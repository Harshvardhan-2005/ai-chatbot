# 🤖 AI Chatbot Platform – Phase 1

A production-ready backend for an AI Chatbot Platform built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy** following a layered architecture (Router → Service → Repository).

This project implements the complete Phase 1 requirements, including authentication, CRUD APIs, pagination, search, validation, and ownership-based authorization.

---

# 🚀 Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected APIs

---

## Chatbots

- Create Chatbot
- List Chatbots
- Get Chatbot by ID
- Search Chatbots
- Update Chatbot
- Delete Chatbot

Supports:

- Pagination
- Owner-based access control

---

## Knowledge Bases

- Create Knowledge Base
- List Knowledge Bases
- Get Knowledge Base by ID
- Search Knowledge Bases
- Update Knowledge Base
- Delete Knowledge Base

Supports:

- Pagination
- Owner verification
- Chatbot relationship

---

## Conversations

- Create Conversation
- List Conversations
- Get Conversation by ID
- Search Conversations
- Update Conversation
- Delete Conversation

Supports:

- Pagination
- Chatbot ownership validation

---

## Messages

- Create Message
- List Messages
- Get Message by ID
- Search Messages
- Update Message
- Delete Message

Supports:

- Conversation validation
- Pagination
- Search

---

# 🏗️ Project Structure

```
app/
│
├── api/
│   └── v1/
│       ├── auth.py
│       ├── chatbot.py
│       ├── knowledge_base.py
│       ├── conversation.py
│       └── message.py
│
├── core/
│   ├── config.py
│   └── security.py
│
├── database/
│   ├── base.py
│   └── session.py
│
├── models/
│   ├── user.py
│   ├── chatbot.py
│   ├── knowledge_base.py
│   ├── conversation.py
│   └── message.py
│
├── repositories/
│
├── schemas/
│
├── services/
│
└── main.py
```

---

# 🛠️ Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Pydantic
- JWT Authentication
- Passlib (bcrypt)
- Uvicorn

---

# 📂 Database Models

## User

- id
- username
- email
- hashed_password
- is_active
- created_at
- updated_at

---

## Chatbot

- id
- name
- description
- model_name
- owner_id
- is_active
- created_at
- updated_at

---

## Knowledge Base

- id
- chatbot_id
- title
- source_type
- content
- created_at
- updated_at

---

## Conversation

- id
- chatbot_id
- title
- created_at
- updated_at

---

## Message

- id
- conversation_id
- role
- content
- created_at

---

# 🔐 Authentication

Protected APIs require a JWT token.

Login:

```
POST /auth/login
```

Use the returned token:

```
Authorization: Bearer <your_token>
```

---

# 📖 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |

---

## Chatbots

| Method | Endpoint |
|---------|----------|
| POST | /chatbots |
| GET | /chatbots |
| GET | /chatbots/{id} |
| GET | /chatbots/search |
| PUT | /chatbots/{id} |
| DELETE | /chatbots/{id} |

---

## Knowledge Bases

| Method | Endpoint |
|---------|----------|
| POST | /knowledge-bases |
| GET | /knowledge-bases |
| GET | /knowledge-bases/{id} |
| GET | /knowledge-bases/search |
| PUT | /knowledge-bases/{id} |
| DELETE | /knowledge-bases/{id} |

---

## Conversations

| Method | Endpoint |
|---------|----------|
| POST | /conversations |
| GET | /conversations |
| GET | /conversations/{id} |
| GET | /conversations/search |
| PUT | /conversations/{id} |
| DELETE | /conversations/{id} |

---

## Messages

| Method | Endpoint |
|---------|----------|
| POST | /messages |
| GET | /messages |
| GET | /messages/{id} |
| GET | /messages/search |
| PUT | /messages/{id} |
| DELETE | /messages/{id} |

---

# 🔍 Search

Implemented using PostgreSQL's case-insensitive matching.

Example:

```
GET /chatbots/search?keyword=bot
```

```
GET /messages/search?keyword=hello
```

---

# 📄 Pagination

Supported on all list endpoints.

Example:

```
GET /chatbots?page=1&size=10
```

Parameters:

- page
- size

---

# 🧱 Architecture

The project follows a layered architecture:

```
Client
   │
   ▼
API Router
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
PostgreSQL Database
```

This separation improves:

- Maintainability
- Scalability
- Code Reusability
- Testing

---

# ✅ Phase 1 Deliverables

- User Authentication
- JWT Security
- CRUD APIs
- Search APIs
- Pagination
- SQLAlchemy Relationships
- Request Validation
- Error Handling
- Layered Architecture
- PostgreSQL Integration

---

# ▶️ Running the Project

Clone the repository:

```bash
git clone https://github.com/Harshvardhan-2005/ai-chatbot.git
```

Install dependencies:

```bash
uv sync
```

Run the server:

```bash
uv run fastapi dev app/main.py
```

Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

# 📌 Future Enhancements

- Alembic Migrations
- Unit Testing
- Docker Support
- Async SQLAlchemy
- File Uploads
- AI Model Integration
- RAG Pipeline
- Vector Database
- Streaming Responses
- Background Tasks

---

# 👨‍💻 Author

**Harshvardhan Kumar**

Built as part of the AI Chatbot Platform internship project using FastAPI and PostgreSQL.
