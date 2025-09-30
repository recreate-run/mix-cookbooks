#!/usr/bin/env python3
"""
Messages Example for Mix Python SDK

Documentation Reference: docs/sdks/messages/README.md

This example demonstrates comprehensive messaging functionality including:
- Global message history retrieval with pagination support
- Session-specific message listing and filtering
- Interactive message sending with AI response handling
- Tool integration during conversations
- Message metadata analysis (reasoning, tool calls, tokens)
- Conversation continuity and context management

Run this example to see all messages methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_global_message_history(mix):
    """Demonstrate global message history retrieval with pagination."""
    print("=== Global Message History Demo ===")

    # Get first page of message history
    print("Fetching first 10 messages from global history...")
    history_page1 = mix.messages.get_history(limit=10, offset=0)
    print(f"Retrieved {len(history_page1)} messages from page 1")

    if history_page1:
        print("Sample message from page 1:")
        sample_msg = history_page1[0]
        for key, value in sample_msg.__dict__.items():
            print(f"  {key}: {value}")

    # Get second page if there are more messages
    print("\nFetching next 10 messages from global history...")
    history_page2 = mix.messages.get_history(limit=10, offset=10)
    print(f"Retrieved {len(history_page2)} messages from page 2")

    return history_page1


def demonstrate_session_message_listing(mix, session_id):
    """Demonstrate session-specific message listing."""
    print("=== Session Message Listing Demo ===")

    print(f"Listing all messages from session: {session_id}")
    session_messages = mix.messages.list_session(id=session_id)
    print(f"Found {len(session_messages)} messages in this session")

    for i, message in enumerate(session_messages):
        print(f"\nMessage {i + 1}:")
        for key, value in message.__dict__.items():
            print(f"  {key}: {value}")

    return session_messages


def demonstrate_interactive_messaging(mix, session_id):
    """Demonstrate interactive message sending with AI response handling."""
    print("=== Interactive Messaging Demo ===")

    # Send a simple question
    print(f"Sending message to session: {session_id}")
    user_message = "What is the capital of France?"
    print(f"User message: {user_message}")

    response = mix.messages.send(
        id=session_id,
        text=user_message,
    )
    print("AI Response received:")
    for key, value in response.__dict__.items():
        print(f"  {key}: {value}")

    # Send a follow-up message
    print("\nSending follow-up message...")
    followup_message = "What is the population of that city?"
    print(f"User message: {followup_message}")

    followup_response = mix.messages.send(id=session_id, text=followup_message)
    print("AI Follow-up Response received:")
    for key, value in followup_response.__dict__.items():
        print(f"  {key}: {value}")

    return [response, followup_response]


def demonstrate_tool_integration_analysis(mix, session_id):
    """Demonstrate tool integration and analysis of tool calls in messages."""
    print("=== Tool Integration Analysis Demo ===")

    # Send a message that might trigger tool usage
    print(f"Sending tool-triggering message to session: {session_id}")
    tool_message = "Can you help me analyze some data or perform a calculation?"
    print(f"User message: {tool_message}")

    response = mix.messages.send(id=session_id, text=tool_message)
    print("Tool Response received:")
    for key, value in response.__dict__.items():
        print(f"  {key}: {value}")
        if key == "tool_calls" and value:
            print("  Tool calls detected:")
            for i, tool_call in enumerate(value):
                print(f"    Tool call {i + 1}:")
                for tool_key, tool_value in tool_call.__dict__.items():
                    print(f"      {tool_key}: {tool_value}")

    return response


def demonstrate_message_metadata_analysis(mix, session_id):
    """Demonstrate analysis of message metadata including reasoning and timing."""
    print("=== Message Metadata Analysis Demo ===")

    # Get all messages from the session
    session_messages = mix.messages.list_session(id=session_id)

    print(f"Analyzing metadata for {len(session_messages)} messages in session:")

    total_reasoning_time = 0
    messages_with_reasoning = 0
    messages_with_tools = 0

    for i, message in enumerate(session_messages):
        print(f"\nMessage {i + 1} metadata:")
        # Analyze reasoning
        if message.reasoning:
            print("  Has reasoning: Yes")
            if message.reasoning_duration:
                print(f"  Reasoning duration: {message.reasoning_duration}ms")
                total_reasoning_time += message.reasoning_duration
                messages_with_reasoning += 1
        else:
            print("  Has reasoning: No")

        # Analyze tool calls
        if message.tool_calls:
            print(f"  Tool calls: {len(message.tool_calls)}")
            messages_with_tools += 1
        else:
            print("  Tool calls: 0")

        # Show role and content info
        print(f"  Role: {message.role}")
        if message.user_input:
            print(f"  User input length: {len(message.user_input)} chars")
        if message.assistant_response:
            print(
                f"  Assistant response length: {len(message.assistant_response)} chars"
            )

    # Summary statistics
    print("\n=== Session Statistics ===")
    print(f"Total messages: {len(session_messages)}")
    print(f"Messages with reasoning: {messages_with_reasoning}")
    print(f"Messages with tool calls: {messages_with_tools}")
    if messages_with_reasoning > 0:
        avg_reasoning_time = total_reasoning_time / messages_with_reasoning
        print(f"Average reasoning time: {avg_reasoning_time:.2f}ms")
    print(f"Total reasoning time: {total_reasoning_time}ms")

    return session_messages


def demonstrate_conversation_continuity(mix, session_id):
    """Demonstrate conversation continuity and context management."""
    print("=== Conversation Continuity Demo ===")

    # Send a series of related messages to test context
    print(f"Testing conversation continuity in session: {session_id}")

    # Establish context
    print("\n1. Establishing context...")
    context_msg = (
        "Let's talk about Python programming. I'm working on a web application."
    )
    print(f"User: {context_msg}")
    response1 = mix.messages.send(id=session_id, text=context_msg)
    print(f"Assistant: {response1.assistant_response}")

    # Reference previous context
    print("\n2. Referencing previous context...")
    context_ref_msg = "What framework would you recommend for that?"
    print(f"User: {context_ref_msg}")
    response2 = mix.messages.send(id=session_id, text=context_ref_msg)
    print(f"Assistant: {response2.assistant_response}")

    # Continue conversation thread
    print("\n3. Continuing conversation thread...")
    continue_msg = "Can you give me a specific example?"
    print(f"User: {continue_msg}")
    response3 = mix.messages.send(id=session_id, text=continue_msg)
    print(f"Assistant: {response3.assistant_response}")

    # Verify conversation flow by listing final messages
    print("\n4. Verifying conversation flow...")
    final_messages = mix.messages.list_session(id=session_id)
    print(f"Session now contains {len(final_messages)} messages total")

    return [response1, response2, response3]


def main():
    """Main function to run all message examples."""
    load_dotenv()

    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")
    print(f"Connecting to Mix server at: {server_url}")

    with Mix(server_url=server_url) as mix:
        # Check system health
        health = mix.system.get_health()
        print(f"System health: {health}")
        print()

        # Create a session for message operations
        print("Creating session for message examples...")
        session = mix.sessions.create(title="Messages Example Session")
        session_id = session.id
        print(f"Created session: {session_id}")
        print()

        try:
            # Run all demonstrations
            demonstrate_global_message_history(mix)
            print()

            demonstrate_session_message_listing(mix, session_id)
            print()

            demonstrate_interactive_messaging(mix, session_id)
            print()

            demonstrate_tool_integration_analysis(mix, session_id)
            print()

            demonstrate_message_metadata_analysis(mix, session_id)
            print()

            demonstrate_conversation_continuity(mix, session_id)
            print()

            print("=== All Messages Examples Completed Successfully ===")

        finally:
            # Clean up the session
            print(f"Cleaning up session: {session_id}")
            mix.sessions.delete(id=session_id)
            print("Session deleted successfully")


if __name__ == "__main__":
    main()
