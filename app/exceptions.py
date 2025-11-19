from fastapi import HTTPException, status


class IncidentsException(HTTPException):
    status_code = 500
    detail = ""

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class NotCorrectAuthData(IncidentsException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Неверный email или пароль"


class UserAlreadyExists(IncidentsException):
    status_code = status.HTTP_409_CONFLICT
    detail = "Пользователь уже существует"


class UserNotFound(IncidentsException):
    status_code = status.HTTP_404_NOT_FOUND
    detail = "Пользователь не найден"