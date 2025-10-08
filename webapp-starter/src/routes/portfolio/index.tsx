/**
 * Portfolio upload page - main entry point for portfolio analysis.
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { TrendingUp, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/portfolio/')({
  component: PortfolioUpload,
})

function PortfolioUpload() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      // Step 1: Create a Mix session
      const sessionResponse = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Portfolio Analysis - ${selectedFile.name}`,
        }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session')
      }

      const sessionData = await sessionResponse.json()
      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Failed to create session')
      }

      const sessionId = sessionData.session.id

      // Step 2: Upload the file
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('sessionId', sessionId)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      const uploadData = await uploadResponse.json()
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload file')
      }

      // Step 3: Navigate to analysis page
      navigate({
        to: '/portfolio/analyze/$sessionId',
        params: { sessionId },
        search: { fileUrl: uploadData.file.url },
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-mix-primary) 10%, transparent)' }}>
            <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-mix-primary)' }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Portfolio Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your portfolio CSV to get AI-powered insights and visualizations
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mb-6 shadow-sm">
          <FileUploader onFileSelect={handleFileSelect} />

          {selectedFile && (
            <button
              onClick={handleAnalyze}
              disabled={isUploading}
              className="w-full mt-6 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: isUploading ? '#6b7280' : 'var(--color-mix-primary)' }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Portfolio'
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
