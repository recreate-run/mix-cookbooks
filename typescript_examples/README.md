# Mix TypeScript Examples

TypeScript demo scripts showcasing the Mix SDK capabilities, similar to the Python examples.

## Prerequisites

- Bun (recommended) or Node.js 20+
- Mix server running (default: `http://localhost:8088`)
- API keys configured (see `.env` setup below)

## Setup

1. **Install dependencies:**

```bash
bun install
```

2. **Configure environment variables:**

Create a `.env` file in the `typescript_examples` directory (or use the parent `.env` from `mix-cookbooks`):

```bash
MIX_SERVER_URL=http://localhost:8088
```

## Available Demos

### 1. Portfolio Analysis

Analyze a stock portfolio CSV and generate visualization plots.

```bash
bun run demo:portfolio
```

**Features:**
- Uploads CSV file to session
- Analyzes portfolio performance
- Generates plots for winners/losers
- Handles media showcase tool events

### 2. TikTok Video Creation

Find a video online and create a short TikTok-style clip.

```bash
bun run demo:tiktok
```

**Features:**
- Web search for videos
- Video editing and trimming
- Adding title animations
- Exporting final video

### 3. Image Upload & Analysis

Upload an image and ask questions about it.

```bash
bun run demo:image
```

**Features:**
- Upload image files to session
- Multimodal analysis with vision models
- Natural language Q&A about images

### 4. Web Search Multimodal

Search for videos, extract important sections, and download clips.

```bash
bun run demo:web-search
```

**Features:**
- Web search for specific content
- Video section extraction
- Batch downloading of clips
- Optional storage upload

## Project Structure

```
typescript_examples/
├── demos/                         # Demo scripts
│   ├── portfolio_analysis.ts
│   ├── tiktok_video.ts
│   ├── upload_image_ask.ts
│   └── web_search_multimodal.ts
├── helpers.ts                     # High-level streaming helpers
├── utils.ts                       # Utility functions
├── package.json
└── README.md
```

## Key Files

### `helpers.ts`

Provides `sendWithCallbacks()` - a high-level function for streaming interactions with event callbacks:

```typescript
await sendWithCallbacks(mix, sessionId, message, {
  onThinking: (text) => console.log(text),
  onContent: (text) => console.log(text),
  onTool: (tool) => console.log(tool.name),
  onError: (error) => console.error(error),
  onComplete: () => console.log("Done!"),
});
```

### `utils.ts`

Utility functions for common tasks:
- `uploadToStorage()` - Download and upload files to session storage

## Development

### Run a specific demo:

```bash
# Using bun scripts (recommended)
bun run demo:portfolio
bun run demo:tiktok
bun run demo:image
bun run demo:web-search

# Or directly with bun
bun run demos/portfolio_analysis.ts
```

### Create a new demo:

1. Create a new `.ts` file in `demos/`
2. Import required modules and helpers
3. Add a script entry in `package.json`
4. Follow the pattern from existing demos

