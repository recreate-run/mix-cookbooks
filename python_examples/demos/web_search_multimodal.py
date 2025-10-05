#!/usr/bin/env python3
"""Minimal streaming example demonstrating SSE connection, message sending, and event processing."""

import asyncio
import os
from dotenv import load_dotenv
from mix_python_sdk import Mix
from utils import stream_message


async def main():
    load_dotenv()

    user_msg = "First, find the top 3 karpathy LLM videos , and then find the most important 10 second section from each video. after that, download the sections and show it."

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.system.get_health()
        # mix.authentication.store_api_key(api_key=api_key, provider="anthropic")
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        # session creation
        session = mix.sessions.create(title="Web search multimodal demo")
        await stream_message(mix, session.id, user_msg)


if __name__ == "__main__":
    asyncio.run(main())
