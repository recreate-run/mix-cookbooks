# Mix Webapp Starter

A full-stack TanStack Start application with Mix SDK integration for building AI-powered web applications.

## Features

- 🚀 **TanStack Start** - Full-stack React framework with SSR
- 🤖 **Mix SDK Integration** - AI-powered workflows with streaming support
- 📊 **Portfolio Analysis** - Complete example with file upload and real-time AI analysis
- 🎨 **Tailwind CSS v4** - Modern styling with utility-first CSS
- 🔄 **Server-Sent Events** - Real-time streaming from Mix AI
- 📁 **File Upload** - Drag-and-drop file handling
- 🎯 **Type-Safe** - End-to-end TypeScript support

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Mix server running (see [Running Mix Server](#running-mix-server))
- Anthropic API key

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# MIX_SERVER_URL=http://localhost:8088
# ANTHROPIC_API_KEY=your_key_here
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
bun run build
bun run serve
```

## Running Mix Server

You need a Mix server running for the AI features to work.

### Option 1: With Devtools GUI (Recommended)

```bash
cd ../mix
make dev
```

### Option 2: Without Devtools

```bash
cd ..
./start_mix.sh
```

The Mix server will start on `http://localhost:8088`.

## Project Structure

```
webapp-starter/
├── src/
│   ├── routes/                    # File-based routing
│   │   ├── __root.tsx            # Root layout
│   │   ├── index.tsx             # Home page
│   │   ├── portfolio/            # Portfolio analysis example
│   │   │   ├── index.tsx         # Upload page
│   │   │   └── analyze.$sessionId.tsx  # Analysis results
│   │   ├── demo/                 # TanStack Start demo routes
│   │   └── api/                  # Server-side API routes
│   │       ├── session.ts        # Create Mix sessions
│   │       ├── upload.ts         # File upload to Mix
│   │       └── stream.$sessionId.ts  # SSE streaming
│   ├── components/
│   │   ├── portfolio/            # Portfolio-specific components
│   │   │   ├── FileUploader.tsx  # Drag-n-drop file upload
│   │   │   ├── StreamingChat.tsx # Real-time AI responses
│   │   │   └── ChartDisplay.tsx  # Chart visualization
│   │   └── Header.tsx            # App navigation
│   ├── lib/
│   │   ├── mix-client.ts         # Mix SDK server client
│   │   ├── mix-streaming.ts      # Streaming utilities
│   │   └── utils.ts              # Helper functions
│   └── styles.css                # Global styles
├── public/                        # Static assets
└── package.json
```

## Portfolio Analysis Example

The portfolio analysis feature demonstrates:

1. **File Upload** (`/portfolio`)
   - Drag-and-drop CSV upload
   - File validation
   - Mix session creation

2. **Real-Time Analysis** (`/portfolio/analyze/:sessionId`)
   - Server-Sent Events (SSE) streaming
   - Live AI responses
   - Chart/plot visualization
   - Tool output handling

### How It Works

1. User uploads a CSV file containing portfolio data
2. API creates a Mix session and uploads file to Mix storage
3. Streaming endpoint sends analysis prompt to Mix
4. AI analyzes data and generates visualizations
5. Results stream back to the UI in real-time

## API Routes

### `POST /api/session`
Create a new Mix session for AI interactions.

**Request:**
```json
{
  "title": "Session title"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session_id",
    "title": "Session title",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### `POST /api/upload`
Upload a file to Mix storage.

**Request:** `multipart/form-data`
- `file`: File to upload
- `sessionId`: Mix session ID

**Response:**
```json
{
  "success": true,
  "file": {
    "url": "storage_url",
    "name": "filename.csv",
    "size": 12345,
    "type": "text/csv"
  }
}
```

### `GET /api/stream/:sessionId?message=...`
Stream AI responses via Server-Sent Events.

**Events:**
- `thinking` - AI is processing
- `content` - Text response chunks
- `tool` - Tool usage (e.g., charts)
- `error` - Error occurred
- `complete` - Stream finished

## Environment Variables

```bash
# Mix Server
MIX_SERVER_URL=http://localhost:8088

# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here  # Optional
BRAVE_API_KEY=your_brave_api_key_here    # Optional
```

## Tech Stack

- **Framework:** TanStack Start
- **Routing:** TanStack Router (file-based)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **AI SDK:** Mix TypeScript SDK
- **Runtime:** Bun
- **Build Tool:** Vite

## Adding New Examples

To add a new AI-powered feature:

1. Create API routes in `src/routes/api/`
2. Create page routes in `src/routes/your-feature/`
3. Build reusable components in `src/components/your-feature/`
4. Add navigation link in `src/components/Header.tsx`

Follow the portfolio example structure for consistency.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing.

```bash
bun run test
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
bun run lint
bun run format
bun run check
```

## Demo Files

Files prefixed with `demo` are TanStack Start examples and can be safely deleted if you only want the Mix integration examples.

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [Mix Documentation](https://recreate.run/docs/mix-agent)
- [Mix TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
- [Mix Repository](https://github.com/recreate-run/mix)

## License

MIT
