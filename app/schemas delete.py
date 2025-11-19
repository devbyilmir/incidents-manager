from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class IncidentCreate(BaseModel):
    title: str
    description: str
    type: str
    priority: str
    location: str

class IncidentResponse(BaseModel):
    id: int
    title: str
    type: str
    priority: str
    status: str
    location: str
    created_at: datetime
    
    class Config:
        from_attributes = True