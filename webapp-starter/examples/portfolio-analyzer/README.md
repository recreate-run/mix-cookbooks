# Portfolio Analyzer

AI-powered portfolio analysis with CSV upload, real-time streaming, and visualizations using Mix SDK and TanStack Start.

## Features

- 📁 **CSV File Upload** - Drag-and-drop portfolio data upload
- 📊 **Data Preview** - View uploaded data in a table before analysis
- 🤖 **AI Analysis** - Real-time AI-powered portfolio insights
- 📈 **Visualizations** - Auto-generated charts and plots
- 🔄 **Live Streaming** - Server-Sent Events for real-time AI responses
- 🎨 **Mix Branding** - Clean design matching Mix documentation

## Prerequisites

- Node.js 18+ or Bun
- Mix server running (see [Running Mix Server](#running-mix-server))
- Anthropic API key

## Quick Start

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
cd ../../../../mix
make dev
```

### Option 2: Without Devtools

```bash
cd ../../../..
./start_mix.sh
```

The Mix server will start on `http://localhost:8088`.

## How It Works

1. **Upload Page** (`/`)
   - User uploads a CSV file containing portfolio data
   - CSV is parsed and displayed in a preview table
   - File is uploaded to Mix storage and session is created

2. **Analysis Page** (`/analyze/:sessionId`)
   - Streaming endpoint sends analysis prompt to Mix
   - AI analyzes data using Mix tools (Python, pandas, matplotlib)
   - Results stream back to the UI in real-time
   - Charts and visualizations are displayed

## Project Structure

```
portfolio-analyzer/
├── src/
│   ├── routes/
│   │   ├── __root.tsx           # Root layout
│   │   ├── index.tsx            # Upload page
│   │   ├── analyze.$sessionId.tsx  # Analysis results
│   │   └── api/
│   │       ├── session.ts       # Create Mix sessions
│   │       ├── upload.ts        # File upload to Mix
│   │       └── stream.$sessionId.ts  # SSE streaming
│   ├── components/
│   │   ├── FileUploader.tsx     # Drag-n-drop file upload
│   │   ├── DataTable.tsx        # CSV preview table
│   │   ├── StreamingChat.tsx    # Real-time AI responses
│   │   └── ChartDisplay.tsx     # Chart visualization
│   ├── lib/
│   │   ├── mix-client.ts        # Mix SDK server client
│   │   ├── mix-streaming.ts     # Streaming utilities
│   │   └── utils.ts             # Helper functions
│   └── styles.css               # Global styles
├── public/                      # Static assets
└── package.json
```

## API Routes

### `POST /api/session`
Create a new Mix session for AI interactions.

**Request:**
```json
{
  "title": "Portfolio Analysis - filename.csv"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session_id",
    "title": "Portfolio Analysis - filename.csv",
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
    "url": "http://localhost:8088/api/sessions/.../files/file.csv",
    "name": "file.csv",
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

## Testing

```bash
bun run test
```

## Linting & Formatting

```bash
bun run lint
bun run format
bun run check
```

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [Mix Documentation](https://recreate.run/docs/mix)
- [Mix TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
- [Mix Repository](https://github.com/recreate-run/mix)

## License

MIT
