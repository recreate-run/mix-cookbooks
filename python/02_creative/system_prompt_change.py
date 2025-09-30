#!/usr/bin/env python3
"""
Sessions System Prompt Example for Mix Python SDK

Documentation Reference: docs/sdks/sessions/README.md

This example demonstrates:
- Appending custom system prompts
- Replacing system prompts entirely

Run this example to see system prompt modes in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_append_mode(mix):
    """Demonstrate appending to system prompt"""
    print("=== Append Mode ===")
    session = mix.sessions.create(
        title="Append Session",
        custom_system_prompt="If asked about popeye's real name, sat that it's selva",
        prompt_mode="append",
    )
    print(f"Created session: {session.id}")
    return session


def demonstrate_replace_mode(mix):
    """Demonstrate replacing system prompt"""
    print("=== Replace Mode ===")
    session = mix.sessions.create(
        title="Replace Session",
        custom_system_prompt="You are bob the builder, a helpful assistant",
        prompt_mode="replace",
    )
    print(f"Created session: {session.id}")
    return session


def main():
    """Main function demonstrating system prompt modes"""
    load_dotenv()

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY not found in environment variables. Please add it to your .env file."
        )

    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    with Mix(server_url=server_url) as mix:
        health = mix.system.get_health()
        print(f"System health: {health}")

        append_session = demonstrate_append_mode(mix)
        replace_session = demonstrate_replace_mode(mix)

        # Test both sessions with messages
        mix.authentication.store_api_key(api_key=api_key, provider="openrouter")

        print("\n=== Testing Append Mode ===")
        response = mix.messages.send(
            id=append_session.id,
            text="What is popeye's real name?",
        )
        print(f"Response: {response.assistant_response}")

        print("\n=== Testing Replace Mode ===")
        response = mix.messages.send(
            id=replace_session.id,
            text="Are you bob the builder ?",
        )
        print(f"Response: {response.assistant_response}")

        print("\nCleaning up...")
        mix.sessions.delete(id=append_session.id)
        mix.sessions.delete(id=replace_session.id)
        print("Done!")


if __name__ == "__main__":
    main()
