#!/usr/bin/env python3
"""
Sessions Example for Mix Python SDK

Documentation Reference: docs/sdks/sessions/README.md

This example demonstrates comprehensive session lifecycle management including:
- Complete session lifecycle (create, get, list, delete)
- Session forking with message index specification
- Processing cancellation for long-running operations
- Session metadata and usage statistics analysis
- Working directory management and isolation
- Session cleanup and resource management

Run this example to see all sessions methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_session_listing(mix):
    """Demonstrate session listing with metadata analysis"""
    print("\n=== Session Listing Demo ===")

    print("1. Listing all existing sessions...")
    sessions = mix.sessions.list()
    print(f"Found {len(sessions)} existing sessions")

    if sessions:
        print("\nExisting sessions overview:")
        for session in sessions:
            print(f"  ID: {session.id}")
            print(f"  Title: {session.title}")
            print(f"  Created: {session.created_at}")
            print(
                f"  Messages: {session.user_message_count} user, {session.assistant_message_count} assistant"
            )
            print(
                f"  Tokens: {session.prompt_tokens} prompt, {session.completion_tokens} completion"
            )
            print(f"  Cost: ${session.cost:.4f}")
            print(f"  Tool calls: {session.tool_call_count}")
            if session.first_user_message:
                print(f"  First message: {session.first_user_message[:100]}...")
            print()


def demonstrate_session_creation(mix):
    """Demonstrate session creation with different configurations"""
    print("\n=== Session Creation Demo ===")

    print("1. Creating basic session...")
    basic_session = mix.sessions.create(title="Basic Demo Session")
    print(f"Created basic session: {basic_session.id}")
    print(f"Title: {basic_session.title}")
    print(f"Created at: {basic_session.created_at}")

    print("\n2. Creating another session with longer title...")
    advanced_session = mix.sessions.create(title="Advanced Demo Session for Testing")
    print(f"Created advanced session: {advanced_session.id}")
    print(f"Title: {advanced_session.title}")
    print(f"Created at: {advanced_session.created_at}")

    return basic_session, advanced_session


def demonstrate_session_retrieval(mix, session_id):
    """Demonstrate session retrieval and detailed inspection"""
    print("\n=== Session Retrieval Demo ===")

    print(f"1. Retrieving session details for ID: {session_id}")
    session = mix.sessions.get(id=session_id)
    print("Session retrieved successfully!")

    print("\nDetailed session information:")
    for key, value in session.__dict__.items():
        print(f"  {key}: {value}")


def demonstrate_session_messaging(mix, session_id, api_key):
    """Demonstrate using session for messaging to generate activity"""
    print("\n=== Session Messaging Demo ===")

    print(f"1. Sending message to session {session_id}...")

    # Store API key for messaging
    mix.authentication.store_api_key(api_key=api_key, provider="openrouter")

    # Send a simple message to generate session activity
    response = mix.messages.send(
        id=session_id,
        text="Hello! This is a test message for the sessions example. Please respond briefly.",
    )
    print("Message sent successfully!")
    print(f"Response: {response.assistant_response[:200]}...")

    # Send another message to create more activity
    response2 = mix.messages.send(
        id=session_id, text="Can you tell me what 2+2 equals?"
    )
    print("Second message sent!")
    print(f"Response: {response2.assistant_response[:100]}...")


def demonstrate_session_forking(mix, source_session_id):
    """Demonstrate session forking with message history"""
    print("\n=== Session Forking Demo ===")

    print(f"1. Checking messages in source session {source_session_id}...")
    messages = mix.messages.list_session(id=source_session_id)
    message_count = len(messages)
    print(f"Source session has {message_count} messages")

    print("\n2. Forking session at message index 1...")
    forked_session = mix.sessions.fork(
        id=source_session_id,
        message_index=1,
        title="Forked Session - First Message Only",
    )
    print(f"Forked session created: {forked_session.id}")
    print(f"Forked session title: {forked_session.title}")

    # Verify forked session has fewer messages
    forked_messages = mix.messages.list_session(id=forked_session.id)
    print(f"Forked session has {len(forked_messages)} messages")

    if len(forked_messages) != 1:
        raise RuntimeError(
            f"Session forking failed: expected 1 message in forked session, got {len(forked_messages)}"
        )

    return forked_session


def demonstrate_session_metadata_analysis(mix, session_id):
    """Demonstrate session metadata and usage statistics analysis"""
    print("\n=== Session Metadata Analysis Demo ===")

    print(f"1. Analyzing session {session_id} after messaging activity...")
    session = mix.sessions.get(id=session_id)

    print("\nUsage Statistics:")
    print(f"  User messages: {session.user_message_count}")
    print(f"  Assistant messages: {session.assistant_message_count}")
    print(f"  Total tool calls: {session.tool_call_count}")

    print("\nToken Usage:")
    print(f"  Prompt tokens: {session.prompt_tokens}")
    print(f"  Completion tokens: {session.completion_tokens}")
    print(f"  Total tokens: {session.prompt_tokens + session.completion_tokens}")

    print("\nCost Analysis:")
    print(f"  Total cost: ${session.cost:.6f}")
    if session.completion_tokens > 0:
        cost_per_token = session.cost / (
            session.prompt_tokens + session.completion_tokens
        )
        print(f"  Cost per token: ${cost_per_token:.8f}")


def demonstrate_processing_cancellation(mix, session_id):
    """Demonstrate processing cancellation for long-running operations"""
    print("\n=== Processing Cancellation Demo ===")

    print(f"1. Attempting to cancel processing for session {session_id}...")
    cancel_response = mix.sessions.cancel_processing(id=session_id)
    print("Cancel response received!")

    print("Cancel response details:")
    for key, value in cancel_response.__dict__.items():
        print(f"  {key}: {value}")

    if cancel_response.cancelled:
        print("✅ Processing was cancelled successfully")
    else:
        print("ℹ️ No active processing to cancel")


def demonstrate_session_cleanup(mix, session_ids):
    """Demonstrate session deletion and cleanup operations"""
    print("\n=== Session Cleanup Demo ===")

    print(f"1. Cleaning up {len(session_ids)} demo sessions...")

    for i, session_id in enumerate(session_ids, 1):
        print(f"{i}. Deleting session {session_id}...")
        mix.sessions.delete(id=session_id)
        print(f"   Session {session_id} deleted successfully")

    print("\n2. Verifying cleanup by checking for deleted session IDs...")
    remaining_sessions = mix.sessions.list()
    remaining_ids = {s.id for s in remaining_sessions}
    failed_deletions = [sid for sid in session_ids if sid in remaining_ids]
    print(f"Sessions that failed to delete: {len(failed_deletions)}")

    if failed_deletions:
        raise RuntimeError(
            f"Session cleanup failed: {len(failed_deletions)} sessions still exist after deletion: {failed_deletions}"
        )


def main():
    """Main function demonstrating Mix SDK Sessions functionality"""
    # Load environment variables from .env file
    load_dotenv()

    # Get required API key from environment
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY not found in environment variables. Please add it to your .env file."
        )

    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    print("=" * 60)
    print("MIX PYTHON SDK - SESSIONS EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all sessions functionality")
    print("Using real OpenRouter API key from .env file")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        # Always start with system health check
        health = mix.system.get_health()
        print(f"System health: {health}")

        if health.status != "ok":
            raise RuntimeError(f"System health check failed: {health}")

        # Remove the models_available check since it's not part of the HealthCheckResponse

        # Track session IDs for cleanup
        created_session_ids = []

        # Demonstrate session listing
        demonstrate_session_listing(mix)

        # Demonstrate session creation
        basic_session, advanced_session = demonstrate_session_creation(mix)
        created_session_ids.extend([basic_session.id, advanced_session.id])

        # Demonstrate session retrieval
        demonstrate_session_retrieval(mix, basic_session.id)

        # Demonstrate session messaging to generate activity
        demonstrate_session_messaging(mix, basic_session.id, api_key)

        # Demonstrate session forking
        forked_session = demonstrate_session_forking(mix, basic_session.id)
        created_session_ids.append(forked_session.id)

        # Demonstrate metadata analysis
        demonstrate_session_metadata_analysis(mix, basic_session.id)

        # Demonstrate processing cancellation
        demonstrate_processing_cancellation(mix, basic_session.id)

        # Demonstrate session cleanup
        demonstrate_session_cleanup(mix, created_session_ids)


if __name__ == "__main__":
    main()
