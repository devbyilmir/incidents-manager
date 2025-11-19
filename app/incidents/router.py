from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.database import get_db
from app.incidents import models, schemas
from app.users.dependencies import get_current_user

router = APIRouter(prefix="/incidents", tags=["Incidents"])


# @router.get("/", response_model=list[schemas.IncidentResponse])
# async def get_all_incidents(
#     db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
# ):
#     result = await db.execute(select(models.Incident))
#     incidents = result.scalars().all()
#     return incidents
@router.get("/", response_model=list[schemas.IncidentResponse])
async def get_all_incidents(
    db: AsyncSession = Depends(get_db), 
    current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(models.Incident)
        .options(joinedload(models.Incident.creator))
    )
    incidents = result.scalars().all()
    
    # for incident in incidents:
    #     if incident.creator:
    #         incident.creator_name = incident.creator.name
    
    return incidents


@router.get("/{incident_id}", response_model=schemas.IncidentResponse)  # ← ДОБАВЬ ЭТО
async def get_incident_by_id(
    incident_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(models.Incident)
        .options(joinedload(models.Incident.creator))
        .where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()

    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")

    return incident


@router.get("/priority/{priority}")
async def get_incidents_by_priority(
    priority: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(models.Incident)
        .options(joinedload(models.Incident.creator))
        .where(models.Incident.priority == priority)
    )
    incidents = result.scalars().all()
    
    # Заполняем creator_name
    # for incident in incidents:
    #     if incident.creator:
    #         incident.creator_name = incident.creator.name
    
    return incidents

@router.get("/search/")
async def search_incidents(
    location: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(models.Incident)
        .options(joinedload(models.Incident.creator))
        .where(models.Incident.location.contains(location))
    )
    incidents = result.scalars().all()
    
    # Заполняем creator_name
    # for incident in incidents:
    #     if incident.creator:
    #         incident.creator_name = incident.creator.name
    
    return incidents


# @router.post("/", response_model=schemas.IncidentResponse)
# async def create_incident(
#     incident: schemas.IncidentCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user=Depends(get_current_user),
# ):
#     db_incident = models.Incident(**incident.dict(), creator_id=current_user.id)
#     db.add(db_incident)
#     await db.commit()
#     await db.refresh(db_incident)
#     return db_incident

#тут
# @router.post("/", response_model=schemas.IncidentResponse)
# async def create_incident(
#     incident: schemas.IncidentCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user=Depends(get_current_user),
# ):
#     db_incident = models.Incident(**incident.dict(), creator_id=current_user.id)
#     db.add(db_incident)
#     await db.commit()
#     await db.refresh(db_incident)

#     result = await db.execute(
#         select(models.Incident)
#         .options(joinedload(models.Incident.creator))
#         .where(models.Incident.id == db_incident.id)
#     )
#     incident_with_creator = result.scalar_one()

#     return incident_with_creator
@router.post("/", response_model=schemas.IncidentResponse)
async def create_incident(
    incident: schemas.IncidentCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_incident = models.Incident(**incident.dict(), creator_id=current_user.id)
    db.add(db_incident)
    await db.commit()
    await db.refresh(db_incident)

    # Перезагружаем с joinedload
    result = await db.execute(
        select(models.Incident)
        .options(joinedload(models.Incident.creator))
        .where(models.Incident.id == db_incident.id)
    )
    incident_with_creator = result.scalar_one()
    
    # ВРУЧНУЮ устанавливаем creator_name
    # incident_with_creator.creator_name = current_user.name
    
    return incident_with_creator


# @router.post("/", response_model=schemas.IncidentResponse)
# async def create_incident(
#     incident: schemas.IncidentCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user=Depends(get_current_user),
# ):
#     print(f"current_user: {current_user}")  # ← Добавь для отладки
#     print(f"current_user.id: {current_user.id if current_user else 'None'}")

#     db_incident = models.Incident(
#         **incident.dict(),
#         creator_id=current_user.id  # ← Убедись, что здесь не None
#     )

#     db.add(db_incident)
#     await db.commit()
#     await db.refresh(db_incident)

#     print(f"Создан инцидент с creator_id: {db_incident.creator_id}")  # ← Проверь
#     return db_incident


@router.patch("/{incident_id}")
async def update_incident_status(
    incident_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(models.Incident).where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")

    incident.status = status
    await db.commit()
    await db.refresh(incident)
    return incident


@router.delete("/{incident_id}")
async def delete_incident(
    incident_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(models.Incident).where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")

    await db.delete(incident)
    await db.commit()
    return {"message": "Инцидент удален"}
