/**
 * High-level helper functions for Mix TypeScript SDK that simplify common patterns.
 * Provides ergonomic APIs for streaming interactions.
 */

import type { Mix } from "mix-typescript-sdk";

export interface StreamCallbacks {
  onThinking?: (text: string) => void;
  onContent?: (text: string) => void;
  onTool?: (tool: any) => void;
  onToolExecutionStart?: (data: any) => void;
  onToolExecutionComplete?: (data: any) => void;
  onError?: (error: string) => void;
  onPermission?: (data: any) => void;
  onComplete?: () => void;
  // New v0.8.x event handlers
  onUserMessageCreated?: (data: any) => void;
  onSessionCreated?: (data: any) => void;
  onSessionDeleted?: (data: any) => void;
  onToolParameterDelta?: (data: any) => void;
  onHeartbeat?: () => void;
  onConnected?: () => void;
}

/**
 * Send a message via streaming with callbacks for different event types.
 * This is the TypeScript equivalent of the Python send_with_callbacks helper.
 */
export async function sendWithCallbacks(
  mix: Mix,
  sessionId: string,
  message: string,
  callbacks: StreamCallbacks = {},
  planMode = false
): Promise<void> {
  const {
    onThinking,
    onContent,
    onTool,
    onToolExecutionStart,
    onToolExecutionComplete,
    onError,
    onPermission,
    onComplete,
    onUserMessageCreated,
    onSessionCreated,
    onSessionDeleted,
    onToolParameterDelta,
    onHeartbeat,
    onConnected,
  } = callbacks;

  // Start the event stream
  const streamResponse = await mix.streaming.streamEvents({
    sessionId,
  });

  // Allow stream connection to establish
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Start sending the message in parallel with stream processing
  const sendPromise = mix.messages.send({
    id: sessionId,
    requestBody: {
      text: message,
      planMode,
    },
  });

  try {
    // Process events from the stream
    for await (const event of streamResponse.result) {
      if (!event.data) continue;

      const eventType = event.event;
      const eventData = event.data;

      switch (eventType) {
        case "thinking":
          if (onThinking && eventData.content) {
            onThinking(eventData.content);
          }
          break;

        case "content":
          if (onContent && eventData.content) {
            onContent(eventData.content);
          }
          break;

        case "tool":
          if (onTool) {
            onTool(eventData);
          }
          break;

        case "tool_execution_start":
          if (onToolExecutionStart) {
            onToolExecutionStart(eventData);
          }
          break;

        case "tool_execution_complete":
          if (onToolExecutionComplete) {
            onToolExecutionComplete(eventData);
          }
          break;

        case "error":
          if (onError && eventData.error) {
            onError(eventData.error);
          }
          break;

        case "permission":
          if (onPermission) {
            onPermission(eventData);
          }
          break;

        case "user_message_created":
          if (onUserMessageCreated) {
            onUserMessageCreated(eventData);
          }
          break;

        case "session_created":
          if (onSessionCreated) {
            onSessionCreated(eventData);
          }
          break;

        case "session_deleted":
          if (onSessionDeleted) {
            onSessionDeleted(eventData);
          }
          break;

        case "tool_parameter_delta":
          if (onToolParameterDelta) {
            onToolParameterDelta(eventData);
          }
          break;

        case "heartbeat":
          if (onHeartbeat) {
            onHeartbeat();
          }
          break;

        case "connected":
          if (onConnected) {
            onConnected();
          }
          break;

        case "complete":
          if (onComplete) {
            onComplete();
          }
          // Wait for send to complete before exiting
          await sendPromise;
          return;
      }
    }

    // If stream ends without complete event, wait for send
    await sendPromise;
  } catch (error: any) {
    if (onError) {
      onError(error.message || String(error));
    } else {
      throw error;
    }
  }
}
