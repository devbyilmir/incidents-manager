from pydantic import BaseModel, EmailStr
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    MASTER = "master"
    OPERATOR = "operator"

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: UserRole

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: UserRole

    class Config:
        from_attributes = True

class UserRoleUpdate(BaseModel):
    role: UserRole