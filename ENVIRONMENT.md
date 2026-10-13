# Environment Variables

Serenity Path reads configuration exclusively from environment variables. This document lists every variable the app uses, where it is read, and whether it is required.

Secrets must never be committed to the repository. Use Replit Secrets (or a local `.env*.local` file outside the repo) for development.

## Server (`server/`)

| Variable                | Required                | Used in                                  | Purpose                                                                               |
| ----------------------- | ----------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Yes for persistence     | `server/storage.ts`, `drizzle.config.ts` | PostgreSQL connection string. When unset, the server falls back to in-memory storage. |
| `GOOGLE_PLACES_API_KEY` | Yes for `/api/meetings` | `server/routes.ts`                       | Google Places API key used by the meeting finder.                                     |
| `SESSION_SECRET`        | Recommended             | sessions/auth (future)                   | Used to sign session cookies.                                                         |
| `APP_URL`               | Optional                | `server/index.ts`                        | Public app origin for the CORS allowlist.                                             |
| `NODE_ENV`              | Optional                | `server/index.ts`                        | `development` (default) or `production`. Toggles production hardening.                |
| `PORT`                  | Optional                | `server/index.ts`                        | HTTP listen port. Defaults to `5000`.                                                 |

### Replit-specific (auto-set inside Replit)

| Variable                                                          | Purpose                                                                                   |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `REPLIT_DEV_DOMAIN`                                               | Replit development domain, used by the Expo packager for QR/proxy access.                 |
| `REPLIT_DOMAINS`                                                  | Comma-separated list of public Replit domains, used to build CORS allowlist and base URL. |
| `REPLIT_INTERNAL_APP_DOMAIN`                                      | Internal domain used by the static-build Expo command.                                    |
| `REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`, `WEB_REPL_RENEWAL` | Used by Replit integration connectors (GitHub). Auto-injected.                            |

When running outside Replit, use `npm run expo:dev:local` and set:

- `EXPO_PUBLIC_DOMAIN=localhost:5000`
- Override `EXPO_PACKAGER_PROXY_URL_HOST` and `REACT_NATIVE_PACKAGER_HOSTNAME` only if you need the packager reachable on a non-localhost host.

## Client (`client/`)

The Expo client only sees variables prefixed with `EXPO_PUBLIC_`. Never put secrets in any `EXPO_PUBLIC_*` variable.

| Variable             | Required | Purpose                                                                           |
| -------------------- | -------- | --------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_DOMAIN` | Yes      | Host and port of the Express API (e.g. `localhost:5000` or `<repl-domain>:5000`). |

## Sample `.env.local` (development, outside Replit)

```
DATABASE_URL=postgres://user:pass@localhost:5432/serenity_path
GOOGLE_PLACES_API_KEY=...
SESSION_SECRET=change-me
APP_URL=http://localhost:5000
EXPO_PUBLIC_DOMAIN=localhost:5000
```
