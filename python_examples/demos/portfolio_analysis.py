#!/usr/bin/env python3
"""Portfolio analysis demo - analyze stock portfolio and generate plots."""

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

        session = mix.sessions.create(title="Portfolio Analysis Q4 2024")

        # Upload portfolio CSV file
        csv_path = (Path(__file__).parent.parent.parent / "sample_files/robinhood_portfolio.csv").resolve()
        with open(csv_path, "rb") as f:
            file_info = mix.files.upload_session_file(
                id=session.id,
                file={"file_name": csv_path.name, "content": f, "content_type": "text/csv"},
            )

        def handle_tool(t):
            if t.name != CoreToolName.SHOW_MEDIA: return
            if not t.input or (isinstance(t.input, str) and not t.input.strip()): return

            try:
                params = MediaShowcaseParams.model_validate_json(t.input) if isinstance(t.input, str) else MediaShowcaseParams.model_validate(t.input)
                for o in params.outputs:
                    print(f"\n{o.title}\n   {o.description or ''}\n   {o.path or ''}\n")
            except Exception:
                pass  # Ignore parsing errors for incomplete tool calls

        # Analyze portfolio
        await send_with_callbacks(
            mix,
            session_id=session.id,
            message=f"Look at my portfolio in the data in @{file_info.url} and find the top winners and losers in Q4. Show the three most relevant plots.",
            on_tool=handle_tool,
            on_content=lambda text: print(re.sub(r'(\.)([A-Z])', r'\1\n\2', text), end="", flush=True),
            on_error=lambda error: print(f"\n❌ {error}"),

        )


if __name__ == "__main__":
    asyncio.run(main())
