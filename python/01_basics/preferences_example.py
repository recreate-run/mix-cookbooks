"""
Preferences Example for Mix Python SDK

Documentation Reference: docs/sdks/preferencessdk/README.md

This example demonstrates comprehensive preferences functionality including:
- Available provider and model discovery
- Current preference retrieval and analysis
- Dual-agent configuration (main agent vs sub agent)
- Model selection, token limits, and reasoning effort settings
- Preference reset functionality
- Provider switching workflows and validation

Run this example to see all preferences methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_provider_discovery(mix):
    """Demonstrate available provider and model discovery"""
    print("\n=== Provider Discovery Demo ===")

    print("1. Discovering available providers and models...")
    providers = mix.preferences.get_available_providers()
    print(f"Available providers response: {providers}")

    print("\nDetailed breakdown:")
    for key, value in providers.items():
        print(f"  {key}: {value}")

    print("\n2. Analyzing provider capabilities...")
    if isinstance(providers, dict):
        for provider_key, provider_info in providers.items():
            print(f"\nProvider: {provider_key}")
            print(f"  Display Name: {provider_info.display_name}")
            print(f"  Available Models: {len(provider_info.models)} models")
            for model in provider_info.models[:3]:  # Show first 3 models
                print(f"    - {model}")
            if len(provider_info.models) > 3:
                print(f"    ... and {len(provider_info.models) - 3} more")


def demonstrate_current_preferences(mix):
    """Demonstrate current preference retrieval and analysis"""
    print("\n=== Current Preferences Demo ===")

    print("1. Retrieving current user preferences...")
    preferences = mix.preferences.get_preferences()
    print(f"Preferences response: {preferences}")

    print("\nDetailed breakdown:")
    for key, value in preferences.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. Analyzing current settings...")
    prefs = preferences.preferences
    print("Current preference configuration:")
    print(f"  Preferred Provider: {prefs.preferred_provider}")
    print(f"  Main Agent Model: {prefs.main_agent_model}")
    print(f"  Main Agent Max Tokens: {prefs.main_agent_max_tokens}")
    print(f"  Sub Agent Model: {prefs.sub_agent_model}")
    print(f"  Sub Agent Max Tokens: {prefs.sub_agent_max_tokens}")


def demonstrate_preference_updates(mix):
    """Demonstrate comprehensive preference configuration"""
    print("\n=== Preference Updates Demo ===")

    print("1. Updating main agent preferences...")
    update_response = mix.preferences.update_preferences(
        preferred_provider="openrouter",
        main_agent_model="openrouter.deepseek-v3.1",
        main_agent_max_tokens=4000,
        main_agent_reasoning_effort="medium",
    )
    print(f"Main agent update response: {update_response}")

    print("Detailed breakdown:")
    for key, value in update_response.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. Updating sub agent preferences...")
    update_response = mix.preferences.update_preferences(
        sub_agent_model="openrouter.zai-glm-4.5-air",
        sub_agent_max_tokens=2000,
        sub_agent_reasoning_effort="low",
    )
    print(f"Sub agent update response: {update_response}")

    print("\n3. Comprehensive preference update...")
    comprehensive_update = mix.preferences.update_preferences(
        preferred_provider="anthropic",
        main_agent_model="claude-4-sonnet",
        main_agent_max_tokens=8000,
        main_agent_reasoning_effort="high",
        sub_agent_model="claude-3.7-sonnet",
        sub_agent_max_tokens=4000,
        sub_agent_reasoning_effort="medium",
    )
    print(f"Comprehensive update response: {comprehensive_update}")


def demonstrate_dual_agent_configuration(mix):
    """Demonstrate dual-agent architecture configuration"""
    print("\n=== Dual-Agent Architecture Demo ===")

    print("1. Configuring main agent for complex reasoning tasks...")
    main_agent_config = mix.preferences.update_preferences(
        main_agent_model="claude-4-sonnet",
        main_agent_max_tokens=8000,
        main_agent_reasoning_effort="high",
    )
    print(f"Main agent configuration: {main_agent_config}")

    print("\n2. Configuring sub agent for quick support tasks...")
    sub_agent_config = mix.preferences.update_preferences(
        sub_agent_model="claude-3.7-sonnet",
        sub_agent_max_tokens=2000,
        sub_agent_reasoning_effort="low",
    )
    print(f"Sub agent configuration: {sub_agent_config}")

    print("\n3. Demonstrating agent role separation...")
    print("Main Agent: High-performance reasoning for complex tasks")
    print("  - Model: claude-4-sonnet (most capable)")
    print("  - Max Tokens: 8000 (longer responses)")
    print("  - Reasoning Effort: high (thorough analysis)")

    print("\nSub Agent: Fast responses for supporting tasks")
    print("  - Model: claude-3.7-sonnet (faster)")
    print("  - Max Tokens: 2000 (concise responses)")
    print("  - Reasoning Effort: low (quick processing)")


def demonstrate_provider_switching(mix):
    """Demonstrate provider switching workflows and validation"""
    print("\n=== Provider Switching Demo ===")

    print("1. Switching to OpenRouter provider...")
    openrouter_switch = mix.preferences.update_preferences(
        preferred_provider="openrouter", main_agent_model="openrouter.deepseek-v3.1"
    )
    print(f"OpenRouter switch response: {openrouter_switch}")

    print("\n2. Verifying provider switch...")
    current_prefs = mix.preferences.get_preferences()
    print(f"Current provider: {current_prefs.preferences.preferred_provider}")
    print(f"Current main model: {current_prefs.preferences.main_agent_model}")

    print("\n3. Testing different provider configurations...")
    providers_to_test = [
        {"provider": "openrouter", "model": "openrouter.deepseek-v3.1"},
        {"provider": "anthropic", "model": "claude-4-sonnet"},
        {"provider": "openai", "model": "gpt-4.1"},
    ]

    for config in providers_to_test:
        print(f"\n  Testing {config['provider']} with {config['model']}...")
        test_response = mix.preferences.update_preferences(
            preferred_provider=config["provider"], main_agent_model=config["model"]
        )
        print(f"  Configuration successful: {test_response is not None}")


def demonstrate_preference_reset(mix):
    """Demonstrate preference reset functionality"""
    print("\n=== Preference Reset Demo ===")

    print("1. Current preferences before reset...")
    before_reset = mix.preferences.get_preferences()
    print(f"Before reset: {before_reset}")

    print("\n2. Resetting preferences to defaults...")
    reset_response = mix.preferences.reset_preferences()
    print(f"Reset response: {reset_response}")

    print("Detailed breakdown:")
    for key, value in reset_response.__dict__.items():
        print(f"  {key}: {value}")

    print("\n3. Verifying reset completed...")
    after_reset = mix.preferences.get_preferences()
    print(f"After reset: {after_reset}")

    print("\n4. Comparing before and after...")
    print("Reset operation completed - preferences restored to defaults")


def main():
    """Main function demonstrating Mix SDK preferences functionality"""
    # Load environment variables from .env file
    load_dotenv()

    # Get required API key from environment
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY not found in environment variables. Please add it to your .env file."
        )

    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    print("=" * 60)
    print("MIX PYTHON SDK - PREFERENCES EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all preferences functionality")
    print("Using real OPENROUTER API key from .env file")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        # Always start with system health check
        health = mix.system.get_health()
        print(f"System health: {health}")

        # Call each demonstration function in logical order
        demonstrate_provider_discovery(mix)
        demonstrate_current_preferences(mix)
        demonstrate_preference_updates(mix)
        demonstrate_dual_agent_configuration(mix)
        demonstrate_provider_switching(mix)
        demonstrate_preference_reset(mix)

        print("\n" + "=" * 60)
        print("PREFERENCES EXAMPLE COMPLETED")
        print("=" * 60)
        print("All preferences operations demonstrated successfully!")


if __name__ == "__main__":
    main()
