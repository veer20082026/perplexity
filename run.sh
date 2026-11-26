#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=============================================="
echo " Starting Perplexity Calculator Web App"
echo "=============================================="

# Check if .venv exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment .venv not found. Creating..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r backend/requirements.txt
else
    source .venv/bin/activate
fi

# Ensure frontend is built
if [ ! -d "frontend/dist" ]; then
    echo "Building frontend..."
    cd frontend && npm install && npm run build && cd ..
fi

echo "Launching FastAPI server with pre-loaded GPT-2 model..."
echo "Web Application URL: http://127.0.0.1:8000"
echo "API Docs: http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to stop."
echo "=============================================="

cd backend
export PYTHONPATH=.
export HF_HUB_OFFLINE=1
exec ../.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
