from fastapi import FastAPI
from app.users.router import router as users_router
from app.users.router import router as users_router
from app.incidents.router import router as incidents_router  # надо поменять, создать отдельные папки


app = FastAPI(
    title="Incident Assistant API",
    description="Цифровой помощник для управления инцидентами на НПЗ",
    version="1.0.0"
)

app.include_router(users_router, prefix="/auth", tags=["Auth"])
app.include_router(incidents_router, prefix="/incidents", tags=["Incidents"])

@app.get("/")
async def root():
    return {"message": "Incident Assistant API работает! 🚀"}