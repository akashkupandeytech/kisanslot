# KisanSlot — MERN Stack + Real-Time (Socket.io)

A digital farmer procurement & slot management system with three roles —
**Farmer**, **Procurement Centre Operator**, and **District Officer** — built
with MongoDB, Express, React (Vite), Node.js, and **Socket.io** for live,
real-time updates across all three roles.

## What's "real-time" here

Every important action pushes a live update to everyone who needs to see it,
without refreshing the page:

- Farmer books a slot → Operator's "Bookings" list updates instantly.
- Operator checks in a token → Farmer's Slot Booking & Status pages update
  instantly, and a notification appears.
- Operator marks quality/weighing done → Payment stage appears live for the
  farmer.
- Farmer books a slot → the centre's live load ticks up for Operator/Officer.
- Officer sends a congestion alert or reallocates staff → Operator sees a
  toast immediately, and the centre's load updates everywhere.

This is done with Socket.io: the backend emits events (`slot:created`,
`slot:updated`, `centre:updated`, `notification:new`, etc.) after every
relevant database write, and the frontend listens for them and updates React
state directly — no polling.

## Folder structure

```
kisanslot-mern/
  backend/     Express API + MongoDB models + Socket.io server
  frontend/    React app (Vite) + Socket.io client
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

Make sure MongoDB is running locally (or set `MONGO_URI` in `.env` to an
Atlas connection string).

Seed the three procurement centres (only needs to be run once):

```bash
npm run seed
```

Start the API + Socket.io server:

```bash
npm run dev
```

Runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 2. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`, and proxies both `/api` and `/socket.io`
requests to the backend (see `vite.config.js`) — so both servers must be
running together.

## 3. Trying out the real-time features

Open the app in **two browser windows/tabs** side by side:

1. In **Tab A**, choose **Farmer**, register a profile, register a crop, and
   book a slot. Note the token shown (e.g. `KS-AB123`).
2. In **Tab B**, choose **Procurement Centre Operator**, go to
   **Bookings / Check-in**, enter that token, and click **Check-in**.
3. Watch **Tab A** — the slot's status updates to "Checked-in" and a
   notification appears, live, with no refresh.
4. In **Tab B**, go to **Quality & Weighing**, mark quality then weighing —
   watch Tab A's Payment Status page update live too.
5. Open a **Tab C** as **District Officer** — the Centres Overview load
   percentages update live as bookings/check-ins happen in the other tabs.

## Roles (no authentication)

This prototype has no login/password — choosing a role from the gate is
enough, matching the original demo. The farmer's identity is remembered in
the browser (`localStorage`) after registration so re-opening the app keeps
you logged in as that farmer. For production use, add real authentication
per role.

## API overview

| Route | Purpose |
|---|---|
| `GET/POST /api/farmers`, `GET /api/farmers/:id` | Farmer profile |
| `GET/POST /api/crops` | Crop registration |
| `GET /api/slots/estimate` | Live duration/queue/wait estimate before booking |
| `GET/POST /api/slots` | List / book slots |
| `PATCH /api/slots/:id/checkin` | Operator check-in |
| `PATCH /api/slots/:id/mismatch` | Operator marks quantity mismatch → auto re-slot |
| `PATCH /api/slots/:id/quality` | Operator marks quality check done |
| `PATCH /api/slots/:id/weigh` | Operator marks weighing done (starts payment) |
| `PATCH /api/slots/:id/payment` | Advance payment stage |
| `GET /api/centres` | List centres with live load |
| `POST /api/centres/:id/alert` | Officer sends congestion alert |
| `POST /api/centres/:id/reallocate` | Officer reallocates staff (reduces load) |
| `GET/POST /api/documents` | Farmer documents |
| `GET/POST /api/notifications` | Notifications |
| `GET/POST /api/complaints` | Help & Support complaints |
| `GET /api/market` | Static MSP market prices |

## Multi-language support

The app now opens with a **language selection gate** (13 languages, same set
as the original prototype: Hindi, English, Punjabi, Marathi, Gujarati,
Bengali, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese, Urdu). The chosen
language is remembered in the browser and can be changed anytime from the
dropdown in the top bar.

**What's translated right now:** the language/role gates and the sidebar
navigation labels for all three roles — this is the "chrome" every user sees
regardless of which page they're on.

**What's not translated yet:** the text *inside* each page (form labels,
table headers, button text, placeholders) — these still show in
Hindi/English as before.

**How it works (`frontend/src/i18n/`):**
- `languages.js` — the list of supported languages.
- `translations.js` — one object per language code, each holding the same
  set of keys (e.g. `'nav.dashboard'`, `'role.farmer.desc'`).
- `LanguageContext.jsx` — a React context exposing `useLanguage()`, which
  gives you `{ lang, setLang, t }`. `t('some.key')` looks up the current
  language, falls back to English, then to the key itself if nothing matches.

**To translate more of a page**, e.g. the Crop Registration form:
1. Pick a key name, like `'crop.title'`.
2. Add it to every language object in `translations.js` (or just `en`/`hi`
   for now — missing languages will fall back to English automatically).
3. In the component, call `const { t } = useLanguage();` and replace the
   hardcoded string with `{t('crop.title')}`.

This is the same pattern already used in `Sidebar.jsx` and `Topbar.jsx`, so
you can copy from there.

## Notes / simplified from the original prototype

- The IVR (voice call) simulator from the original HTML mockup was left out
  to keep this MERN build focused on the app/web flow.
- Procurement centres are seeded data (`npm run seed`); swap for a full
  CRUD admin panel if centres need to be added/edited from the UI.
