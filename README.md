# Mix Cookbooks

Creative and advanced examples for building with [Mix](https://github.com/recreate-run/mix).

## What is Mix?

Mix is an agentic platform built for multimodal workflows:

- Session-based persistent state
- Real-time streaming (SSE)
- Multimodal (video, images, text)
- SDK-first design

## Prerequisites

- Anthropic API key / Claude code subscription
- Brave API key for web search tool free ([Get free key](https://brave.com/search/api/))
- Gemini API key for `ReadMedia` tool ([Get free key](https://aistudio.google.com/api-keys))

## Examples

Examples are in the [`python_examples/`](./python) folder, written with the [Python SDK](https://github.com/recreate-run/mix-python-sdk). See:

- [Portfolio Analysis](./python/portfolio_analysis.py) - AI-powered CSV analysis and visualizations
- [TikTok Video](./python/tiktok_video.py) - Text-to-video generation workflows
- [Image Upload](./python/upload_image_ask.py) - Image analysis with vision models
- [Web Search](./python/web_search_multimodal.py) - Multimodal web search integration
- [Custom Prompts](./python/system_prompt_change.py) - Dynamic system prompt configuration

For TypeScript, see the [Mix devtools source code](https://github.com/recreate-run/mix) as a reference. Typescript examples are coming soon.

> **Note**: For API usage examples (authentication, sessions, messages, files), see the [Python SDK](https://github.com/recreate-run/mix-python-sdk/tree/main/examples).

## Resources

- [Mix Docs](https://recreate.run/docs/mix-agent)
- [Mix Repository](https://github.com/recreate-run/mix)
- [Python SDK](https://github.com/recreate-run/mix-python-sdk)
- [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
