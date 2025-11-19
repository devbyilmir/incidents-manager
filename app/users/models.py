from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="operator")
    hashed_password = Column(String, nullable=False)

    incidents = relationship("Incident", back_populates="creator")

    def __str__(self):
        # return f"Пользователь {self.email}"
        return f"Пользователь {self.name}"