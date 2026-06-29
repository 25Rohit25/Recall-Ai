"""
Why it exists: Defines the contract that all LLM providers (OpenAI, Gemini, Anthropic) must follow.
Why this architecture is scalable: By enforcing a standard interface, we can swap between LLMs dynamically using configuration (e.g., using GPT-4o for complex reasoning and Claude 3.5 Sonnet for fast chat) without changing business logic.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_completion(self, prompt: str, system_prompt: str = "") -> str:
        """Standard full-text generation for things like Summary extraction."""
        pass
        
    @abstractmethod
    async def generate_structured(self, prompt: str, schema: Any, system_prompt: str = "") -> Any:
        """Generates JSON constrained by a Pydantic schema."""
        pass
        
    @abstractmethod
    async def chat(self, messages: List[Dict[str, str]]) -> str:
        """Handles conversational history (user, assistant, system)."""
        pass
