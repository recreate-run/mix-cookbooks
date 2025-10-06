#!/usr/bin/env python3
"""Web search multimodal demo - find and download video clips."""

import asyncio
import os
from dotenv import load_dotenv
from mix_python_sdk import Mix
from utils import stream_message


async def main():
    load_dotenv()

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        session = mix.sessions.create(title="Web search multimodal demo")

        await stream_message(
            mix,
            session.id,
            "First, find the top 3 karpathy LLM videos, then find the most important 10 second section from each video. After that, download the sections and show it."
        )


if __name__ == "__main__":
    asyncio.run(main())
