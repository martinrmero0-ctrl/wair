# Yevo

**For you, by you.** — A minimal fashion discovery app.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local` for the Explore map view (Maps JavaScript API enabled in Google Cloud Console).

## Routes

| Path        | Screen              |
| ----------- | ------------------- |
| `/`         | Landing             |
| `/swipe`    | Daily swipe deck    |
| `/wishlist` | Wishlist            |
| `/nearby`   | Explore — stores (NYC) |
| `/social`   | Social feed + map overlay |
| `/profile/[username]` | Public user profile |
| `/profile`  | Profile & settings  |

## Project structure

```
src/
  app/              # Pages (one route per screen)
  components/
    landing/        # Landing page UI
```
