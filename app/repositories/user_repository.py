from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserUpdate,
)


def create_user(
    db: Session,
    user: UserCreate,
    hashed_password: str,
):
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def get_user_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_username(
    db: Session,
    username: str,
):
    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )


def get_users(
    db: Session,
    skip: int,
    limit: int,
):
    return (
        db.query(User)
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_user(
    db: Session,
    user_id: int,
    user: UserUpdate,
):
    db_user = get_user(
        db,
        user_id,
    )

    if not db_user:
        return None

    update_data = user.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            db_user,
            key,
            value,
        )

    db.commit()
    db.refresh(db_user)

    return db_user


def delete_user(
    db: Session,
    user_id: int,
):
    db_user = get_user(
        db,
        user_id,
    )

    if not db_user:
        return False

    db.delete(db_user)
    db.commit()

    return True