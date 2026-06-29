from sqlalchemy.orm import Session

import app.repositories.message_repository as message_repository

from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
)


def create_message(
    db: Session,
    message: MessageCreate,
):
    return message_repository.create_message(
        db,
        message,
    )


def get_message(
    db: Session,
    message_id: int,
):
    return message_repository.get_message(
        db,
        message_id,
    )


def get_messages(
    db: Session,
    skip: int,
    limit: int,
):
    return message_repository.get_messages(
        db,
        skip,
        limit,
    )


def search_messages(
    db: Session,
    keyword: str,
):
    return message_repository.search_messages(
        db,
        keyword,
    )


def update_message(
    db: Session,
    message_id: int,
    message: MessageUpdate,
):
    return message_repository.update_message(
        db,
        message_id,
        message,
    )


def delete_message(
    db: Session,
    message_id: int,
):
    return message_repository.delete_message(
        db,
        message_id,
    )