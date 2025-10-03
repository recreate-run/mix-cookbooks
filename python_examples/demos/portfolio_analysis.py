#!/usr/bin/env python3
from mix_python_sdk import Mix
import os
from pathlib import Path
from dotenv import load_dotenv
from utils import stream_message


def main():
    load_dotenv()

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        mix.authentication.store_api_key(api_key=api_key, provider="openrouter")
        mix.preferences.update_preferences(
            preferred_provider="openrouter",
            main_agent_model="openrouter.deepseek-v3.1",
        )
        session = mix.sessions.create(title="Portfolio Analysis Q4 2024")

        csv_path = (
            Path(__file__).parent.parent.parent / "sample_files/robinhood_portfolio.csv"
        ).resolve()
        with open(csv_path, "rb") as f:
            file_info = mix.files.upload_session_file(
                id=session.id,
                file={
                    "file_name": csv_path.name,
                    "content": f,
                    "content_type": "text/csv",
                },
            )

        stream_message(
            mix,
            session.id,
            f"Look at my portfolio in the data in @{file_info.url} and find the top winners and losers in Q4. Show the three most relevant plots. Think hard.",
        )


if __name__ == "__main__":
    main()
