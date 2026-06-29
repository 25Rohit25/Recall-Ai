"""
Why it exists: Provides a standard mathematical helper for calculating pagination offsets and totals.
Why this architecture is scalable: Standardizes how the backend computes pages, preventing off-by-one errors across different list endpoints.
"""

def calculate_pages(total_items: int, page_size: int) -> int:
    """Calculate the total number of pages."""
    if total_items == 0:
        return 0
    return (total_items + page_size - 1) // page_size

def get_offset(page: int, page_size: int) -> int:
    """Calculate the database offset."""
    return (page - 1) * page_size
