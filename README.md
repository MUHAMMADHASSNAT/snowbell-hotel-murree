# Snowbell Hotel Murree

```
snowbell-hotel-murree/
  frontend/     React + Vite website
  backend/      Express + MongoDB API
```

## Run both (local)

```bat
start.bat
```

Website: http://localhost:5173  
API: http://localhost:5000/api/health  
Admin: http://localhost:5173/admin/login

Or separately:

```bat
api.bat
dev.bat
```

## Deploy

- Frontend: deploy the `frontend` folder (Vercel / Netlify / static host). Set `VITE_API_URL` to your API origin, e.g. `https://your-api.onrender.com`.
- Backend: deploy the `backend` folder (Render / Railway / VPS). Set `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`.

Copy `.env.example` to `backend/.env` before running the API.
