#!/usr/bin/env python3
"""Web search multimodal demo - find and download video clips."""

import asyncio
import os, re, sys
from pathlib import Path
from dotenv import load_dotenv
from mix_python_sdk import Mix
from mix_python_sdk.helpers import send_with_callbacks
from mix_python_sdk.tool_models import MediaShowcaseParams, CoreToolName

# Add parent directory to path for utils import
sys.path.insert(0, str(Path(__file__).parent.parent))
from utils import upload_to_storage


async def main():
    load_dotenv()

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        session = mix.sessions.create(title="Web search multimodal demo")

        downloaded_files = []

        def handle_tool(t):
            if t.name != CoreToolName.SHOW_MEDIA or not t.input:
                return
            for o in MediaShowcaseParams.model_validate_json(t.input).outputs:
                print(f"\n{o.title}\n   {o.description or ''}\n   {o.path or ''}\n")
                if o.path:
                    downloaded_files.append(o.path)

        await send_with_callbacks(
            mix,
            session_id=session.id,
            message="First, find the top 3 karpathy LLM videos, then find the most important 10 second section from each video. After that, download the sections and show it.",
            on_tool=handle_tool,
            on_content=lambda text: print(
                re.sub(r"(\.)([A-Z])", r"\1\n\2", text), end="", flush=True
            ),
            on_error=lambda error: print(f"\n❌ {error}"),
        )

        # Upload downloaded files to the storage(local/supabase)
        # if downloaded_files:
        #     for file_url in downloaded_files:
        #         await upload_to_storage(mix, session.id, file_url)


if __name__ == "__main__":
    asyncio.run(main())
