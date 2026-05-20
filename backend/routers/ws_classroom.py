from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
from backend.cv_engine import process_frame
from backend.database import SessionLocal
from backend.models import AttentionLog, Session as ClassSession
from backend.deps import get_current_user
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Maps classroom_id -> { "host": WebSocket, "students": { student_id: WebSocket } }
        self.classrooms: Dict[int, Dict] = {}

    async def connect_host(self, websocket: WebSocket, classroom_id: int):
        await websocket.accept()
        if classroom_id not in self.classrooms:
            self.classrooms[classroom_id] = {"host": None, "students": {}}
        self.classrooms[classroom_id]["host"] = websocket

    async def connect_student(self, websocket: WebSocket, classroom_id: int, student_id: int):
        await websocket.accept()
        if classroom_id not in self.classrooms:
            self.classrooms[classroom_id] = {"host": None, "students": {}}
        self.classrooms[classroom_id]["students"][student_id] = websocket

    def disconnect_host(self, classroom_id: int):
        if classroom_id in self.classrooms:
            self.classrooms[classroom_id]["host"] = None

    def disconnect_student(self, classroom_id: int, student_id: int):
        if classroom_id in self.classrooms and student_id in self.classrooms[classroom_id]["students"]:
            del self.classrooms[classroom_id]["students"][student_id]

    async def broadcast_to_host(self, classroom_id: int, message: dict):
        if classroom_id in self.classrooms and self.classrooms[classroom_id]["host"]:
            await self.classrooms[classroom_id]["host"].send_json(message)

manager = ConnectionManager()

# NOTE: Authentication via WebSockets in FastAPI usually requires passing the token
# as a query parameter or inside the first message. For simplicity in this demo,
# we expect the client to pass token in query param or we assume client ID.
# Here we'll pass role and id in path for routing, but production should validate token.

@router.websocket("/ws/classroom/{classroom_id}/host")
async def websocket_host(websocket: WebSocket, classroom_id: int):
    await manager.connect_host(websocket, classroom_id)
    try:
        while True:
            # Keep connection alive, listen for host commands if needed
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_host(classroom_id)


from starlette.concurrency import run_in_threadpool

def sync_process_and_log(image_data: str, classroom_id: int, student_id: int):
    # Process CPU-bound frame
    result = process_frame(image_data)
    result["student_id"] = student_id

    # Perform synchronous DB operations
    db = SessionLocal()
    try:
        active_session = db.query(ClassSession).filter(
            ClassSession.classroom_id == classroom_id,
            ClassSession.status == "active"
        ).first()

        if active_session:
            log = AttentionLog(
                session_id=active_session.id,
                student_id=student_id,
                attention_score=result["attention_score"],
                emotion=result["emotion"],
                head_pose=result["head_pose"],
                drowsiness=result["drowsiness"],
                missing_face=result["missing_face"]
            )
            db.add(log)
            db.commit()
    finally:
        db.close()

    return result

@router.websocket("/ws/classroom/{classroom_id}/student/{student_id}")
async def websocket_student(websocket: WebSocket, classroom_id: int, student_id: int):
    await manager.connect_student(websocket, classroom_id, student_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                if "image" in payload:
                    # Offload CPU-bound task and DB operations to threadpool
                    result = await run_in_threadpool(
                        sync_process_and_log,
                        payload["image"],
                        classroom_id,
                        student_id
                    )

                    # 1. Send feedback back to the student
                    await websocket.send_json(result)

                    # 2. Broadcast result to the teacher/host
                    await manager.broadcast_to_host(classroom_id, result)

            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        manager.disconnect_student(classroom_id, student_id)
