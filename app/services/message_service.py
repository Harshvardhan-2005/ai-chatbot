from sqlalchemy.orm import Session

import app.repositories.message_repository as message_repository

from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
)


def create_message(
    db: Session,
    message: MessageCreate,
    owner_id: int,
):
    return message_repository.create_message(
        db,
        message,
        owner_id,
    )


def get_message(
    db: Session,
    message_id: int,
    owner_id: int,
):
    return message_repository.get_message(
        db,
        message_id,
        owner_id,
    )


def get_messages(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return message_repository.get_messages(
        db,
        owner_id,
        skip,
        limit,
    )


def search_messages(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return message_repository.search_messages(
        db,
        owner_id,
        keyword,
    )


def update_message(
    db: Session,
    message_id: int,
    message: MessageUpdate,
    owner_id: int,
):
    return message_repository.update_message(
        db,
        message_id,
        message,
        owner_id,
    )


def delete_message(
    db: Session,
    message_id: int,
    owner_id: int,
):
    return message_repository.delete_message(
        db,
        message_id,
        owner_id,
    )
