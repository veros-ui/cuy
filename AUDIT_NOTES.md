# Audit notes

Security and correctness audit completed against the current marketplace flow.

Key fixes include protected premium downloads, removal of legacy per-project checkout from the active flow, safer project API responses, role mutation protection, chat authorization and unread handling, and Prisma query corrections for non-unique filters.

Build verification is limited to repository/static inspection because the connected Vercel scope currently returns HTTP 403 for deployment logs.
