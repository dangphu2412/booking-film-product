Bet, Justin — let’s cook your **Identity** service deliverables 🔥
I’ll keep it clean DDD-style but still Gen Z-coded.

---

# 🎯 1. **Identity Context Map Diagram**

Here’s the vibe-level map showing who Identity vibes with and how:

```
                         +---------------------+
                         |      Catalog        |
                         |   (Movie Data)      |
                         +----------+----------+
                                    ^
                                    | Query (public profile if needed)
                                    |
+---------------------+             |
|     Notifications   |             |
|  (Email / Messaging)|             |
+----------+----------+             |
           ^                        |
           | Event: UserRegistered  |
           |                        |
+----------+----------+     +-------+--------+
|      Identity        | --> |     Booking    |
| (Auth / Users / SSO) |     | (Reservations) |
+----------+----------+     +-------+--------+
           |                         ^
           | provides auth tokens    |
           v                         |
+----------+----------+              |
|      Payment         |-------------+
| (Orders / Checkout)  |
+-----------------------+
```

**Relationships:**

* **Identity → Booking/Payment**
  *Customer–Supplier.* Identity provides verified user identity; Booking/Payment depend on it.

* **Identity → Notifications**
  *Event-triggered / Published Language.*
  When a user registers or updates profile, Identity publishes domain events.

* **Catalog** barely interacts with Identity — just reads public profile if you allow personalization.

---

# 🧱 2. **Suggested Microservice Boundaries (Identity)**

You can split Identity into these microservices if you wanna go full microservice mode:

### **1. Auth Service**

Handles:

* Login
* OAuth / SSO
* JWT issuing / refreshing
* Session revocation

### **2. User Profile Service**

Handles:

* User profile CRUD
* Preferences (language, timezone)
* Profile events like `UserRegistered`, `UserProfileUpdated`

### **3. Access Control Service** (optional)

Handles:

* Roles / permissions
* Admin access gates

> If you want to keep it chill and simple early on, merge all three into a single **Identity Service**.
> Only split when scale hits.

---

# 🛢️ 3. **Database Tables (Identity Context Only)**

### **🗂️ auth_users**

| column        | type      | notes             |
| ------------- | --------- | ----------------- |
| id (PK)       | uuid      | user id           |
| email         | varchar   | unique            |
| phone         | varchar   | optional          |
| password_hash | varchar   | nullable if SSO   |
| status        | enum      | active / disabled |
| created_at    | timestamp |                   |
| updated_at    | timestamp |                   |

### **🗂️ auth_providers**

| column           | type      | notes              |
| ---------------- | --------- | ------------------ |
| id (PK)          | uuid      |                    |
| user_id (FK)     | uuid      | link to auth_users |
| provider         | enum      | google, apple, etc |
| provider_user_id | varchar   | external ID        |
| created_at       | timestamp |                    |

### **🗂️ user_profiles**

| column           | type      | notes              |
| ---------------- | --------- | ------------------ |
| user_id (PK, FK) | uuid      | same as auth_users |
| full_name        | varchar   |                    |
| avatar_url       | varchar   | optional           |
| locale           | varchar   | en-US, vi-VN       |
| timezone         | varchar   | optional           |
| created_at       | timestamp |                    |
| updated_at       | timestamp |                    |

### **🗂️ user_sessions** (if you track sessions)

| column      | type      | notes            |
| ----------- | --------- | ---------------- |
| id (PK)     | uuid      | session id       |
| user_id     | uuid      |                  |
| device_info | jsonb     | browser, OS, etc |
| expires_at  | timestamp |                  |
| created_at  | timestamp |                  |

---

# 🔔 4. **Event-Driven Flow (Identity → Others)**

This is where your system starts hitting main-character energy.

---

## ⭐ **Event: UserRegistered**

**Published by:**
Identity Service

**Payload:**

```json
{
  "event": "UserRegistered",
  "userId": "123",
  "email": "user@example.com",
  "fullName": "John Wick"
}
```

### **Subscribers:**

* **Notifications Service**
  Sends welcome email.

* **Booking Service**
  Creates an internal customer record if needed.

---

## ⭐ **Event: UserLoggedIn**

Useful if other services want to adapt personalization.

### Subscribers:

* **Analytics Service** (future)
* **Recommendations** (if you ever go Netflix mode)

---

## ⭐ **Event: UserProfileUpdated**

**Subscribers:**

* **Notifications** → “Your profile was updated”
* **Booking/Payment** → sync names on tickets/receipts

---

## ⭐ **Event: UserDisabled**

If you soft-ban an account.

**Subscribers:**

* **Booking** → cancel seat reservations tied to this user
* **Payment** → freeze pending payments
