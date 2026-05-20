from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class SessionBase(BaseModel):
    topic: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    teacher_id: int
    start_time: datetime
    end_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class AttentionLogResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    attention_score: float
    emotion: str

    class Config:
        from_attributes = True
