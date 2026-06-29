import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_meetings_pagination(async_client: AsyncClient):
    response = await async_client.get("/api/v1/meetings?page=1&size=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert data["page"] == 1

@pytest.mark.asyncio
async def test_create_meeting(async_client: AsyncClient):
    payload = {
        "title": "Strategy Sync",
        "duration": 3600,
        "meeting_date": "2026-06-29T10:00:00Z"
    }
    response = await async_client.post("/api/v1/meetings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Strategy Sync"
    assert data["duration"] == 3600
    assert data["is_pinned"] is False
