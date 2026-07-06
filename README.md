# Deneb — AI Chatbot Platform

Deneb is a full-stack AI chatbot platform for creating, configuring, and managing knowledge-grounded AI assistants.

The platform combines a FastAPI backend, PostgreSQL persistence, JWT authentication, Groq-powered language models, and a React workspace for managing assistants and their knowledge sources.

## Features

### Authentication and Security

- User registration and login
- JWT-based authentication
- bcrypt password hashing
- Protected API routes
- Ownership-based resource authorization
- User-scoped data access

### AI Assistant Management

- Create AI assistants
- View and search assistants
- Update assistant configuration
- Delete assistants
- Configure model selection
- Enable or disable assistants
- Paginated assistant listings

### Knowledge Management

- Add knowledge sources to individual assistants
- Search knowledge sources by title
- Update knowledge content
- Delete knowledge sources
- Assistant-specific knowledge isolation
- Knowledge-grounded AI responses

### AI Chat

- Groq-powered language model integration
- Persistent conversation history
- Automatic conversation title generation
- Knowledge context injection
- Assistant-specific knowledge retrieval
- Multi-turn conversation support
- Message persistence

### Conversation and Message APIs

- Complete conversation CRUD operations
- Complete message CRUD operations
- Search APIs
- Pagination
- Ownership validation
- Conversation history management

### Frontend Workspace

- React-based assistant management interface
- JWT authentication flow
- Protected application routes
- Assistant creation and editing
- Knowledge management interface
- Search with debounced API requests
- Pagination
- Loading and error states
- Toast notifications
- Responsive workspace UI

## Architecture

Deneb follows a layered backend architecture:

```text
Client
  |
  v
FastAPI Router
  |
  v
Service Layer
  |
  v
Repository Layer
  |
  v
SQLAlchemy ORM
  |
  v
PostgreSQL
```
