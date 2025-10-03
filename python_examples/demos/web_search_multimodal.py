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
        mix.preferences.update_preferences(
            preferred_provider="openrouter",
            main_agent_model="openrouter.zai-glm-4.6",
        )

        # session creation
        session = mix.sessions.create(title="Streaming Demo")
        stream_message(mix, session.id, user_msg)


if __name__ == "__main__":
    main()
