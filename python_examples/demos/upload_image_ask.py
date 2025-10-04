"""Streaming example demonstrating image upload and AI analysis via SSE connection."""

from mix_python_sdk import Mix
import os
from pathlib import Path
from dotenv import load_dotenv
from utils import stream_message


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


def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
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

        stream_message(mix, session.id, user_msg)


if __name__ == "__main__":
    main()
