/**
 * API route for uploading CSV files to Mix storage.
 */

import { createFileRoute } from "@tanstack/react-router";
import { getMixClient } from "@/lib/mix-client";

export const Route = createFileRoute("/api/upload")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const formData = await request.formData();
					const file = formData.get("file") as File;
					const sessionId = formData.get("sessionId") as string;

					if (!file) {
						return new Response(
							JSON.stringify({
								success: false,
								error: "No file provided",
							}),
							{
								status: 400,
								headers: {
									"Content-Type": "application/json",
								},
							},
						);
					}

					if (!sessionId) {
						return new Response(
							JSON.stringify({
								success: false,
								error: "No session ID provided",
							}),
							{
								status: 400,
								headers: {
									"Content-Type": "application/json",
								},
							},
						);
					}

					console.log("[API Upload] Uploading CSV file:", file.name);
					const mix = getMixClient();

					// Upload file to Mix storage
					const fileInfo = await mix.files.upload({
						id: sessionId,
						requestBody: {
							file,
						},
					});

					console.log("[API Upload] File uploaded successfully:", fileInfo.url);

					return new Response(
						JSON.stringify({
							success: true,
							file: {
								url: fileInfo.url,
								name: file.name,
								size: file.size,
								type: file.type,
							},
						}),
						{
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
				} catch (error: unknown) {
					console.error("[API Upload] File upload error:", error);
					return new Response(
						JSON.stringify({
							success: false,
							error:
								error instanceof Error ? error.message : "Failed to upload file",
						}),
						{
							status: 500,
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
				}
			},
		},
	},
});
