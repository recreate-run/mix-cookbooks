# Mix Cookbooks

Creative and advanced examples for building with [Mix](https://github.com/recreate-run/mix).

> **Note**: For basic examples (authentication, sessions, messages, files), see the [Python SDK](https://github.com/recreate-run/mix-python-sdk/tree/main/examples) or [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk) repositories.

## What is Mix?

Mix is an agentic platform built for multimodal workflows:
- Session-based persistent state
- Real-time streaming (SSE)
- Multimodal (video, images, text)
- SDK-first design

## Prerequisites

- Python 3.10+ or Node.js 18+
- API Keys: Anthropic, Gemini, Brave

## Getting Started

### Option 1: Binary (Recommended for Users)

Download and run the Mix agent binary:

```bash
# Start Mix agent (downloads binary automatically)
./start_mix.sh

# Configure environment
cp .env.example .env
# Edit .env and add your API keys
```

The binary runs on port 8088 by default.

### Option 2: Development Mode (For Mix Contributors)

Clone and run Mix from source:

```bash
# Clone Mix repository
git clone https://github.com/recreate-run/mix.git
cd mix

# Start development server
make dev
```

This runs Mix with hot-reloading and development tools.

## Examples

📂 **Python** - See [python/](python/) for creative examples including portfolio analysis, video generation, and more

📂 **TypeScript** - Coming soon


## Resources

- [Mix Docs](https://recreate.run/docs/mix-agent)
- [Mix Repository](https://github.com/recreate-run/mix)
- [Python SDK](https://github.com/recreate-run/mix-python-sdk)
- [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)

## License

MIT