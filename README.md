# Om Namashivaya Agents

Digital platform for Om Namashivaya Agents — B2B + B2C sales for electronics and food products.

## Project Structure

```
om-frontend/
├── frontend/     React + Vite + TypeScript (web app)
├── backend/      FastAPI Python (API server)
├── mobile/       React Native + Expo (Android app — Phase 3)
└── supabase/     Database migrations and seed data
```

## Tech Stack

| Layer | Technology | Hosting |
|---|---|---|
| Web | React + Vite + Tailwind | Vercel (free) |
| API | FastAPI (Python) | Render.com (free) |
| Database | Supabase PostgreSQL | Supabase (free) |
| Auth | Supabase Auth | Supabase (free) |
| Mobile | React Native + Expo | Phase 3 |

## Quick Start

### 1. Database (Supabase)
1. Go to [supabase.com](https://supabase.com) → Create new project
2. Open SQL Editor → paste and run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/seed.sql` to add sample products
4. Copy your Project URL and anon key

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# Fill in your Supabase URL and anon key, and backend URL
npm install
npm run dev
```
Opens at http://localhost:5173

### 3. Backend
```bash
cd backend
cp .env.example .env
# Fill in your Supabase URL, service role key, and JWT secret
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API runs at http://localhost:8000
Auto-generated docs at http://localhost:8000/docs

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository → select `frontend/` folder
3. Add environment variables from `.env.example`
4. Deploy

### Backend → Render.com
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo → set root directory to `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Domain
Buy a `.in` domain from [Hostinger](https://hostinger.in) (~₹600/year) and point it to Vercel.

## User Roles

| Role | Access |
|---|---|
| `consumer` | Browse products, place retail orders, view own orders |
| `shop` | See wholesale prices, place bulk orders |
| `admin` | Full access — manage products, stock, all orders |

To make yourself admin: In Supabase dashboard → Table Editor → `user_profiles` → find your user → set `role` to `admin`.

## Phase Roadmap

- **Phase 1 (Now):** Web app + admin panel
- **Phase 2:** WhatsApp notifications + UPI payment links
- **Phase 3:** Android app on Google Play Store ($25 one-time)
- **Phase 4:** AI chatbot with LangChain + pgvector
