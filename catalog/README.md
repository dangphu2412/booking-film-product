# 🎥 **CATALOG CONTEXT — Full Breakdown**

This is the “movie brain” of CineBook. It owns *content*, not *transactions*.
Let’s cook:

---

# 1️⃣ **Context Map Diagram (Catalog at the center)**

```
                             +----------------------+
                             |      Identity        |
                             | (User auth, SSO)     |
                             +-----------+----------+
                                         ^
                                         | Optional personalization queries
                                         |
+----------------------+                 |
|    Notifications     |                 |
| (Alerts, Emails)     |                 |
+----------+-----------+                 |
           ^                             |
           | Event: MoviePublished?      |
           |                             |
+----------+-----------+        +--------+--------+
|        Catalog        | --->   |     Booking     |
| (Movies, Showtimes)   |        | (Seats, Avail)  |
+----------+-----------+        +---------+--------+
           |                                ^
           | Provides showtime info         |
           v                                |
+----------+-----------+        +-----------+--------+
|       Payment         |       |     Frontend/UI     |
| (Pricing may depend)  | <-----| (Calls Catalog APIs)|
+-----------------------+       +----------------------+
```

### Catalog's relationships:

* **Booking** (Customer–Supplier)
  Booking depends heavily on Catalog for showtime & film validity.
* **Payment** (Downstream Consumer)
  Payment doesn’t call Catalog often directly, but it *needs* showtime metadata for receipts.
* **Notifications** (Event subscriber)
  Subscribes to “MoviePublished”, “ShowtimeUpdated”, etc.
* **Frontend** (Consumer)
  Pure query layer.

Catalog doesn’t know about money or seats — it’s the chill data librarian.

---

# 2️⃣ **Microservice Boundaries (Recommended)**

### 🧱 **1. Movie Service**

Owns:

* Movie metadata (title, genre, poster, cast)
* Language versions
* Trailers
* Tags (popular, trending, etc.)

### 🧱 **2. Showtime Service**

Owns:

* Showtimes per movie
* Cinema → Room → Schedule mapping
* Duration
* Status (active, canceled, sold_out-ready)

### 🧱 **3. Media Service** *(optional)*

If you want to manage:

* Posters
* Thumbnails
* Trailer hosting links
* CDN refs

If you wanna keep v1 simple → combine everything into **Catalog Service**.

---

# 3️⃣ **Database Tables (Catalog Context)**

## 📚 **movies**

| column           | type      | notes                    |
| ---------------- | --------- | ------------------------ |
| id (PK)          | uuid      |                          |
| title            | varchar   |                          |
| synopsis         | text      |                          |
| genre            | varchar[] |                          |
| duration_minutes | int       |                          |
| rating           | varchar   | PG13, R, etc             |
| release_date     | date      |                          |
| poster_url       | varchar   |                          |
| trailer_url      | varchar   |                          |
| status           | enum      | coming_soon, now_showing |
| created_at       | timestamp |                          |
| updated_at       | timestamp |                          |

---

## 🏨 **cinemas**

If you manage multiple theatres.

| column           | type      | notes |
| ---------------- | --------- | ----- |
| id (PK)          | uuid      |       |
| name             | varchar   |       |
| location_address | text      |       |
| timezone         | varchar   |       |
| created_at       | timestamp |       |
| updated_at       | timestamp |       |

---

## 📽️ **rooms**

| column          | type      | notes             |
| --------------- | --------- | ----------------- |
| id (PK)         | uuid      |                   |
| cinema_id (FK)  | uuid      |                   |
| name            | varchar   | Room 1, IMAX, VIP |
| capacity        | int       |                   |
| seat_map_schema | jsonb     | optional          |
| created_at      | timestamp |                   |
| updated_at      | timestamp |                   |

---

## ⏰ **showtimes**

| column         | type      | notes                          |
| -------------- | --------- | ------------------------------ |
| id (PK)        | uuid      |                                |
| movie_id (FK)  | uuid      |                                |
| cinema_id (FK) | uuid      | optional if room has cinema_id |
| room_id (FK)   | uuid      |                                |
| starts_at      | timestamp |                                |
| ends_at        | timestamp |                                |
| status         | enum      | active, canceled               |
| created_at     | timestamp |                                |
| updated_at     | timestamp |                                |

---

## 🏷️ **movie_tags** *(optional)*

For trending, recommended, etc.

---

# 4️⃣ **Event-Driven Flow (Catalog → Others)**

Catalog is mostly a **publisher** of reference data change events.

---

## ⭐ Event: `MoviePublished`

**Triggered when:**
A new movie is added and moved to “now_showing”.

**Payload:**

```json
{
  "event": "MoviePublished",
  "movieId": "uuid",
  "title": "Kung Fu Panda 4",
  "releaseDate": "2025-12-01",
  "posterUrl": "https://cdn..."
}
```

### Subscribers:

* **Notifications** → Send “Now Showing!” blast
* **Frontend** → Update caches
* **Analytics** → Update trending lists

---

## ⭐ Event: `ShowtimeCreated`

**Trigger:**
A new schedule is added for a movie.

**Payload:**

```json
{
  "event": "ShowtimeCreated",
  "showtimeId": "uuid",
  "movieId": "uuid",
  "startsAt": "2025-03-10T19:00:00Z",
  "roomId": "R1"
}
```

### Subscribers:

* **Booking** → Creates initial seat map availability
* **Frontend** → Updates showtime listings
* **Payment** → (optional) logs base data for receipts

---

## ⭐ Event: `ShowtimeUpdated` / `ShowtimeCanceled`

### Subscribers:

* **Booking** → freeze/cancel seat availability
* **Notifications** → notify buyers of schedule changes
* **Payment** → update receipts
* **Frontend** → update listings

---

## ⭐ Event: `MovieArchived`

For movies no longer showing.

Subscribers:

* **Frontend** (remove from UI)
* **Booking** (block future seat reservations)
* **Analytics** (freeze stats)

---

# 5️⃣ **End-to-End Flow Example**

### 🎬 Movie → Showtime → Booking

1. **New movie added**
   Catalog publishes `MoviePublished`.

2. **Showtimes added**
   Catalog publishes `ShowtimeCreated`.

3. **Booking Service** reacts:

    * Builds seat maps for that showtime
    * Marks seats available

4. **Frontend** syncs both movie + showtime data through queries.

5. **If showtime is canceled**
   Catalog publishes `ShowtimeCanceled`.

6. **Booking** automatically:

    * Locks all seats
    * Creates cancellation suggestions for Payment
    * Sends BookingCanceled events
