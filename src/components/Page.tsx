import type { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
  className?: string
}

/**
 * Base Page component that provides consistent layout structure
 * for all pages in the application
 */
export default function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  )
}

