from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

# Association table for students joined in a classroom
classroom_students = Table(
    "classroom_students",
    Base.metadata,
    Column("classroom_id", Integer, ForeignKey("classrooms.id")),
    Column("student_id", Integer, ForeignKey("users.id"))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # teacher, admin, student

    classrooms_taught = relationship("Classroom", back_populates="teacher")
    classrooms_joined = relationship("Classroom", secondary=classroom_students, back_populates="students")

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    join_code = Column(String, unique=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("User", back_populates="classrooms_taught")
    students = relationship("User", secondary=classroom_students, back_populates="classrooms_joined")
    sessions = relationship("Session", back_populates="classroom")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    topic = Column(String, nullable=True)
    status = Column(String, default="active") # active, paused, ended
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    classroom = relationship("Classroom", back_populates="sessions")
    participants = relationship("SessionParticipant", back_populates="session")
    logs = relationship("AttentionLog", back_populates="session")

class SessionParticipant(Base):
    __tablename__ = "session_participants"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)

    session = relationship("Session", back_populates="participants")

class AttentionLog(Base):
    __tablename__ = "attention_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)

    attention_score = Column(Float)
    emotion = Column(String)

    # Detailed metrics
    eye_gaze = Column(String, nullable=True)
    head_pose = Column(String, nullable=True)
    drowsiness = Column(Boolean, default=False)
    yawning = Column(Boolean, default=False)
    phone_detected = Column(Boolean, default=False)
    missing_face = Column(Boolean, default=False)

    session = relationship("Session", back_populates="logs")
