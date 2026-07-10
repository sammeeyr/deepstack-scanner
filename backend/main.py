from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Wappalyzer import Wappalyzer, WebPage
import warnings

# Suppress some common warnings from BeautifulSoup used internally by python-Wappalyzer
warnings.filterwarnings("ignore")

app = FastAPI(title="SiteForge Recon API")

# Setup CORS to allow the React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    url: str

# Initialize Wappalyzer globally
try:
    wappalyzer = Wappalyzer.latest()
except Exception as e:
    print(f"Failed to initialize Wappalyzer: {e}")
    wappalyzer = None

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analyze")
async def analyze_url(req: AnalyzeRequest):
    if not wappalyzer:
        raise HTTPException(status_code=500, detail="Wappalyzer engine not initialized")
        
    try:
        url = req.url
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url
            
        # Fetch the webpage using Wappalyzer's built-in mechanism
        # Note: This is a synchronous call. For high concurrency, a fully async wrapper
        # using httpx might be preferred, but this works for MVP.
        webpage = WebPage.new_from_url(url)
        
        # Analyze the webpage and get categories
        analyze_result = wappalyzer.analyze_with_categories(webpage)
        
        # Format the result to be more friendly for the frontend
        # Wappalyzer returns: {'Tech Name': {'categories': ['Cat1', 'Cat2'], 'versions': []}}
        formatted_results = []
        for tech_name, details in analyze_result.items():
            formatted_results.append({
                "name": tech_name,
                "categories": details.get("categories", []),
                "versions": details.get("versions", [])
            })
            
        return {
            "status": "success",
            "url": url,
            "technologies": formatted_results
        }
        
    except Exception as e:
        print(f"Error analyzing {req.url}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
