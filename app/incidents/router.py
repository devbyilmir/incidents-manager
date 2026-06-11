from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from app.database import get_db
from app.incidents import models, schemas
from app.users.dependencies import get_current_user
from app.incidents.risk import calculate_risk
from app.users.permissions import require_master_or_admin, require_admin
from app.incidents.recommendations import get_recommendation
from datetime import datetime


router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.get("/", response_model=list[schemas.IncidentResponse])
async def get_all_incidents(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(models.Incident).options(joinedload(models.Incident.creator))
    )
    incidents = result.scalars().all()

    response = []

    for incident in incidents:

        incident.recommendation = get_recommendation(incident.risk_score)

        response.append(incident)

    return response


@router.get("/stats", response_model=schemas.IncidentStats)
async def get_incident_stats(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total = await db.scalar(select(func.count(models.Incident.id)))

    open_count = await db.scalar(
        select(func.count(models.Incident.id)).where(models.Incident.status == "открыт")
    )

    in_progress_count = await db.scalar(
        select(func.count(models.Incident.id)).where(
            models.Incident.status == "в работе"
        )
    )

    closed_count = await db.scalar(
        select(func.count(models.Incident.id)).where(models.Incident.status == "закрыт")
    )

    avg_risk = await db.scalar(select(func.avg(models.Incident.risk_score)))

    return {
        "total": total or 0,
        "open": open_count or 0,
        "in_progress": in_progress_count or 0,
        "closed": closed_count or 0,
        "average_risk": round(avg_risk or 0, 2),
    }


@router.get("/stats/locations", response_model=list[schemas.LocationStats])
async def get_top_locations(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(models.Incident.location, func.count(models.Incident.id).label("count"))
        .group_by(models.Incident.location)
        .order_by(func.count(models.Incident.id).desc())
    )

    rows = result.all()

    return [
        {
            "location": row.location,
            "count": row.count,
        }
        for row in rows
    ]


@router.get(
    "/stats/types",
    response_model=list[schemas.IncidentTypeStats],
)
async def get_top_incident_types(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(
            models.Incident.type,
            func.count(models.Incident.id).label("count"),
        )
        .group_by(models.Incident.type)
        .order_by(func.count(models.Incident.id).desc())
    )

    rows = result.all()

    return [
        {
            "type": row.type,
            "count": row.count,
        }
        for row in rows
    ]


@router.get("/reference/types")
async def get_incident_types():
    return [
        "утечка",
        "отказ оборудования",
        "коррозия",
        "пожарная опасность",
        "загазованность",
        "сбой автоматики",
        "другое",
    ]


@router.get("/reference/priorities")
async def get_priorities():
    return [
        "низкий",
        "средний",
        "высокий",
        "критический",
    ]


@router.get(
    "/stats/resolution-time",
    response_model=schemas.ResolutionStats,
)
async def get_resolution_time_stats(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(
            func.avg(
                func.extract(
                    "epoch",
                    models.Incident.closed_at - models.Incident.created_at,
                )
            )
        ).where(models.Incident.closed_at.is_not(None))
    )

    avg_seconds = result.scalar()

    if not avg_seconds:
        return {"average_hours": 0}

    return {
        "average_hours": round(
            avg_seconds / 3600,
            2,
        )
    }


@router.get(
    "/stats/risk-distribution",
    response_model=list[schemas.RiskDistributionStats],
)
async def get_risk_distribution(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(
            models.Incident.risk_level,
            func.count(models.Incident.id).label("count"),
        )
        .group_by(models.Incident.risk_level)
        .order_by(func.count(models.Incident.id).desc())
    )

    rows = result.all()

    return [
        {
            "risk_level": row.risk_level,
            "count": row.count,
        }
        for row in rows
    ]


@router.post("/recalculate-risks")
async def recalculate_risks(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_admin(current_user)

    result = await db.execute(select(models.Incident))

    incidents = result.scalars().all()

    updated = 0

    for incident in incidents:
        risk_score, risk_level = calculate_risk(
            incident.type,
            incident.priority,
            incident.location,
        )

        incident.risk_score = risk_score
        incident.risk_level = risk_level

        updated += 1

    await db.commit()

    return {
        "message": "Риски пересчитаны",
        "updated": updated,
    }


@router.get("/{incident_id}", response_model=schemas.IncidentResponse)
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

    incident.recommendation = get_recommendation(incident.risk_score)

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

    return incidents


@router.post("/", response_model=schemas.IncidentResponse)
async def create_incident(
    incident: schemas.IncidentCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    risk_score, risk_level = calculate_risk(
        incident.type.value,
        incident.priority.value,
        incident.location,
    )
    recommendation = get_recommendation(risk_score)

    db_incident = models.Incident(
        **incident.dict(),
        creator_id=current_user.id,
        risk_score=risk_score,
        risk_level=risk_level,
    )

    db.add(db_incident)

    await db.commit()

    result = await db.execute(
        select(models.Incident)
        .options(joinedload(models.Incident.creator))
        .where(models.Incident.id == db_incident.id)
    )

    incident_with_creator = result.scalar_one_or_none()
    incident_with_creator.recommendation = get_recommendation(
        incident_with_creator.risk_score
    )
    return incident_with_creator


@router.patch("/{incident_id}")
async def update_incident_status(
    incident_id: int,
    status_data: schemas.IncidentStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_master_or_admin(current_user)

    result = await db.execute(
        select(models.Incident).where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")

    incident.status = status_data.status

    if status_data.status == schemas.IncidentStatus.CLOSED:

        if status_data.closed_at:
            incident.closed_at = status_data.closed_at
        else:
            incident.closed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(incident)
    return incident


@router.delete("/{incident_id}")
async def delete_incident(
    incident_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_admin(current_user)

    result = await db.execute(
        select(models.Incident).where(models.Incident.id == incident_id)
    )
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")

    await db.delete(incident)
    await db.commit()
    return {"message": "Инцидент удален"}
