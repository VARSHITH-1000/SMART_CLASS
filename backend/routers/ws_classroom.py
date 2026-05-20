from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.cv_engine import process_frame
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

@router.websocket("/ws/classroom")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Expecting data to be a JSON string with a base64 image
            try:
                payload = json.loads(data)
                if "image" in payload:
                    result = process_frame(payload["image"])
                    await websocket.send_json(result)
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
