#!/usr/bin/env python3
"""Image upload and analysis demo - upload image and ask questions about it."""

import asyncio
import os
from pathlib import Path
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

        session = mix.sessions.create(title="Image Analysis Demo")

        # Upload image file
        image_path = (Path(__file__).parent / "../../sample_files/sample.jpg").resolve()
        with open(image_path, "rb") as f:
            file_info = mix.files.upload_session_file(
                id=session.id,
                file={"file_name": "sample.jpg", "content": f, "content_type": "image/jpeg"},
            )
        print(f"Uploaded: {file_info.url}\n")

        # Ask about the image
        await stream_message(mix, session.id, f"Explain {file_info.url}")


if __name__ == "__main__":
    asyncio.run(main())
