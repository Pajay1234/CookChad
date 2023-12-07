import sys
from openai import OpenAI

caption = sys.argv[1]
key = sys.argv[2]
value = sys.argv[3]

client = OpenAI(
    api_key=key
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": (f"Give me a recipe for whatever food is in this quote, '{caption}' that is {value} ")
        }
    ],
    model="gpt-3.5-turbo",
)

print(chat_completion.choices[0].message.content)
sys.stdout.flush() 