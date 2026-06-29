"""
Why it exists: Standardizes time handling, ensuring UTC is used universally.
Why this architecture is scalable: Prevents timezone bugs that occur when different developers use different datetime libraries or formats.
How it can evolve: Can be expanded to handle user-specific timezone conversions for the frontend display.
Common mistakes avoided: Mixing naive and timezone-aware datetimes in SQLAlchemy, which causes silent truncation bugs or crashes.
"""
from datetime import datetime, timezone

def get_utc_now() -> datetime:
    """Returns the current timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)

def format_iso8601(dt: datetime) -> str:
    """Formats a datetime to a standard ISO8601 string."""
    return dt.isoformat()
