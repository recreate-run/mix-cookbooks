# Mix + TanStack Start Template

## What This Template Provides

This is a fully-configured TanStack Start application with Mix SDK integration. Everything you need to build AI-powered webapps is already set up.

### Pre-configured Stack

**Frontend Framework:**
- React 19 with TypeScript
- TanStack Start (SSR framework)
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- Tailwind CSS v4
- Radix UI components (50+ components via Shadcn)

**Mix SDK Integration:**
- Mix TypeScript SDK v0.8.8 (already installed)
- Mix client singleton (`src/lib/mix-client.ts`)
- Streaming utilities (`src/lib/mix-streaming.ts`)
- Server-side API route patterns

**Developer Tools:**
- Biome (linting & formatting)
- TypeScript strict mode
- Vite dev server with HMR
- TanStack DevTools

### Project Structure

```
src/
├── routes/              # File-based routing
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   └── api/            # API routes (create these)
├── components/
│   ├── ui/             # 50+ Shadcn components
│   └── [custom]/       # Your components go here
├── lib/
│   ├── mix-client.ts   # Mix SDK singleton
│   ├── mix-streaming.ts # Streaming helpers
│   └── utils.ts        # Utility functions
├── data/               # Data/types (create as needed)
└── integrations/       # TanStack Query setup
```

---

## Mix SDK Integration Guide

### What is Mix?

Mix is an AI agent SDK that provides:
- **Multi-model routing**: Automatically uses the best AI model (Claude, Gemini, OpenAI)
- **Built-in streaming**: Real-time Server-Sent Events (SSE)
- **Tool system**: Web search, file handling, code execution, media analysis
- **Session management**: Persistent conversations with context
- **Production-ready**: Supabase integration for deployment

### Already Configured for You

#### 1. Mix Client (`src/lib/mix-client.ts`)

```typescript
import { getMixClient } from "~/lib/mix-client"

// Server-side only - use in API routes
const mix = getMixClient()
```

**What it does:**
- Creates singleton Mix client instance
- Reads `MIX_SERVER_URL` from environment
- Provides `initializeMixPreferences()` helper

#### 2. Streaming Utilities (`src/lib/mix-streaming.ts`)

```typescript
import { sendWithCallbacks } from "~/lib/mix-streaming"

// High-level streaming helper
await sendWithCallbacks(mix, sessionId, "Your prompt", {
  onContent: (text) => console.log(text),
  onTool: (tool) => console.log(tool),
  onComplete: () => console.log("Done!")
})
```

**Available callbacks:**
- `onThinking` - AI reasoning updates
- `onContent` - Streaming text content
- `onTool` - Tool execution events
- `onError` - Error handling
- `onComplete` - Stream finished

### How to Add Mix to Your Example

#### Step 1: Create API Routes

**Session Creation** (`src/routes/api/session.ts`):
```typescript
import { json } from "@tanstack/start"
import { createAPIFileRoute } from "@tanstack/start/api"
import { getMixClient, initializeMixPreferences } from "~/lib/mix-client"

export const Route = createAPIFileRoute("/api/session")({
  POST: async () => {
    const mix = getMixClient()
    await initializeMixPreferences(mix)

    const session = await mix.sessions.create({
      title: "My Session"
    })

    return json({ success: true, session })
  }
})
```

**SSE Streaming** (`src/routes/api/stream.$sessionId.ts`):
```typescript
import { createAPIFileRoute } from "@tanstack/start/api"
import { getMixClient } from "~/lib/mix-client"

export const Route = createAPIFileRoute("/api/stream/$sessionId")({
  GET: async ({ request, params }) => {
    const url = new URL(request.url)
    const message = url.searchParams.get("message") || ""
    const sessionId = params.sessionId

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const mix = getMixClient()

        await mix.messages.send({
          id: sessionId,
          requestBody: { text: message }
        })

        const streamResponse = await mix.streaming.streamEvents({ sessionId })

        for await (const event of streamResponse.result) {
          if (!event.data) continue

          const data = `data: ${JSON.stringify({
            type: event.event,
            content: "content" in event.data ? event.data.content : null,
            ...event.data
          })}\n\n`

          controller.enqueue(encoder.encode(data))

          if (event.event === "complete") {
            controller.close()
            break
          }
        }
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    })
  }
})
```

#### Step 2: Client-Side Integration

```typescript
"use client"

import { useState, useEffect } from "react"

export function MyComponent() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [isStreaming, setIsStreaming] = useState(false)

  // Create session
  useEffect(() => {
    async function createSession() {
      const res = await fetch("/api/session", { method: "POST" })
      const data = await res.json()
      setSessionId(data.session.id)
    }
    createSession()
  }, [])

  // Send message with streaming
  async function sendMessage(prompt: string) {
    setIsStreaming(true)
    let aiContent = ""

    const eventSource = new EventSource(
      `/api/stream/${sessionId}?message=${encodeURIComponent(prompt)}`
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "content") {
        aiContent += data.content
        // Update UI with streaming content
      }

      if (data.type === "complete") {
        setIsStreaming(false)
        eventSource.close()
      }
    }
  }
}
```

### Key Patterns

#### Pattern 1: Context Passing to AI

```typescript
// Build rich context for AI
const context = `
User Data:
- Name: ${user.name}
- Preferences: ${user.preferences}

Current State:
- Items: ${items.map(i => i.name).join(", ")}
`

const prompt = `${context}\n\nUser Question: ${userQuestion}`

// AI now has full context!
```

#### Pattern 2: Follow-up Questions

```typescript
// Keep context in follow-ups
const contextualPrompt = `Regarding the ${topic}: ${userQuestion}`

// Mix sessions maintain conversation history automatically
```

#### Pattern 3: Tool Events

```typescript
onTool: (tool) => {
  if (tool.name === "ShowMedia") {
    // AI generated a chart/visualization
    const outputs = JSON.parse(tool.input).outputs
    // Display charts to user
  }
}
```

### Environment Setup

Create `.env`:
```bash
MIX_SERVER_URL=http://localhost:8088
```

**Mix Server must be running:**
```bash
cd mix && make dev
```

---

## Development Commands

<bash_commands>
make dev          # Start dev server (autoreload + HMR)
make tail-log     # View dev.log (last 100 lines)
make typecheck    # TypeScript type checking
make clean        # Clean build artifacts
make help         # Show all commands
</bash_commands>

**Important:**
- Do NOT build manually - all output goes to `dev.log`
- Run `make tail-log` after each task to check for errors
- Dev server auto-reloads, don't stop it
- Run `make` commands from project root

## Code Style

1. **Simple & readable** - No premature optimization, minimal abstraction
2. **Never mock AI calls** - Always use real Mix SDK
3. **No backward compatibility** - Unless explicitly requested
4. **Fail fast** - Don't handle errors gracefully, raise immediately

## Common Tasks

### Add a Route
1. Create file in `src/routes/my-page.tsx`
2. TanStack Router auto-generates routing

### Add Shadcn Component
```bash
pnpx shadcn@latest add button
```

### Add API Route
1. Create file in `src/routes/api/my-endpoint.ts`
2. Export `Route` with handler
3. Use `getMixClient()` for Mix operations
