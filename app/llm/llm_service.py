from groq import Groq

from app.core.config import settings

client = Groq(
    api_key=settings.GROQ_API_KEY,
)


def generate_response(messages: list):

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
    )

    return completion.choices[0].message.content