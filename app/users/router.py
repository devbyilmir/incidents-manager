from fastapi import APIRouter, Depends, Response, HTTPException
from app.exceptions import NotCorrectAuthData, UserAlreadyExists
from app.users.auth import authenticate_user, create_access_token, get_password_hash
from app.users.dao import UsersDAO
from app.users.dependencies import get_current_user
from app.users.schemas import UserAuth

router = APIRouter()

@router.post("/register")
async def register_user(user_data: UserAuth):
    existing_user = await UsersDAO.find_one_or_none(email=user_data.email)
    if existing_user:
        raise UserAlreadyExists
    
    hashed_password = get_password_hash(user_data.password)
    await UsersDAO.add(
        email=user_data.email, 
        hashed_password=hashed_password,
        name=user_data.name,
        role="operator"
    )
    return {"message": "Пользователь создан"}

@router.post("/login")
async def login_user(response: Response, user_data: UserAuth):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise NotCorrectAuthData
    
    access_token = create_access_token({"sub": str(user.id)})
    response.set_cookie("incident_access_token", access_token, httponly=True)
    return {"access_token": access_token}

@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("incident_access_token")
    return {"message": "Успешный выход"}

@router.get("/me")
async def read_users_me(current_user = Depends(get_current_user)):
    return get_current_user