"""Shared utilities for Mix Python SDK examples."""

import asyncio
from mix_python_sdk.models import (
    SSEThinkingEvent,
    SSEContentEvent,
    SSEToolEvent,
    SSEErrorEvent,
    SSECompleteEvent,
)


async def stream_message(mix, session_id: str, message: str) -> None:
    """Send message via streaming and process events"""
    stream_response = await mix.streaming.stream_events_async(session_id=session_id)
    await asyncio.sleep(0.5)

    thinking_started = content_started = False

    async with stream_response.result as event_stream:

        async def process_events():
            nonlocal thinking_started, content_started
            async for event in event_stream:
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

        await asyncio.gather(
            mix.messages.send_async(id=session_id, text=message),
            process_events(),
        )
