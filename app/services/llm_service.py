from groq import Groq

from app.core.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY,
)


def generate_response(
    messages: list,
) -> str:

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
    )

    return completion.choices[0].message.content

def generate_title(first_message: str) -> str:
    prompt = f"""
Generate a short conversation title (maximum 5 words).

Message:
{first_message}

Return ONLY the title.
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.2,
        max_tokens=20,
    )

    return completion.choices[0].message.content.strip().replace('"', "")