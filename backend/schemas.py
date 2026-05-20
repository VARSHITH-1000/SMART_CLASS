from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ClassroomBase(BaseModel):
    name: str

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomResponse(ClassroomBase):
    id: int
    join_code: str
    teacher_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SessionBase(BaseModel):
    topic: Optional[str] = None

class SessionCreate(SessionBase):
    classroom_id: int

class SessionResponse(SessionBase):
    id: int
    classroom_id: int
    status: str
    start_time: datetime
    end_time: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class AttentionLogResponse(BaseModel):
    id: int
    session_id: int
    student_id: int
    timestamp: datetime
    attention_score: float
    emotion: str
    eye_gaze: Optional[str] = None
    head_pose: Optional[str] = None
    drowsiness: bool = False
    phone_detected: bool = False
    missing_face: bool = False
    model_config = ConfigDict(from_attributes=True)

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
