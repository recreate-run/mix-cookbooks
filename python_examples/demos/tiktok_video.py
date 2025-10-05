"""Minimal streaming example demonstrating SSE connection, message sending, and event processing."""

import asyncio
import os
from dotenv import load_dotenv
from mix_python_sdk import Mix
from utils import stream_message


async def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    user_msg = "Find the top cat video and create a 5 sec tiktok video from it. Add a title animation. Export it and show ."

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.system.get_health()
        # mix.authentication.store_api_key(api_key=api_key, provider="anthropic")
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        # session creation
        session = mix.sessions.create(title="Streaming Demo")
        await stream_message(mix, session.id, user_msg)


if __name__ == "__main__":
    asyncio.run(main())
