#!/usr/bin/env python3
"""Web search multimodal demo - find and download video clips."""

import asyncio
import os
from dotenv import load_dotenv
from mix_python_sdk import Mix
from mix_python_sdk.helpers import send_with_callbacks
from mix_python_sdk.tool_models import MediaShowcaseParams


async def main():
    load_dotenv()

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        session = mix.sessions.create(title="Web search multimodal demo")

        def cb(t):
            if "show_media" not in t.name.lower() or not t.input: return
            for o in MediaShowcaseParams.model_validate_json(t.input).outputs:
                print(f"\n{o.title}\n   {o.description or ''}\n   {o.path or ''}\n")

        await send_with_callbacks(
            mix,
            session_id=session.id,
            message="First, find the top 3 karpathy LLM videos, then find the most important 10 second section from each video. After that, download the sections and show it.",
            on_tool=cb,
        )


if __name__ == "__main__":
    asyncio.run(main())
