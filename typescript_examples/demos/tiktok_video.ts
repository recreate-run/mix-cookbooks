#!/usr/bin/env tsx
/**
 * TikTok video creation demo - find video and create short clip.
 */

import { config } from "dotenv";
import { Mix } from "mix-typescript-sdk";
import { sendWithCallbacks } from "../helpers.js";

config();

async function main() {
  const mix = new Mix({
    serverURL: process.env.MIX_SERVER_URL,
  });

  // Update preferences
  await mix.preferences.update({
    preferred_provider: "anthropic",
    main_agent_model: "claude-sonnet-4-5",
  });

  // Create session
  const session = await mix.sessions.create({
    title: "TikTok Video Demo",
  });

  // Handle tool events
  function handleTool(tool: any) {
    if (tool.name !== "show_media" || !tool.input) return;

    try {
      const input = typeof tool.input === "string" ? JSON.parse(tool.input) : tool.input;
      const outputs = input.outputs || [];

      for (const output of outputs) {
        console.log(`\n${output.title}`);
        if (output.description) console.log(`   ${output.description}`);
        if (output.path) console.log(`   ${output.path}`);
        console.log();
      }
    } catch (e) {
      // Silently ignore parse errors
    }
  }

  // Create TikTok video
  await sendWithCallbacks(
    mix,
    session.id,
    "Find the top cat video and create a 5 sec tiktok video from it. Add a title animation. Export it and show.",
    {
      onTool: handleTool,
      onContent: (text) => {
        // Add line breaks after periods before capital letters for readability
        const formatted = text.replace(/(\.)([A-Z])/g, "$1\n$2");
        process.stdout.write(formatted);
      },
      onError: (error) => console.log(`\n❌ ${error}`),
    }
  );
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
