import { createFileRoute } from '@tanstack/react-router';
import { StreamingChat } from '@/components/StreamingChat';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

type AnalyzeSearch = {
  fileUrl: string;
};

export const Route = createFileRoute('/analyze/$sessionId')({
  component: AnalyzePage,
  validateSearch: (search: Record<string, unknown>): AnalyzeSearch => {
    return {
      fileUrl: (search.fileUrl as string) || '',
    };
  },
});

function AnalyzePage() {
  const { sessionId } = Route.useParams();
  const { fileUrl } = Route.useSearch();

  const message = `I've uploaded a portfolio CSV file. Please analyze it and provide:

1. A summary of the portfolio composition
2. Key insights about asset allocation
3. Risk analysis
4. Performance metrics
5. Visualizations of the portfolio distribution

The file is available at: ${fileUrl}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Upload</span>
          </Link>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Portfolio Analysis
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Session: {sessionId}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <StreamingChat
          sessionId={sessionId}
          message={message}
        />
      </div>
    </div>
  );
}
