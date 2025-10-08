import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/icon.png" alt="Mix" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Mix Webapp Examples</h1>
      </Link>

      <div className="flex items-center gap-6">
        <a
          href="https://recreate.run/docs/mix"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--color-mix-primary)] dark:hover:text-[var(--color-mix-primary)] transition-colors"
        >
          Docs
        </a>
        <a
          href="https://github.com/recreate-run/mix"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--color-mix-primary)] dark:hover:text-[var(--color-mix-primary)] transition-colors"
        >
          GitHub
        </a>
      </div>
    </header>
  )
}
