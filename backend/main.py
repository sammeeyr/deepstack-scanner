from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Wappalyzer import Wappalyzer, WebPage
from supabase import create_client, Client
import warnings
import os
from dotenv import load_dotenv

load_dotenv()

# Suppress some common warnings from BeautifulSoup used internally by python-Wappalyzer
warnings.filterwarnings("ignore")

app = FastAPI(title="SiteForge Recon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
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

# Initialize Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to init Supabase: {e}")


async def get_user_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    if not supabase:
        print("Supabase client not initialized, bypassing auth for dev")
        return None
        
    try:
        user_resp = supabase.auth.get_user(token)
        if not user_resp or not user_resp.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_resp.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "SiteForge Recon API is running."}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analyze")
async def analyze_url(req: AnalyzeRequest, request: Request):
    if not wappalyzer:
        raise HTTPException(status_code=500, detail="Wappalyzer engine not initialized")
        
    # Verify auth
    user = await get_user_from_token(request)
        
    try:
        url = req.url
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url
            
        webpage = WebPage.new_from_url(url)
        analyze_result = wappalyzer.analyze_with_categories(webpage)
        
        formatted_results = []
        for tech_name, details in analyze_result.items():
            formatted_results.append({
                "name": tech_name,
                "categories": details.get("categories", []),
                "versions": details.get("versions", [])
            })
            
        # Save to Supabase if authenticated
        if supabase and user:
            try:
                supabase.table('scans').insert({
                    'user_id': user.id,
                    'url': url,
                    'technologies_json': formatted_results
                }).execute()
            except Exception as db_err:
                print(f"Failed to save scan to database: {db_err}")
            
        return {
            "status": "success",
            "url": url,
            "technologies": formatted_results
        }
        
    except Exception as e:
        print(f"Error analyzing {req.url}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Could not reach or analyze the URL. Make sure it's a valid website. (Error: {str(e)})")
