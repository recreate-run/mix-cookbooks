#!/usr/bin/env python3
"""
Authentication Example for Mix Python SDK

Documentation Reference: docs/sdks/authentication/README.md

This example demonstrates comprehensive authentication functionality including:
- Provider-specific API key storage and management
- OAuth flow initiation and callback handling (Anthropic provider only)
- Authentication status checking across all providers
- Preferred provider validation
- Credential deletion and cleanup operations

Run this example to see all authentication methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_api_key_storage(mix, api_key):
    """Demonstrate API key storage for OpenRouter provider"""
    print("\n=== API Key Storage Demo ===")

    print("1. Storing OpenRouter API key...")
    result = mix.authentication.store_api_key(api_key=api_key, provider="openrouter")
    print(f"Result: {result}")

    print("\nDetailed breakdown:")
    for key, value in result.__dict__.items():
        print(f"  {key}: {value}")


def demonstrate_oauth_flow(mix):
    """Demonstrate OAuth flow initiation and callback handling (Anthropic only)"""
    print("\n=== OAuth Flow Demo ===")

    print("1. Starting OAuth flow for Anthropic provider...")
    print("   (Note: OAuth is currently only supported for Anthropic provider)")
    oauth_result = mix.authentication.start_o_auth_flow(provider="anthropic")
    print(f"OAuth flow result: {oauth_result}")

    print("\nDetailed OAuth flow breakdown:")
    for key, value in oauth_result.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. OAuth callback handling demonstration...")
    print("   (Note: This would normally be called by OAuth provider with actual code)")
    print("   For demo purposes, showing the method signature and expected behavior")

    if oauth_result.state:
        print("   Would call handle_o_auth_callback with:")
        print("   - code: 'oauth_authorization_code'")
        print("   - provider: 'anthropic'")
        print(f"   - state: '{oauth_result.state}'")

        callback_result = mix.authentication.handle_o_auth_callback(
            code="demo_code", provider="anthropic", state=oauth_result.state
        )
        print(f"Callback result: {callback_result}")

        print("\nDetailed callback breakdown:")
        for key, value in callback_result.__dict__.items():
            print(f"  {key}: {value}")


def demonstrate_auth_status(mix):
    """Demonstrate authentication status checking across all providers"""
    print("\n=== Authentication Status Demo ===")

    print("1. Getting authentication status for all providers...")
    status_result = mix.authentication.get_auth_status()
    print(f"Auth status result: {status_result}")

    print("\nDetailed status breakdown:")
    for key, value in status_result.__dict__.items():
        print(f"  {key}: {value}")

    if status_result.providers:
        print("\nProvider-specific details:")
        for provider_name, provider_info in status_result.providers.items():
            print(f"  Provider: {provider_name}")
            for attr, val in provider_info.__dict__.items():
                print(f"    {attr}: {val}")


def demonstrate_preferred_provider_validation(mix):
    """Demonstrate preferred provider validation"""
    print("\n=== Preferred Provider Validation Demo ===")

    print("1. Validating preferred provider authentication...")
    validation_result = mix.authentication.validate_preferred_provider()
    print(f"Validation result: {validation_result}")

    print("\nDetailed validation breakdown:")
    for key, value in validation_result.__dict__.items():
        print(f"  {key}: {value}")


def demonstrate_credential_deletion(mix):
    """Demonstrate credential deletion and cleanup operations"""
    print("\n=== Credential Deletion Demo ===")

    print("1. Deleting OpenRouter credentials...")
    print("   (Note: This will remove stored API key for OpenRouter)")
    deletion_result = mix.authentication.delete_credentials(provider="openrouter")
    print(f"Deletion result: {deletion_result}")

    print("\nDetailed deletion breakdown:")
    for key, value in deletion_result.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. Verifying deletion by checking auth status...")
    final_status = mix.authentication.get_auth_status()
    if final_status.providers:
        openrouter_status = final_status.providers.get("openrouter")
        if openrouter_status:
            print(f"OpenRouter status after deletion: {openrouter_status}")
            print(f"  Authenticated: {openrouter_status.authenticated}")


def main():
    """Main function demonstrating Mix SDK authentication functionality"""
    load_dotenv()

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY not found in environment variables. Please add it to your .env file."
        )

    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    print("=" * 60)
    print("MIX PYTHON SDK - AUTHENTICATION EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all authentication functionality")
    print("Using real OpenRouter API key from .env file")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        health = mix.system.get_health()
        print(f"System health: {health}")

        demonstrate_api_key_storage(mix, api_key)
        demonstrate_auth_status(mix)
        demonstrate_preferred_provider_validation(mix)
        # demonstrate_oauth_flow(mix)
        demonstrate_credential_deletion(mix)


if __name__ == "__main__":
    main()
