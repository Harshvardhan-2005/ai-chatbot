# Deneb AI Chatbot Platform

## Overview

Deneb AI Chatbot Platform is a backend application developed using FastAPI and PostgreSQL for managing AI chatbots and their knowledge bases. This project was developed as part of the internship assignment to implement RESTful APIs following industry-standard practices.

## Features

- CRUD operations for Chatbots
- CRUD operations for Knowledge Bases
- PostgreSQL database integration
- SQLAlchemy ORM
- Pydantic validation
- Search functionality
- Pagination support
- Interactive API documentation using Swagger

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Uvicorn
- Python 3.13

## API Endpoints

### Chatbots
- POST /chatbots
- GET /chatbots
- GET /chatbots/{id}
- PUT /chatbots/{id}
- DELETE /chatbots/{id}
- GET /chatbots/search

### Knowledge Bases
- POST /knowledge-bases
- GET /knowledge-bases
- GET /knowledge-bases/{id}
- PUT /knowledge-bases/{id}
- DELETE /knowledge-bases/{id}
- GET /knowledge-bases/search

## Running the Project

bash uv sync uv run uvicorn app.main:app --reload 

API Documentation:

text http://127.0.0.1:8000/docs 

## Outcome

Successfully implemented a scalable backend foundation with database integration, validation, search, pagination, and complete CRUD functionality for chatbot and knowledge base management.

## Author

Harshvardhan Kumar  
Software Development Intern
