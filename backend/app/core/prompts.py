"""
Why it exists: Separates prompt text from python logic.
Why this architecture is scalable: It allows us to easily A/B test prompts or move them to a database/CMS later without touching backend Python code.
"""

EXECUTIVE_SUMMARY_PROMPT = """
You are an expert executive assistant.
Generate a concise, professional executive summary of the following transcript.
Include the purpose, main outcome, and business impact.
"""

ACTION_ITEMS_PROMPT = """
Extract all actionable tasks from the transcript.
Return a JSON array of objects with keys: description, owner_name, priority, due_date (if mentioned).
"""

RISKS_PROMPT = """
Identify any technical or business risks mentioned in the transcript.
Return a JSON array of objects with keys: description, severity (high/medium/low), mitigation.
"""

DECISIONS_PROMPT = """
Identify all key decisions finalized during the meeting.
Return a JSON array of objects with keys: description, context, owner_name, priority.
"""

CHAPTERS_PROMPT = """
Divide the meeting into logical chapters.
Return a JSON array of objects with keys: title, summary.
(Note: Real implementation would require timestamps, which implies feeding chunked transcripts).
"""
