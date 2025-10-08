/**
 * Data table component for displaying CSV data preview.
 */

interface DataTableProps {
  data: string[][]
  maxRows?: number
}

export function DataTable({ data, maxRows = 10 }: DataTableProps) {
  if (!data || data.length === 0) return null

  const headers = data[0]
  const rows = data.slice(1, maxRows + 1)
  const hasMore = data.length > maxRows + 1

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {maxRows} of {data.length - 1} rows
          </p>
        </div>
      )}
    </div>
  )
}
