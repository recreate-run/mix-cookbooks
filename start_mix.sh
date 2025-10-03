#!/bin/bash
set -e

# Mix Agent Starter Script
# This script downloads and runs the Mix agent binary

MIX_VERSION="${MIX_VERSION:-latest}"
MIX_DIR="${HOME}/.mix"
MIX_BINARY="${MIX_DIR}/mix"

# Detect OS and architecture
detect_platform() {
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)

    case "${OS}" in
        darwin)
            if [ "${ARCH}" = "arm64" ]; then
                PLATFORM="mac-apple-silicon"
            else
                PLATFORM="mac-intel"
            fi
            ;;
        linux)
            if [ "${ARCH}" = "x86_64" ]; then
                PLATFORM="linux-x64"
            elif [ "${ARCH}" = "aarch64" ] || [ "${ARCH}" = "arm64" ]; then
                PLATFORM="linux-arm64"
            else
                echo "Unsupported architecture: ${ARCH}"
                exit 1
            fi
            ;;
        mingw*|msys*|cygwin*)
            PLATFORM="windows-x64"
            MIX_BINARY="${MIX_BINARY}.exe"
            ;;
        *)
            echo "Unsupported OS: ${OS}"
            exit 1
            ;;
    esac

    echo "Detected platform: ${PLATFORM}"
}

# Download Mix binary
download_mix() {
    echo "📥 Downloading Mix binary..."

    # Create Mix directory
    mkdir -p "${MIX_DIR}"

    # Get latest release info
    if [ "${MIX_VERSION}" = "latest" ]; then
        RELEASE_URL="https://api.github.com/repos/recreate-run/mix/releases/latest"
        VERSION=$(curl -s "${RELEASE_URL}" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    else
        VERSION="${MIX_VERSION}"
    fi

    echo "Version: ${VERSION}"

    # Download URL pattern
    DOWNLOAD_URL="https://github.com/recreate-run/mix/releases/download/${VERSION}/mix-${PLATFORM}.tar.gz"

    echo "Downloading from: ${DOWNLOAD_URL}"

    # Download and extract
    if command -v curl &> /dev/null; then
        curl -L "${DOWNLOAD_URL}" | tar xz -C "${MIX_DIR}"
    elif command -v wget &> /dev/null; then
        wget -qO- "${DOWNLOAD_URL}" | tar xz -C "${MIX_DIR}"
    else
        echo "❌ Error: curl or wget is required to download Mix"
        exit 1
    fi

    # Make binary executable
    chmod +x "${MIX_BINARY}"

    echo "✅ Mix binary downloaded to ${MIX_BINARY}"
}

# Check if Mix binary exists
check_mix_binary() {
    if [ ! -f "${MIX_BINARY}" ]; then
        echo "Mix binary not found at ${MIX_BINARY}"
        echo "Attempting to download..."
        download_mix
    else
        echo "✅ Mix binary found at ${MIX_BINARY}"
    fi
}

# Load environment variables from .env file
load_env() {
    if [ -f ".env" ]; then
        echo "📋 Loading environment variables from .env"
        export $(grep -v '^#' .env | xargs)
    else
        echo "⚠️  No .env file found. Using default settings."
        echo "💡 Tip: Copy .env.example to .env and add your API keys"
    fi
}

# Start Mix agent
start_mix() {
    # Extract port from MIX_SERVER_URL (e.g., http://localhost:8088 -> 8088)
    if [ -n "${MIX_SERVER_URL}" ]; then
        MIX_PORT=$(echo "${MIX_SERVER_URL}" | sed -E 's|.*:([0-9]+).*|\1|')
    else
        MIX_PORT="8088"
    fi

    echo ""
    echo "🚀 Starting Mix Agent on port ${MIX_PORT}..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    "${MIX_BINARY}" --http-port "${MIX_PORT}"
}

# Main execution
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "           Mix Agent Startup Script"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    detect_platform
    load_env
    check_mix_binary
    start_mix
}

# Handle script arguments
case "${1}" in
    --download-only)
        detect_platform
        download_mix
        ;;
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --download-only    Only download the binary, don't start it"
        echo "  --help, -h         Show this help message"
        echo ""
        echo "Environment Variables:"
        echo "  MIX_VERSION        Mix version to download (default: latest)"
        echo "  MIX_SERVER_URL     Server URL with port (default: http://localhost:8088)"
        echo ""
        exit 0
        ;;
    *)
        main
        ;;
esac
