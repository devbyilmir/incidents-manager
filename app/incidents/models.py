from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    type = Column(String)  # "утечка", "поломка", "авария"
    priority = Column(String)  # "низкий", "средний", "высокий"
    status = Column(String, default="открыт")
    location = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("Users", back_populates="incidents")

    # def __str__(self):
    #     return f"Инцидент {self.title}"