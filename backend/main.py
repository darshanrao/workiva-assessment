from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid
from contextlib import asynccontextmanager

from database import connect_to_mongo, close_mongo_connection, get_database
from models import ConversationModel, ConversationInDB
from schemas import PromptRequest, PromptResponse, ConversationResponse

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Workiva Assessment API",
    description="A FastAPI backend with Gemini AI integration and MongoDB Atlas cloud database",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.get("/")
async def root():
    return {"message": "Workiva Assessment API - FastAPI Backend with MongoDB Atlas"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow(), "database": "MongoDB Atlas"}

@app.post("/api/ask-ai", response_model=PromptResponse)
async def ask_ai(request: PromptRequest):
    """
    Send a prompt to Gemini AI and get a response.
    Stores the conversation in MongoDB.
    """
    try:
        if not request.prompt or len(request.prompt.strip()) == 0:
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
        if len(request.prompt) > 10000:
            raise HTTPException(status_code=400, detail="Prompt too long (max 10,000 characters)")
        
        # Generate response from Gemini
        response = model.generate_content(request.prompt)
        
        if not response.text:
            raise HTTPException(status_code=500, detail="Failed to generate response from AI")
        
        # Create conversation record
        conversation_id = str(uuid.uuid4())
        conversation = ConversationModel(
            conversation_id=conversation_id,
            prompt=request.prompt.strip(),
            response=response.text,
            timestamp=datetime.utcnow()
        )
        
        # Save to MongoDB
        db = get_database()
        result = await db.conversations.insert_one(conversation.dict(by_alias=True, exclude_unset=True))
        
        return PromptResponse(
            response=response.text,
            conversation_id=conversation_id
        )
        
    except Exception as e:
        if "API_KEY" in str(e):
            raise HTTPException(status_code=401, detail="Invalid or missing Gemini API key")
        elif "quota" in str(e).lower() or "rate limit" in str(e).lower():
            raise HTTPException(status_code=429, detail="AI service rate limit exceeded. Please try again later.")
        elif "timeout" in str(e).lower():
            raise HTTPException(status_code=504, detail="AI service timeout. Please try again.")
        else:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/conversations", response_model=list[ConversationResponse])
async def get_conversations():
    """
    Retrieve all stored conversations from MongoDB.
    """
    try:
        db = get_database()
        conversations_cursor = db.conversations.find().sort("timestamp", -1)
        conversations = await conversations_cursor.to_list(length=1000)
        
        return [
            ConversationResponse(
                id=conv["conversation_id"],
                prompt=conv["prompt"],
                response=conv["response"],
                timestamp=conv["timestamp"]
            )
            for conv in conversations
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve conversations: {str(e)}")

@app.delete("/api/conversations")
async def clear_conversations():
    """
    Clear all stored conversations from MongoDB.
    """
    try:
        db = get_database()
        result = await db.conversations.delete_many({})
        return {"message": f"Successfully cleared {result.deleted_count} conversations"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear conversations: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 