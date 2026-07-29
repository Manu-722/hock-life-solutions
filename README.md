# Hock Life Solutions — E-commerce Website

Full stack: **Django + Django REST Framework** (backend/API) and **React (Vite)** (frontend).
Theme: black / amber / white, as requested.

## What's included

- One login form for everyone. If the account is an admin, the response tells the
  frontend `is_admin: true` — the site greets them by name as admin and reveals the
  **Admin Dashboard** link in the navbar. Normal users never see that link.
- Google Sign-In (functional, once you add your own Google OAuth credentials).
- Forgot password → emails a 6-digit code that **expires in 5 minutes** → reset password.
- Cart → Checkout → shows the Hock Life Solutions **Till/Paybill number** → order sits
  **Pending** → admin approves it in the dashboard → customer instantly sees **Approved**
  in their Profile order history.
- Admin Dashboard (only reachable by admins):
  - **Products**: add/edit/delete any product, mark items on offer or remove them from
    offer, mark stock as out/in. Choosing "Induction Cookers" as the category reveals a
    form for watts, power output levels, and the channel/lock system. Choosing the
    kitchenware/sufuria category reveals a form for size and material. Any other
    category just uses the base product fields.
  - **Slideshow/Offers**: add, edit, reorder, hide, or delete homepage slides.
  - **Orders**: approve or reject pending customer orders.
- Homepage: offers slideshow, then a search bar with filters (category, price range,
  in-stock, on-offer) below it.
- Hardcoded starter admin password created via a management command; the admin is
  **forced to change it** the moment they log in (see Settings page).

## Project structure

```
hocklife/
  backend/     Django project (DRF API)
  frontend/    React (Vite) app
```

---

## 1. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # then edit .env with real values
python manage.py migrate
python manage.py create_admin    # creates the admin with the hardcoded starter password
python manage.py runserver
```

The `create_admin` command prints the starter username/password. Log in with that,
and you'll immediately be prompted in Settings to change it — this is intentional and
is part of "keeping the site secure."

To change the starter password itself before you ever run the command, edit
`HARDCODED_STARTER_PASSWORD` in `accounts/management/commands/create_admin.py`.

### Adding your first categories (as an admin, once logged in via the API/admin panel)
Go to `http://localhost:8000/admin/` (Django's built-in admin, separate from your
React admin dashboard) and add three categories to start: `Cells`, `Induction Cookers`,
`Kitchenware`. Slugs should contain "induction" and "sufuria"/"kitchen" respectively —
the frontend uses that to decide which extra spec form to show.

### Email (for the 5-minute reset code)
By default, emails print to your terminal (`console` backend) so you can test without
a real mail server. For production, set `EMAIL_BACKEND`, `EMAIL_HOST_USER`, and
`EMAIL_HOST_PASSWORD` in `.env` (e.g. a Gmail "app password").

### Google login
1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth 2.0 Client ID (type: Web application)
3. Add `http://localhost:5173` (and later your real domain) to Authorized JavaScript origins
4. Put the Client ID/Secret into both `backend/.env` and `frontend/.env`

### Till/Paybill number
Set `COMPANY_TILL_NUMBER` in `backend/.env` to Hock Life Solutions' real M-Pesa
till or paybill number — this is what's shown to customers at checkout.

---

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env              # then edit with your API URL + Google client ID
npm run dev
```

Visit `http://localhost:5173`.

---

## 3. Going live (domain + hosting)

1. **Buy your domain** (e.g. from Namecheap, Google Domains successor, or a local
   Kenyan registrar).
2. **Host the backend** (Django) somewhere like Railway, Render, or a VPS (DigitalOcean).
   Set `DJANGO_DEBUG=False`, a real `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, and
   switch the database to Postgres (env vars already wired for this in `.env.example`).
3. **Host the frontend** (Vercel, Netlify, or the same VPS). Run `npm run build` —
   it outputs static files in `frontend/dist` that any static host can serve.
4. **Point your domain's DNS** at your hosting provider (A record or CNAME, depending
   on the host's instructions).
5. Update `CORS_ALLOWED_ORIGINS` (backend) and `VITE_API_BASE_URL` (frontend) to your
   real domain, then redeploy both.
6. **Google Search Console**: once the domain is live with HTTPS, add it to
   https://search.google.com/search-console to get it indexed on Google.

## 4. Security notes

- The hardcoded admin password is only used once — the account is forced to change it
  on first login.
- Admin accounts can never be created through the public registration API — only
  through the `create_admin` management command, so a regular customer can never
  make themselves an admin.
- Passwords are hashed by Django (never stored in plain text), and Django's password
  validators enforce a minimum length and block common passwords.
- JWT access tokens expire in 6 hours; refresh tokens in 7 days.
- Before going live: set `DJANGO_DEBUG=False`, use a real random `DJANGO_SECRET_KEY`,
  serve everything over HTTPS, and keep `.env` out of version control (already covered
  by `.gitignore`).
