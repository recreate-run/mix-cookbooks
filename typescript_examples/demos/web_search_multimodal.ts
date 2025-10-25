#!/usr/bin/env tsx
/**
 * Web search multimodal demo - find and download video clips.
 */

import { config } from "dotenv";
import { Mix } from "mix-typescript-sdk";
import { sendWithCallbacks } from "../helpers.js";
import { uploadToStorage } from "../utils.js";

config();

async function main() {
  const mix = new Mix({
    serverURL: process.env.MIX_SERVER_URL,
  });

  // Update preferences
  await mix.preferences.update({
    preferredProvider: "anthropic",
    mainAgentModel: "claude-sonnet-4-5",
  });

  // Create session
  const session = await mix.sessions.create({
    title: "Web search multimodal demo",
  });

  const downloadedFiles: string[] = [];

  // Handle tool events
  function handleTool(tool: any) {
    if (tool.name !== "ShowMedia" || !tool.input) return;

    try {
      const input = typeof tool.input === "string" ? JSON.parse(tool.input) : tool.input;
      const outputs = input.outputs || [];

      for (const output of outputs) {
        console.log(`\n${output.title}`);
        if (output.description) console.log(`   ${output.description}`);
        if (output.path) {
          console.log(`   ${output.path}`);
          downloadedFiles.push(output.path);
        }
        console.log();
      }
    } catch (e) {
      // Silently ignore parse errors
    }
  }

  // Search and create video clips
  await sendWithCallbacks(
    mix,
    session.id,
    "First, find the top 3 karpathy LLM videos, then find the most important 10 second section from each video. After that, download the sections and show it.",
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

  // Upload downloaded files to storage (local/supabase)
  // Uncomment to enable uploading to storage
  // if (downloadedFiles.length > 0) {
  //   for (const fileUrl of downloadedFiles) {
  //     await uploadToStorage(mix, session.id, fileUrl);
  //   }
  // }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
