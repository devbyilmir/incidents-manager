from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.IncidentResponse])
async def get_incidents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Incident))
    incidents = result.scalars().all()
    return incidents

@router.get("/{incident_id}")
async def get_incident(incident_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Incident).where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()
    return incident

@router.get("/priority/{priority}")
async def get_incidents_by_priority(priority: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Incident).where(models.Incident.priority == priority)
    )
    incidents = result.scalars().all()
    return incidents

@router.get("/search/")
async def search_incidents(location: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Incident).where(models.Incident.location.contains(location))
    )
    incidents = result.scalars().all()
    return incidents

@router.post("/", response_model=schemas.IncidentResponse)
async def create_incident(incident: schemas.IncidentCreate, db: AsyncSession = Depends(get_db)):
    db_incident = models.Incident(**incident.dict())
    db.add(db_incident)
    await db.commit()
    await db.refresh(db_incident)
    return db_incident

@router.patch("/{incident_id}")
async def update_incident_status(incident_id: int, status: str, db: AsyncSession = Depends(get_db)):
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
async def delete_incident(incident_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Incident).where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")
    
    await db.delete(incident)
    await db.commit()
    return {"message": "Инцидент удален"}