# Mix Cookbooks

Creative and advanced examples for building with [Mix](https://github.com/recreate-run/mix).

## What is Mix?

Mix is an agentic platform built for multimodal workflows:

- Session-based persistent state
- Real-time streaming (SSE)
- Multimodal (video, images, text)
- SDK-first design

## Quick Start

### Python

```bash
cd python_examples
uv sync
uv run demos/portfolio_analysis.py
```

### TypeScript

```bash
cd typescript_examples
bun install
bun run demo:portfolio
```

## Prerequisites

- Anthropic API key / Claude code subscription
- Brave API key for web search tool free ([Get free key](https://brave.com/search/api/))
- Gemini API key for `ReadMedia` tool ([Get free key](https://aistudio.google.com/api-keys))

## Examples

### Python Examples

Examples are in the [`python_examples/`](./python_examples) folder, written with the [Python SDK](https://github.com/recreate-run/mix-python-sdk):

- [Portfolio Analysis](./python_examples/demos/portfolio_analysis.py) - AI-powered CSV analysis and visualizations
- [TikTok Video](./python_examples/demos/tiktok_video.py) - Text-to-video generation workflows
- [Image Upload](./python_examples/demos/upload_image_ask.py) - Image analysis with vision models
- [Web Search](./python_examples/demos/web_search_multimodal.py) - Multimodal web search integration

### TypeScript Examples

TypeScript examples are in the [`typescript_examples/`](./typescript_examples) folder, written with the [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk):

- [Portfolio Analysis](./typescript_examples/demos/portfolio_analysis.ts) - AI-powered CSV analysis and visualizations
- [TikTok Video](./typescript_examples/demos/tiktok_video.ts) - Text-to-video generation workflows
- [Image Upload](./typescript_examples/demos/upload_image_ask.ts) - Image analysis with vision models
- [Web Search](./typescript_examples/demos/web_search_multimodal.ts) - Multimodal web search integration

See the [TypeScript examples README](./typescript_examples/README.md) for setup and usage instructions.

> **Note**: For API usage examples (authentication, sessions, messages, files), see the [Python SDK](https://github.com/recreate-run/mix-python-sdk/tree/main/examples) or [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk/tree/main/examples).

## Resources

- [Mix Docs](https://recreate.run/docs/mix-agent)
- [Mix Repository](https://github.com/recreate-run/mix)
- [Python SDK](https://github.com/recreate-run/mix-python-sdk)
- [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
