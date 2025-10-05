import asyncio
import os
from dotenv import load_dotenv
from mix_python_sdk import Mix
from mix_python_sdk.helpers import stream_and_send


async def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    user_msg = "Find the top cat video and create a 5 sec tiktok video from it. Add a title animation. Export it and show ."

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.system.get_health()
        # mix.authentication.store_api_key(api_key=api_key, provider="anthropic")
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        # session creation
        session = mix.sessions.create(title="Streaming Demo")

        await stream_and_send(
            mix,
            session_id=session.id,
            message=user_msg,
            on_thinking=lambda text: print(text, end="", flush=True),
            on_content=lambda text: print(text, end="", flush=True),
            on_tool=lambda tool: print(f"\n🔧 {tool.name}: {tool.status}"),
            on_error=lambda error: print(f"\n❌ {error}"),
        )


if __name__ == "__main__":
    asyncio.run(main())
