"""
Why it exists: REST endpoints for the Command Palette and Global Search.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.schemas.search import GlobalSearchResponse, RecentSearchResponse
from app.services.search.search_service import search_service

router = APIRouter(prefix="/search", tags=["Global Search"])

@router.get("", response_model=GlobalSearchResponse)
async def perform_global_search(
    q: str = Query(..., min_length=2, description="Search keyword"),
    db: AsyncSession = Depends(get_db)
):
    """Executes a cross-table global search."""
    return await search_service.global_search(db, query=q)

@router.get("/recent", response_model=RecentSearchResponse)
async def get_recent_searches(db: AsyncSession = Depends(get_db)):
    """Fetches the user's recent search queries."""
    queries = await search_service.get_recent_searches(db)
    return RecentSearchResponse(queries=queries)
