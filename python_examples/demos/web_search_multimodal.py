import asyncio
import os
from dotenv import load_dotenv
from mix_python_sdk import Mix
from mix_python_sdk.helpers import stream_and_send


async def main():
    load_dotenv()

    user_msg = "First, find the top 3 karpathy LLM videos , and then find the most important 10 second section from each video. after that, download the sections and show it."

    async with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.system.get_health()
        # mix.authentication.store_api_key(api_key=api_key, provider="anthropic")
        mix.preferences.update_preferences(
            preferred_provider="anthropic",
            main_agent_model="claude-sonnet-4-5",
        )

        # session creation
        session = mix.sessions.create(title="Web search multimodal demo")

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
