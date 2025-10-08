/**
 * API route for streaming Mix events via Server-Sent Events (SSE).
 */

import { createFileRoute } from '@tanstack/react-router'
import { getMixClient } from '@/lib/mix-client'

export const Route = createFileRoute('/api/stream/$sessionId')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { sessionId } = params
        const url = new URL(request.url)
        const message = url.searchParams.get('message')

        if (!message) {
          return new Response('Missing message parameter', { status: 400 })
        }

        const mix = getMixClient()

        // Create a ReadableStream for SSE
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder()

            function send(event: string, data: any) {
              const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
              controller.enqueue(encoder.encode(message))
            }

            try {
              // Start the event stream
              const streamResponse = await mix.streaming.streamEvents({
                sessionId,
              })

              // Allow stream connection to establish
              await new Promise((resolve) => setTimeout(resolve, 500))

              // Start sending the message in parallel
              const sendPromise = mix.messages.send({
                id: sessionId,
                requestBody: {
                  text: message,
                },
              })

              // Process events from the stream
              for await (const event of streamResponse.result) {
                if (!event.data) continue

                const eventType = event.event
                const eventData = event.data

                // Forward the event to the client
                send(eventType, eventData)

                // If complete event, wait for send to complete and close
                if (eventType === 'complete') {
                  await sendPromise
                  controller.close()
                  return
                }
              }

              // If stream ends without complete event, wait for send
              await sendPromise
              controller.close()
            } catch (error: any) {
              send('error', { error: error.message || 'Stream error' })
              controller.close()
            }
          },
        })

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        })
      },
    },
  },
})
