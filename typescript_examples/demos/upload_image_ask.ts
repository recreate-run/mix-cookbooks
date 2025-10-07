#!/usr/bin/env tsx
/**
 * Image upload and analysis demo - upload image and ask questions about it.
 */

import { config } from "dotenv";
import { Mix } from "mix-typescript-sdk";
import { sendWithCallbacks } from "../helpers.js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    title: "Image Analysis Demo",
  });

  // Upload image file
  const imagePath = resolve(__dirname, "../../sample_files/sample.jpg");
  const imageContent = readFileSync(imagePath);
  const imageFile = new File([imageContent], "sample.jpg", {
    type: "image/jpeg",
  });

  const fileInfo = await mix.files.upload({
    id: session.id,
    requestBody: {
      file: imageFile,
    },
  });

  console.log(`Uploaded: ${fileInfo.url}\n`);

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

  // Ask about the image
  await sendWithCallbacks(
    mix,
    session.id,
    `Explain ${fileInfo.url}`,
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
