#!/usr/bin/env python3
"""Portfolio analysis example demonstrating CSV data analysis with AI-powered insights and visualizations."""

from mix_python_sdk import Mix
import os
from pathlib import Path
from dotenv import load_dotenv
from utils import stream_message


def upload_portfolio_csv(mix, session_id: str) -> str:
    """Upload Robinhood Portfolio CSV to the session"""
    # Get the path to sample_files directory relative to this script
    script_dir = Path(__file__).parent
    csv_path = script_dir / "../sample_files/Robinhood Portfolio Q4 2024.csv"
    csv_path = csv_path.resolve()

    print(f"📊 Uploading portfolio data from {csv_path.name}...")

    with open(csv_path, "rb") as f:
        file_info = mix.files.upload_session_file(
            id=session_id,
            file={
                "file_name": csv_path.name,
                "content": f,
                "content_type": "text/csv",
            },
        )
    print(f"✅ Uploaded File URL: {file_info.url}\n")
    return file_info.url


def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    with Mix(server_url=os.getenv("MIX_SERVER_URL")) as mix:
        # System health check
        mix.system.get_health()

        # Configure preferences for data analysis
        mix.preferences.update_preferences(main_agent_model="claude-4-sonnet")
        # mix.authentication.store_api_key(api_key=api_key, provider="openrouter")

        # Create session for portfolio analysis
        session = mix.sessions.create(title="Portfolio Analysis Q4 2024")
        print(f"📈 Session created: {session.title}\n")

        # Upload portfolio CSV
        uploaded_file_url = upload_portfolio_csv(mix, session.id)

        # Analysis prompt
        user_msg = f"""Look at my portfolio in the data in @{uploaded_file_url} and find the top winners and losers in Q4.

Show the three most relevant plots. Think hard."""

        print("🤔 Analyzing portfolio...\n")
        print("=" * 60)

        # Stream the analysis
        stream_message(mix, session.id, user_msg)

        print("\n" + "=" * 60)
        print(f"\n✅ Analysis complete! Session: {session.id}")
        print(f"💡 Tip: Check your Mix storage for generated plots")

        # Optionally keep the session for further analysis
        # mix.sessions.delete(id=session.id)


if __name__ == "__main__":
    main()
