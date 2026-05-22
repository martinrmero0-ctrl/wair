# Yevo — Product Spec

**For you, by you.** Minimal fashion discovery for niche aesthetics: Japanese Americana, Ametora, Workwear, Vintage Denim, and Streetwear.

## Design

- White background, black text, Cormorant Garamond throughout
- Editorial, minimal UI — no heavy chrome or gradients

## Core screens

| Route | Screen |
| ----- | ------ |
| `/` | Landing — search, mode toggles (Online / Near me / Both) |
| `/swipe` | Daily swipe deck (8 cards), wishlist save, personalization |
| `/wishlist` | Saved items, filters, totals |
| `/nearby` | **Explore** — NYC store list + map (route stays `/nearby`) |
| `/social` | Social feed + map overlay |
| `/profile` | Settings — sizes, aesthetics, budget, notifications |
| `/profile/[username]` | Public user profile |

## Environment

- `ANTHROPIC_API_KEY` — Claude search (`/api/search`)
- `ONESIGNAL_REST_API_KEY` — scheduled push (HTTPS only for web push)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Explore + Social maps

---

## Done

### Landing & search

- Landing page with wordmark, tagline, search bar, mode toggles
- Claude-powered search (`/api/search`) with intent detection: **piece**, **brand**, or **store**
- Full-page search results grid; piece cards use Google Shopping links for Shop
- Official brand/store URLs only (no placeholder links)

### Swipe & wishlist

- 24-piece catalog, personalized daily deck (8/day), swipe history
- Wishlist with filters, mark bought, stats

### Explore (`/nearby`)

- 8 NYC stores with coordinates, addresses, neighborhoods
- Geolocation (Haversine distances), permission prompt, NYC fallback
- Search, tag filters, sort (Nearest / Top Rated / Open Now)
- Neighborhood search (Soho, Williamsburg, etc.)
- Friend-rating badge on store cards (Blue in Green, Tokio 7)
- Bookmark + Directions (Apple Maps on iOS, Google Maps elsewhere)
- Beli-style **list / map toggle**; map pins colored by rating, friend ★ and bookmark badges

### Profile (settings)

- Sizes (top / waist / shoe), aesthetics, budget slider, notification toggles — `localStorage`

### Notifications

- OneSignal (HTTPS only); permission modal after first deck; daily picks schedule API

### Social (`/social`)

- **Social page** with chronological feed (BOUGHT / RATED / SELLING posts)
- **Comments** on each post — expand/collapse, add comment, avatars + timestamps
- **Marketplace listings** — selling posts with price and “Message to buy”
- **Clickable user profiles** — avatars and `@username` link to `/profile/[username]`
- Public profile pages: stats, aesthetics, post grid, Follow / Following
- **Map overlay with five tabs** — Map button opens full-screen Google Map:
  - **Rated** — stores the user has rated (mock set)
  - **Been** — visited stores (mock set)
  - **Want to Try** — bookmarked stores from Explore
  - **Friends' Recs** — friend-rated stores (Blue in Green, Tokio 7)
  - **Trending** — all stores sorted by rating (visit-based trending planned)

### Brand

- App renamed to **Yevo** in UI, metadata, and README

---

## Build roadmap

### Shipped ✅

| Feature | Notes |
| ------- | ----- |
| **Social map overlay** | Map button on Social opens full-screen overlay with five tabs (Rated, Been, Want to Try, Friends' Recs, Trending). NYC store pins reuse Explore map styling. Close button returns to feed. |

### Planned

| Feature | Notes |
| ------- | ----- |
| **Wair Size Profile Integration** | Browser extension (Chrome / Safari) that reads the user's **Yevo size profile** and automatically highlights their size on any fashion brand website they visit. **Long term:** “Sign in with Yevo” embed widget for brand sites so shoppers share their size profile. **Revenue:** brands pay a monthly SaaS fee for the integration. |
| Visit-based **Trending** tab | Replace rating-sort fallback with real “most visited this week” data |
| Social feed backend | Persist posts, comments, likes, follows |
| Near-me search mode | Wire landing “Near me” to Explore + geolocation (partial — navigates to Explore) |

### Future ideas

- Real store / piece data APIs
- “Sign in with Yevo” OAuth for extension + widget
- Social: DMs for marketplace, photo uploads
- Explore: live open hours, more cities
