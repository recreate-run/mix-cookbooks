# Mix Python Cookbooks

Creative and advanced examples for building with Mix Python SDK.

> **Note**: For basic examples (authentication, sessions, messages, files, etc.), see the [Python SDK examples](https://github.com/recreate-run/mix-python-sdk/tree/main/examples).

## Setup

```bash
# Run setup script
./setup.sh

## Configuration

```bash
# Copy environment file
cp ../.env.example ../.env

# Add your credentials
MIX_SERVER_URL=http://localhost:8088
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
BRAVE_API_KEY=your_key_here
```

## Examples

### `portfolio_analysis.py`
Analyze investment portfolio data with AI-powered insights and visualizations. Demonstrates:
- CSV file upload and analysis
- Data-driven AI insights (winners/losers, trends)
- Automated plot generation
- Financial data analysis workflows

```bash
python portfolio_analysis.py
```

### `tiktok_video.py`
Generate TikTok-style videos from text prompts. Demonstrates:
- Video generation workflows
- Multi-step agent interactions
- Video file handling

```bash
python tiktok_video.py
```

### `upload_image_ask.py`
Upload and analyze images with AI. Demonstrates:
- File upload to sessions
- Image analysis with vision models
- Multimodal interactions

```bash
python upload_image_ask.py
```

### `web_search_multimodal.py`
Multimodal web search workflows. Demonstrates:
- Web search integration
- Processing search results
- Multimodal queries

```bash
python web_search_multimodal.py
```

### `system_prompt_change.py`
Custom system prompts for specialized behaviors. Demonstrates:
- Dynamic system prompt modification
- Session preferences configuration
- Customized agent behavior

```bash
python system_prompt_change.py
```

## Common Files

- `utils.py` - Shared utilities for streaming message handling
- `../sample_files/` - Sample files used across examples:
  - `sample.jpg` - Sample image for image analysis
  - `sample.txt` - Sample text file
  - `Robinhood Portfolio Q4 2024.csv` - Portfolio data for financial analysis
