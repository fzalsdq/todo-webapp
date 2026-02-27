# Task: P2-T-002
# Spec: specs/implementation-plan.md §1.4
# Plan: specs/database/schema.md

from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from config import settings

# Create database engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_pre_ping=True,  # Enable connection health checks
    pool_size=10,  # Number of connections to keep in pool
    max_overflow=20,  # Max connections beyond pool_size
)


def create_db_and_tables() -> None:
    """
    Create all database tables.
    Call this on application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency for getting database session.
    Use with FastAPI Depends().
    """
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
