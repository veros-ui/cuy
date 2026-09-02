# ProjectHub setup

## Neon
Run `database/schema.sql` against the Neon Postgres database, then set `DATABASE_URL` to the Neon connection string.

## Google Cloud OAuth
Create an OAuth 2.0 Web application in Google Cloud Console. Add your exact `GOOGLE_CALLBACK_URL` as an authorized redirect URI. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as server environment variables.

## Security
`password_hash` stores bcrypt hashes, not plaintext passwords. OAuth secrets and the Neon connection string must stay in environment variables and must never be committed.

## Netlify
The current server is a normal Express process. Netlify deployment requires wrapping the Express app as a Netlify Function (or using another Node host). Do not publish database credentials to client-side JavaScript.