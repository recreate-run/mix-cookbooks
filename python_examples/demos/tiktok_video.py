#!/usr/bin/env python3
"""TikTok video creation demo - find video and create short clip."""

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

        session = mix.sessions.create(title="TikTok Video Demo")

        await stream_message(
            mix,
            session.id,
            "Find the top cat video and create a 5 sec tiktok video from it. Add a title animation. Export it and show."
        )


if __name__ == "__main__":
    asyncio.run(main())
