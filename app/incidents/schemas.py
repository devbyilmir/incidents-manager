from pydantic import BaseModel, computed_field
from datetime import datetime
from typing import Optional
from enum import Enum


class UserShortInfo(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True

class IncidentCreate(BaseModel):
    title: str
    description: str
    type: str
    priority: str
    location: str

class IncidentStatus(str, Enum):
    OPEN = "открыт"
    IN_PROGRESS = "в работе"
    CLOSED = "закрыт"

class IncidentStatusUpdate(BaseModel):
    status: IncidentStatus

class IncidentResponse(BaseModel):
    id: int
    title: str
    type: str
    description: str
    priority: str

    risk_score: int
    risk_level: str

    status: str
    location: str
    # creator_id: Optional[int] = None
    created_at: datetime
    creator: Optional[UserShortInfo] = None

    # @computed_field
    # @property
    # def creator_name(self) -> Optional[str]:
    #     if hasattr(self, "creator") and self.creator:
    #         return self.creator.name
    #     return None

    class Config:
        from_attributes = True

