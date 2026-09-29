# Nova Club — Campus Events

A campus club events platform built with React, TypeScript, Vite and Tailwind CSS.
Students can browse events, filter by category/date, view details and register.
Admins sign in to manage events and registrations from a dashboard.

## Features

- Public site: home with featured-event countdown, searchable/filterable events list,
  event detail pages with rules & seat availability, and a registration flow with
  validation (duplicate-email, deadline and capacity checks).
- Admin portal (`/admin`): dashboard stats, event CRUD with image presets,
  registration management with status updates.
- Data layer (`src/services/api.ts`) is async and swappable — currently backed by
  `localStorage`, designed to be replaced with a real backend without touching components.

## Demo admin credentials

| Email | Password |
| --- | --- |
| `admin@novaclub.edu` | `admin123` |

## Getting started

```bash
npm install
npm run dev      # start dev server on http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview  # preview the production build locally
```

## Tech stack

- React 18 + TypeScript + Vite
- React Router v6
- Tailwind CSS v3
- lucide-react icons

## Deployment

Static SPA — deploys as-is to Netlify or Vercel.

- **Netlify:** build command `npm run build`, publish directory `dist`.
  The SPA fallback is handled by `public/_redirects`.
- **Vercel:** the rewrite in `vercel.json` keeps deep links like `/events/xyz`
  working on hard refresh.
