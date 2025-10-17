from app.dao.base import BaseDAO
from app.models import Incident
from app.database import async_session_maker
from sqlalchemy import select


class IncidentDAO(BaseDAO):
    model = Incident

    @classmethod
    async def find_critical_incidents(cls):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(priority="высокий")
            result = await session.execute(query)
            return result.scalars().all()