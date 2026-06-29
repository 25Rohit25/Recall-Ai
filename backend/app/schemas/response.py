"""
Why it exists: Standardizes the shape of all API responses returned to the client.
Why this architecture is scalable: It ensures the frontend always receives predictable JSON structure (data, message, status) across all endpoints. Generic types allow strong typing for nested Pydantic models.
How it can evolve: Can easily append 'meta' fields for global tracing IDs, deprecation warnings, or rate-limiting data.
Common mistakes avoided: Returning raw data on some endpoints and wrapped objects on others, causing frontend parsing bugs.
"""
from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")

class SuccessResponse(BaseModel, Generic[T]):
    status: str = "success"
    message: str = "Request successful"
    data: Optional[T] = None
    
    model_config = ConfigDict(from_attributes=True)

class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    code: str
    details: Optional[Any] = None

class PaginatedResponse(BaseModel, Generic[T]):
    status: str = "success"
    message: str = "Request successful"
    data: List[T]
    total: int
    page: int
    size: int
    pages: int
    
    model_config = ConfigDict(from_attributes=True)
