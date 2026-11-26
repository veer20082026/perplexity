from contextlib import asynccontextmanager
import os
import time
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from engine import PerplexityEngine

# Initialize engine singleton
engine = PerplexityEngine(model_name="gpt2")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load the model once
    print("Starting Perplexity API server...")
    try:
        engine.load_model()
    except Exception as e:
        print(f"Warning: Model preloading encountered an error: {e}")
    yield
    # Shutdown
    print("Shutting down Perplexity API server.")

app = FastAPI(
    title="Perplexity Calculator API",
    description="Educational Perplexity Calculator backend powered by GPT-2",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculateRequest(BaseModel):
    text: str = Field(..., description="Text to calculate perplexity for")

class TokenItem(BaseModel):
    index: int
    token: str
    token_id: int
    probability: float
    probability_percent: float
    log_probability: float
    nll: float
    category: str
    label: str

class CalculateResponse(BaseModel):
    perplexity: float
    token_count: int
    word_count: int
    average_nll: float
    model: str
    device: str
    calculation_time_ms: float
    truncated: bool = False
    tokens: List[TokenItem]

class TokenCountRequest(BaseModel):
    text: str

class TokenCountResponse(BaseModel):
    token_count: int
    word_count: int
    char_count: int

@app.get("/health")
def health_check():
    return {
        "status": "healthy" if engine.is_loaded else "model_loading_or_failed",
        "model_loaded": engine.is_loaded,
        "model_name": engine.model_name,
        "device": str(engine.device),
        "error": engine.load_error,
    }

@app.post("/count-tokens", response_model=TokenCountResponse)
def count_tokens(request: TokenCountRequest):
    text = request.text
    token_count = engine.get_token_count(text) if engine.is_loaded else 0
    words = len(text.strip().split()) if text.strip() else 0
    return {
        "token_count": token_count,
        "word_count": words,
        "char_count": len(text),
    }

@app.post("/calculate", response_model=CalculateResponse)
def calculate_perplexity(request: CalculateRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty. Please enter at least one word or character.",
        )

    if not engine.is_loaded:
        # Attempt on-demand load if initial startup failed
        try:
            engine.load_model()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Language model is not available: {str(e)}",
            )

    try:
        result = engine.calculate(request.text)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Calculation failed: {str(e)}",
        )

# Serve built frontend static files if dist directory exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
