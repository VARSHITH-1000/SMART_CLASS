from fastapi import APIRouter, Depends, HTTPException
from backend.schemas import ChatMessage, ChatResponse
from backend.deps import require_role
from groq import Groq
import os

router = APIRouter(prefix="/ai", tags=["ai"])

# Ensure you have GROQ_API_KEY set in your environment
client = Groq(api_key=os.environ.get("GROQ_API_KEY", "mock_key_for_tests"))

@router.post("/chat", response_model=ChatResponse)
def ai_assistant_chat(
    chat: ChatMessage,
    # In production, require teacher role: current_user = Depends(require_role(["teacher"]))
):
    """
    Groq API integration for the Teacher AI Assistant.
    """
    try:
        if os.environ.get("GROQ_API_KEY") is None:
            # Fallback for local testing if no key is provided
            return {"reply": f"[MOCK Groq API] You asked: {chat.message}. Please configure GROQ_API_KEY."}

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a highly intelligent AI Teaching Assistant. Your job is to help the teacher analyze classroom attention data, summarize sessions, identify struggling students, generate quizzes, and offer intervention strategies."
                },
                {
                    "role": "user",
                    "content": chat.message
                }
            ],
            model="llama3-8b-8192",
        )
        return {"reply": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to AI: {str(e)}")
