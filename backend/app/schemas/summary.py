from pydantic import BaseModel
from typing import Optional

class SummaryBase(BaseModel):
    overview: str
    sentiment: Optional[str] = None

class SummaryCreate(SummaryBase):
    pass

class SummaryResponse(SummaryBase):
    id: str
    meeting_id: str

    model_config = {"from_attributes": True}
