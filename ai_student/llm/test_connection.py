from ai_student.llm.service import safe_chat_completion

response = safe_chat_completion(
    messages=[
        {
            "role": "user",
            "content": "Say hello in one sentence."
        }
    ],
    temperature=0.2,
    timeout=30.0,
)

print(response.choices[0].message.content)