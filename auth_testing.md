# Auth-Gated App Testing Playbook

Step 1: Create Test User & Session
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  role: 'admin',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

Step 2: Test Backend API
```
curl -X GET "$BASE/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
curl -X GET "$BASE/api/library" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
curl -X GET "$BASE/api/admin/stats" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

Step 3: Browser Testing
```
await page.context.add_cookies([{
    "name": "session_token", "value": "YOUR_TOKEN",
    "domain": "your-app.com", "path": "/",
    "httpOnly": True, "secure": True, "sameSite": "None"
}]);
```

Endpoints:
- POST /api/auth/session (creates session from emergent session_id)
- GET /api/auth/me (returns current user)
- POST /api/auth/logout (clears session)
- GET /api/templates
- GET /api/templates/{slug}
- POST /api/checkout/create (accepts { slugs: [...] })
- GET /api/checkout/verify/{session_id}
- GET /api/library (auth required)
- GET /api/admin/orders (admin only)
- GET /api/admin/stats (admin only)
