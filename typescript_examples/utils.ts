/**
 * Utility functions for Mix TypeScript examples.
 */

import type { Mix } from "mix-typescript-sdk";

/**
 * Download file from a URL and upload to session storage.
 */
export async function uploadToStorage(
  mix: Mix,
  sessionId: string,
  fileUrl: string,
  contentType: string = "video/mp4"
): Promise<any> {
  try {
    // Extract filename from URL
    const filename = fileUrl.split("/").pop() || "downloaded_file";

    // Download file from URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.warn(`⚠️  Failed to download: ${fileUrl}`);
      return null;
    }

    const fileBlob = await response.blob();

    // Upload to session storage
    const fileInfo = await mix.files.upload({
      id: sessionId,
      requestBody: {
        file: new File([fileBlob], filename, { type: contentType }),
      },
    });

    console.log(`✅ Uploaded to storage: ${fileInfo.url}`);
    return fileInfo;
  } catch (error) {
    console.error(`❌ Error uploading file: ${error}`);
    return null;
  }
}
