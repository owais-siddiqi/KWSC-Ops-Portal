import type { ReactNode } from 'react'

export interface TableColumn<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  emptyMessage?: string
  getRowKey: (item: T) => string
  onRowClick?: (item: T) => void
}

export default function Table<T>({ 
  columns, 
  data, 
  emptyMessage = 'No data found',
  getRowKey,
  onRowClick
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.className || ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr 
                key={getRowKey(item)} 
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 ${
                      column.className?.includes('whitespace-nowrap') 
                        ? 'whitespace-nowrap' 
                        : ''
                    } ${column.className || ''}`}
                  >
                    {column.render ? column.render(item) : String((item as any)[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

