from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
import os

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Classroom AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.routers import users, classrooms, sessions, analytics, ws_classroom, ai_assistant

app.include_router(users.router)
app.include_router(classrooms.router)
app.include_router(sessions.router)
app.include_router(analytics.router)
app.include_router(ws_classroom.router)
app.include_router(ai_assistant.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Classroom API"}
