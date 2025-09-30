#!/usr/bin/env python3
"""
Permissions Example for Mix Python SDK

Documentation Reference: docs/sdks/permissions/README.md

This example demonstrates comprehensive permissions functionality including:
- Permission granting operations with ID-based management
- Permission denial operations with proper response handling
- Error handling for invalid permission IDs and authentication
- Both synchronous and asynchronous operation patterns
- Response validation and status checking

Run this example to see all permissions methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv
import asyncio


def demonstrate_permission_granting(mix):
    """Demonstrate permission granting with various scenarios"""
    print("\n=== Permission Granting Demo ===")

    print("1. Granting a valid permission...")
    response = mix.permissions.grant(id="test_permission_001")
    print(f"Grant response: {response}")
    print("Detailed breakdown:")
    for key, value in response.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. Granting another permission...")
    response = mix.permissions.grant(id="test_permission_002")
    print(f"Grant response: {response}")

    print(
        "\n3. Attempting to grant invalid permission (will demonstrate error handling)..."
    )
    response = mix.permissions.grant(id="invalid_permission_xyz")
    print(f"Grant response for invalid ID: {response}")


def demonstrate_permission_denial(mix):
    """Demonstrate permission denial operations"""
    print("\n=== Permission Denial Demo ===")

    print("1. Denying a permission...")
    response = mix.permissions.deny(id="test_permission_001")
    print(f"Deny response: {response}")
    print("Detailed breakdown:")
    for key, value in response.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. Denying another permission...")
    response = mix.permissions.deny(id="test_permission_002")
    print(f"Deny response: {response}")

    print(
        "\n3. Attempting to deny invalid permission (will demonstrate error handling)..."
    )
    response = mix.permissions.deny(id="nonexistent_permission_123")
    print(f"Deny response for invalid ID: {response}")


async def demonstrate_async_operations(mix):
    """Demonstrate asynchronous permission operations"""
    print("\n=== Asynchronous Operations Demo ===")

    print("1. Async permission granting...")
    response = await mix.permissions.grant_async(id="async_test_permission_001")
    print(f"Async grant response: {response}")
    print("Detailed breakdown:")
    for key, value in response.__dict__.items():
        print(f"  {key}: {value}")

    print("\n2. Async permission denial...")
    response = await mix.permissions.deny_async(id="async_test_permission_001")
    print(f"Async deny response: {response}")

    print("\n3. Concurrent async operations...")
    grant_task = mix.permissions.grant_async(id="concurrent_permission_001")
    deny_task = mix.permissions.deny_async(id="concurrent_permission_002")

    grant_response, deny_response = await asyncio.gather(grant_task, deny_task)
    print(f"Concurrent grant response: {grant_response}")
    print(f"Concurrent deny response: {deny_response}")


def demonstrate_advanced_parameters(mix):
    """Demonstrate advanced parameter usage and customization"""
    print("\n=== Advanced Parameters Demo ===")

    print("1. Using custom timeout...")
    response = mix.permissions.grant(id="timeout_test_permission", timeout_ms=5000)
    print(f"Custom timeout response: {response}")

    print("\n2. Using custom HTTP headers...")
    custom_headers = {
        "X-Custom-Header": "test-value",
        "X-Request-ID": "demo-request-001",
    }
    response = mix.permissions.grant(
        id="headers_test_permission", http_headers=custom_headers
    )
    print(f"Custom headers response: {response}")

    print("\n3. Using server URL override...")
    response = mix.permissions.deny(
        id="server_test_permission",
        server_url=os.getenv("MIX_SERVER_URL", "http://localhost:8088"),
    )
    print(f"Server override response: {response}")


def demonstrate_permission_workflow(mix):
    """Demonstrate complete permission management workflow"""
    print("\n=== Permission Management Workflow Demo ===")

    permission_id = "workflow_permission_demo"

    print(f"1. Starting workflow for permission: {permission_id}")

    print("2. Initial grant...")
    grant_response = mix.permissions.grant(id=permission_id)
    print(f"Initial grant: {grant_response}")

    print("3. Subsequent deny...")
    deny_response = mix.permissions.deny(id=permission_id)
    print(f"Subsequent deny: {deny_response}")

    print("4. Re-grant...")
    regrant_response = mix.permissions.grant(id=permission_id)
    print(f"Re-grant: {regrant_response}")

    print("5. Final deny...")
    final_deny_response = mix.permissions.deny(id=permission_id)
    print(f"Final deny: {final_deny_response}")

    print("Workflow completed successfully!")


async def run_async_demonstrations(mix):
    """Run all async demonstrations"""
    await demonstrate_async_operations(mix)


def main():
    """Main function demonstrating Mix SDK permissions functionality"""
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
    print("MIX PYTHON SDK - PERMISSIONS EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all permissions functionality")
    print("Using real OpenRouter API key from .env file")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        # Always start with system health check
        health = mix.system.get_health()
        print(f"System health: {health}")

        # Demonstrate synchronous operations
        demonstrate_permission_granting(mix)
        demonstrate_permission_denial(mix)
        demonstrate_advanced_parameters(mix)
        demonstrate_permission_workflow(mix)

        # Demonstrate asynchronous operations
        print("\n" + "=" * 60)
        print("ASYNCHRONOUS OPERATIONS")
        print("=" * 60)
        asyncio.run(run_async_demonstrations(mix))

        print("\n" + "=" * 60)
        print("PERMISSIONS EXAMPLE COMPLETED")
        print("=" * 60)
        print("All permissions operations demonstrated successfully!")


if __name__ == "__main__":
    main()
