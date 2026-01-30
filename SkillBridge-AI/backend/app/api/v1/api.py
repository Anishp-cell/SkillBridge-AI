from fastapi import APIRouter
from app.api.v1.endpoints import users, onboarding, syllabus, ai_mock

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(syllabus.router, prefix="/syllabus", tags=["syllabus"])
api_router.include_router(ai_mock.router, prefix="/ai", tags=["ai"])
