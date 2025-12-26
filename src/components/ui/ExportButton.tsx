'use client'

import { useState } from 'react'

export interface ExportButtonProps {
  onClick: () => void | Promise<void>
  disabled?: boolean
  loading?: boolean
  exportType?: 'stock-in' | 'stock-out' | 'inventory' | 'stock-movements' | 'report'
  label?: string
}

export function ExportButton({
  onClick,
  disabled = false,
  loading: externalLoading = false,
  exportType = 'inventory',
  label = 'Export to PDF',
}: ExportButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading || internalLoading

  const handleClick = async () => {
    setInternalLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  const getButtonColor = () => {
    switch (exportType) {
      case 'stock-in':
        return 'bg-primary hover:bg-primary/90'
      case 'stock-out':
        return 'bg-primary hover:bg-primary/90'
      case 'stock-movements':
        return 'bg-primary hover:bg-primary/90'
      case 'report':
        return 'bg-primary hover:bg-primary/90'
      case 'inventory':
      default:
        return 'bg-primary hover:bg-primary/90'
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColor()}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : (
        <>{label}</>
      )}
    </button>
  )
}
