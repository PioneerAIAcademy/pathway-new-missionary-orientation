#!/bin/bash
# Helper script to run the crawler with error handling

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "================================="
echo "BYU-Pathway Course Crawler"
echo "================================="
echo ""

# Activate virtual environment
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo "❌ Virtual environment not found. Please run:"
    echo "   python3 -m venv venv"
    echo "   source venv/bin/activate"
    echo "   pip install -r requirements.txt"
    exit 1
fi

source "$PROJECT_ROOT/venv/bin/activate"

# Check if Playwright browsers are installed
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "⚠️  Playwright browsers not installed."
    echo "📦 Installing Chromium browser..."
    echo ""
    
    # Try installing with timeout
    timeout 300 playwright install chromium || {
        echo ""
        echo "❌ Failed to install Playwright Chromium."
        echo ""
        echo "Troubleshooting options:"
        echo "  1. Check your internet connection"
        echo "  2. Try using a VPN"
        echo "  3. Use alternative download host:"
        echo "     export PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net"
        echo "     playwright install chromium"
        echo ""
        exit 1
    }
    
    echo ""
    echo "✅ Chromium installed successfully"
    echo ""
fi

# Run the crawler
echo "🕷️  Starting crawler..."
echo "📂 Output directory: docs/output/"
echo ""

cd "$PROJECT_ROOT"
python src/main.py "$@"

echo ""
echo "✅ Crawler completed successfully!"
echo ""
echo "📄 Check docs/output/ for extracted content"
echo "📊 Next step: python src/question_generator.py"
