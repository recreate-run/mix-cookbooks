/**
 * Portfolio analysis results page with streaming AI responses.
 */

import { createFileRoute } from '@tanstack/react-router'
import { StreamingChat } from '@/components/StreamingChat'
import { TrendingUp, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface AnalyzeSearch {
  fileUrl: string
}

export const Route = createFileRoute('/analyze/$sessionId')({
  validateSearch: (search: Record<string, unknown>): AnalyzeSearch => {
    return {
      fileUrl: (search.fileUrl as string) || '',
    }
  },
  component: PortfolioAnalyze,
})

function PortfolioAnalyze() {
  const { sessionId } = Route.useParams()
  const { fileUrl } = Route.useSearch()

  const analysisMessage = `Look at my portfolio in the data in @${fileUrl} and find the top winners and losers in Q4. Show the three most relevant plots.`

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-colors mb-4"
            style={{
              color: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-mix-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-mix-primary) 10%, transparent)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--color-mix-primary)' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Analysis</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Session ID: {sessionId}</p>
            </div>
          </div>
        </div>

        {/* Streaming Results */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
          <StreamingChat
            sessionId={sessionId}
            message={analysisMessage}
            onComplete={() => {
              console.log('Analysis complete')
            }}
          />
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 The AI is analyzing your portfolio data in real-time. This may take a few moments
            as it processes your data and generates visualizations.
          </p>
        </div>
      </div>
    </div>
  )
}
