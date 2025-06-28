from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000, description="The prompt to send to the AI")

class PromptResponse(BaseModel):
    response: str = Field(..., description="The AI-generated response")
    conversation_id: str = Field(..., description="Unique identifier for this conversation")

class ConversationResponse(BaseModel):
    id: str = Field(..., description="Unique conversation identifier")
    prompt: str = Field(..., description="The user's prompt")
    response: str = Field(..., description="The AI's response")
    timestamp: datetime = Field(..., description="When the conversation occurred")
    
    class Config:
        from_attributes = True 