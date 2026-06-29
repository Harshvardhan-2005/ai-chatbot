from sqlalchemy.orm import Session

from app.core.security import (
    verify_password,
    create_access_token,
)
from app.repositories import user_repository


def login(
    db: Session,
    email: str,
    password: str,
):
    user = user_repository.get_user_by_email(
        db,
        email,
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
        }
    )

    return access_token