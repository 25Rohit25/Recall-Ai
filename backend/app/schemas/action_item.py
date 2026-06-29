from pydantic import BaseModel
from typing import Optional

class ActionItemBase(BaseModel):
    assignee: Optional[str] = None
    task_description: str
    is_completed: bool = False

class ActionItemCreate(ActionItemBase):
    pass

class ActionItemUpdate(BaseModel):
    is_completed: bool

class ActionItemResponse(ActionItemBase):
    id: str
    meeting_id: str

    model_config = {"from_attributes": True}
