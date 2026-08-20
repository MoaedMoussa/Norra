from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import httpx
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Seed template data ----------
SEED_TEMPLATES = [
    {"slug": "notion-second-brain", "name": "Second Brain", "tagline": "Organize your entire life and build your second brain inside Notion.", "price": 49, "originalPrice": 99, "image": "https://images.unsplash.com/photo-1708447134640-2b57ad0dd846?w=1200&q=80", "category": "Productivity", "rating": 4.9, "reviews": 2841, "description": "The Second Brain is an all-in-one Notion template that helps you organize your entire digital life. Capture notes, tasks, projects, goals, ideas, and knowledge in one central hub inspired by the PARA method.", "features": ["PARA method organization (Projects, Areas, Resources, Archive)", "Weekly review dashboard with progress tracking", "Notes system with backlinks and tags", "Integrated task manager with priorities", "Reading list with highlights capture", "Habit tracker and daily journal"], "gallery": ["https://images.unsplash.com/photo-1708447134640-2b57ad0dd846?w=1400&q=80", "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400", "https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1400"], "notionPreviewUrl": "https://www.notion.so/Notion-Template-Gallery-181e961aeb2c80d1a419fe23fe387fa8"},
    {"slug": "notion-finance-tracker", "name": "Finance Tracker", "tagline": "Make smarter financial decisions and stay in control of your finances.", "price": 39, "originalPrice": 79, "image": "https://images.pexels.com/photos/38888681/pexels-photo-38888681.jpeg?w=1200", "category": "Finance", "rating": 4.9, "reviews": 1932, "description": "Take full control of your money with a beautifully designed Notion finance system.", "features": ["Monthly budget & expense tracker", "Net worth dashboard", "Subscription and bill tracker", "Savings goals with progress", "Debt payoff planner", "Investment portfolio overview"], "gallery": ["https://images.pexels.com/photos/38888681/pexels-photo-38888681.jpeg?w=1400", "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80"], "notionPreviewUrl": "https://www.notion.so/Personal-Finance-Tracker-templates-46b96f1a01d94a0a89e5c1a0fac3f0f3"},
    {"slug": "notion-life-planner", "name": "Life Planner", "tagline": "Plan your entire life and turn your goals into a reality effortlessly.", "price": 39, "originalPrice": 79, "image": "https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=1200&q=80", "category": "Planning", "rating": 4.9, "reviews": 2213, "description": "A complete life planning system inside Notion.", "features": ["Yearly, quarterly, monthly, weekly, and daily planners", "Goal tracker with milestones", "Vision board and life wheel", "Habit builder with streaks", "Gratitude and reflection journal", "Bucket list"], "gallery": ["https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=1400&q=80", "https://images.pexels.com/photos/768472/pexels-photo-768472.jpeg?w=1400"], "notionPreviewUrl": "https://www.notion.so/Weekly-Planner-Template-9c0e6a2f6c7f4e8e9a6e4e4f5f4e4f4e"},
    {"slug": "notion-creator-system", "name": "Creator System", "tagline": "Manage your entire creator business and grow faster than ever before.", "price": 49, "originalPrice": 99, "image": "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1200", "category": "Business", "rating": 4.8, "reviews": 1421, "description": "A powerful Notion OS for content creators.", "features": ["Content calendar across platforms", "Idea vault with scoring", "Brand deal pipeline", "Analytics dashboard", "Script templates", "Community CRM"], "gallery": ["https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400", "https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80"], "notionPreviewUrl": "https://www.notion.so/Content-Creator-Dashboard-e6f4c1e93b8a4b3f9b3d1b5f5d5f5d5f"},
    {"slug": "notion-freelance-system", "name": "Freelance System", "tagline": "Manage your entire freelance business and take control of your work.", "price": 49, "originalPrice": 99, "image": "https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1200", "category": "Business", "rating": 4.9, "reviews": 1108, "description": "Run your freelance business like a pro.", "features": ["Client CRM", "Project management", "Invoice tracker", "Contract library", "Time tracking", "Income reports"], "gallery": ["https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1400", "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80"], "notionPreviewUrl": "https://www.notion.so/Freelance-Client-Portal-cff3c1ef2c4a4e5cae7c7c7c7c7c7c7c"},
    {"slug": "notion-business-system", "name": "Business System", "tagline": "Manage your entire business and take control of every aspect efficiently.", "price": 59, "originalPrice": 129, "image": "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1200&q=80", "category": "Business", "rating": 4.9, "reviews": 892, "description": "The complete Notion OS for small businesses.", "features": ["Company wiki", "Sales pipeline", "Project tracker", "HR directory", "Financial dashboard", "Product roadmap"], "gallery": ["https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80", "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400"], "notionPreviewUrl": "https://www.notion.so/Small-Business-OS-b1a1b1a1b1a1b1a1b1a1b1a1b1a1b1a1"},
    {"slug": "notion-complete-bundle", "name": "Notion Complete Bundle", "tagline": "Every premium template. One low price.", "price": 99, "originalPrice": 494, "image": "https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80", "category": "Bundle", "rating": 4.9, "reviews": 6421, "description": "Get lifetime access to every Notion template PathPages has ever released \u2014 plus every new template we launch.", "features": ["Every current premium template", "All future template releases included", "Priority customer support", "Lifetime access & free updates", "Save $395 vs buying individually", "One-click Notion duplicate"], "gallery": ["https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80"], "notionPreviewUrl": "https://www.notion.so/Notion-Template-Gallery-181e961aeb2c80d1a419fe23fe387fa8"},
]

@app.on_event("startup")
async def seed():
    if await db.templates.count_documents({}) == 0:
        await db.templates.insert_many([{**t} for t in SEED_TEMPLATES])
        logging.info("Seeded templates")

# ---------- Models ----------
class Template(BaseModel):
    slug: str
    name: str
    tagline: str
    price: float
    originalPrice: float
    image: str
    category: str
    rating: float
    reviews: int
    description: str
    features: List[str]
    gallery: List[str]
    notionPreviewUrl: Optional[str] = None

class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"

class CheckoutRequest(BaseModel):
    slugs: List[str]

class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
    mocked: bool = False

# ---------- Auth helpers ----------
async def get_user_from_request(request: Request) -> Optional[dict]:
    token = request.cookies.get("session_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        return None
    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        return None
    exp = sess.get("expires_at")
    if isinstance(exp, str):
        exp = datetime.fromisoformat(exp)
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp and exp < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
    return user

# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "PathPages API", "stripe_configured": bool(STRIPE_SECRET_KEY)}

@api_router.get("/config")
async def config():
    return {"stripe_publishable_key": STRIPE_PUBLISHABLE_KEY, "stripe_enabled": bool(STRIPE_SECRET_KEY)}

@api_router.get("/templates", response_model=List[Template])
async def list_templates():
    docs = await db.templates.find({}, {"_id": 0}).to_list(100)
    return docs

@api_router.get("/templates/{slug}", response_model=Template)
async def get_template(slug: str):
    doc = await db.templates.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Template not found")
    return doc

# ---------- Auth ----------
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(400, "session_id required")
    async with httpx.AsyncClient(timeout=15) as hc:
        r = await hc.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id},
        )
    if r.status_code != 200:
        raise HTTPException(401, "Invalid session")
    data = r.json()
    email = data.get("email")
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"user_id": user_id}, {"$set": {"name": data.get("name"), "picture": data.get("picture")}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        # First user becomes admin for convenience
        role = "admin" if await db.users.count_documents({}) == 0 else "user"
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": data.get("name"),
            "picture": data.get("picture"), "role": role,
            "created_at": datetime.now(timezone.utc),
        })
    session_token = data.get("session_token")
    await db.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc),
    })
    response.set_cookie(
        "session_token", session_token,
        max_age=7*24*3600, httponly=True, secure=True, samesite="none", path="/",
    )
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return {"user": {k: user.get(k) for k in ["user_id", "email", "name", "picture", "role"]}}

@api_router.get("/auth/me")
async def me(request: Request):
    user = await get_user_from_request(request)
    if not user:
        raise HTTPException(401, "Not authenticated")
    return {k: user.get(k) for k in ["user_id", "email", "name", "picture", "role"]}

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}

# ---------- Checkout ----------
@api_router.post("/checkout/create", response_model=CheckoutResponse)
async def create_checkout(req: CheckoutRequest, request: Request):
    if not req.slugs:
        raise HTTPException(400, "No items")
    templates = await db.templates.find({"slug": {"$in": req.slugs}}, {"_id": 0}).to_list(100)
    if not templates:
        raise HTTPException(404, "Templates not found")
    total = sum(int(t["price"] * 100) for t in templates)
    user = await get_user_from_request(request)
    origin = request.headers.get("origin") or request.headers.get("referer", "").rstrip("/")

    order_id = f"ord_{uuid.uuid4().hex[:14]}"
    order_doc = {
        "order_id": order_id,
        "user_id": user["user_id"] if user else None,
        "user_email": user["email"] if user else None,
        "slugs": req.slugs,
        "total_cents": total,
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }

    if STRIPE_SECRET_KEY:
        import stripe
        stripe.api_key = STRIPE_SECRET_KEY
        line_items = [{
            "price_data": {
                "currency": "usd",
                "unit_amount": int(t["price"] * 100),
                "product_data": {"name": t["name"], "images": [t["image"]]},
            },
            "quantity": 1,
        } for t in templates]
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            success_url=f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{origin}/cart",
            metadata={"order_id": order_id},
        )
        order_doc["stripe_session_id"] = session.id
        await db.orders.insert_one(order_doc)
        return CheckoutResponse(checkout_url=session.url, session_id=session.id, mocked=False)
    else:
        # Mock flow — simulate a successful test payment
        mock_session = f"cs_test_mock_{uuid.uuid4().hex[:16]}"
        order_doc["stripe_session_id"] = mock_session
        await db.orders.insert_one(order_doc)
        return CheckoutResponse(
            checkout_url=f"{origin}/checkout/success?session_id={mock_session}",
            session_id=mock_session, mocked=True,
        )

@api_router.get("/checkout/verify/{session_id}")
async def verify_checkout(session_id: str, request: Request):
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    paid = False
    if STRIPE_SECRET_KEY and not session_id.startswith("cs_test_mock_"):
        import stripe
        stripe.api_key = STRIPE_SECRET_KEY
        s = stripe.checkout.Session.retrieve(session_id)
        paid = s.payment_status == "paid"
    else:
        paid = True  # Mocked success
    if paid and order["status"] != "paid":
        await db.orders.update_one({"order_id": order["order_id"]}, {"$set": {"status": "paid", "paid_at": datetime.now(timezone.utc)}})
        # Attach templates to user library if logged in
        user = await get_user_from_request(request)
        uid = order.get("user_id") or (user["user_id"] if user else None)
        if uid:
            for slug in order["slugs"]:
                await db.library.update_one(
                    {"user_id": uid, "slug": slug},
                    {"$setOnInsert": {"user_id": uid, "slug": slug, "acquired_at": datetime.now(timezone.utc), "order_id": order["order_id"]}},
                    upsert=True,
                )
    order["status"] = "paid" if paid else order["status"]
    order["created_at"] = order["created_at"].isoformat() if isinstance(order.get("created_at"), datetime) else order.get("created_at")
    return {"order": order, "paid": paid}

@api_router.get("/library")
async def library(request: Request):
    user = await get_user_from_request(request)
    if not user:
        raise HTTPException(401, "Not authenticated")
    lib_items = await db.library.find({"user_id": user["user_id"]}, {"_id": 0}).to_list(100)
    slugs = [i["slug"] for i in lib_items]
    templates = await db.templates.find({"slug": {"$in": slugs}}, {"_id": 0}).to_list(100)
    return {"templates": templates, "count": len(templates)}

# ---------- Admin ----------
@api_router.get("/admin/orders")
async def admin_orders(request: Request):
    user = await get_user_from_request(request)
    if not user or user.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    for o in orders:
        if isinstance(o.get("created_at"), datetime):
            o["created_at"] = o["created_at"].isoformat()
        if isinstance(o.get("paid_at"), datetime):
            o["paid_at"] = o["paid_at"].isoformat()
    return {"orders": orders}

@api_router.get("/admin/stats")
async def admin_stats(request: Request):
    user = await get_user_from_request(request)
    if not user or user.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    total_orders = await db.orders.count_documents({"status": "paid"})
    total_users = await db.users.count_documents({})
    all_paid = await db.orders.find({"status": "paid"}, {"_id": 0, "total_cents": 1}).to_list(1000)
    revenue = sum(o.get("total_cents", 0) for o in all_paid) / 100
    return {"total_orders": total_orders, "total_users": total_users, "revenue": revenue}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
