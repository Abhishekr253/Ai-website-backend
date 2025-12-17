from fastapi import FastAPI
from pydantic import BaseModel
from services.chatbot import get_ai_response

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    reply = get_ai_response(req.message)
    return {"reply": reply}
