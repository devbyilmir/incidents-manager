from fastapi import Depends, HTTPException, Request, Response, status
from jose import jwt, JWTError
from app.users.auth import create_access_token, create_refresh_token
from app.users.dao import UsersDAO
from app.config import settings


async def get_token_from_request(request: Request) -> str:
    """Извлекает токен из куки или заголовка"""
    # Меняем название куки на то, что вы используете в login
    token = request.cookies.get("incident_access_token")

    # Если нет в куках, пробуем из заголовка Authorization
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Требуется авторизация"
        )

    return token


# async def get_current_user(token: str = Depends(get_token_from_request)):
#     try:
#         # ВАЖНО: algorithms=[settings.ALGORITHM] - множественное число!
#         payload = jwt.decode(
#             token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
#         )
#         user_id: str = payload.get("sub")
#         if not user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный токен"
#             )
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Ошибка проверки токена"
#         )

#     user = await UsersDAO.find_by_id(int(user_id))
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не найден"
#         )
#     return user
async def get_current_user(
    request: Request, 
    response: Response,
    token: str = Depends(get_token_from_request)
):
    try:
        # Пробуем декодировать access token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
    except JWTError:
        # Access token истёк - пробуем refresh token
        refresh_token = request.cookies.get("incident_refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Token expired")
        
        try:
            # Декодируем refresh token
            refresh_payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = refresh_payload.get("sub")
            
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid refresh token")
                
            # Проверяем пользователя
            user = await UsersDAO.find_by_id(int(user_id))
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            
            # СОЗДАЁМ НОВЫЕ ТОКЕНЫ
            new_access_token = create_access_token({"sub": str(user.id)})
            new_refresh_token = create_refresh_token({"sub": str(user.id)})
            
            # ОБНОВЛЯЕМ КУКИ
            response.set_cookie("incident_access_token", new_access_token, httponly=True)
            response.set_cookie("incident_refresh_token", new_refresh_token, httponly=True)
            
            return user
            
        except JWTError:
            raise HTTPException(status_code=401, detail="Refresh token expired")
    
    # Если access token валиден - просто возвращаем пользователя
    user = await UsersDAO.find_by_id(int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_current_admin_user(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав"
        )
    return current_user
