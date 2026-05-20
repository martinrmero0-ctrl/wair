# Wair

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

## Routes

| Path        | Screen              |
| ----------- | ------------------- |
| `/`         | Landing             |
| `/swipe`    | Daily swipe deck    |
| `/wishlist` | Wishlist            |
| `/nearby`   | Explore — stores (NYC) |
| `/social`   | Social feed (coming soon) |
| `/profile`  | Profile & settings  |

## Project structure

```
src/
  app/              # Pages (one route per screen)
  components/
    landing/        # Landing page UI
```
