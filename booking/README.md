# 🎟️ **BOOKING CONTEXT — Full Breakdown**

This context owns everything about **seat availability**, **reservations**, **seat locks**, and **actual bookings** — but knows nothing about payments or movie metadata.

---

# 1️⃣ **Context Map Diagram (Booking in the middle of the drama)**

```
                             +-------------------------+
                             |        Catalog          |
                             | (Movies, Showtimes)     |
                             +-----------+-------------+
                                         |
                                         | Queries: showtime validity
                                         v
+-------------------------+     +--------+---------+     +----------------------+
|      Notifications      | <-- |       Booking     | --> |       Payment        |
| (Emails, Alerts, SMS)   |     |  (Seats, Holds)   |     | (Checkout, Orders)   |
+------------+------------+     +--------+----------+     +----------+-----------+
             ^                          ^                           ^
             | Event: BookingConfirmed  | Token validation           |
             | CancelationNotice        |                           |
+------------+------------+             |                           |
|        Identity          |------------+                           |
| (Auth, User profile)     |  AuthN check / customer identity       |
+--------------------------+                                         
```

### Relationship dynamics:

* **Catalog → Booking** = *Supplier*
  Booking depends on showtime + cinema + room data.
* **Identity → Booking** = *Auth boundary*
  Simply verifies users; Booking owns all reservation logic.
* **Payment ↔ Booking** = *Orchestration partners*
  Payment finalizes the booking.
* **Notifications ← Booking** = *Event Subscriber*
  Booking tells Notifications when to send confirmation or cancellation.

---

# 2️⃣ **Microservice Boundaries for Booking**

If you ever wanna split this domain, here are clean boundaries:

### 🧱 **1. Seat Service**

Owns:

* Seat maps
* Seat availability per showtime
* Locking seats (optimistic or pessimistic strategies)

### 🧱 **2. Reservation Service**

Owns:

* Temporary reservations (pending)
* Reservation timers (e.g., 5–7 mins)
* Expiration workflows

### 🧱 **3. Booking Service**

Owns:

* Final booking records
* “Confirm booking” process
* Emits booking lifecycle events

For v1, you can absolutely combine all three into a **Booking Service**.

---

# 3️⃣ **Database Tables (Booking Context)**

### 🪑 **1. seats** *(Master seat map for each room)*

Usually static, from Catalog — but Booking can store it for fast access.

| column      | type    | notes       |
| ----------- | ------- | ----------- |
| id (PK)     | uuid    |             |
| room_id     | uuid    | FK          |
| seat_number | varchar | “A10”, “B7” |
| row         | int     | optional    |
| column      | int     | optional    |

---

### 🧷 **2. showtime_seats**

Availability per showtime.

| column       | type      | notes                             |
| ------------ | --------- | --------------------------------- |
| id (PK)      | uuid      |                                   |
| showtime_id  | uuid      | FK                                |
| seat_id      | uuid      | FK                                |
| status       | enum      | available, locked, reserved, sold |
| locked_by    | uuid      | optional (userId)                 |
| locked_until | timestamp | TTL lock                          |
| updated_at   | timestamp |                                   |

---

### ⏳ **3. reservations**

Temporary seat holds before payment.

| column      | type      | notes                       |
| ----------- | --------- | --------------------------- |
| id (PK)     | uuid      | reservation ID              |
| user_id     | uuid      | FK                          |
| showtime_id | uuid      |                             |
| seats       | jsonb     | [seat_id]                   |
| status      | enum      | pending, expired, confirmed |
| expires_at  | timestamp |                             |
| created_at  | timestamp |                             |

---

### 🎟️ **4. bookings**

Final, confirmed bookings.

| column         | type      | notes               |
| -------------- | --------- | ------------------- |
| id (PK)        | uuid      | ticket ID           |
| reservation_id | uuid      | FK                  |
| user_id        | uuid      |                     |
| showtime_id    | uuid      |                     |
| seats          | jsonb     | [seat_number]       |
| total_price    | decimal   | stored for audit    |
| payment_id     | uuid      | FK (from Payment)   |
| status         | enum      | confirmed, canceled |
| created_at     | timestamp |                     |
| updated_at     | timestamp |                     |

---

# 4️⃣ **Event-Driven Flow (Booking Events)**

Booking is an event powerhouse.
Here are the main events and who reacts to them:

---

## ⭐ Event: `SeatsLocked`

**When triggered:**
User picks seats → service locks them for a short period.

**Payload:**

```json
{
  "event": "SeatsLocked",
  "reservationId": "uuid",
  "showtimeId": "uuid",
  "userId": "uuid",
  "seats": ["A10", "A11"],
  "expiresAt": "2025-03-10T19:05:00Z"
}
```

### Subscribers:

* **Frontend** → show highlight countdown for seat lock
* **Payment** → allow payment to proceed knowing seats are held

---

## ⭐ Event: `ReservationExpired`

Triggered by background cron or TTL worker.

### Subscribers:

* **Frontend** → Notify user
* **Booking (internal)** → Release seats
* **Payment** → Block checkout if user tries to pay late

---

## ⭐ Event: `BookingConfirmed`

Triggered after Payment emits a “PaymentCompleted” and Booking finalizes the record.

**Payload:**

```json
{
  "event": "BookingConfirmed",
  "bookingId": "uuid",
  "userId": "uuid",
  "showtimeId": "uuid",
  "seats": ["B5", "B6"]
}
```

### Subscribers:

* **Notifications** → send e-ticket
* **Catalog** → optional analytics update
* **Payment** → store confirmation state
* **Frontend** → show success page

---

## ⭐ Event: `BookingCancelled`

Triggered when showtime is canceled OR payment fails.

### Subscribers:

* **Notifications** → send refund / cancel message
* **Payment** → reverse or void the payment
* **Catalog** → mark seats as reopened

---

# 5️⃣ **End-to-End Booking Flow (Realistic Example)**

This is the whole vibe when a user books seats:

---

### **1. User picks seats**

Booking service:

* Validates showtime from Catalog
* Validates user from Identity
* Locks seats → creates reservation
* Emits `SeatsLocked`

---

### **2. User pays**

Payment service:

* Confirms seats are still locked
* Charges card
* Emits `PaymentCompleted`

---

### **3. Booking finalizes**

Booking service:

* Converts reservation → booking
* Marks seats as sold
* Emits `BookingConfirmed`

---

### **4. Notifications sends ticket**

Subscriber to `BookingConfirmed`

---

### **5. If reservation expires**

* Booking emits `ReservationExpired`
* Releases seats
