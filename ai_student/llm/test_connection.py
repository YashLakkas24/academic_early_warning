from client import client


response = client.chat.completions.create(
    model="qwen3.6",
    messages=[
        {
            "role": "user",
            "content": "Say hello in one short sentence."
        }
    ],
    max_tokens=50
)


print(response.choices[0].message.content)