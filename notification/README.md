# 🔔 **NOTIFICATIONS CONTEXT — Full Breakdown**

Notifications is *reactive*, not authoritative.
It doesn’t own business workflows — it just tells humans what happened.

Its job:
**Listen → Format → Deliver**

---

# 1️⃣ **Context Map Diagram (Notifications as event sponge)**

```
                          +-----------------------+
                          |       Identity        |
                          | (UserRegistered)      |
                          +-----------+-----------+
                                      |
                                      v Events
+--------------------+         +------+-------+        +---------------------+
|      Payment       | ------> | Notifications | <-----|       Booking       |
| (PaymentCompleted) | Events  |  (Emails/SMS) | Events| (BookingConfirmed)  |
+--------------------+         +------+-------+        +---------+-----------+
                                      ^                         ^
                                      |                         |
                                      |                         |
                          +-----------+-----------+    +--------+----------------+
                          |        Catalog         |    |        Frontend         |
                          | (MoviePublished etc.)  |    | Triggers in-app toasts  |
                          +------------------------+    +--------------------------+
```

### Notifications depends on:

* Identity events → user onboarding flows
* Catalog events → promos / new movie drops
* Booking events → seat confirmations
* Payment events → receipts / refunds
* (Optionally) Frontend triggers for client-side notifications

### Notifications never feeds data back into domains.

It’s pure output.

---

# 2️⃣ **Microservice Boundaries (Recommended)**

You can keep everything inside a single **Notifications Service**, but here are clean splits if you scale:

### 🧱 Email Notification Service

* Templates (React Email, MJML, etc.)
* Receipts, confirmations
* Transactional email logs

### 🧱 SMS & Push Notification Service

* OTP (if needed)
* Urgent alerts

### 🧱 In-App Notification Service

* Inside the mobile/web app
* Notification center

### 🧱 Webhooks Service (Optional)

* For future partners (cinemas, business customers)

For v1 → keep it all as a **Notifications Service** with multiple channels.

---

# 3️⃣ **Database Tables (Notifications Context)**

Notifications should store **proof** it sent something, retries, and templates.

---

## 📨 **notifications**

Log table for all outgoing notifications.

| column        | type      | notes                               |
| ------------- | --------- | ----------------------------------- |
| id (PK)       | uuid      |                                     |
| user_id       | uuid      | nullable (for system announcements) |
| channel       | enum      | email, sms, push, webhook           |
| template      | varchar   | name of template used               |
| payload       | jsonb     | rendered template values            |
| status        | enum      | pending, sent, failed               |
| error_message | text      | nullable                            |
| sent_at       | timestamp |                                     |
| created_at    | timestamp |                                     |

---

## 📰 **notification_templates**

Stores the metadata for templates.

| column     | type       | notes                                   |
| ---------- | ---------- | --------------------------------------- |
| id (PK)    | uuid       |                                         |
| name       | varchar    | e.g., “booking-confirmed”               |
| channel    | enum       | email, sms, push                        |
| version    | int        | allows updates without breaking history |
| content    | text/jsonb | depends on templating engine            |
| created_at | timestamp  |                                         |

(React-based templates usually get checked into Git instead.)

---

## 🎧 **notification_subscriptions** (optional)

User preferences.

| column        | type | notes |
| ------------- | ---- | ----- |
| user_id (PK)  | uuid |       |
| email_enabled | bool |       |
| sms_enabled   | bool |       |
| push_enabled  | bool |       |

---

# 4️⃣ **Event Flows (Notifications subscribers)**

Notifications listens to events from every upstream subsystem.

---

## ⭐ Event: `UserRegistered`

**Triggered by:** Identity service

### Notifications does:

* Send welcome email
* Send onboarding push

---

## ⭐ Event: `BookingConfirmed`

**Triggered by:** Booking

### Notifications does:

* Send e-ticket with QR code
* Send SMS reminder (optional)
* Log the notification in `notifications` table

---

## ⭐ Event: `PaymentCompleted`

**Triggered by:** Payment

### Notifications does:

* Email receipt
* Push notification “Your order is confirmed”

---

## ⭐ Event: `PaymentFailed`

**Triggered by:** Payment

### Notifications does:

* Email user about failed payment
* Push alert if urgent

---

## ⭐ Event: `ShowtimeCanceled`

**Triggered by:** Catalog

### Notifications does:

* Notify all affected users
  (Booking emits *which* users are affected)

---

## ⭐ Event: `ReservationExpired`

**Triggered by:** Booking TTL worker

### Notifications does:

* In-app notification to user
* Optional email “Your reservation expired; seats are released”

---

# 5️⃣ **Notification Delivery Pipeline (Internal Workflow)**

Typical pipeline inside Notifications service:

```
Event Received
     |
     v
Match event → template
     |
     v
Render template (React Email / MJML / Handlebars)
     |
     v
Send via channel (SMTP / SMS API / Push Service)
     |
     v
Log result to database
```

This is why Notifications is easy to scale and maintain — it’s decoupled.

---

# 6️⃣ **End-to-End Scenario (Booking flow)**

### 🎬 Step-by-step vibe check:

1. User picks seats → Booking locks seats
2. User pays → Payment emits `PaymentCompleted`
3. Booking receives payment → emits `BookingConfirmed`
4. Notifications receives:

    * `PaymentCompleted` → send receipt
    * `BookingConfirmed` → send e-ticket
5. User receives confirmations across channels

Notifications does not need to understand seat logic or movie metadata.
It only knows how to **tell the story**.

---

# 7️⃣ **Bonus: Suggested Event → Template Mapping**

| Event              | Template            | Channel    |
| ------------------ | ------------------- | ---------- |
| UserRegistered     | welcome             | email/push |
| BookingConfirmed   | ticket-confirmation | email/sms  |
| PaymentCompleted   | payment-receipt     | email      |
| PaymentFailed      | payment-failed      | email/push |
| ReservationExpired | reservation-expired | in-app     |
| ShowtimeCanceled   | showtime-canceled   | email/sms  |
