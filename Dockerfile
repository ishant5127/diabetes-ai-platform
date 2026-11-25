# Multi-stage production build for DiaPredict AI

# ── Stage 1: Build React Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npm run build

# ── Stage 2: Python FastAPI Production Runtime ──
FROM python:3.12-slim AS runner
WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and ML models
COPY backend/app ./app
COPY backend/models ./models

# Copy built frontend SPA assets from Stage 1 into static folder
COPY --from=frontend-builder /app/frontend/dist ./static

ENV STATIC_DIR=/app/static \
    CORS_ORIGINS="*"

EXPOSE 8000

# Start Uvicorn bound to dynamic host and port (Render, Railway, Cloud Run compatible)
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
