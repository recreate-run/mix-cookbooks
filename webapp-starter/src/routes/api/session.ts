/**
 * API route for creating and managing Mix sessions.
 */

import { createFileRoute } from '@tanstack/react-router'
import { getMixClient, initializeMixPreferences } from '@/lib/mix-client'

export const Route = createFileRoute('/api/session')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { title } = body

          const mix = getMixClient()

          // Initialize preferences
          await initializeMixPreferences(mix)

          // Create session
          const session = await mix.sessions.create({
            title: title || 'Portfolio Analysis',
          })

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
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error: any) {
          console.error('Session creation error:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: error.message || 'Failed to create session',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
      },
    },
  },
})
