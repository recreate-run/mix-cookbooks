# Mix Cookbooks

Code examples for building with [Mix](https://github.com/recreate-run/mix) - the best agentic backbone for your multimodal app.

## What is Mix?

Mix is an agentic platform built for multimodal workflows. Key features:

- **SDK-first**: SDK is a first-class citizen (unlike CLI tools that also offer an SDK)
- **Multimodal**: Built for multimodal workflows (video, images, text)
- **Session-based**: Persistent sessions with file storage
- **Real-time streaming**: Server-Sent Events (SSE) for live updates
- **No lock-in**: All data stored as plain text and native media files
- **HTTP backend**: Python and TypeScript SDKs available

## Prerequisites

- **Mix Agent** running locally or deployed
- **Python 3.10+** or **Node.js 18+**
- **API Keys**: Claude (via OAuth or API key), Gemini (for ReadMedia tool), Brave (for Search)

## Quick Start

### Python

```bash
git clone https://github.com/recreate-run/mix-cookbooks.git
cd mix-cookbooks/python

# Install dependencies
uv venv
source .venv/bin/activate
uv pip install mix-python-sdk python-dotenv

# Set up environment
cp .env.example .env
# Add MIX_SERVER_URL and API keys

# Run example
python 01_basics/basic_client.py
```

### TypeScript

```bash
cd mix-cookbooks/typescript
npm install

cp .env.example .env
# Add MIX_SERVER_URL and API keys

npx tsx 01_basics/basic_client.ts
```

## Examples

### Python

**01_basics/** - Core API functionality
- `basic_client.py` - Setup and health check
- `authentication_example.py` - API key and OAuth
- `sessions_example.py` - Session management
- `messages_example.py` - Send and receive messages
- `files_example.py` - Upload/download files
- `streaming_example.py` - Real-time SSE streaming
- `preferences_example.py` - Configure models and providers
- `permissions_example.py` - Permission management
- `tools_example.py` - Tools status
- `system_example.py` - System health

**02_creative/** - Multimodal workflows
- `tiktok_video.py` - Generate TikTok videos
- `upload_image_ask.py` - Image analysis
- `web_search_multimodal.py` - Multimodal web search
- `system_prompt_change.py` - Custom system prompts

### TypeScript

Coming soon

## Resources

- [Mix Docs](https://recreate.run/docs/mix-agent)
- [Python SDK](https://github.com/recreate-run/mix-python-sdk)
- [TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
- [Main Repo](https://github.com/recreate-run/mix)

## License

MIT