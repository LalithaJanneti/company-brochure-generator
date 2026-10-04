import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_brochure(company_text: str) -> str:

    prompt = f"""
You are a professional business analyst and content writer.

Analyze the company information provided below.

Create a professional company brochure containing:

1. Company Name
2. Company Overview
3. Products and Services
4. Industries Served
5. Key Features or Strengths
6. Target Customers
7. Contact Information, if available

Write the brochure in clear, professional language.

Do not invent information.
Only use information present in the provided company content.

Company Information:
{company_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

#TERMINAL 1
#C:\Users\rgukt\Documents\company-brochure-generator\backend>
#uv run uvicorn main:app --reload

#C:\Users\rgukt\Documents\company-brochure-generator\frontend>
#uv run python -m http.server 5500