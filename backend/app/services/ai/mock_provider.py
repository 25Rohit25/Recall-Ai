"""
Why it exists: A fake provider to simulate LLM latency and streaming without burning tokens during development.
Why this architecture is scalable: It fulfills the `BaseLLMProvider` contract perfectly, allowing rapid UI iteration.
"""
import asyncio
import json
from typing import Dict, Any, List
from app.services.ai.base import BaseLLMProvider

class MockLLMProvider(BaseLLMProvider):
    
    async def generate_completion(self, prompt: str, system_prompt: str = "") -> str:
        await asyncio.sleep(1) # Simulate network latency
        return "This is a mocked LLM response for the executive summary. It captures the essence of the meeting without making real API calls."

    async def generate_structured(self, prompt: str, schema: Any, system_prompt: str = "") -> Any:
        await asyncio.sleep(1.5)
        # We would normally parse the schema and return a mocked dict that matches it.
        # For this prototype, we'll return a generic mock structure that our service layer will parse.
        return {
            "decisions": [
                {"description": "Adopt React Query for state management", "owner_name": "Sarah", "priority": "high"}
            ],
            "action_items": [
                {"description": "Write API Tests", "owner_name": "Mike", "priority": "high", "due_date": "2026-07-01"}
            ]
        }
        
    async def chat(self, messages: List[Dict[str, str]]) -> str:
        await asyncio.sleep(0.5)
        last_msg = messages[-1]["content"] if messages else ""
        return f"Mocked AI Assistant replying to: '{last_msg}'. I understand the context!"
