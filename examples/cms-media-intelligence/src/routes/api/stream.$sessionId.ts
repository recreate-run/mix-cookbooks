import { createFileRoute } from "@tanstack/react-router";
import { getMixClient } from "@/lib/mix-client";

export const Route = createFileRoute("/api/stream/$sessionId")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const { sessionId } = params;
				const url = new URL(request.url);
				const message = url.searchParams.get("message");

				console.log("[API Stream] Request for session:", sessionId);
				console.log("[API Stream] Message length:", message?.length);

				if (!message) {
					console.error("[API Stream] Missing message parameter");
					return new Response("Missing message parameter", { status: 400 });
				}

				const mix = getMixClient();

				const stream = new ReadableStream({
					async start(controller) {
						const encoder = new TextEncoder();

						function send(event: string, data: unknown) {
							const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
							console.log("[API Stream] Sending event:", event, "data:", JSON.stringify(data).substring(0, 100));
							controller.enqueue(encoder.encode(message));
						}

						try {
							console.log("[API Stream] Creating stream for session:", sessionId);
							const streamResponse = await mix.streaming.streamEvents({
								sessionId,
							});
							console.log("[API Stream] Stream created successfully");

							// Start sending message in parallel
							console.log("[API Stream] Sending message to Mix");
							const sendPromise = mix.messages.send({
								id: sessionId,
								requestBody: { text: message },
							});

							// Process events from stream
							console.log("[API Stream] Starting to process events");
							for await (const event of streamResponse.result) {
								if (!event.data) {
									console.log("[API Stream] Skipping event with no data:", event.event);
									continue;
								}
								console.log("[API Stream] Processing event:", event.event);
								send(event.event, event.data);

								if (event.event === "complete") {
									console.log("[API Stream] Received complete event, waiting for send promise");
									await sendPromise;
									console.log("[API Stream] Send promise completed, closing stream");
									controller.close();
									return;
								}
							}

							console.log("[API Stream] Stream loop ended, waiting for send promise");
							await sendPromise;
							console.log("[API Stream] Closing controller");
							controller.close();
						} catch (error: unknown) {
							console.error("[API Stream] Error in stream:", error);
							send("error", {
								error: error instanceof Error ? error.message : "Stream error",
							});
							controller.close();
						}
					},
				});

				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache",
						Connection: "keep-alive",
					},
				});
			},
		},
	},
});
