## 🎥 **1. Catalog Context (Movies & Showtimes)**

**What it owns:**

* Movie metadata (titles, genres, posters, synopsis)
* Showtimes for each film
* Trailer links / rich media
* Search + filtering logic

**Why it exists:**
This is the “movie library brain.” It serves pure content — no booking, no payments, just vibes and data.

**Other contexts ask it:**
“Yo, what movies y’all got?”
“Is this showtime valid?”

---

## 🙋‍♂️ **2. Identity & Access Context (Auth + SSO)**

**What it owns:**

* User accounts
* Single Sign-On integrations (Google, Apple)
* Sessions, tokens, roles

**Why it exists:**
The bouncer of the club. It handles logins, keeps users secure, but doesn’t care about movies or money.

**Other contexts ask it:**
“Is this user legit?”
“Who is this?”

---

## 🎟️ **3. Booking Context (Seats + Reservations)**

**What it owns:**

* Seat maps per showtime
* Seat availability logic
* Holding/reserving seats
* Booking workflows (movie → showtime → seats)

**Why it exists:**
This is the “fight for the good seats” engine.
Handles the messy logic like preventing double-booking and temporary seat locks.

**Other contexts ask it:**
“What seats are open?”
“Lock these seats for this user rn.”

---

## 💳 **4. Payment Context (Checkout + Orders)**

**What it owns:**

* Payment processing (Stripe, cashless flows, etc.)
* Order creation
* Pricing rules + fees
* Booking confirmation

**Why it exists:**
Handles money and receipts. Doesn’t care about movies, only whether the purchase is valid.

**Other contexts ask it:**
“User picked seats, here’s the cost — charge them.”
“Did the payment clear?”

---

## 🧾 **5. Notifications Context (Receipts + Alerts)**

**What it owns:**

* Booking confirmation notifications
* Email / in-app toasts
* Any future event-based notifications

**Why it exists:**
Keeps users in the loop. It reacts to events from other contexts but owns its own delivery logic.

**Other contexts tell it:**
“Hey yo, booking succeeded, send the vibes.”

---

## 🏠 **6. Experience/UI Context (Frontend App Layer)**

**What it owns:**

* Pages + UI flows:

    * Home, Movies, Movie Detail
    * Seat Selection
    * Checkout
    * Confirmation
    * Login
* State management, transitions, animations

**Why it exists:**
This is the part users actually touch. It orchestrates across all backend contexts while keeping the interface smooth.

**Other contexts don’t talk to it;**
It talks to them.

---

# 🗺️ Full Picture (bird’s-eye)

Here’s how they vibe together:

* **Identity** → confirms the user
* **Catalog** → serves movie + showtime info
* **Booking** → checks seat availability + creates reservations
* **Payment** → charges user + finalizes order
* **Notifications** → sends confirmation
* **UI** → orchestrates everything
