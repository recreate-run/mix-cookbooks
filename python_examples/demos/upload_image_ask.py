#!/usr/bin/env python3
"""Image upload and analysis demo - upload image and ask questions about it."""

import asyncio
import os,re
from pathlib import Path
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

        session = mix.sessions.create(title="Image Analysis Demo")

        # Upload image file
        image_path = (Path(__file__).parent / "../../sample_files/sample.jpg").resolve()
        with open(image_path, "rb") as f:
            file_info = mix.files.upload_session_file(
                id=session.id,
                file={"file_name": "sample.jpg", "content": f, "content_type": "image/jpeg"},
            )
        print(f"Uploaded: {file_info.url}\n")

        def handle_tool(t):
            if t.name != CoreToolName.SHOW_MEDIA or not t.input: return
            for o in MediaShowcaseParams.model_validate_json(t.input).outputs:
                print(f"\n{o.title}\n   {o.description or ''}\n   {o.path or ''}\n")

        # Ask about the image
        await send_with_callbacks(
            mix,
            session_id=session.id,
            message=f"Explain {file_info.url}",
            on_tool=handle_tool,
            on_content=lambda text: print(re.sub(r'(\.)([A-Z])', r'\1\n\2', text), end="", flush=True),
            on_error=lambda error: print(f"\n❌ {error}"),
        )


if __name__ == "__main__":
    asyncio.run(main())
