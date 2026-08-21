FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend ./
RUN npm run build


FROM nginx:1.29-alpine AS frontend

RUN apk add --no-cache apache2-utils

COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/docker-entrypoint-auth.sh /usr/local/bin/docker-entrypoint-auth.sh

EXPOSE 80

CMD ["sh", "/usr/local/bin/docker-entrypoint-auth.sh"]


FROM python:3.13-slim AS api

WORKDIR /app

RUN pip install uv

COPY backend/pyproject.toml backend/uv.lock ./backend/

WORKDIR /app/backend

RUN uv sync --frozen --no-install-project

COPY backend .

ENV PATH="/app/backend/.venv/bin:$PATH"

EXPOSE 8000

CMD ["sh", "-c", "python scripts/run_migrations.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]