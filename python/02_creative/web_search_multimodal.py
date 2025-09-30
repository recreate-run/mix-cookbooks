#!/usr/bin/env python3
"""Minimal streaming example demonstrating SSE connection, message sending, and event processing."""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv
from utils import stream_message


def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    user_msg = "Show me the top cat videos on youtube"

    with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.system.get_health()
        mix.authentication.store_api_key(api_key=api_key, provider="openrouter")

        # session creation
        session = mix.sessions.create(title="Streaming Demo")
        stream_message(mix, session.id, user_msg)
        mix.sessions.delete(id=session.id)


if __name__ == "__main__":
    main()
