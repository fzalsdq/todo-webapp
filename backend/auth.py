# Task: P2-T-005
# Spec: specs/implementation-plan.md §1.7
# Plan: specs/architecture.md §Security Architecture

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime
from config import settings
from schemas import TokenPayload

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Verify JWT token and return user_id from token subject.

    Args:
        credentials: HTTP Authorization header with Bearer token

    Returns:
        str: User ID from token subject

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    token = credentials.credentials

    try:
        # Decode and verify JWT token
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": True},
        )
        return payload["sub"]
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        ) from e


def verify_user_match(path_user_id: str, token_user_id: str) -> None:
    """
    Verify that the user ID in the path matches the token user ID.

    This prevents users from accessing other users' data by changing
    the user_id in the URL.

    Args:
        path_user_id: User ID from the URL path
        token_user_id: User ID from the verified JWT token

    Raises:
        HTTPException: 403 if user IDs don't match
    """
    if path_user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ID mismatch - you can only access your own data",
        )
