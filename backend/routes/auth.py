# Task: P2-T-024
# Spec: specs/implementation-plan.md §1.9
# Plan: specs/features/authentication.md

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from datetime import datetime, timedelta
from jose import jwt
from db import get_session
from config import settings
from schemas import TokenPayload

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/sign-up")
def sign_up(
    email: str,
    password: str,
    name: str | None = None,
    session: Session = Depends(get_session),
):
    """
    Sign up a new user.
    
    Note: This is a simplified implementation.
    In production, use Better Auth SDK with proper password hashing.
    """
    # TODO: Implement proper user creation with Better Auth
    # For now, return a mock response
    user_id = f"user_{datetime.utcnow().timestamp()}"
    
    # Generate JWT token
    token = create_jwt_token(user_id, email, name)
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
        },
    }


@router.post("/sign-in")
def sign_in(
    email: str,
    password: str,
    session: Session = Depends(get_session),
):
    """
    Sign in an existing user.
    
    Note: This is a simplified implementation.
    In production, use Better Auth SDK with proper password verification.
    """
    # TODO: Implement proper authentication with Better Auth
    # For now, return a mock response
    user_id = f"user_{hash(email)}"
    
    # Generate JWT token
    token = create_jwt_token(user_id, email, None)
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "email": email,
            "name": None,
        },
    }


@router.get("/session")
def get_session_endpoint(
    current_user_id: str = Depends(lambda: "user_id"),  # Replace with actual JWT dependency
):
    """
    Get current user session.
    """
    # TODO: Implement proper session retrieval
    return {
        "user": {
            "id": current_user_id,
            "email": "user@example.com",
            "name": "User",
        }
    }


def create_jwt_token(user_id: str, email: str, name: str | None = None) -> str:
    """
    Create JWT token for authenticated user.
    """
    now = datetime.utcnow()
    expire = now + timedelta(seconds=settings.JWT_EXPIRATION)
    
    payload = {
        "sub": user_id,
        "email": email,
        "name": name,
        "iat": now,
        "exp": expire,
    }
    
    token = jwt.encode(
        payload,
        settings.BETTER_AUTH_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    
    return token
