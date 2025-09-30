#!/usr/bin/env python3
"""
System Example for Mix Python SDK

Documentation Reference: docs/sdks/system/README.md

This example demonstrates comprehensive system functionality including:
- Health check and system status monitoring
- Command discovery and detailed command inspection
- MCP (Model Context Protocol) server listing and tool ecosystem status
- Integration readiness verification
- System introspection and capability discovery

Run this example to see all system methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_health_monitoring(mix):
    """Demonstrate system health monitoring and status checking"""
    print("\n=== Health Monitoring Demo ===")

    print("1. Checking system health...")
    health = mix.system.get_health()
    print(f"Health Status: {health.status}")
    print(f"Server Version: {health.version}")
    print(f"Timestamp: {health.timestamp}")

    # Show detailed health information
    print("\nDetailed health breakdown:")
    for key, value in health.__dict__.items():
        print(f"  {key}: {value}")


def demonstrate_command_discovery(mix):
    """Demonstrate command discovery and detailed command inspection"""
    print("\n=== Command Discovery Demo ===")

    print("1. Listing all available commands...")
    commands = mix.system.list_commands()
    print(f"Found {len(commands)} available commands:")

    for i, command in enumerate(commands, 1):
        print(f"  {i}. {command.name}: {command.description}")

    # Demonstrate detailed command inspection
    if commands:
        print(f"\n2. Getting detailed information for command: {commands[0].name}")
        cmd_detail = mix.system.get_command(name=commands[0].name)
        print(f"Command Name: {cmd_detail.name}")
        print(f"Description: {cmd_detail.description}")
        print(f"Usage: {cmd_detail.usage}")

        # Show detailed command information
        print("\nDetailed command breakdown:")
        for key, value in cmd_detail.__dict__.items():
            print(f"  {key}: {value}")

        # Inspect a few more commands if available
        if len(commands) > 1:
            print("\n3. Inspecting additional commands...")
            for command in commands[1 : min(4, len(commands))]:  # Inspect up to 3 more
                detail = mix.system.get_command(name=command.name)
                print(f"  • {detail.name}: {detail.usage}")


def demonstrate_mcp_server_monitoring(mix):
    """Demonstrate MCP server listing and tool ecosystem status"""
    print("\n=== MCP Server Monitoring Demo ===")

    print("1. Listing all MCP servers...")
    mcp_servers = mix.system.list_mcp_servers()
    print(f"Found {len(mcp_servers)} MCP servers:")

    for i, server in enumerate(mcp_servers, 1):
        print(f"\n  {i}. MCP Server: {server.name}")
        print(f"     Status: {server.status}")
        print(f"     Connected: {'✅' if server.connected else '❌'}")

        # Show tools if server is connected and has tools
        if server.connected and server.tools:
            print(f"     Available Tools ({len(server.tools)}):")
            for tool in server.tools:
                print(f"       • {tool.name}: {tool.description}")
        elif server.connected and not server.tools:
            print("     No tools available")
        else:
            print("     Tools unavailable (server not connected)")

        # Show detailed server information
        print("     Detailed server breakdown:")
        for key, value in server.__dict__.items():
            if key != "tools":  # Skip tools as we already displayed them
                print(f"       {key}: {value}")


def demonstrate_integration_verification(mix):
    """Demonstrate system integration readiness verification"""
    print("\n=== Integration Verification Demo ===")

    print("1. Verifying system integration readiness...")

    # Check system health
    health = mix.system.get_health()
    health_ok = health.status.lower() in ["ok", "healthy", "up"]
    print(f"   System Health: {'✅' if health_ok else '❌'} ({health.status})")

    # Check available commands
    commands = mix.system.list_commands()
    commands_ok = len(commands) > 0
    print(
        f"   Available Commands: {'✅' if commands_ok else '❌'} ({len(commands)} commands)"
    )

    # Check MCP servers
    mcp_servers = mix.system.list_mcp_servers()
    connected_servers = [s for s in mcp_servers if s.connected]
    mcp_ok = len(connected_servers) > 0
    print(
        f"   MCP Servers: {'✅' if mcp_ok else '❌'} ({len(connected_servers)}/{len(mcp_servers)} connected)"
    )

    # Overall integration status
    integration_ready = health_ok and commands_ok
    print(
        f"\n2. Overall Integration Status: {'✅ READY' if integration_ready else '❌ NOT READY'}"
    )

    if integration_ready:
        print("   System is ready for integration and development")
        total_tools = sum(len(s.tools) if s.tools else 0 for s in connected_servers)
        print(f"   Total available tools: {total_tools}")
    else:
        print("   System may have issues - check individual components above")


def demonstrate_capability_discovery(mix):
    """Demonstrate system introspection and capability discovery"""
    print("\n=== Capability Discovery Demo ===")

    print("1. Discovering system capabilities...")

    # Get comprehensive system information
    health = mix.system.get_health()
    commands = mix.system.list_commands()
    mcp_servers = mix.system.list_mcp_servers()

    print(f"   System Version: {health.version}")
    print(f"   Total Commands: {len(commands)}")
    print(f"   Total MCP Servers: {len(mcp_servers)}")

    # Categorize commands by type (simple heuristic)
    api_commands = [c for c in commands if "api" in c.name.lower()]
    system_commands = [c for c in commands if "system" in c.name.lower()]
    other_commands = [
        c for c in commands if c not in api_commands and c not in system_commands
    ]

    print("\n2. Command categorization:")
    print(f"   API Commands: {len(api_commands)}")
    print(f"   System Commands: {len(system_commands)}")
    print(f"   Other Commands: {len(other_commands)}")

    # MCP server capabilities
    connected_servers = [s for s in mcp_servers if s.connected]
    total_tools = sum(len(s.tools) if s.tools else 0 for s in connected_servers)

    print("\n3. MCP ecosystem capabilities:")
    print(f"   Connected Servers: {len(connected_servers)}")
    print(f"   Available Tools: {total_tools}")

    if connected_servers:
        print("   Server capabilities:")
        for server in connected_servers:
            tool_count = len(server.tools) if server.tools else 0
            print(f"     • {server.name}: {tool_count} tools")


def main():
    """Main function demonstrating Mix SDK system functionality"""
    # Load environment variables from .env file
    load_dotenv()

    # Get server URL from environment (no API key needed for system operations)
    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    print("=" * 60)
    print("MIX PYTHON SDK - SYSTEM EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all system functionality")
    print("No API keys required for system operations")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        # Always start with system health check
        health = mix.system.get_health()
        print(f"Initial system health: {health.status}")

        # Call each demonstration function in logical order
        demonstrate_health_monitoring(mix)
        demonstrate_command_discovery(mix)
        demonstrate_mcp_server_monitoring(mix)
        demonstrate_integration_verification(mix)
        demonstrate_capability_discovery(mix)

        print("\n" + "=" * 60)
        print("SYSTEM EXAMPLE COMPLETED SUCCESSFULLY")
        print("=" * 60)


if __name__ == "__main__":
    main()
