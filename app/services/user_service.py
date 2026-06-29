from sqlalchemy.orm import Session

from app.repositories import user_repository
from app.schemas.user import (
    UserCreate,
    UserUpdate,
)
from app.core.security import (
    get_password_hash,
)


def create_user(
    db: Session,
    user: UserCreate,
):
    if user_repository.get_user_by_email(
        db,
        user.email,
    ):
        raise ValueError(
            "Email already registered"
        )

    if user_repository.get_user_by_username(
        db,
        user.username,
    ):
        raise ValueError(
            "Username already exists"
        )

    hashed_password = get_password_hash(
        user.password
    )

    return user_repository.create_user(
        db,
        user,
        hashed_password,
    )


def get_user(
    db: Session,
    user_id: int,
):
    return user_repository.get_user(
        db,
        user_id,
    )


def get_users(
    db: Session,
    skip: int,
    limit: int,
):
    return user_repository.get_users(
        db,
        skip,
        limit,
    )


def update_user(
    db: Session,
    user_id: int,
    user: UserUpdate,
):
    return user_repository.update_user(
        db,
        user_id,
        user,
    )


def delete_user(
    db: Session,
    user_id: int,
):
    return user_repository.delete_user(
        db,
        user_id,
    )