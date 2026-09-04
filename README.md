# ProjectVault

Marketplace developer projects built with Next.js 14, NextAuth, Prisma/PostgreSQL, and Stripe.

## Implemented in this push
- Registration, email/password login, Google OAuth, logout, protected routes, roles and automatic admin email mapping.
- Marketplace cards/detail pages, search, category/free-premium filters, sorting, tags, views/download counters, wishlist, share/copy link, ratings and reviews.
- Stripe Checkout, success/cancel pages, signed-by-server purchase verification via webhook, and premium download protection.
- User dashboard, purchase history, downloadable projects, wishlist, notifications/activity data, profile editing, avatar 1:1 crop/resize preview, creator profile and creator upload flow.
- Admin dashboard with user/project/transaction/download/view/revenue statistics.
- Responsive UI, dark theme, empty/loading states and mobile-friendly navigation.

## Setup
1. Create PostgreSQL database and set `DATABASE_URL`.
2. Set `NEXTAUTH_URL` and a strong `NEXTAUTH_SECRET`.
3. Set `ADMIN_EMAILS` as comma-separated emails.
4. Optional Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
5. Premium payments: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
6. Run `npm install`, `npm run prisma:push`, `npm run dev`.

The remaining enterprise features in the original 101–200 list (email delivery, 2FA, withdrawals, affiliate/referral, advanced moderation/support, realtime infrastructure, etc.) require additional provider integrations and operational policies; they are not falsely marked as complete here.
