def get_ai_response(message: str) -> str:
    # Temporary AI logic
    message = message.lower()

    if "hello" in message:
        return "Hello 👋 How can I help you with your business today?"

    if "website" in message:
        return "I can help you build an AI-powered website in minutes 🚀"

    if "pricing" in message:
        return "Our pricing plans are flexible and designed for businesses of all sizes."

    return f"AI Response: {message}"
