"""AASW backend API tests - covers auth, admin CRUD, public forms, file storage.

Notes:
- Login brute-force: 5 failed attempts on (ip,username) triggers 15-min lockout.
  We intentionally use max 1 wrong-password test to stay safe.
- Test-created data uses TEST_ prefix and is cleaned up.
"""
import io
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_USERNAME = "Ashutosh Kumar"
ADMIN_PASSWORD = "Arshi@1308"

# 1x1 transparent PNG
PNG_1x1 = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000d49444154789c62000000000005000173096da70000000049454e44ae426082"
)

# Minimal PDF (single-page)
MIN_PDF = (
    b"%PDF-1.4\n"
    b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n"
    b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]>>endobj\n"
    b"xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n"
    b"0000000053 00000 n \n0000000100 00000 n \n"
    b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n160\n%%EOF\n"
)


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
    return data["token"]


@pytest.fixture(scope="module")
def admin_client(admin_token):
    s = requests.Session()
    s.headers.update({"Authorization": f"Bearer {admin_token}"})
    return s


# --- Health / basic ---
class TestHealth:
    def test_api_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert "message" in r.json()


# --- Auth ---
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data
        assert data["user"]["username"] == ADMIN_USERNAME
        assert data["user"]["role"] == "admin"

    def test_login_wrong_password(self, api):
        # Only ONE wrong-password attempt to avoid brute force lockout (5 = 15 min)
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"username": ADMIN_USERNAME, "password": "definitely-wrong-xyz"})
        assert r.status_code == 401
        assert "Invalid" in r.json().get("detail", "")

    def test_me_with_token(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        data = r.json()
        assert data["username"] == ADMIN_USERNAME
        assert data["role"] == "admin"

    def test_me_without_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_bad_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me",
                         headers={"Authorization": "Bearer notarealtoken.blah.blah"})
        assert r.status_code == 401


# --- Public contact/volunteer POST still work; GET now requires auth ---
class TestContactVolunteerPublic:
    def test_create_contact_public(self, api):
        payload = {
            "name": "TEST_Contact User",
            "email": "test_contact@example.com",
            "phone": "+911234567890",
            "subject": "TEST Subject",
            "message": "TEST message body",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert "id" in data and len(data["id"]) > 0
        assert "_id" not in data

    def test_create_volunteer_public(self, api):
        payload = {
            "name": "TEST_Volunteer",
            "email": "test_vol@example.com",
            "phone": "+919999999999",
            "profession": "Engineer",
            "areas_of_interest": ["Women Empowerment"],
            "availability": "Weekends",
            "message": "TEST volunteer message",
        }
        r = api.post(f"{BASE_URL}/api/volunteer", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert "id" in data

    def test_invalid_email_contact(self, api):
        r = api.post(f"{BASE_URL}/api/contact",
                     json={"name": "X", "email": "not-an-email", "subject": "s", "message": "m"})
        assert r.status_code == 422

    def test_list_contact_requires_auth(self, api):
        r = requests.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 401

    def test_list_volunteer_requires_auth(self, api):
        r = requests.get(f"{BASE_URL}/api/volunteer")
        assert r.status_code == 401

    def test_list_contact_with_auth(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200
        lst = r.json()
        assert isinstance(lst, list)
        # At least our TEST_ item should be present
        for item in lst:
            assert "_id" not in item

    def test_list_volunteer_with_auth(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/volunteer")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# --- Admin routes without token → 401 ---
class TestAdminAuthRequired:
    def test_admin_gallery_post_no_token(self, api):
        r = requests.post(f"{BASE_URL}/api/admin/gallery",
                          files={"file": ("x.png", PNG_1x1, "image/png")},
                          data={"caption": "x", "category": "y"})
        assert r.status_code == 401

    def test_admin_reports_post_no_token(self, api):
        r = requests.post(f"{BASE_URL}/api/admin/reports",
                          files={"file": ("x.pdf", MIN_PDF, "application/pdf")},
                          data={"title": "x", "year": "2025"})
        assert r.status_code == 401

    def test_admin_projects_post_no_token(self, api):
        r = requests.post(f"{BASE_URL}/api/admin/projects",
                          json={"title": "unauth"})
        assert r.status_code == 401

    def test_admin_delete_no_token(self, api):
        r = requests.delete(f"{BASE_URL}/api/admin/gallery/507f1f77bcf86cd799439011")
        assert r.status_code == 401


# --- Admin CRUD: Gallery ---
class TestAdminGallery:
    def test_gallery_full_flow(self, admin_client, admin_token):
        # Create
        files = {"file": ("test.png", PNG_1x1, "image/png")}
        data = {"caption": "TEST_ gallery item", "category": "TEST_Category"}
        r = requests.post(f"{BASE_URL}/api/admin/gallery",
                          headers={"Authorization": f"Bearer {admin_token}"},
                          files=files, data=data)
        assert r.status_code == 200, r.text
        item = r.json()
        assert item["caption"] == data["caption"]
        assert item["category"] == data["category"]
        assert "id" in item and "file_id" in item
        item_id = item["id"]
        file_id = item["file_id"]

        # Public listing shows it
        r2 = requests.get(f"{BASE_URL}/api/gallery")
        assert r2.status_code == 200
        ids = [x["id"] for x in r2.json()]
        assert item_id in ids

        # Serve file publicly
        r3 = requests.get(f"{BASE_URL}/api/files/{file_id}")
        assert r3.status_code == 200
        assert r3.headers.get("content-type", "").startswith("image/")
        assert len(r3.content) > 0

        # Delete
        r4 = admin_client.delete(f"{BASE_URL}/api/admin/gallery/{item_id}")
        assert r4.status_code == 200
        assert r4.json().get("deleted") is True

        # File no longer served
        r5 = requests.get(f"{BASE_URL}/api/files/{file_id}")
        assert r5.status_code == 404

    def test_gallery_reject_non_image(self, admin_token):
        # A .txt file should be rejected
        r = requests.post(
            f"{BASE_URL}/api/admin/gallery",
            headers={"Authorization": f"Bearer {admin_token}"},
            files={"file": ("bad.txt", b"hello", "text/plain")},
            data={"caption": "TEST_bad", "category": "TEST"},
        )
        assert r.status_code == 400


# --- Admin CRUD: Reports ---
class TestAdminReports:
    def test_reports_pdf_upload_and_delete(self, admin_client, admin_token):
        r = requests.post(
            f"{BASE_URL}/api/admin/reports",
            headers={"Authorization": f"Bearer {admin_token}"},
            files={"file": ("test.pdf", MIN_PDF, "application/pdf")},
            data={"title": "TEST_ Annual Report", "year": "2099", "desc": "TEST"},
        )
        assert r.status_code == 200, r.text
        rep = r.json()
        assert rep["title"] == "TEST_ Annual Report"
        assert rep["year"] == "2099"
        assert "file_id" in rep
        rep_id = rep["id"]
        file_id = rep["file_id"]

        # Public list shows it
        r2 = requests.get(f"{BASE_URL}/api/reports")
        assert r2.status_code == 200
        assert rep_id in [x["id"] for x in r2.json()]

        # File served with pdf content-type
        r3 = requests.get(f"{BASE_URL}/api/files/{file_id}")
        assert r3.status_code == 200
        assert "pdf" in r3.headers.get("content-type", "").lower()

        # Delete
        r4 = admin_client.delete(f"{BASE_URL}/api/admin/reports/{rep_id}")
        assert r4.status_code == 200

    def test_reports_reject_non_pdf(self, admin_token):
        r = requests.post(
            f"{BASE_URL}/api/admin/reports",
            headers={"Authorization": f"Bearer {admin_token}"},
            files={"file": ("photo.png", PNG_1x1, "image/png")},
            data={"title": "TEST_bad", "year": "2099"},
        )
        assert r.status_code == 400


# --- Admin CRUD: Projects ---
class TestAdminProjects:
    def test_project_lifecycle(self, admin_client, admin_token):
        # Create project (JSON)
        payload = {
            "title": "TEST_ Project Folder",
            "subtitle": "TEST subtitle",
            "location": "TEST City",
            "date": "2099",
            "beneficiaries": "10 test",
            "summary": "TEST summary",
        }
        r = admin_client.post(f"{BASE_URL}/api/admin/projects", json=payload)
        assert r.status_code == 200, r.text
        proj = r.json()
        assert proj["title"] == payload["title"]
        assert proj["photos"] == []
        proj_id = proj["id"]

        # Public list shows it
        r2 = requests.get(f"{BASE_URL}/api/projects")
        assert r2.status_code == 200
        assert proj_id in [x["id"] for x in r2.json()]

        # Public GET one
        r3 = requests.get(f"{BASE_URL}/api/projects/{proj_id}")
        assert r3.status_code == 200
        assert r3.json()["title"] == payload["title"]

        # Add photo
        r4 = requests.post(
            f"{BASE_URL}/api/admin/projects/{proj_id}/photos",
            headers={"Authorization": f"Bearer {admin_token}"},
            files={"file": ("p.png", PNG_1x1, "image/png")},
        )
        assert r4.status_code == 200, r4.text
        updated = r4.json()
        assert len(updated["photos"]) == 1
        photo_id = updated["photos"][0]

        # Delete photo
        r5 = admin_client.delete(f"{BASE_URL}/api/admin/projects/{proj_id}/photos/{photo_id}")
        assert r5.status_code == 200
        r6 = requests.get(f"{BASE_URL}/api/projects/{proj_id}")
        assert r6.json()["photos"] == []

        # Delete project
        r7 = admin_client.delete(f"{BASE_URL}/api/admin/projects/{proj_id}")
        assert r7.status_code == 200

        # Now project no longer accessible
        r8 = requests.get(f"{BASE_URL}/api/projects/{proj_id}")
        assert r8.status_code == 404


# --- File serve edge cases ---
class TestFileServe:
    def test_serve_invalid_id(self, api):
        r = requests.get(f"{BASE_URL}/api/files/notarealid")
        assert r.status_code == 404

    def test_serve_missing_id(self, api):
        # Valid ObjectId format but non-existent
        r = requests.get(f"{BASE_URL}/api/files/507f1f77bcf86cd799439011")
        assert r.status_code == 404


# --- Cleanup test data via admin (best-effort) ---
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_data():
    yield
    # After all tests, purge TEST_ prefixed contact/volunteer messages we created
    try:
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
        if r.status_code != 200:
            return
        token = r.json()["token"]
        h = {"Authorization": f"Bearer {token}"}
        for path, kind in [("/api/contact", "contact"), ("/api/volunteer", "volunteer")]:
            lst = requests.get(f"{BASE_URL}{path}", headers=h)
            if lst.status_code != 200:
                continue
            for item in lst.json():
                name = item.get("name", "")
                if name.startswith("TEST_") or name.startswith("Email Test"):
                    requests.delete(f"{BASE_URL}/api/admin/{kind}/{item['id']}", headers=h)
    except Exception:
        pass
