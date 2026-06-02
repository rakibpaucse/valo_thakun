# Valo Thakun — deploy this build

This zip is the production-ready Valo Thakun project. It contains the
pre-built `.next/` output, sources, Prisma schema, and a seeded SQLite
database, but **not** `node_modules`. Install once on the target host and
start the server.

## 1. Unzip & enter

```bash
unzip valo-thakun-deploy.zip
cd valo-thakun
```

(On Windows, right-click → Extract All, then `cd` into the folder.)

## 2. Install runtime dependencies

```bash
npm install --omit=dev
```

This skips devDependencies (TypeScript, ESLint, etc.) — only what the
running server needs.

> If you also intend to run `npm run dev` or rebuild on this machine,
> use `npm install` (no flag) instead.

## 3. Set environment variables

A working `.env` is included with a demo secret. **Before going to
production, replace `AUTH_SECRET`** with a fresh value:

```bash
# unix
openssl rand -base64 32
# windows powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Required keys (`.env`):

```
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="<paste 32-byte base64 here>"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="https://your-domain.example"
```

## 4. Start the server

```bash
npm start
```

Defaults to `http://localhost:3000`. To change the port:

```bash
PORT=8080 npm start          # unix
$env:PORT=8080; npm start    # powershell
```

## 5. Demo logins

All demo accounts share the password `password123`:

| Role    | Email                          |
|---------|--------------------------------|
| ADMIN   | `admin@anisbhai.health`        |
| DOCTOR  | `anis@anisbhai.health` (main)  |
| DOCTOR  | `farhana@anisbhai.health`      |
| PATIENT | `rashed@example.com`           |

## 6. Re-seed (optional)

If the demo data ever gets stale, reset and re-seed:

```bash
npm run db:reset
```

This wipes `prisma/dev.db` and re-runs `prisma/seed.ts`.

---

## Notes

- **SQLite vs Postgres**: this bundle uses SQLite at `prisma/dev.db`.
  For real production traffic, change the `datasource` provider in
  `prisma/schema.prisma` to `postgresql` and set `DATABASE_URL` to a
  Postgres connection string. Then re-run `npm run db:push` and
  `npm run db:seed`.
- **Stubbed integrations**: email (`src/lib/email.ts`) and SMS log to
  the console. Swap in Resend / Twilio / SSL Wireless before launch.
- **Reverse proxy**: put nginx or Caddy in front for TLS. Forward
  `X-Forwarded-Proto` so NextAuth sees `https`.
