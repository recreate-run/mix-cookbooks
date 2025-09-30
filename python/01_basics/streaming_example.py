#!/usr/bin/env python3
"""Minimal streaming example demonstrating SSE connection, message sending, and event processing."""

from mix_python_sdk import Mix
from mix_python_sdk.models import (
    SendMessageRequestBody,
    SSEThinkingEvent,
    SSEContentEvent,
    SSEToolEvent,
    SSEToolExecutionStartEvent,
    SSEToolExecutionCompleteEvent,
    SSECompleteEvent,
    SSEErrorEvent,
    SSEPermissionEvent,
    SSEEventStream,
)
import os
from dotenv import load_dotenv
import json
import time


def stream_message(mix, session_id: str, message: str) -> None:
    """Send message via streaming and process events"""
    stream_response = mix.streaming.stream_events(session_id=session_id)
    time.sleep(2)

    mix.streaming.send_streaming_message(
        id=session_id,
        content=json.dumps(SendMessageRequestBody(text=message).model_dump()),
    )

    thinking_started = content_started = False

    with stream_response.result as event_stream:
        event: SSEEventStream
        for event in event_stream:
            if isinstance(event, SSEThinkingEvent):
                if not thinking_started:
                    print("🤔 Thinking: ", end="", flush=True)
                    thinking_started = True
                print(event.data.content, end="", flush=True)
            elif isinstance(event, SSEContentEvent):
                if thinking_started and not content_started:
                    print("\n📝 Response: ", end="", flush=True)
                    content_started = True
                elif not content_started:
                    print("📝 Response: ", end="", flush=True)
                    content_started = True
                print(event.data.content, end="", flush=True)
            elif isinstance(event, SSEToolEvent):
                print(f"\n🔧 Tool: {event.data.name} - {event.data.status}")
                if event.data.input:
                    print(f"   Parameters: {event.data.input}")
            elif isinstance(event, SSEToolExecutionStartEvent):
                if hasattr(event.data, "progress") and event.data.progress:
                    print(f"   Progress: {event.data.progress}")
            elif isinstance(event, SSEToolExecutionCompleteEvent):
                # Display the actual tool content
                if hasattr(event.data, "progress") and event.data.progress:
                    if event.data.success:
                        print(f"📄 Result:\n{event.data.progress}")
                    else:
                        print(f"❌ Error:\n{event.data.progress}")
            elif isinstance(event, SSEErrorEvent):
                print(f"\n❌ Error: {event.data.error}")
            elif isinstance(event, SSEPermissionEvent):
                print(f"\n🔐 Permission: {event.data.tool_name}")
            elif isinstance(event, SSECompleteEvent):
                if content_started:
                    print("\n")
                print("✅ Complete!")
                break


def main():
    load_dotenv()
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables")

    user_msg = "what's your working dir?"

    with Mix(server_url=os.getenv("MIX_SERVER_URL", "http://localhost:8088")) as mix:
        mix.system.get_health()
        mix.authentication.store_api_key(api_key=api_key, provider="openrouter")
        session = mix.sessions.create(title="Streaming Demo")
        stream_message(mix, session.id, user_msg)
        mix.sessions.delete(id=session.id)


if __name__ == "__main__":
    main()
