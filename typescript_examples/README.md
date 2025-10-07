# Mix TypeScript Cookbooks

## Setup

```bash
cd typescript_examples
bun install
```

Then add your credentials in the generated `.env` file:

```bash
MIX_SERVER_URL=http://localhost:8088
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
BRAVE_API_KEY=your_key_here
```

## Run server

### With devtools GUI (recommended)

```bash
git clone https://github.com/recreate-run/mix.git
cd mix
make dev
```

### Without devtools GUI

```bash
./start_mix.sh
```

## Run demos

### `portfolio_analysis.ts`

Analyze investment portfolio data with AI-powered insights. Upload CSV files and get automated analysis with visualizations.

```bash
bun run demo:portfolio
```

### `tiktok_video.ts`

Generate TikTok-style videos from text prompts using multi-step agent workflows.

```bash
bun run demo:tiktok
```

### `upload_image_ask.ts`

Upload and analyze images with vision models in multimodal interactions.

```bash
bun run demo:image
```

### `web_search_multimodal.ts`

Multimodal web search workflows that process and analyze search results.

```bash
bun run demo:web-search
```
