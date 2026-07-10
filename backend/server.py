from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import asyncio
import logging
from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import jwt as pyjwt

from auth import hash_password, verify_password, create_access_token, decode_token
from storage import init_storage, put_object, get_object
from emailer import send_notification, contact_email_html, volunteer_email_html

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="AASW API")
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(str)]

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "pdf": "application/pdf",
}
IMAGE_EXTS = {"jpg", "jpeg", "png", "webp", "gif"}


def now_iso():
    return datetime.now(timezone.utc).isoformat()


class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = {"populate_by_name": True}

    def to_mongo(self):
        return self.model_dump(by_alias=True, exclude={"id"})

    @classmethod
    def from_mongo(cls, doc):
        return cls(**doc)


class ContactMessage(BaseDocument):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: str = Field(default_factory=now_iso)


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class VolunteerApplication(BaseDocument):
    name: str
    email: EmailStr
    phone: str
    profession: Optional[str] = None
    areas_of_interest: List[str] = []
    availability: Optional[str] = None
    message: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


class VolunteerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    profession: Optional[str] = None
    areas_of_interest: List[str] = []
    availability: Optional[str] = None
    message: Optional[str] = None


class Report(BaseDocument):
    title: str
    year: str
    desc: Optional[str] = None
    file_id: str
    created_at: str = Field(default_factory=now_iso)


class GalleryItem(BaseDocument):
    caption: str
    category: str
    file_id: str
    created_at: str = Field(default_factory=now_iso)


class Project(BaseDocument):
    title: str
    subtitle: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    beneficiaries: Optional[str] = None
    summary: Optional[str] = None
    photos: List[str] = []
    created_at: str = Field(default_factory=now_iso)


class ProjectCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    beneficiaries: Optional[str] = None
    summary: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# ---------- Auth ----------

async def get_current_admin(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Not authorized")
        return {"id": str(user["_id"]), "username": user["username"], "name": user.get("name"), "role": user["role"]}
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/auth/login")
async def login(payload: LoginRequest, request: Request):
    username = payload.username.strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{username.lower()}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = datetime.fromisoformat(attempt["locked_until"])
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    user = await db.users.find_one({"username_lower": username.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        count = (attempt.get("count", 0) + 1) if attempt else 1
        update = {"identifier": identifier, "count": count, "updated_at": now_iso()}
        if count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid username or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(str(user["_id"]), user["username"])
    return {"token": token, "user": {"username": user["username"], "name": user.get("name"), "role": user["role"]}}


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# ---------- File storage ----------

async def save_upload(file: UploadFile, kind: str, max_mb: int, allowed: set) -> str:
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else ""
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed. Allowed: {', '.join(sorted(allowed))}")
    data = await file.read()
    if len(data) > max_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large (max {max_mb} MB)")
    path = f"aasw/{kind}/{uuid.uuid4()}.{ext}"
    ct = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    try:
        result = await asyncio.to_thread(put_object, path, data, ct)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="File storage upload failed. Please try again.")
    doc = {
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": ct,
        "size": len(data),
        "is_deleted": False,
        "created_at": now_iso(),
    }
    ins = await db.files.insert_one(doc)
    return str(ins.inserted_id)


@api_router.get("/files/{file_id}")
async def serve_file(file_id: str):
    try:
        oid = ObjectId(file_id)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    doc = await db.files.find_one({"_id": oid, "is_deleted": False})
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, ct = await asyncio.to_thread(get_object, doc["storage_path"])
    except Exception as e:
        logger.error(f"Storage fetch failed: {e}")
        raise HTTPException(status_code=502, detail="File fetch failed")
    return Response(
        content=data,
        media_type=doc.get("content_type", ct),
        headers={
            "Cache-Control": "public, max-age=86400",
            "Content-Disposition": f'inline; filename="{doc.get("original_filename", "file")}"',
        },
    )


# ---------- Public routes ----------

@api_router.get("/")
async def root():
    return {"message": "AASW API is running"}


@api_router.post("/contact", response_model=ContactMessage, response_model_by_alias=False)
async def create_contact(payload: ContactCreate):
    obj = ContactMessage(**payload.model_dump())
    result = await db.contact_messages.insert_one(obj.to_mongo())
    obj.id = str(result.inserted_id)
    asyncio.create_task(send_notification(f"New contact message: {obj.subject}", contact_email_html(payload.model_dump())))
    return obj


@api_router.post("/volunteer", response_model=VolunteerApplication, response_model_by_alias=False)
async def create_volunteer(payload: VolunteerCreate):
    obj = VolunteerApplication(**payload.model_dump())
    result = await db.volunteer_applications.insert_one(obj.to_mongo())
    obj.id = str(result.inserted_id)
    asyncio.create_task(send_notification(f"New volunteer application: {obj.name}", volunteer_email_html(payload.model_dump())))
    return obj


@api_router.get("/reports", response_model=List[Report], response_model_by_alias=False)
async def list_reports():
    docs = await db.reports.find().sort("created_at", -1).to_list(100)
    return [Report.from_mongo(d) for d in docs]


@api_router.get("/gallery", response_model=List[GalleryItem], response_model_by_alias=False)
async def list_gallery():
    docs = await db.gallery_items.find().sort("created_at", -1).to_list(500)
    return [GalleryItem.from_mongo(d) for d in docs]


@api_router.get("/projects", response_model=List[Project], response_model_by_alias=False)
async def list_projects():
    docs = await db.projects.find().sort("created_at", -1).to_list(100)
    return [Project.from_mongo(d) for d in docs]


@api_router.get("/projects/{project_id}", response_model=Project, response_model_by_alias=False)
async def get_project(project_id: str):
    try:
        oid = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Project not found")
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project.from_mongo(doc)


# ---------- Admin-protected reads of form submissions ----------

@api_router.get("/contact", response_model=List[ContactMessage], response_model_by_alias=False)
async def list_contacts(admin: dict = Depends(get_current_admin)):
    docs = await db.contact_messages.find().sort("created_at", -1).to_list(500)
    return [ContactMessage.from_mongo(d) for d in docs]


@api_router.get("/volunteer", response_model=List[VolunteerApplication], response_model_by_alias=False)
async def list_volunteers(admin: dict = Depends(get_current_admin)):
    docs = await db.volunteer_applications.find().sort("created_at", -1).to_list(500)
    return [VolunteerApplication.from_mongo(d) for d in docs]


# ---------- Admin routes ----------

admin_router = APIRouter(prefix="/api/admin", dependencies=[Depends(get_current_admin)])


def to_oid(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=404, detail="Not found")


@admin_router.delete("/contact/{item_id}")
async def delete_contact(item_id: str):
    result = await db.contact_messages.delete_one({"_id": to_oid(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"deleted": True}


@admin_router.delete("/volunteer/{item_id}")
async def delete_volunteer(item_id: str):
    result = await db.volunteer_applications.delete_one({"_id": to_oid(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"deleted": True}


@admin_router.post("/reports", response_model=Report, response_model_by_alias=False)
async def create_report(title: str = Form(...), year: str = Form(...), desc: str = Form(""), file: UploadFile = File(...)):
    file_id = await save_upload(file, "reports", 25, {"pdf"})
    obj = Report(title=title, year=year, desc=desc or None, file_id=file_id)
    result = await db.reports.insert_one(obj.to_mongo())
    obj.id = str(result.inserted_id)
    return obj


@admin_router.delete("/reports/{item_id}")
async def delete_report(item_id: str):
    doc = await db.reports.find_one({"_id": to_oid(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")
    await db.files.update_one({"_id": to_oid(doc["file_id"])}, {"$set": {"is_deleted": True}})
    await db.reports.delete_one({"_id": to_oid(item_id)})
    return {"deleted": True}


@admin_router.post("/gallery", response_model=GalleryItem, response_model_by_alias=False)
async def create_gallery_item(caption: str = Form(...), category: str = Form(...), file: UploadFile = File(...)):
    file_id = await save_upload(file, "gallery", 10, IMAGE_EXTS)
    obj = GalleryItem(caption=caption, category=category, file_id=file_id)
    result = await db.gallery_items.insert_one(obj.to_mongo())
    obj.id = str(result.inserted_id)
    return obj


@admin_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    doc = await db.gallery_items.find_one({"_id": to_oid(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    await db.files.update_one({"_id": to_oid(doc["file_id"])}, {"$set": {"is_deleted": True}})
    await db.gallery_items.delete_one({"_id": to_oid(item_id)})
    return {"deleted": True}


@admin_router.post("/projects", response_model=Project, response_model_by_alias=False)
async def create_project(payload: ProjectCreate):
    obj = Project(**payload.model_dump())
    result = await db.projects.insert_one(obj.to_mongo())
    obj.id = str(result.inserted_id)
    return obj


@admin_router.post("/projects/{project_id}/photos", response_model=Project, response_model_by_alias=False)
async def add_project_photo(project_id: str, file: UploadFile = File(...)):
    oid = to_oid(project_id)
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    file_id = await save_upload(file, "projects", 10, IMAGE_EXTS)
    await db.projects.update_one({"_id": oid}, {"$push": {"photos": file_id}})
    updated = await db.projects.find_one({"_id": oid})
    return Project.from_mongo(updated)


@admin_router.delete("/projects/{project_id}/photos/{file_id}")
async def delete_project_photo(project_id: str, file_id: str):
    oid = to_oid(project_id)
    await db.projects.update_one({"_id": oid}, {"$pull": {"photos": file_id}})
    await db.files.update_one({"_id": to_oid(file_id)}, {"$set": {"is_deleted": True}})
    return {"deleted": True}


@admin_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    oid = to_oid(project_id)
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    for fid in doc.get("photos", []):
        await db.files.update_one({"_id": to_oid(fid)}, {"$set": {"is_deleted": True}})
    await db.projects.delete_one({"_id": oid})
    return {"deleted": True}


# ---------- App setup ----------

@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(api_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


async def seed_admin():
    username = os.environ["ADMIN_USERNAME"]
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"username_lower": username.lower()})
    if existing is None:
        await db.users.insert_one({
            "username": username,
            "username_lower": username.lower(),
            "password_hash": hash_password(password),
            "name": username,
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Admin user seeded")
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"_id": existing["_id"]}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password updated from env")


@app.on_event("startup")
async def startup():
    await db.users.create_index("username_lower", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed (will retry on first upload): {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
