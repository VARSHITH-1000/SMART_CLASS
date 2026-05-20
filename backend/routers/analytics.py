from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import AttentionLog, Session as ClassSession
from sqlalchemy import func

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_sessions = db.query(ClassSession).count()
    avg_attention = db.query(func.avg(AttentionLog.attention_score)).scalar() or 0.0

    return {
        "total_sessions": total_sessions,
        "average_attention": round(avg_attention, 2),
        "active_students": 0 # Placeholder for realtime stats
    }
