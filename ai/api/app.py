from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from ai.api.routes.roadmap import router as roadmap_router
from ai.api.routes.recommendation import router as recommendation_router

app = FastAPI(
    title="SkillBridgeAI API",
    version="0.1.0"
)

# Allow all origins for production stability
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a main api router for versioning
api_v1 = APIRouter(prefix="/api/v1")

# Include sub-routers
api_v1.include_router(recommendation_router)
# Note: recommendation_router has prefix="/ai", so result is /api/v1/ai/recommend-domain

# Roadmap router was mounted at root /roadmap in previous version.
# To keep DashboardPage.tsx working (which calls localhost:8000/roadmap/generate),
# we keep it at root OR mount it in v1 too.
# Ideally we move everything to v1, but for stability now:
app.include_router(roadmap_router) 
app.include_router(api_v1)

# Dummy onboarding route to prevent 404s on Inputs step
@app.post("/api/v1/onboarding")
def mock_onboarding(data: dict):
    # In a stateless backend, we just acknowledge.
    # Frontend passes data locally to next step anyway.
    return {"status": "success", "message": "Onboarding data received (mock)"}
