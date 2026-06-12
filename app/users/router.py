from fastapi import APIRouter, Depends, Response
from app.exceptions import NotCorrectAuthData, UserAlreadyExists, UserNotFound
from app.users.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_password_hash,
)
from app.users.dao import UsersDAO
from app.users.dependencies import get_current_user
from fastapi import HTTPException
from sqlalchemy import select
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.models import Users
from app.users.schemas import (
    UserAuth,
    UserRegister,
    UserResponse,
    UserRoleUpdate,
)


router = APIRouter(prefix="/auth", tags=["Пользователи"])


@router.post("/register")
async def register_user(user_data: UserRegister):
    existing_user = await UsersDAO.find_one_or_none(email=user_data.email)
    if existing_user:
        raise UserAlreadyExists

    hashed_password = get_password_hash(user_data.password)
    await UsersDAO.add(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name,
        # role=user_data.role.value,
        role="operator",
    )
    return {"message": "Пользователь создан"}


@router.post("/login")
async def login_user(response: Response, user_data: UserAuth):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        existing_user = await UsersDAO.find_one_or_none(email=user_data.email)
        if not existing_user:
            raise UserNotFound
        else:
            raise NotCorrectAuthData

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    response.set_cookie("incident_access_token", access_token, httponly=True)
    response.set_cookie("incident_refresh_token", refresh_token, httponly=True)

    return {"access_token": access_token, "refresh_token": refresh_token}


@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("incident_access_token")
    return {"message": "Успешный выход"}


@router.get("/me")
async def read_users_me(current_user=Depends(get_current_user)):
    # return get_current_user
    return current_user


@router.get("/users", response_model=list[UserResponse])
async def get_users(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Только администратор может просматривать пользователей",
        )

    result = await db.execute(select(Users))
    users = result.scalars().all()

    return users


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_data: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Только администратор может изменять роли",
        )

    result = await db.execute(select(Users).where(Users.id == user_id))

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь не найден",
        )

    user.role = role_data.role.value

    await db.commit()
    await db.refresh(user)

    return {
        "message": "Роль обновлена",
        "user_id": user.id,
        "new_role": user.role,
    }
