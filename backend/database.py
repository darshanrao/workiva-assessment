from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Atlas connection - no fallback to localhost
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "workiva_assessment")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL environment variable is required. Please provide your MongoDB Atlas connection string.")

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection to MongoDB Atlas"""
    try:
        mongodb.client = AsyncIOMotorClient(MONGODB_URL)
        mongodb.database = mongodb.client[DATABASE_NAME]
        
        # Test the connection
        await mongodb.client.admin.command('ping')
        print("Connected to MongoDB Atlas successfully!")
        
        # Print database info (without exposing credentials)
        if MONGODB_URL.startswith("mongodb+srv://"):
            print("Using MongoDB Atlas cloud database")
        
    except Exception as e:
        print(f"Failed to connect to MongoDB Atlas: {e}")
        print("Please check your MONGODB_URL environment variable and ensure it contains a valid MongoDB Atlas connection string.")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()
        print("MongoDB Atlas connection closed.")

def get_database():
    """Get database instance"""
    return mongodb.database 