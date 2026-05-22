# Malzz Nokos

Platform nomor virtual OTP otomatis — Next.js 15, Firebase, RumahOTP API.

## Stack

- **Next.js 15** App Router
- **Firebase** Auth + Firestore
- **RumahOTP API** untuk nomor virtual
- **Tailwind CSS** + Framer Motion
- **Vercel** deployment ready

## Setup

1. Clone repo
2. Copy `.env.example` → `.env.local` dan isi semua variabel
3. Install: `npm install`
4. Run dev: `npm run dev`
5. Build: `npm run build`

## Environment Variables

```env
RUMAHOTP_API_KEY=           # API key RumahOTP (backend only)
RUMAHOTP_BASE_URL=          # Base URL API RumahOTP

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

NEXT_PUBLIC_APP_URL=        # URL app di Vercel
ADMIN_UID=                  # Firebase UID untuk akses admin
DEFAULT_MARKUP=10           # Markup default dalam persen
```

## Deploy ke Vercel

1. Push ke GitHub
2. Connect repo di Vercel
3. Add environment variables di Vercel dashboard
4. Deploy otomatis

## Fitur

- Login/Register (Email + Google)
- Beli nomor virtual (100+ layanan)
- OTP realtime polling
- Top up saldo via QRIS
- Riwayat order
- Admin panel (konfirmasi deposit/withdraw)
- SEO + PWA ready
- Mobile responsive

## Struktur Penting

- `app/api/` — API routes (server-side, API key aman)
- `firebase/` — Firebase config & auth helpers
- `lib/api.ts` — RumahOTP API calls (server-side only)
- `hooks/` — React hooks (auth, balance)
- `components/` — UI components

## Firebase Firestore Collections

- `users` — data user (uid, email, displayName, balance, isAdmin)
- `orders` — order nomor virtual
- `deposits` — request deposit
- `withdraws` — request withdraw
- `settings/app` — pengaturan global (markup, dll)

## Atur Admin

Di Firebase Console → Firestore → Collection `users` → cari UID kamu → set field `isAdmin: true`
