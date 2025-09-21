from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.db import engine, Base
from routers import chat, faqs, logs
from core.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Persian Chatbot API",
    description="A Persian chatbot with FAQ management and semantic search",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(faqs.router, prefix="/api", tags=["faqs"])
app.include_router(logs.router, prefix="/api", tags=["logs"])


@app.get("/")
async def root():
    return {"message": "Persian Chatbot API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002)
