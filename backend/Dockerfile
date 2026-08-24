# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /workspace

# Install curl for docker compose healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies first to leverage caching
COPY requirements.txt /workspace/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files into /workspace/backend directory
COPY . /workspace/backend

# Make PYTHONPATH contain workspace so imports like 'backend.app...' work correctly
ENV PYTHONPATH="/workspace"

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
