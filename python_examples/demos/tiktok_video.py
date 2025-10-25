#!/usr/bin/env python3
"""TikTok video creation demo - find video and create short clip."""

import asyncio
import os,re
from dotenv import load_dotenv
from mix_python_sdk import Mix
from mix_python_sdk.helpers import send_with_callbacks
from mix_python_sdk.tool_models import MediaShowcaseParams, CoreToolName


async def main():
    load_dotenv()

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        session = mix.sessions.create(title="TikTok Video Demo")

        def handle_tool(t):
            if t.name != CoreToolName.SHOW_MEDIA: return
            if not t.input or (isinstance(t.input, str) and not t.input.strip()): return

            try:
                params = MediaShowcaseParams.model_validate_json(t.input) if isinstance(t.input, str) else MediaShowcaseParams.model_validate(t.input)
                for o in params.outputs:
                    print(f"\n{o.title}\n   {o.description or ''}\n   {o.path or ''}\n")
            except Exception:
                pass  # Ignore parsing errors for incomplete tool calls

        await send_with_callbacks(
            mix,
            session_id=session.id,
            message="Find the top cat video and create a 5 sec tiktok video from it. Add a title animation. Export it and show.",
            on_tool=handle_tool,
            on_content=lambda text: print(re.sub(r'(\.)([A-Z])', r'\1\n\2', text), end="", flush=True),
            on_error=lambda error: print(f"\n❌ {error}"),

        )


if __name__ == "__main__":
    asyncio.run(main())
