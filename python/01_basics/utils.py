#!/usr/bin/env python3
"""Shared utilities for Mix Python SDK examples."""

from mix_python_sdk.models import (
    SendMessageRequestBody,
    SSEThinkingEvent,
    SSEContentEvent,
    SSEToolEvent,
    SSEErrorEvent,
    SSEEventStream,
    SSECompleteEvent,
)
import json


def stream_message(mix, session_id: str, message: str) -> None:
    """Send message via streaming and process events"""
    stream_response = mix.streaming.stream_events(session_id=session_id)
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
                if not content_started:
                    if thinking_started:
                        print("\n📝 Response: ", end="", flush=True)
                    else:
                        print("📝 Response: ", end="", flush=True)
                    content_started = True
                print(event.data.content, end="", flush=True)
            elif isinstance(event, SSEToolEvent):
                print(f"\n🔧 Tool: {event.data.name} - {event.data.status}")
                if event.data.input:
                    print(f"   Parameters: {event.data.input}")
            elif isinstance(event, SSEErrorEvent):
                print(f"\n❌ Error: {event.data.error}")
                break
            elif isinstance(event, SSECompleteEvent):
                break