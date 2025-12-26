'use client'

import { useState } from 'react'

export interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void
  disabled?: boolean
  label?: string
}

export function DateRangePicker({
  onDateRangeChange,
  disabled = false,
  label = 'Select Date Range',
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStartDate(value)
    setError(null)
    validateAndNotify(value, endDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEndDate(value)
    setError(null)
    validateAndNotify(startDate, value)
  }

  const validateAndNotify = (start: string, end: string) => {
    if (!start || !end) return

    const startDateObj = new Date(start)
    const endDateObj = new Date(end)

    if (startDateObj > endDateObj) {
      setError('End date must be after start date')
      return
    }

    onDateRangeChange(startDateObj, endDateObj)
  }

  return (
    <div className="space-y-3">
      <label className="block text-base font-semibold text-foreground">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            disabled={disabled}
            className="w-full px-4 py-2 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-muted-foreground mb-1">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            disabled={disabled}
            className="w-full px-4 py-2 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  )
}
