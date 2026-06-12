from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class UserShortInfo(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True


class IncidentStatus(str, Enum):
    OPEN = "открыт"
    IN_PROGRESS = "в работе"
    CLOSED = "закрыт"


class IncidentStatusUpdate(BaseModel):
    status: IncidentStatus
    closed_at: datetime | None = None


class IncidentStats(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int
    average_risk: float


class LocationStats(BaseModel):
    location: str
    count: int


class IncidentTypeStats(BaseModel):
    type: str
    count: int


class IncidentType(str, Enum):
    LEAK = "утечка"
    EQUIPMENT_FAILURE = "отказ оборудования"
    CORROSION = "коррозия"
    FIRE_HAZARD = "пожарная опасность"
    GAS = "загазованность"
    AUTOMATION_FAILURE = "сбой автоматики"
    OTHER = "другое"


class IncidentPriority(str, Enum):
    LOW = "низкий"
    MEDIUM = "средний"
    HIGH = "высокий"
    CRITICAL = "критический"


class IncidentCreate(BaseModel):
    title: str
    description: str
    type: IncidentType
    priority: IncidentPriority
    location: str


class IncidentResponse(BaseModel):
    id: int
    title: str
    type: IncidentType
    description: str
    priority: IncidentPriority

    risk_score: int
    risk_level: str
    recommendation: str | None = None

    status: IncidentStatus
    location: str
    created_at: datetime
    creator: Optional[UserShortInfo] = None

    class Config:
        from_attributes = True


class ResolutionStats(BaseModel):
    average_hours: float


class RiskDistributionStats(BaseModel):
    risk_level: str
    count: int


class DashboardResponse(BaseModel):
    stats: IncidentStats
    resolution: ResolutionStats
    risk_distribution: list[RiskDistributionStats]
    locations: list[LocationStats]
    incident_types: list[IncidentTypeStats]