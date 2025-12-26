/**
 * Service for filtering data by date ranges
 */

export interface DateRange {
  startDate: Date
  endDate: Date
}

export class DateFilterService {
  /**
   * Filters items by date range (inclusive)
   * @param items - Array of items with date property
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns Filtered array of items within date range
   */
  static filterByDateRange<T extends { date: string }>(
    items: T[],
    startDate: Date,
    endDate: Date
  ): T[] {
    return items.filter(item => this.isDateInRange(item.date, startDate, endDate))
  }

  /**
   * Checks if a date string falls within a date range (inclusive)
   * @param dateString - Date string in ISO format (YYYY-MM-DD)
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns True if date is within range
   */
  static isDateInRange(dateString: string, startDate: Date, endDate: Date): boolean {
    const date = new Date(dateString)
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Set times to start of day for comparison
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    date.setHours(0, 0, 0, 0)

    return date >= start && date <= end
  }

  /**
   * Formats a date for display
   * @param date - Date to format
   * @returns Formatted date string (YYYY-MM-DD)
   */
  static formatDateForDisplay(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * Formats a date for filename
   * @param date - Date to format
   * @returns Formatted date string (YYYY-MM-DD)
   */
  static formatDateForFilename(date: Date): string {
    return this.formatDateForDisplay(date)
  }
}
