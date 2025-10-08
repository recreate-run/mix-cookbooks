/**
 * File uploader component with drag-and-drop support.
 */

import { useState, useCallback } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { cn, formatFileSize, isValidFileType } from '@/lib/utils'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number
}

export function FileUploader({
  onFileSelect,
  acceptedTypes = ['text/csv', 'application/vnd.ms-excel'],
  maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File) => {
      if (!isValidFileType(file, acceptedTypes)) {
        return 'Invalid file type. Please upload a CSV file.'
      }
      if (file.size > maxSize) {
        return `File too large. Maximum size is ${formatFileSize(maxSize)}.`
      }
      return null
    },
    [acceptedTypes, maxSize]
  )

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setSelectedFile(null)
        return
      }

      setError(null)
      setSelectedFile(file)
      onFileSelect(file)
    },
    [validateFile, onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    setSelectedFile(null)
    setError(null)
  }, [])

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        )}
        style={isDragging ? { borderColor: 'var(--color-mix-primary)' } : {}}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!selectedFile ? (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drop your CSV file here, or click to browse
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Maximum file size: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" style={{ color: 'var(--color-mix-primary)' }} />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
