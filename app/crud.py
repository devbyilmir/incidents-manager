# from sqlalchemy.orm import Session
# from app.incidents import models, schemas

# def get_incidents(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Incident).offset(skip).limit(limit).all()

# def create_incident(db: Session, incident: schemas.IncidentCreate):
#     db_incident = models.Incident(
#         title=incident.title,
#         description=incident.description,
#         type=incident.type,
#         priority=incident.priority,
#         location=incident.location
#     )
#     db.add(db_incident)
#     db.commit()
#     db.refresh(db_incident)
#     return db_incident
