# Task: P2-T-008
# Spec: specs/implementation-plan.md §1.10
# Plan: specs/architecture.md

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from config import settings
from db import create_db_and_tables
from routes import tasks, auth

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/health", summary="Health check")
def health_check():
    """
    Check API health status.

    Returns application status, timestamp, and version.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": settings.APP_VERSION,
    }


@app.get("/", summary="Root endpoint")
def root():
    """
    Root endpoint with API information.

    Provides links to documentation and health check.
    """
    return {
        "message": "Todo WebApp API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }


@app.on_event("startup")
def on_startup():
    """
    Application startup event.

    Creates database tables if they don't exist.
    """
    create_db_and_tables()


@app.on_event("shutdown")
def on_shutdown():
    """
    Application shutdown event.

    Perform any cleanup here if needed.
    """
    pass
