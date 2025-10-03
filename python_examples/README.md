# Mix Python Cookbooks

Creative and advanced examples for building with Mix Python SDK.

> **Note**: For basic examples (authentication, sessions, messages, files, etc.), see the [Python SDK examples](https://github.com/recreate-run/mix-python-sdk/tree/main/examples).

## Setup

```bash
cd python
./scripts/setup.sh
```

Then add your credentials to `../.env`:

```bash
MIX_SERVER_URL=http://localhost:8088
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
BRAVE_API_KEY=your_key_here
```

## Run server

### With devools GUI (recommended)

```bash
git clone https://github.com/recreate-run/mix.git
cd mix
make dev
```

### Without devools GUI

```bash
./start_mix.sh
```

## Run demos

### `portfolio_analysis.py`

Analyze investment portfolio data with AI-powered insights. Upload CSV files and get automated analysis with visualizations.

```bash
uv run demos/portfolio_analysis.py
```

### `tiktok_video.py`

Generate TikTok-style videos from text prompts using multi-step agent workflows.

```bash
uv run demos/tiktok_video.py
```

### `upload_image_ask.py`

Upload and analyze images with vision models in multimodal interactions.

```bash
uv run demos/upload_image_ask.py
```

### `web_search_multimodal.py`

Multimodal web search workflows that process and analyze search results.

```bash
uv run demos/web_search_multimodal.py
```

### `system_prompt_change.py`

Customize agent behavior by modifying system prompts and session preferences.

```bash
uv run guides/system_prompt_change.py
```
