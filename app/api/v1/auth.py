from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.user import (
    UserCreate,
    UserResponse,
)

from app.schemas.auth import (
    LoginRequest,
    Token,
)

from app.services.user_service import (
    create_user,
)

from app.services.auth_service import (
    login,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_user(
            db,
            user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=Token,
)
def login_user(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    token = login(
        db,
        request.email,
        request.password,
    )

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return {
        "access_token": token,
        "token_type": "bearer",
    }