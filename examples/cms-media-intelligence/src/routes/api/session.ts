import { createFileRoute } from "@tanstack/react-router";
import { getMixClient, initializeMixPreferences } from "@/lib/mix-client";

export const Route = createFileRoute("/api/session")({
	server: {
		handlers: {
			POST: async () => {
				try {
					console.log("[API Session] Creating new Mix session");
					const mix = getMixClient();
					console.log("[API Session] Initializing Mix preferences");
					await initializeMixPreferences(mix);

					console.log("[API Session] Creating session with Mix SDK");
					const session = await mix.sessions.create({
						title: "CMS Media Intelligence Session",
					});
					console.log("[API Session] Session created successfully:", session.id);

					return new Response(JSON.stringify({ success: true, session }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("[API Session] Failed to create session:", error);
					return new Response(
						JSON.stringify({
							success: false,
							error: error instanceof Error ? error.message : "Unknown error",
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
