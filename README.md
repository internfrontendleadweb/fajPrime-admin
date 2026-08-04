# FAJ Prime Estates — Admin Dashboard

React + Vite + Tailwind admin CMS for managing the FAJ Prime Estates
website content. Talks to the backend API at
[faj-prime-api.onrender.com](https://faj-prime-api.onrender.com) (repo:
`fajPrime-Backend`) — full endpoint reference in that repo's `API.md`.

## Stack
- React + Vite
- Tailwind CSS v4
- React Router
- React Hook Form + Zod (matches the backend's own validation)
- lucide-react (icons)

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```
Runs on http://localhost:5174 (deliberately different port from the main
public site, so both can run locally at the same time).

Make sure the backend is running too (see `fajPrime-Backend` repo) and that
its `ALLOWED_ORIGINS` includes wherever this dashboard runs — `.env`'s
`VITE_API_URL` just points here at the API; the API also needs to allow
this origin for the cross-domain auth cookie to work.

## Status
Section 1 (scaffolding) — folder structure, API client, routing skeleton.
Built section by section: login → dashboard layout → content management →
submissions management → image uploads → deployment.
