from app.database.session import SessionLocal
from app.models.chatbot import Chatbot


def seed_chatbots():
    db = SessionLocal()

    try:
        owner_id = 4

        assistants = [
            {
                "name": "Python Assistant",
                "description": "Helps with Python development and debugging.",
            },
            {
                "name": "Backend Assistant",
                "description": "Helps design scalable backend services.",
            },
            {
                "name": "Database Assistant",
                "description": "Helps with PostgreSQL and database queries.",
            },
            {
                "name": "FastAPI Assistant",
                "description": "Helps build REST APIs using FastAPI.",
            },
            {
                "name": "DevOps Assistant",
                "description": "Helps with Docker and deployment workflows.",
            },
            {
                "name": "Testing Assistant",
                "description": "Helps write and improve automated tests.",
            },
            {
                "name": "Security Assistant",
                "description": "Reviews application security practices.",
            },
            {
                "name": "API Design Assistant",
                "description": "Helps design clean REST APIs.",
            },
            {
                "name": "SQL Assistant",
                "description": "Helps write and optimize SQL queries.",
            },
            {
                "name": "Architecture Assistant",
                "description": "Helps design scalable software architecture.",
            },
            {
                "name": "Debugging Assistant",
                "description": "Helps diagnose software bugs.",
            },
        ]

        for assistant in assistants:
            chatbot = Chatbot(
                name=assistant["name"],
                description=assistant["description"],
                model_name="llama-3.3-70b-versatile",
                owner_id=owner_id,
                is_active=True,
            )

            db.add(chatbot)

        db.commit()

        print("11 test assistants created successfully.")

    except Exception as error:
        db.rollback()
        print(f"Failed to seed assistants: {error}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_chatbots()