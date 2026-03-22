# Saját miniCRM (Next.js + Supabase)

Belső, **egy operátoros**, login-védett mini CRM biztosítási kárügyekhez.

## Fő funkciók
- Kapcsolatok kezelése
- Ügyek kezelése kapcsolathoz kötve
- Teendők (lejárt/mai/közelgő/elvégzett)
- Megjegyzések idővonala
- Dokumentum feltöltés Supabase Storage-ba
- Dashboard összefoglalók
- Agenda nézet (ma/holnap/hét)

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + Storage)

## 1) Lokális setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2) Környezeti változók
`.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

## 3) Supabase setup
1. Hozz létre projektet Supabase-ben.
2. Futtasd a migrációt a `supabase/migrations/202603220001_init.sql` fájlból.
3. Hozz létre legalább egy auth felhasználót (Dashboard > Authentication > Users).
4. (Opcionális) futtasd a `scripts/seed.sql` fájlt demo adatokhoz.

## 4) Migráció futtatás
SQL Editorben másold be a migráció tartalmát, vagy CLI-vel:
```bash
supabase db push
```

## 5) Lokális futtatás
```bash
npm run dev
```
Alapértelmezett URL: `http://localhost:3000`

## 6) Vercel deploy
1. Pushold a repository-t GitHubra.
2. Vercelben importáld a projektet.
3. Add meg az env változókat ugyanazzal a névvel.
4. Deploy.

## Auth modell
- Nincs publikus regisztrációs flow.
- Bejelentkezés email+jelszóval a `/bejelentkezes` oldalon.
- Middleware védi az összes belső oldalt.

## Mappa-struktúra
- `app/(auth)` – bejelentkezés
- `app/(protected)` – belső CRM oldalak
- `app/api` – task státusz és dokumentum upload API
- `components` – UI, layout, űrlap komponensek
- `lib` – Supabase kliens, query réteg, utilok
- `supabase/migrations` – adatbázis séma
- `scripts` – seed script
