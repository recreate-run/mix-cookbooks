#!/usr/bin/env python3
"""
Tools Example for Mix Python SDK

Documentation Reference: docs/sdks/tools/README.md

This example demonstrates comprehensive tools functionality including:
- Tools status discovery and authentication checking
- Tool category and provider analysis
- Authentication verification workflows
- Tool capability assessment

Note: store_tool_credentials() and delete_tool_credentials() methods
are planned but not yet implemented in the current SDK version.

Run this example to see all tools methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_tools_status_discovery(mix):
    """Demonstrate comprehensive tools status discovery and analysis"""
    print("\n=== Tools Status Discovery Demo ===")

    print("1. Getting comprehensive tools status...")
    tools_status = mix.tools.get_tools_status()
    print(f"Tools status response received: {type(tools_status)}")

    print(f"\n2. Found {len(tools_status.categories)} tool categories")

    for category_name, category_info in tools_status.categories.items():
        print(f"\n--- Category: {category_name} ---")
        print(f"  Display Name: {category_info.display_name}")
        print(f"  Tools in category: {len(category_info.tools)}")
        for tool in category_info.tools:
            demonstrate_tool_analysis(tool)


def demonstrate_tool_analysis(tool):
    """Demonstrate detailed tool analysis and authentication status"""
    print(f"\n    Tool: {tool.display_name}")
    print(f"      Provider: {tool.provider}")
    print(f"      Description: {tool.description}")
    print(f"      API Key Required: {tool.api_key_required}")
    print(f"      Authenticated: {tool.authenticated}")

    # Analysis of authentication status
    if tool.api_key_required and tool.authenticated:
        print("      Status: ✅ Fully authenticated and ready")
    elif tool.api_key_required and not tool.authenticated:
        print("      Status: ❌ Requires authentication setup")
    elif not tool.api_key_required and tool.authenticated:
        print("      Status: ✅ Ready to use (no auth required)")
    else:
        print("      Status: ⚠️  Status unclear")


def demonstrate_authentication_verification(mix):
    """Demonstrate authentication verification workflows"""
    print("\n=== Authentication Verification Demo ===")

    print("1. Analyzing authentication status across all tools...")
    tools_status = mix.tools.get_tools_status()

    authenticated_tools = []
    unauthenticated_tools = []
    no_auth_required = []

    for category_name, category_info in tools_status.categories.items():
        for tool in category_info.tools:
            if tool.api_key_required and tool.authenticated:
                authenticated_tools.append((category_name, tool))
            elif tool.api_key_required and not tool.authenticated:
                unauthenticated_tools.append((category_name, tool))
            elif not tool.api_key_required:
                no_auth_required.append((category_name, tool))

    print("\n2. Authentication Summary:")
    print(f"   ✅ Authenticated tools: {len(authenticated_tools)}")
    print(f"   ❌ Unauthenticated tools: {len(unauthenticated_tools)}")
    print(f"   ⚪ No auth required: {len(no_auth_required)}")

    if authenticated_tools:
        print("\n3. Ready-to-use authenticated tools:")
        for category, tool in authenticated_tools:
            print(f"   - {tool.display_name} ({tool.provider}) in {category}")

    if unauthenticated_tools:
        print("\n4. Tools requiring authentication setup:")
        for category, tool in unauthenticated_tools:
            print(f"   - {tool.display_name} ({tool.provider}) in {category}")


def demonstrate_provider_analysis(mix):
    """Demonstrate tool provider analysis and categorization"""
    print("\n=== Provider Analysis Demo ===")

    print("1. Analyzing providers across tool ecosystem...")
    tools_status = mix.tools.get_tools_status()

    providers = {}

    for category_name, category_info in tools_status.categories.items():
        for tool in category_info.tools:
            provider = tool.provider
            if provider not in providers:
                providers[provider] = {"tools": [], "authenticated": 0, "total": 0}
            providers[provider]["tools"].append((category_name, tool))
            providers[provider]["total"] += 1
            if tool.authenticated:
                providers[provider]["authenticated"] += 1

    print(f"\n2. Found {len(providers)} unique providers:")
    for provider_name, provider_info in providers.items():
        auth_ratio = (
            provider_info["authenticated"] / provider_info["total"]
            if provider_info["total"] > 0
            else 0
        )
        print(f"\n   Provider: {provider_name}")
        print(f"     Tools: {provider_info['total']}")
        print(
            f"     Authenticated: {provider_info['authenticated']}/{provider_info['total']} ({auth_ratio:.1%})"
        )
        print("     Tools list:")
        for category, tool in provider_info["tools"]:
            status = "✅" if tool.authenticated else "❌"
            print(f"       {status} {tool.display_name} ({category})")


def demonstrate_capability_assessment(mix):
    """Demonstrate comprehensive capability assessment"""
    print("\n=== Capability Assessment Demo ===")

    print("1. Assessing overall tool ecosystem readiness...")
    tools_status = mix.tools.get_tools_status()

    total_tools = 0
    ready_tools = 0

    capabilities = {
        "web_search": False,
        "multimodal_analyzer": False,
        "brave": False,
        "gemini": False,
    }

    for category_name, category_info in tools_status.categories.items():
        for tool in category_info.tools:
            total_tools += 1

            # Check if tool is ready (either authenticated or no auth required)
            if tool.authenticated or not tool.api_key_required:
                ready_tools += 1

            # Check for specific capabilities mentioned in plan
            tool_name = tool.display_name.lower()
            provider_name = tool.provider.lower()

            if "web" in tool_name or "search" in tool_name:
                capabilities["web_search"] = (
                    tool.authenticated or not tool.api_key_required
                )
            if "multimodal" in tool_name or "analyzer" in tool_name:
                capabilities["multimodal_analyzer"] = (
                    tool.authenticated or not tool.api_key_required
                )
            if "brave" in provider_name:
                capabilities["brave"] = tool.authenticated or not tool.api_key_required
            if "gemini" in provider_name:
                capabilities["gemini"] = tool.authenticated or not tool.api_key_required

    readiness_ratio = ready_tools / total_tools if total_tools > 0 else 0

    print("\n2. Ecosystem Readiness Report:")
    print(f"   Total tools: {total_tools}")
    print(f"   Ready tools: {ready_tools}")
    print(f"   Readiness ratio: {readiness_ratio:.1%}")

    print("\n3. Specific Capability Status:")
    for capability, ready in capabilities.items():
        status = "✅ Ready" if ready else "❌ Not Ready"
        print(f"   {capability}: {status}")


def main():
    """Main function demonstrating Mix SDK tools functionality"""
    # Load environment variables from .env file
    load_dotenv()

    # Get server URL from environment
    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    print("=" * 60)
    print("MIX PYTHON SDK - TOOLS EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all tools functionality")
    print("Note: Only get_tools_status() is currently implemented")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        # Always start with system health check
        health = mix.system.get_health()
        print(f"System health: {health}")

        # Call each demonstration function in logical order
        demonstrate_tools_status_discovery(mix)
        demonstrate_authentication_verification(mix)
        demonstrate_provider_analysis(mix)
        demonstrate_capability_assessment(mix)

        print("\n" + "=" * 60)
        print("PLANNED FUNCTIONALITY (Not Yet Implemented):")
        print("- store_tool_credentials() - Store provider credentials")
        print("- delete_tool_credentials() - Remove provider credentials")
        print("These methods are mentioned in the plan but not in current SDK")
        print("=" * 60)


if __name__ == "__main__":
    main()
