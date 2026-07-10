# PRD — Arshi Association for Social Welfare (AASW) Website

## Original Problem Statement
Build a premium, modern, elegant, responsive, SEO-optimized, production-ready website for AASW (Section 8 Company, est. 19 Sep 2020, Ranchi, Jharkhand) using the uploaded Annual Report 2023–24 as the primary content source and all 44 uploaded photographs throughout the site (hero, about, programs, projects, gallery, impact). Pages: Home, About, Programs, Projects (4 detail pages), Impact, Gallery, Annual Reports, Transparency & Compliance, Partners, Volunteer, Donate, Contact. Deep green + white + soft green + golden palette, animated counters, masonry gallery with lightbox, embedded PDF viewer, chart from beneficiary data.

## User Choices
- Full-stack: contact & volunteer forms stored in MongoDB
- Donate page informational only ("payment gateway coming soon")
- Light theme, deep green + golden accents
- Target: 10/10 premium visual quality

## Architecture
- **Frontend**: React 19 + react-router-dom, Tailwind, framer-motion, recharts, lucide-react, sonner. Fonts: Fraunces (headings) + Manrope (body).
- **Backend**: FastAPI + Motor/MongoDB. Routes: POST/GET `/api/contact`, POST/GET `/api/volunteer` (PyObjectId + BaseDocument pattern, `response_model_by_alias=False`).
- **Assets**: 44 photos in `/app/frontend/public/images/1..44.jpeg`; Annual Report PDF at `/app/frontend/public/annual-report-2023-24.pdf`.
- **Content**: single source of truth `/app/frontend/src/data/content.js` (org info, stats, 44 categorized gallery items, 14 programs, 4 projects, compliance, partners).

## User Personas
- Donors & CSR partners (verify credibility, download report, donate)
- Volunteers (students, doctors, educators — apply via form)
- Beneficiaries/community (discover programmes)
- Institutional partners (NABARD, JSLPS, colleges)

## Implemented (June 2026 — MVP)
- All 13 routes/12 pages with premium design, sticky glass navbar, footer
- Full-screen hero (photo 2) with the required heading & 4 CTAs
- Animated impact counters (1,619 / 7 / 125 / 30 / 25 / 30) + recharts beneficiary bar chart
- Gallery: all 44 photos, 10 auto-categories, masonry, filters, custom lightbox
- 4 project detail pages with facts, highlights, photo lightbox (Dhoop Batti/MEDP, Intl Mahila Diwas, Vocational & Computer Training, Health Camp)
- About: journey timeline 2020→2024, mission/vision/objectives, Director's message (Ashutosh Kumar) with photo
- Annual Reports page: report card + embedded PDF modal viewer + download; slot for future reports
- Transparency: 6 registration cards (CIN, PAN, NGO Darpan, CSR, 12A, 80G)
- Partners: NABARD, JSLPS, Ranchi Women's College + partnership CTA (info@aasw.in)
- Volunteer & Contact forms → MongoDB (tested E2E); Google Maps embed; social placeholders
- SEO: title, meta description/keywords, OG tags; data-testids everywhere
- Testing: iteration_1 — frontend 100%, backend 10/10 pytest pass after `_id`→`id` serialization fix

## Iteration 2 (June 2026)
- Replaced Women Empowerment program card image (privacy concern) with photo 24
- Director's message now uses the user-uploaded director photograph (`/images/director.jpeg`)
- Contact address updated everywhere: 101, Vandana Apartment, Opposite Amrita Nursing Home, Lalpur, Ranchi – 834001 (map embed updated too)

## Iteration 3 (June 2026)
- Added root-level `GET /health` endpoint in server.py (K8s liveness probe deployment fix) — verified by testing agent (backend 12/12 pytest pass)
- Removed privacy-sensitive photo #15 from Gallery array AND deleted `/images/15.jpeg` from public folder entirely
- Gallery/Home copy now binds to `GALLERY.length` dynamically ("43 photographs")
- Testing: iteration_2 — backend 100%, frontend 100%
- Fixed "destroy is not a function" runtime crash: useEffect hooks in App.js (ScrollToTop) and Navbar.jsx returned values via concise arrows; wrapped in braces so React gets no bogus cleanup function

## Iteration 4 (July 2026)
- Main phone updated to +91 6206857414 (content.js → Contact page + Footer)
- Production contact-form failure diagnosed: user's self-hosted Render backend (aasw-api.onrender.com) is down ("no-server"). User chose to migrate fully to Emergent hosting with custom domain www.arshiassociation.in (Entri domain linking steps provided)
- Deployment readiness check: PASS

## Backlog / Next Tasks
- P0: none remaining
- P1: Payment gateway integration on Donate (Razorpay/Stripe); admin view for submitted contact/volunteer entries
- P2: Real social media links; certificate uploads on Transparency page; blog/news section; Hindi language toggle; sitemap.xml/robots.txt for deployment
