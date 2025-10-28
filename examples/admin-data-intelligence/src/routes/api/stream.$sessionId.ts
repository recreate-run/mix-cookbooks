import { createFileRoute } from "@tanstack/react-router";
import { getMixClient } from "@/lib/mix-client";

export const Route = createFileRoute("/api/stream/$sessionId")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const { sessionId } = params;
				const url = new URL(request.url);
				const message = url.searchParams.get("message");

				if (!message) {
					return new Response("Missing message parameter", { status: 400 });
				}

				const mix = getMixClient();

				const stream = new ReadableStream({
					async start(controller) {
						const encoder = new TextEncoder();

						function send(event: string, data: unknown) {
							const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
							controller.enqueue(encoder.encode(message));
						}

						try {
							const streamResponse = await mix.streaming.streamEvents({
								sessionId,
							});

							// Start sending message in parallel
							const sendPromise = mix.messages.send({
								id: sessionId,
								requestBody: { text: message },
							});

							// Process events from stream
							for await (const event of streamResponse.result) {
								if (!event.data) continue;

								send(event.event, event.data);

								if (event.event === "complete") {
									await sendPromise;
									controller.close();
									return;
								}
							}

							await sendPromise;
							controller.close();
						} catch (error: unknown) {
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
