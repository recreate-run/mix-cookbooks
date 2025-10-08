import { createFileRoute, Link } from '@tanstack/react-router'
import { TrendingUp, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const demos = [
    {
      title: 'Portfolio Analysis',
      description:
        'Upload CSV files and get AI-powered portfolio analysis with visualizations and insights.',
      icon: <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-mix-primary)' }} />,
      path: '/portfolio',
      tags: ['File Upload', 'AI Analysis', 'Streaming', 'Charts'],
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
        <div className="relative max-w-4xl mx-auto">
          <img src="/icon.png" alt="Mix" className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Mix Webapp Examples
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            AI-powered web applications with TanStack Start
          </p>
          <p className="text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
            Explore interactive demos showcasing real-time AI streaming, file processing, and multimodal workflows
          </p>
        </div>
      </section>

      {/* Demos Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Available Demos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo, index) => (
            <Link
              key={index}
              to={demo.path}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:border-[var(--color-mix-primary)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                '--hover-shadow-color': 'var(--color-mix-primary)',
              } as React.CSSProperties}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-mix-primary) 10%, transparent)' }}>
                    {demo.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-[var(--color-mix-primary)] transition-colors">
                    {demo.title}
                  </h3>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-[var(--color-mix-primary)] group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {demo.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {demo.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            More examples coming soon...
          </p>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-6 max-w-4xl mx-auto border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            About This Project
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This webapp showcases the Mix SDK integrated with TanStack Start. Each demo demonstrates different capabilities like file uploads, real-time AI streaming, and multimodal interactions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://recreate.run/docs/mix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-mix-primary)] hover:underline text-sm transition-colors"
            >
              Mix Docs →
            </a>
            <a
              href="https://github.com/recreate-run/mix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-mix-primary)] hover:underline text-sm transition-colors"
            >
              GitHub →
            </a>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-mix-primary)] hover:underline text-sm transition-colors"
            >
              TanStack Start →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
