# 💳 **PAYMENT CONTEXT — Full Breakdown**

The Payment domain is **transactional**, **auditable**, and **strictly consistent**.
It doesn't care about seats, movies, or showtimes — only whether an order is legit and paid for.

---

# 1️⃣ **Context Map Diagram (Payment in the finance matrix)**

```
                 +----------------------+
                 |      Identity        |
                 | (User validated)     |
                 +---------+------------+
                           |
                           v
+-----------------+    +---+--------------------+    +----------------------+
|     Catalog     |    |        Payment         |    |      Booking         |
| (Pricing maybe) |    | (Orders + Transactions) |<---| (Seat reservations) |
+--------+--------+    +-----------+------------+    +----------+-----------+
         ^                         |                          ^
         |                         | Events                   |
         |                         v                          |
+--------+--------+      +---------+-----------+    +---------+-----------+
|    Frontend     | ---> |     Notifications    | <--|   Refund/Cancel    |
+-----------------+      +----------------------+
```

### How Payment vibes with others:

* **Identity → Payment** (authN)
  Payment needs verified users.
* **Booking → Payment** (supplier)
  Payment validates reservation + locked seats.
* **Payment → Booking** (event-driven)
  “Yo, payment done, go finalize the booking.”
* **Payment → Notifications**
  “Send the receipt, babes.”

Payment NEVER decides seats.
Payment NEVER creates bookings.
Payment ONLY verifies & charges.

---

# 2️⃣ **Microservice Boundaries (Recommended)**

If you split this into microservices, here’s the clean domain cut:

### 🧱 **1. Order Service**

Owns:

* Order creation
* Price calculation (base + fees)
* Order status logic (pending, paid, failed)

### 🧱 **2. Payment Processor Service**

Owns:

* Stripe/PayPal/VNPay integration
* Webhook handling
* Fraud checks
* Payment authorizations + captures

### 🧱 **3. Refund Service**

Owning:

* Refund requests
* Partial refunds
* Stripe refund flows

### 🧱 **4. Billing/Invoice Service** *(optional)*

If you need legal receipt/invoice logic.

v1 → combine everything into **Payment Service**.

---

# 3️⃣ **Database Tables (Payment Context)**

Payment domain data must be **immutable**, **auditable**, and **traceable**.

---

## 🧾 **orders**

Created when user proceeds to checkout.

| column         | type      | notes                           |
| -------------- | --------- | ------------------------------- |
| id (PK)        | uuid      |                                 |
| reservation_id | uuid      | FK to Booking                   |
| user_id        | uuid      |                                 |
| showtime_id    | uuid      | denormalized for receipts       |
| seats          | jsonb     | seat numbers                    |
| amount_total   | decimal   | final price                     |
| currency       | varchar   |                                 |
| status         | enum      | pending, paid, failed, canceled |
| created_at     | timestamp |                                 |
| updated_at     | timestamp |                                 |

---

## 💸 **transactions**

Actual payment attempts.

| column                  | type      | notes                        |
| ----------------------- | --------- | ---------------------------- |
| id (PK)                 | uuid      |                              |
| order_id                | uuid      | FK                           |
| provider                | enum      | stripe, paypal, vnPay        |
| provider_transaction_id | varchar   |                              |
| amount                  | decimal   |                              |
| status                  | enum      | initiated, succeeded, failed |
| error_code              | varchar   |                              |
| raw_response            | jsonb     |                              |
| created_at              | timestamp |                              |

---

## ↩️ **refunds**

Refund ledger.

| column         | type      | notes                        |
| -------------- | --------- | ---------------------------- |
| id (PK)        | uuid      |                              |
| transaction_id | uuid      | FK                           |
| amount         | decimal   |                              |
| status         | enum      | requested, completed, failed |
| created_at     | timestamp |                              |

---

# 4️⃣ **Event-Driven Flows (Payment is both listener + publisher)**

Let’s go through the key events.

---

## ⭐ Event (incoming): `SeatsLocked` (from Booking)

Payment sees this → creates **Order**.

### Payment does:

* Recalculates price
* Creates `order` with status = pending

---

## ⭐ Event (incoming): `ReservationExpired`

Payment sees this → cancels unpaid orders.

---

## ⭐ Event: `PaymentInitiated`

Frontend → Payment Service

Payment triggers:

* Stripe session creation
* Redirect URLs

---

## ⭐ Event: `PaymentCompleted` (from Stripe webhook)

This is the most important event.

Payment validates:

* Stripe signature
* Order amount
* Order still pending

Then Payment publishes:

### ⭐ `PaymentSucceeded`

```json
{
  "event": "PaymentSucceeded",
  "orderId": "uuid",
  "reservationId": "uuid",
  "userId": "uuid",
  "amount": 250000,
  "provider": "stripe"
}
```

**Subscribers:**

* **Booking** → Finalize booking & mark seats sold
* **Notifications** → Send receipt & ticket
* **Analytics** → Update revenue

---

## ⭐ Event: `PaymentFailed`

**Subscribers:**

* Booking → release seats
* Frontend → show failed payment screen
* Notifications → optionally notify

---

## ⭐ Event: `RefundCompleted`

**Subscribers:**

* Booking → mark booking canceled
* Notifications → email about refund

---

# 5️⃣ **End-to-End Payment Flow (Clean DDD Vibes)**

### **1. User selects seats**

Booking locks seats → emits `SeatsLocked`.

### **2. Payment creates order**

`order` status = pending.

### **3. User clicks “Pay Now”**

Payment creates Stripe checkout session.
Frontend redirects.

### **4. Stripe webhook hits Payment Service**

Stripe:
“Yo, customer paid.”

Payment:

* Validates
* Creates a transaction record
* Updates order to `paid`
* Emits `PaymentSucceeded`

### **5. Booking Confirmed**

Booking:

* Converts reservation → booking
* Emits `BookingConfirmed`

### **6. Notifications deliver receipt**

One event can trigger email, SMS, in-app alerts.

---

# 6️⃣ **Payment → Other Context Contracts**

| Target Context | Why it needs Payment | Events it listens to              |
| -------------- | -------------------- | --------------------------------- |
| Booking        | Finalize seat sale   | PaymentSucceeded                  |
| Notifications  | Email receipts       | PaymentSucceeded, RefundCompleted |
| Identity       | Auth                 | N/A                               |
| Catalog        | Analytics only       | PaymentSucceeded                  |
| Frontend       | UI flow              | PaymentFailed, PaymentSucceeded   |

---

# 7️⃣ **Pricing Strategy (where to put it?)**

Your options:

### Option A — Payment owns pricing

Best if:
You need seats-based pricing, fees, discounts, VIP seating.

### Option B — Booking owns pricing

Best if:
Prices depend on seat categories.

### Option C — Catalog owns pricing

Best if:
Movie pricing tiers vary by showtime.

**Most clean DDD setups put pricing in Payment**, since it ties to audit + orders.
