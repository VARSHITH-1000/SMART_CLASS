from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_db
from backend.models import Session as ClassSession, Classroom, User
from backend.schemas import SessionCreate, SessionResponse
from backend.deps import require_role

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.post("/", response_model=SessionResponse)
def start_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["teacher"]))
):
    classroom = db.query(Classroom).filter(Classroom.id == session.classroom_id).first()
    if not classroom or classroom.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to start session in this classroom")

    active_session = db.query(ClassSession).filter(
        ClassSession.classroom_id == session.classroom_id,
        ClassSession.status == "active"
    ).first()

    if active_session:
        raise HTTPException(status_code=400, detail="An active session already exists for this classroom")

    new_session = ClassSession(
        classroom_id=session.classroom_id,
        topic=session.topic,
        status="active"
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.post("/{session_id}/stop")
def stop_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["teacher"]))
):
    session = db.query(ClassSession).filter(ClassSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    classroom = db.query(Classroom).filter(Classroom.id == session.classroom_id).first()
    if classroom.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.status = "ended"
    session.end_time = datetime.utcnow()
    db.commit()
    return {"message": "Session stopped"}
