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

        def handle_tool(tool):
            """Show tool inputs for display tools like show_media"""
            import json

            # For show_media, parse and display what's being shown
            if hasattr(tool, "name") and "show_media" in str(tool.name).lower():
                if hasattr(tool, "input") and tool.input:
                    try:
                        input_data = json.loads(tool.input) if isinstance(tool.input, str) else tool.input
                        if "outputs" in input_data:
                            print("\n")  # Line gap before all videos
                            for output in input_data["outputs"]:
                                print(f"🎬 {output.get('title', 'Media')}")
                                if output.get('description'):
                                    print(f"   {output['description']}")
                                if output.get('path'):
                                    print(f"   {output['path']}")
                                print()  # Empty line between each video
                    except:
                        pass

        def handle_tool_complete(data):
            """Show actual tool output content (ReadMedia, bash, etc.)"""
            # Show actual tool output if available (skip empty/completion-only messages)
            if hasattr(data, "progress") and data.progress and "Completed" not in data.progress:
                print(f"\n\n{data.progress}")

        def handle_content(text):
            """Print content with proper line breaks"""
            # Replace periods followed by "Now" with period + newline + "Now"
            import re
            text = re.sub(r'(\.)([A-Z])', r'\1\n\2', text)
            print(text, end="", flush=True)

        await stream_and_send(
            mix,
            session_id=session.id,
            message=user_msg,
            on_thinking=lambda text: print(text, end="", flush=True),
            on_content=handle_content,
            on_tool=handle_tool,
            on_tool_execution_complete=handle_tool_complete,
            on_error=lambda error: print(f"\n❌ {error}"),
        )


if __name__ == "__main__":
    asyncio.run(main())
