from fastapi import FastAPI
from app.users.router import router as users_router
from app.incidents.router import router as incidents_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="Incident Assistant API",
    description="Цифровой помощник для управления инцидентами на НПЗ",
)

app.include_router(users_router)
app.include_router(incidents_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Incident Assistant API работает! 🚀"}
