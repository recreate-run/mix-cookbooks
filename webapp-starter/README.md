# Mix Webapp Examples

Collection of TanStack Start applications demonstrating Mix SDK integration for building AI-powered web applications.

## Examples

### [Portfolio Analyzer](./examples/portfolio-analyzer/)

AI-powered portfolio analysis with CSV upload, real-time streaming, and visualizations.

**Features:**
- CSV file upload with drag-and-drop
- Data preview table
- Real-time AI analysis using Mix SDK
- Auto-generated charts and plots
- Server-Sent Events streaming

[View Example →](./examples/portfolio-analyzer/)

## Getting Started

Each example is a **standalone TanStack Start application** with its own dependencies and configuration. This structure allows you to:

- Run examples independently
- Copy a single example for your project
- Customize each example without affecting others
- Add new examples easily

### Prerequisites

- Node.js 18+ or Bun
- Mix server running
- API keys (Anthropic, etc.)

### Running an Example

Navigate to any example directory and follow its README:

```bash
cd examples/portfolio-analyzer
bun install
bun run dev
```

## Running Mix Server

All examples require a Mix server. Start it once and all examples can connect to it:

### Option 1: With Devtools GUI (Recommended)

```bash
cd ../../mix
make dev
```

### Option 2: Without Devtools

```bash
cd ../..
./start_mix.sh
```

The Mix server will be available at `http://localhost:8088`.

## Project Structure

```
webapp-starter/
├── examples/
│   ├── portfolio-analyzer/    # Portfolio analysis with CSV upload
│   └── [future examples]/     # More examples coming soon
└── README.md                  # This file
```

## Adding New Examples

To add a new example:

1. Create a new directory in `examples/`
2. Set up a new TanStack Start application
3. Integrate Mix SDK following the portfolio-analyzer pattern
4. Add documentation in the example's README
5. Update this README with a link to the new example

## Common Patterns

All examples follow these patterns:

### Mix SDK Integration

- Server-side Mix client in `src/lib/mix-client.ts`
- Streaming utilities in `src/lib/mix-streaming.ts`
- API routes for session, upload, and streaming
- SSE (Server-Sent Events) for real-time AI responses

### File Structure

```
example-name/
├── src/
│   ├── routes/               # File-based routing
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Main page
│   │   └── api/             # Server-side API routes
│   ├── components/          # React components
│   ├── lib/                 # Mix SDK integration
│   └── styles.css           # Global styles
├── public/                  # Static assets
├── package.json
└── README.md
```

## Tech Stack

- **Framework:** TanStack Start
- **Routing:** TanStack Router (file-based)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **AI SDK:** Mix TypeScript SDK
- **Runtime:** Bun
- **Build Tool:** Vite

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [Mix Documentation](https://recreate.run/docs/mix)
- [Mix TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
- [Mix Repository](https://github.com/recreate-run/mix)

## Contributing

New example contributions are welcome! Please ensure:

- Each example is self-contained
- README includes setup and usage instructions
- Code follows existing patterns
- Examples demonstrate specific Mix SDK features

## License

MIT
