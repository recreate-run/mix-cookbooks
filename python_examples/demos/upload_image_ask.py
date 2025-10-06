import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from mix_python_sdk import Mix
from mix_python_sdk.helpers import stream_and_send


def upload_sample_image(mix, session_id: str) -> str:
    """Upload sample.jpg to the session"""
    # Get the path to sample_files directory relative to this script
    script_dir = Path(__file__).parent
    image_path = script_dir / "../../sample_files/sample.jpg"
    image_path = image_path.resolve()

    with open(image_path, "rb") as f:
        image_file_info = mix.files.upload_session_file(
            id=session_id,
            file={
                "file_name": "sample.jpg",
                "content": f,
                "content_type": "image/jpeg",
            },
        )
    print(f"✅ Uploaded File URL: {image_file_info.url}")
    return image_file_info.url


async def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.system.get_health()
        # mix.authentication.store_api_key(api_key=api_key, provider="anthropic")
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        # session creation
        session = mix.sessions.create(title="Image Analysis Demo")

        # Upload sample image
        uploaded_file_url = upload_sample_image(mix, session.id)

        # Ask about the uploaded image
        user_msg = f"Explain {uploaded_file_url}"

        def handle_tool_complete(data):
            """Only show actual tool output content, skip completion messages"""
            # Only print if there's actual output content (not just completion status)
            if hasattr(data, "output") and data.output:
                print(f"\n{data.output}")
            elif hasattr(data, "result") and data.result:
                print(f"\n{data.result}")

        await stream_and_send(
            mix,
            session_id=session.id,
            message=user_msg,
            on_thinking=lambda text: print(text, end="", flush=True),
            on_content=lambda text: print(text, end="", flush=True),
            on_tool_execution_complete=handle_tool_complete,
            on_error=lambda error: print(f"\n❌ {error}"),
        )


if __name__ == "__main__":
    asyncio.run(main())
