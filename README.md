# ProjectVault

Marketplace developer projects built with Next.js 14, NextAuth, and Prisma/PostgreSQL.

## Implemented
- Registration, email/password login, Google OAuth, logout, protected routes, roles and automatic admin email mapping.
- Marketplace cards/detail pages, search, category/free-premium filters, sorting, tags, views/download counters, wishlist, share/copy link, ratings and reviews.
- Manual Premium membership: `USER` can download `FREE` projects, while `PREMIUM` and `ADMIN` can download all `PREMIUM` projects without per-project checkout.
- User-to-admin chat with simple username-based messages, `@admin` identity for admins, unread badges, and an admin inbox with reply/resolve controls.
- Admin dashboard with user role management, manual PREMIUM grant/revoke, admin email management, and user/project/transaction/download/view statistics.
- User dashboard, purchase history, downloadable projects, wishlist, notifications/activity data, profile editing, avatar crop/resize preview, creator profile and creator upload flow.
- Responsive UI, dark theme, loading/error/empty states and mobile hamburger navigation.

## Setup
1. Create PostgreSQL database and set `DATABASE_URL`.
2. Set `NEXTAUTH_URL` and a strong `NEXTAUTH_SECRET`.
3. Set `ADMIN_EMAILS` as comma-separated emails.
4. Optional Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
5. Run `npm install`, `npm run prisma:push`, `npm run dev`.

Premium activation is intentionally manual: users use **Chat Admin**, then an admin can change the user role between `USER` and `PREMIUM` from the Admin Dashboard.

The remaining enterprise features from the original 101–200 list (email delivery, 2FA, withdrawals, affiliate/referral, advanced moderation/support, realtime infrastructure, etc.) require additional provider integrations and operational policies.
