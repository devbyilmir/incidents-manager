from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from app.users.dao import UsersDAO
from app.config import settings

async def get_current_user(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id: str = payload.get("sub")
        if not user_id:
            return None
    except JWTError:
        return None
    
    user = await UsersDAO.find_by_id(int(user_id))
    return user

async def get_current_admin_user(current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав"
        )
    return current_user