from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scraper import scrape_website
from llm import generate_brochure
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BrochureRequest(BaseModel):
    url: str

@app.get("/")
def home():
    return {"message": "Company Brochure Generator API is running"}

@app.get("/health")
def health():
    try:
        models_res = ollama.list()
        model_names = [m.model for m in models_res.models] if hasattr(models_res, 'models') else []
        has_llama = any("llama3.2" in name for name in model_names)
        return {
            "status": "ok",
            "ollama_running": True,
            "has_model": has_llama,
            "models": model_names
        }
    except Exception as e:
        return {
            "status": "degraded",
            "ollama_running": False,
            "has_model": False,
            "error": "Ollama is not running. Please start Ollama via the Start Menu or run 'ollama serve'."
        }

@app.post("/generate")
def generate(request: BrochureRequest):
    try:
        company_text = scrape_website(request.url)
        if not company_text or len(company_text.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="Could not extract readable content from the provided website."
            )
        brochure = generate_brochure(company_text)
        return {
            "status_code": 200,
            "success": True,
            "brochure": brochure
        }
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(
            status_code=400,
            detail=str(ve)
        )
    except Exception as e:
        err_msg = str(e)
        if "connect" in err_msg.lower() or "connection" in err_msg.lower():
            err_msg = (
                "Failed to connect to Ollama. Please make sure Ollama is running "
                "(open Ollama from your Start menu or run 'ollama serve' in a terminal)."
            )
        raise HTTPException(
            status_code=500,
            detail=err_msg
        )

