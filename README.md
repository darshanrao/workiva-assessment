# Workiva Assessment - Full Stack AI Application

A full-stack application built with FastAPI, Next.js, and Google Gemini AI integration. Features real-time chat functionality with MongoDB Atlas cloud database storage.

## Overview

This project demonstrates a complete AI-powered chat system with the following components:

- **Backend**: FastAPI with Google Gemini AI integration
- **Frontend**: Next.js with React and Tailwind CSS
- **Database**: MongoDB Atlas (cloud database)
- **AI**: Google Gemini for intelligent responses

## Features

- Real-time chat interface with AI responses
- Conversation history storage and retrieval
- Responsive web design with dark mode support
- RESTful API with comprehensive error handling
- Secure API key management
- Input validation and rate limiting

## Tech Stack

**Backend:**
- FastAPI 0.104.1
- Google Generative AI
- Motor (async MongoDB driver)
- Pydantic for data validation

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

**Database:**
- MongoDB Atlas (cloud database)

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd workiva-assessment
```

2. **Setup MongoDB Atlas**
   - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Add your IP address to the IP whitelist
   - Create a database user with read/write permissions
   - Get your connection string from the "Connect" button

3. **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env_example.txt .env
# Edit .env and add your GEMINI_API_KEY and MONGODB_URL
python main.py
```

Backend runs on `http://localhost:8000`

4. **Setup Frontend**
```bash
cd frontend
npm install
cp env_example.txt .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Send Message to AI
```
POST /api/ask-ai
Content-Type: application/json

{
  "prompt": "Your message here"
}
```

Response:
```json
{
  "response": "AI response",
  "conversation_id": "unique-id"
}
```

### Get Conversation History
```
GET /api/conversations
```

### Clear All Conversations
```
DELETE /api/conversations
```

## Configuration

### Backend Environment (.env)
```
# Required: MongoDB Atlas connection string
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
# Required: Google Gemini API key
GEMINI_API_KEY=your_api_key_here
# Optional: Database name (defaults to 'workiva_assessment')
DATABASE_NAME=workiva_assessment
```

### Frontend Environment (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Project Structure

```
workiva-assessment/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Request/response schemas
│   ├── database.py          # MongoDB Atlas connection
│   ├── requirements.txt     # Python dependencies
│   ├── env_example.txt      # Environment template
│   └── README.md           # Backend setup guide
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   └── components/     # React components
│   ├── package.json        # Node dependencies
│   └── env_example.txt     # Frontend environment template
└── README.md               # This file
```

## Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:8000/health

# Send message
curl -X POST "http://localhost:8000/api/ask-ai" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'

# Get history
curl http://localhost:8000/api/conversations

# Clear history
curl -X DELETE http://localhost:8000/api/conversations
```

## Development

API documentation is available at `http://localhost:8000/docs` when the backend is running.

For development with auto-reload:
```bash
# Backend
python main.py
# or
uvicorn main:app --reload

# Frontend
npm run dev
```

## Troubleshooting

**Backend issues:**
- Ensure virtual environment is activated
- Check GEMINI_API_KEY is set correctly
- Verify MONGODB_URL contains valid MongoDB Atlas connection string
- Ensure your IP address is whitelisted in MongoDB Atlas

**Frontend issues:**
- Confirm backend is running on port 8000
- Check NEXT_PUBLIC_BACKEND_URL setting

**Database issues:**
- Verify MongoDB Atlas cluster is running
- Check connection string format: `mongodb+srv://...`
- Ensure database user has proper permissions
- Confirm IP whitelist includes your current IP address

## MongoDB Atlas Setup

This application **requires** MongoDB Atlas cloud database. Local MongoDB is not supported.

1. Visit [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Build a new cluster (M0 free tier is sufficient)
4. Create a database user
5. Add your IP to the IP Access List
6. Get your connection string and add it to your `.env` file

## Author

Darshan Rao - Workiva Technical Assessment 