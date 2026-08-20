#!/usr/bin/env python3
"""
PathPages Backend API Testing Suite
Tests all backend endpoints end-to-end
"""
import requests
import json
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient

# Configuration
BASE_URL = "https://page-analyzer-pro.preview.emergentagent.com/api"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"

# Test results tracking
test_results = []

def log_test(name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({"name": name, "passed": passed, "details": details})
    print(f"{status}: {name}")
    if details:
        print(f"   Details: {details}")

def test_root_endpoint():
    """Test 1: GET /api/ - Health check"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            if "message" in data and data["message"] == "PathPages API":
                log_test("GET /api/ - Root endpoint", True, f"Response: {data}")
                return True
            else:
                log_test("GET /api/ - Root endpoint", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("GET /api/ - Root endpoint", False, f"Status: {response.status_code}, Body: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/ - Root endpoint", False, f"Exception: {str(e)}")
        return False

def test_config_endpoint():
    """Test 2: GET /api/config - Stripe configuration"""
    try:
        response = requests.get(f"{BASE_URL}/config")
        if response.status_code == 200:
            data = response.json()
            if "stripe_publishable_key" in data and "stripe_enabled" in data:
                log_test("GET /api/config - Config endpoint", True, f"Response: {data}")
                return True
            else:
                log_test("GET /api/config - Config endpoint", False, f"Missing fields: {data}")
                return False
        else:
            log_test("GET /api/config - Config endpoint", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/config - Config endpoint", False, f"Exception: {str(e)}")
        return False

def test_templates_list():
    """Test 3: GET /api/templates - List all templates"""
    try:
        response = requests.get(f"{BASE_URL}/templates")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) == 7:
                log_test("GET /api/templates - List templates", True, f"Found {len(data)} templates")
                return data
            else:
                log_test("GET /api/templates - List templates", False, f"Expected 7 templates, got {len(data) if isinstance(data, list) else 'non-list'}")
                return None
        else:
            log_test("GET /api/templates - List templates", False, f"Status: {response.status_code}")
            return None
    except Exception as e:
        log_test("GET /api/templates - List templates", False, f"Exception: {str(e)}")
        return None

def test_template_detail():
    """Test 4: GET /api/templates/{slug} - Get specific template"""
    try:
        response = requests.get(f"{BASE_URL}/templates/notion-second-brain")
        if response.status_code == 200:
            data = response.json()
            if "notionPreviewUrl" in data and data["slug"] == "notion-second-brain":
                log_test("GET /api/templates/notion-second-brain - Template detail", True, f"Has notionPreviewUrl: {data.get('notionPreviewUrl')}")
                return True
            else:
                log_test("GET /api/templates/notion-second-brain - Template detail", False, f"Missing notionPreviewUrl or wrong slug")
                return False
        else:
            log_test("GET /api/templates/notion-second-brain - Template detail", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/templates/notion-second-brain - Template detail", False, f"Exception: {str(e)}")
        return False

def test_template_not_found():
    """Test 5: GET /api/templates/does-not-exist - 404 handling"""
    try:
        response = requests.get(f"{BASE_URL}/templates/does-not-exist")
        if response.status_code == 404:
            log_test("GET /api/templates/does-not-exist - 404 handling", True, "Correctly returned 404")
            return True
        else:
            log_test("GET /api/templates/does-not-exist - 404 handling", False, f"Expected 404, got {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/templates/does-not-exist - 404 handling", False, f"Exception: {str(e)}")
        return False

def test_checkout_create():
    """Test 6: POST /api/checkout/create - Create checkout session"""
    try:
        payload = {"slugs": ["notion-second-brain"]}
        response = requests.post(f"{BASE_URL}/checkout/create", json=payload)
        if response.status_code == 200:
            data = response.json()
            if "checkout_url" in data and "session_id" in data and data.get("mocked") == True:
                log_test("POST /api/checkout/create - Create checkout", True, f"Session ID: {data['session_id']}, Mocked: {data['mocked']}")
                return data["session_id"]
            else:
                log_test("POST /api/checkout/create - Create checkout", False, f"Missing fields or not mocked: {data}")
                return None
        else:
            log_test("POST /api/checkout/create - Create checkout", False, f"Status: {response.status_code}, Body: {response.text}")
            return None
    except Exception as e:
        log_test("POST /api/checkout/create - Create checkout", False, f"Exception: {str(e)}")
        return None

def test_checkout_empty_slugs():
    """Test 7: POST /api/checkout/create with empty slugs - 400 handling"""
    try:
        payload = {"slugs": []}
        response = requests.post(f"{BASE_URL}/checkout/create", json=payload)
        if response.status_code == 400:
            log_test("POST /api/checkout/create (empty slugs) - 400 handling", True, "Correctly returned 400")
            return True
        else:
            log_test("POST /api/checkout/create (empty slugs) - 400 handling", False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test("POST /api/checkout/create (empty slugs) - 400 handling", False, f"Exception: {str(e)}")
        return False

def test_checkout_verify(session_id):
    """Test 8: GET /api/checkout/verify/{session_id} - Verify payment"""
    try:
        response = requests.get(f"{BASE_URL}/checkout/verify/{session_id}")
        if response.status_code == 200:
            data = response.json()
            if data.get("paid") == True and data.get("order", {}).get("status") == "paid":
                log_test("GET /api/checkout/verify - Verify payment", True, f"Order paid: {data['paid']}")
                return data.get("order", {}).get("order_id")
            else:
                log_test("GET /api/checkout/verify - Verify payment", False, f"Payment not verified: {data}")
                return None
        else:
            log_test("GET /api/checkout/verify - Verify payment", False, f"Status: {response.status_code}")
            return None
    except Exception as e:
        log_test("GET /api/checkout/verify - Verify payment", False, f"Exception: {str(e)}")
        return None

def create_test_user_in_mongo():
    """Create a test user and session directly in MongoDB"""
    try:
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Create test user
        user_id = f"test-user-{int(datetime.now().timestamp())}"
        email = f"test.user.{int(datetime.now().timestamp())}@example.com"
        session_token = f"test_session_{int(datetime.now().timestamp())}"
        
        db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": "Test User",
            "picture": "https://via.placeholder.com/150",
            "role": "user",
            "created_at": datetime.utcnow()
        })
        
        db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": datetime.utcnow() + timedelta(days=7),
            "created_at": datetime.utcnow()
        })
        
        print(f"\n📝 Created test user: {user_id}")
        print(f"📝 Session token: {session_token}")
        
        return user_id, session_token
    except Exception as e:
        print(f"❌ Failed to create test user: {str(e)}")
        return None, None

def create_admin_user_in_mongo():
    """Create an admin user and session directly in MongoDB"""
    try:
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Create admin user
        user_id = f"admin-user-{int(datetime.now().timestamp())}"
        email = f"admin.user.{int(datetime.now().timestamp())}@example.com"
        session_token = f"admin_session_{int(datetime.now().timestamp())}"
        
        db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": "Admin User",
            "picture": "https://via.placeholder.com/150",
            "role": "admin",
            "created_at": datetime.utcnow()
        })
        
        db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": datetime.utcnow() + timedelta(days=7),
            "created_at": datetime.utcnow()
        })
        
        print(f"\n📝 Created admin user: {user_id}")
        print(f"📝 Admin session token: {session_token}")
        
        return user_id, session_token
    except Exception as e:
        print(f"❌ Failed to create admin user: {str(e)}")
        return None, None

def test_auth_me(session_token):
    """Test 9: GET /api/auth/me - Get current user"""
    try:
        headers = {"Authorization": f"Bearer {session_token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if "user_id" in data and "email" in data:
                log_test("GET /api/auth/me - Get current user", True, f"User: {data.get('email')}")
                return True
            else:
                log_test("GET /api/auth/me - Get current user", False, f"Missing user fields: {data}")
                return False
        else:
            log_test("GET /api/auth/me - Get current user", False, f"Status: {response.status_code}, Body: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/auth/me - Get current user", False, f"Exception: {str(e)}")
        return False

def test_library_empty(session_token):
    """Test 10a: GET /api/library - Empty library"""
    try:
        headers = {"Authorization": f"Bearer {session_token}"}
        response = requests.get(f"{BASE_URL}/library", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if "templates" in data and "count" in data:
                log_test("GET /api/library - Empty library", True, f"Count: {data['count']}, Templates: {len(data['templates'])}")
                return True
            else:
                log_test("GET /api/library - Empty library", False, f"Missing fields: {data}")
                return False
        else:
            log_test("GET /api/library - Empty library", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/library - Empty library", False, f"Exception: {str(e)}")
        return False

def add_order_to_user(user_id):
    """Add a paid order to user's library"""
    try:
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Create a paid order
        order_id = f"ord_test_{int(datetime.now().timestamp())}"
        session_id = f"cs_test_mock_{int(datetime.now().timestamp())}"
        
        db.orders.insert_one({
            "order_id": order_id,
            "user_id": user_id,
            "user_email": f"{user_id}@example.com",
            "slugs": ["notion-second-brain"],
            "total_cents": 4900,
            "status": "paid",
            "stripe_session_id": session_id,
            "created_at": datetime.utcnow(),
            "paid_at": datetime.utcnow()
        })
        
        # Add to library
        db.library.insert_one({
            "user_id": user_id,
            "slug": "notion-second-brain",
            "acquired_at": datetime.utcnow(),
            "order_id": order_id
        })
        
        print(f"📝 Added order {order_id} to user {user_id}")
        return True
    except Exception as e:
        print(f"❌ Failed to add order: {str(e)}")
        return False

def test_library_with_templates(session_token):
    """Test 10b: GET /api/library - Library with templates"""
    try:
        headers = {"Authorization": f"Bearer {session_token}"}
        response = requests.get(f"{BASE_URL}/library", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if "templates" in data and data["count"] > 0:
                log_test("GET /api/library - Library with templates", True, f"Count: {data['count']}, Templates: {len(data['templates'])}")
                return True
            else:
                log_test("GET /api/library - Library with templates", False, f"Expected templates, got: {data}")
                return False
        else:
            log_test("GET /api/library - Library with templates", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/library - Library with templates", False, f"Exception: {str(e)}")
        return False

def test_admin_orders_non_admin(session_token):
    """Test 11a: GET /api/admin/orders - Non-admin access (403)"""
    try:
        headers = {"Authorization": f"Bearer {session_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        if response.status_code == 403:
            log_test("GET /api/admin/orders (non-admin) - 403 handling", True, "Correctly returned 403")
            return True
        else:
            log_test("GET /api/admin/orders (non-admin) - 403 handling", False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/admin/orders (non-admin) - 403 handling", False, f"Exception: {str(e)}")
        return False

def test_admin_stats_non_admin(session_token):
    """Test 11b: GET /api/admin/stats - Non-admin access (403)"""
    try:
        headers = {"Authorization": f"Bearer {session_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        if response.status_code == 403:
            log_test("GET /api/admin/stats (non-admin) - 403 handling", True, "Correctly returned 403")
            return True
        else:
            log_test("GET /api/admin/stats (non-admin) - 403 handling", False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/admin/stats (non-admin) - 403 handling", False, f"Exception: {str(e)}")
        return False

def test_admin_orders_admin(admin_token):
    """Test 11c: GET /api/admin/orders - Admin access (200)"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if "orders" in data:
                log_test("GET /api/admin/orders (admin) - Admin access", True, f"Orders count: {len(data['orders'])}")
                return True
            else:
                log_test("GET /api/admin/orders (admin) - Admin access", False, f"Missing orders field: {data}")
                return False
        else:
            log_test("GET /api/admin/orders (admin) - Admin access", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/admin/orders (admin) - Admin access", False, f"Exception: {str(e)}")
        return False

def test_admin_stats_admin(admin_token):
    """Test 11d: GET /api/admin/stats - Admin access (200)"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if "total_orders" in data and "total_users" in data and "revenue" in data:
                log_test("GET /api/admin/stats (admin) - Admin access", True, f"Stats: {data}")
                return True
            else:
                log_test("GET /api/admin/stats (admin) - Admin access", False, f"Missing stats fields: {data}")
                return False
        else:
            log_test("GET /api/admin/stats (admin) - Admin access", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/admin/stats (admin) - Admin access", False, f"Exception: {str(e)}")
        return False

def test_logout(session_token):
    """Test 12: POST /api/auth/logout - Logout"""
    try:
        headers = {"Authorization": f"Bearer {session_token}"}
        response = requests.post(f"{BASE_URL}/auth/logout", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("POST /api/auth/logout - Logout", True, "Successfully logged out")
                return True
            else:
                log_test("POST /api/auth/logout - Logout", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("POST /api/auth/logout - Logout", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("POST /api/auth/logout - Logout", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 80)
    print("PathPages Backend API Testing Suite")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    print()
    
    # Test public endpoints
    print("🔍 Testing Public Endpoints...")
    test_root_endpoint()
    test_config_endpoint()
    test_templates_list()
    test_template_detail()
    test_template_not_found()
    
    # Test checkout flow
    print("\n🛒 Testing Checkout Flow...")
    session_id = test_checkout_create()
    test_checkout_empty_slugs()
    if session_id:
        test_checkout_verify(session_id)
    
    # Create test user and test auth endpoints
    print("\n👤 Testing Auth Endpoints...")
    user_id, session_token = create_test_user_in_mongo()
    if user_id and session_token:
        test_auth_me(session_token)
        test_library_empty(session_token)
        
        # Add order to user and test library with templates
        add_order_to_user(user_id)
        test_library_with_templates(session_token)
        
        # Test admin endpoints with non-admin user
        print("\n🔒 Testing Admin Endpoints (Non-Admin)...")
        test_admin_orders_non_admin(session_token)
        test_admin_stats_non_admin(session_token)
    
    # Create admin user and test admin endpoints
    print("\n👑 Testing Admin Endpoints (Admin)...")
    admin_id, admin_token = create_admin_user_in_mongo()
    if admin_id and admin_token:
        test_admin_orders_admin(admin_token)
        test_admin_stats_admin(admin_token)
    
    # Test logout
    if session_token:
        print("\n🚪 Testing Logout...")
        test_logout(session_token)
    
    # Summary
    print("\n" + "=" * 80)
    print("Test Summary")
    print("=" * 80)
    passed = sum(1 for t in test_results if t["passed"])
    failed = sum(1 for t in test_results if not t["passed"])
    total = len(test_results)
    
    print(f"Total: {total} | Passed: {passed} | Failed: {failed}")
    
    if failed > 0:
        print("\n❌ Failed Tests:")
        for t in test_results:
            if not t["passed"]:
                print(f"  - {t['name']}")
                if t["details"]:
                    print(f"    {t['details']}")
    
    print("=" * 80)
    
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
