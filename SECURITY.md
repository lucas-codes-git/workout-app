# Security Notes

This project is designed to be safe to publish as a public portfoliner's machine.
o repository. The source code and documentation are public; the running workout data and credentials remain private on the ow
## Repository

The GitHub repository may be public. Never commit `.env`, database dumps, tokens, passwords, private keys, or real credentials. The committed `.env.example` contains placeholders only and is safe to show publicly.

## Local startup

Copy `.env.example` to `.env` and replace every placeholder with strong, unique values. The `.env` file is ignored by Git.

The Compose stack binds to `127.0.0.1` by default. To use the app from a phone, set `HOST_BIND_IP` to the computer's private LAN address. Do not configure router port forwarding.

The browser reaches only the authenticated frontend gateway. FastAPI and PostgreSQL remain private inside the Docker network.

## Network boundary

The frontend uses HTTP Basic Authentication. This protects the local app from other devices on the private network, but plain HTTP is not suitable for public internet exposure because credentials are not encrypted in transit. The portfolio repository is public; the running app should remain local/private. Do not configure router port forwarding or expose this stack to the public internet without HTTPS, a real identity provider, and a production deployment review.

## Public repository checklist

- Keep `.env` ignored and commit only `.env.example`.
- Do not commit PostgreSQL data, backups, logs, certificates, or private keys.
- Use strong local values for `APP_PASSWORD`, `POSTGRES_PASSWORD`, and `DATABASE_URL`.
- Review `git diff` and `git status --ignored` before pushing.
- Keep the app bound to `127.0.0.1`, or bind only to a trusted private LAN address for phone access.
