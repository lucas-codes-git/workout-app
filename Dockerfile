FROM python:3.13-slim

WORKDIR /app

RUN pip install uv

COPY backend/pyproject.toml backend/uv.lock ./backend/

WORKDIR /app/backend

RUN uv sync --frozen --no-install-project

COPY backend .

ENV PATH="/app/backend/.venv/bin:$PATH"

EXPOSE 8000


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]