from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from backend.database import get_db
from backend.models import Classroom, User, classroom_students
from backend.schemas import ClassroomCreate, ClassroomResponse
from backend.deps import require_role, get_current_user

router = APIRouter(prefix="/classrooms", tags=["classrooms"])

@router.post("/", response_model=ClassroomResponse)
def create_classroom(
    classroom: ClassroomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["teacher", "admin"]))
):
    join_code = str(uuid.uuid4())[:8].upper()
    new_classroom = Classroom(
        name=classroom.name,
        join_code=join_code,
        teacher_id=current_user.id
    )
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    return new_classroom

@router.post("/{join_code}/join")
def join_classroom(
    join_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["student"]))
):
    classroom = db.query(Classroom).filter(Classroom.join_code == join_code).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")

    if current_user in classroom.students:
        return {"message": "Already joined"}

    classroom.students.append(current_user)
    db.commit()
    return {"message": "Successfully joined classroom"}

@router.get("/", response_model=list[ClassroomResponse])
def list_classrooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "teacher":
        return db.query(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    elif current_user.role == "student":
        return current_user.classrooms_joined
    elif current_user.role == "admin":
        return db.query(Classroom).all()
    return []
