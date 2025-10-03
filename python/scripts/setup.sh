#!/bin/bash
set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Navigate to the python directory (parent of scripts)
PYTHON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# Navigate to the mix-cookbooks directory (parent of python)
COOKBOOKS_DIR="$(cd "$PYTHON_DIR/.." && pwd)"

cd "$PYTHON_DIR"

echo "🔧 Setting up Mix Python Cookbooks..."

# Create virtual environment
echo "📦 Creating virtual environment..."
uv venv

# Install dependencies using pyproject.toml
echo "📥 Installing dependencies..."
uv pip install -e .

# Copy environment file if it doesn't exist
if [ ! -f "$COOKBOOKS_DIR/.env" ]; then
  echo "📝 Creating .env file..."
  cp "$COOKBOOKS_DIR/.env.example" "$COOKBOOKS_DIR/.env"
  echo "⚠️  Please update $COOKBOOKS_DIR/.env with your API keys"
else
  echo "✓ .env file already exists"
fi

echo "✅ Setup complete!"
echo ""
echo "To run examples:"
echo "  uv run demos/tiktok_video.py"
echo "  uv run demos/upload_image_ask.py"
echo "  uv run guides/system_prompt_change.py"
