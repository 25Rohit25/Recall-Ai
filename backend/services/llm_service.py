import os
import json
from openai import AsyncOpenAI
import logging

logger = logging.getLogger(__name__)

# Initialize client if key exists, otherwise None
api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=api_key) if api_key else None

async def generate_summary(transcript_text: str) -> dict:
    """
    Generates a structured summary from transcript text using an LLM.
    Falls back to high-quality mock data if no API key is provided.
    """
    if not client:
        logger.warning("No OPENAI_API_KEY provided. Using mock summary generation.")
        return get_mock_summary(transcript_text)

    prompt = f"""
    You are an advanced AI meeting assistant. Analyze the following meeting transcript and extract intelligence.
    
    Transcript:
    {transcript_text}
    
    Return the output strictly as a JSON object with the following schema:
    {{
        "overview": "A 2-3 paragraph executive summary of the meeting",
        "action_items": [
            {{"task": "Description of task", "owner": "Name of person responsible (or 'Unassigned')"}}
        ],
        "key_decisions": ["Decision 1", "Decision 2"],
        "risks": ["Risk 1", "Risk 2"],
        "topics": ["Topic 1", "Topic 2"],
        "health_score": <integer from 0 to 100 representing meeting effectiveness>
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo-1106", # Using a faster/cheaper model for general use, capable of JSON mode
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a helpful meeting assistant designed to output JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"LLM API Error: {e}")
        return get_mock_summary(transcript_text)

async def ask_about_meeting(transcript_text: str, question: str) -> str:
    """
    Answers a question based on the provided meeting transcript.
    """
    if not client:
        return "I'm currently running in mock mode because no OpenAI API key was provided. I can't answer specific questions about this transcript."

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant answering questions about a meeting transcript. Be concise and direct."},
                {"role": "user", "content": f"Transcript:\n{transcript_text}\n\nQuestion: {question}"}
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"LLM Q&A Error: {e}")
        return "I encountered an error trying to process your question."

def get_mock_summary(transcript_text: str) -> dict:
    """Fallback mock summary for when API keys aren't available"""
    return {
        "overview": "The team discussed the upcoming Q3 product roadmap, focusing heavily on integrating the new LLM features into the core platform. Sarah highlighted the need to finalize the UI designs by next week, while John raised concerns about API rate limits. The meeting concluded with a clear path forward for the alpha release.",
        "action_items": [
            {"task": "Finalize UI designs for the AI Copilot", "owner": "Sarah"},
            {"task": "Investigate Anthropic rate limit increases", "owner": "John"},
            {"task": "Schedule alpha testing sessions with top 5 clients", "owner": "Mike"}
        ],
        "key_decisions": [
            "We will launch the AI Copilot in beta to all enterprise users in Q3.",
            "The backend will transition from REST to GraphQL for the new features."
        ],
        "risks": [
            "Potential delays in UI sign-off could push the schedule back.",
            "API costs might exceed projections if usage spikes."
        ],
        "topics": ["Q3 Roadmap", "AI Integration", "UI/UX", "API Limits"],
        "health_score": 85
    }
