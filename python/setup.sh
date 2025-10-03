#!/bin/bash
set -e

echo "🔧 Setting up Mix Python Cookbooks..."

# Create virtual environment
echo "📦 Creating virtual environment..."
uv venv

# Activate and install dependencies
echo "📥 Installing dependencies..."
source .venv/bin/activate
uv pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "To activate the virtual environment, run:"
echo "  source .venv/bin/activate"
echo ""
echo "To run examples:"
echo "  python tiktok_video.py"
echo "  python upload_image_ask.py"
