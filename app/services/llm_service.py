from groq import Groq

from app.core.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY,
)


def generate_response(
    messages: list,
) -> str:

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=messages,
    )

    return completion.choices[0].message.content


def generate_title(first_message: str) -> str:
    prompt = f"""
Generate a short title for this conversation.

User message:
{first_message}

Rules:
- Maximum 5 words
- Return only the title
- Do not use quotation marks
"""

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.2,
        max_tokens=50,
    )

    title = completion.choices[0].message.content

    if not title:
        return first_message[:50]

    return title.strip().replace('"', "")