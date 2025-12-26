import { DateFilterService } from './dateFilterService'

/**
 * Unit tests for DateFilterService
 * Feature: pdf-export-feature, Property 1: Date Range Filtering Inclusivity
 * Validates: Requirements 1.2, 2.2
 */

describe('DateFilterService - Property 1: Date Range Filtering Inclusivity', () => {
  it('should only include transactions within the date range (inclusive)', () => {
    const transactions = [
      { id: 1, date: '2024-01-05', item: 'Item 1', quantity: 10, user: 'User 1' },
      { id: 2, date: '2024-01-15', item: 'Item 2', quantity: 20, user: 'User 2' },
      { id: 3, date: '2024-02-05', item: 'Item 3', quantity: 30, user: 'User 3' },
    ]

    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    const filtered = DateFilterService.filterByDateRange(transactions, startDate, endDate)

    expect(filtered.length).toBe(2)
    expect(filtered.map(t => t.id)).toContain(1)
    expect(filtered.map(t => t.id)).toContain(2)
    expect(filtered.map(t => t.id)).not.toContain(3)
  })

  it('should include transactions on start and end dates (inclusive boundaries)', () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    const transactions = [
      { id: 1, date: '2024-01-01', item: 'Item 1', quantity: 10, user: 'User 1' },
      { id: 2, date: '2024-01-31', item: 'Item 2', quantity: 20, user: 'User 2' },
    ]

    const filtered = DateFilterService.filterByDateRange(transactions, startDate, endDate)

    expect(filtered.length).toBe(2)
    expect(filtered.map(t => t.id)).toContain(1)
    expect(filtered.map(t => t.id)).toContain(2)
  })

  it('should return empty array when no transactions match date range', () => {
    const transactions = [
      { id: 1, date: '2023-12-31', item: 'Item 1', quantity: 10, user: 'User 1' },
      { id: 2, date: '2025-01-01', item: 'Item 2', quantity: 20, user: 'User 2' },
    ]

    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-12-31')

    const filtered = DateFilterService.filterByDateRange(transactions, startDate, endDate)

    expect(filtered.length).toBe(0)
  })
})
