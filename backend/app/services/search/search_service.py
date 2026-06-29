"""
Why it exists: Orchestrates the global search logic and search history tracking.
Why this architecture is scalable: It formats the raw DB results into a unified UI-friendly JSON response. It also provides the "Recent Searches" functionality out-of-the-box.
"""
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.search import search_repo

class SearchService:
    
    async def global_search(self, db: AsyncSession, query: str, user_id: str = "default_user") -> Dict[str, Any]:
        """
        Executes search and saves to history.
        """
        # Save history if query is meaningful
        if len(query.strip()) >= 3:
            await search_repo.save_search_history(db, query.strip(), user_id)
            
        # Execute cross-table search
        raw_results = await search_repo.global_search(db, query.strip())
        
        # Format results for the frontend (simplified mapping)
        formatted = {
            "meetings": [{"id": m.id, "title": m.title, "type": "meeting"} for m in raw_results["meetings"]],
            "transcripts": [{"id": t.id, "meeting_id": t.meeting_id, "text": t.search_text, "type": "transcript"} for t in raw_results["transcripts"]],
            "action_items": [{"id": a.id, "description": a.description, "type": "action_item"} for a in raw_results["action_items"]],
            "decisions": [{"id": d.id, "description": d.description, "type": "decision"} for d in raw_results["decisions"]]
        }
        
        return formatted

    async def get_recent_searches(self, db: AsyncSession, user_id: str = "default_user") -> List[str]:
        history = await search_repo.get_recent_searches(db, user_id)
        # Deduplicate while preserving order
        seen = set()
        unique = []
        for h in history:
            if h.query not in seen:
                seen.add(h.query)
                unique.append(h.query)
        return unique

search_service = SearchService()
