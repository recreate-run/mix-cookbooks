/**
 * API route for creating Mix sessions.
 */

import { createFileRoute } from "@tanstack/react-router";
import { getMixClient, initializeMixPreferences } from "@/lib/mix-client";

export const Route = createFileRoute("/api/session")({
	server: {
		handlers: {
			POST: async () => {
				try {
					const mix = getMixClient();

					// Initialize preferences
					await initializeMixPreferences(mix);

					// Create session
					const session = await mix.sessions.create({
						title: "Product Comparison",
					});

					return new Response(
						JSON.stringify({
							success: true,
							session: {
								id: session.id,
								title: session.title,
								created_at: session.created_at,
							},
						}),
						{
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
				} catch (error: unknown) {
					console.error("Session creation error:", error);
					return new Response(
						JSON.stringify({
							success: false,
							error: error instanceof Error ? error.message : "Unknown error",
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
