import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { ExportButton } from '@/components/ui/ExportButton'
import { DateFilterService } from '@/lib/services/dateFilterService'

/**
 * Integration tests for PDF export workflows
 * Feature: pdf-export-feature
 */

describe('PDF Export Integration Tests', () => {
  describe('Stock In Export Workflow', () => {
    it('should complete stock in export end-to-end', async () => {
      const mockExport = jest.fn()
      const mockDateChange = jest.fn()

      const { rerender } = render(
        <>
          <DateRangePicker onDateRangeChange={mockDateChange} />
          <ExportButton onClick={mockExport} exportType="stock-in" />
        </>
      )

      // Select date range
      const startInput = screen.getByDisplayValue('')
      fireEvent.change(startInput, { target: { value: '2024-01-01' } })

      await waitFor(() => {
        expect(mockDateChange).toHaveBeenCalled()
      })

      // Click export button
      const exportButton = screen.getByRole('button', { name: /export to pdf/i })
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(mockExport).toHaveBeenCalled()
      })
    })
  })

  describe('Stock Out Export Workflow', () => {
    it('should complete stock out export end-to-end', async () => {
      const mockExport = jest.fn()
      const mockDateChange = jest.fn()

      render(
        <>
          <DateRangePicker onDateRangeChange={mockDateChange} />
          <ExportButton onClick={mockExport} exportType="stock-out" />
        </>
      )

      // Select date range
      const inputs = screen.getAllByDisplayValue('')
      fireEvent.change(inputs[0], { target: { value: '2024-01-01' } })

      await waitFor(() => {
        expect(mockDateChange).toHaveBeenCalled()
      })

      // Click export button
      const exportButton = screen.getByRole('button', { name: /export to pdf/i })
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(mockExport).toHaveBeenCalled()
      })
    })
  })

  describe('Inventory Export Workflow', () => {
    it('should complete inventory export end-to-end', async () => {
      const mockExport = jest.fn()

      render(<ExportButton onClick={mockExport} exportType="inventory" />)

      // Click export button
      const exportButton = screen.getByRole('button', { name: /export to pdf/i })
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(mockExport).toHaveBeenCalled()
      })
    })
  })

  describe('Date Filtering Integration', () => {
    it('should filter transactions correctly by date range', () => {
      const transactions = [
        { id: 1, date: '2024-01-05', item: 'Item 1', quantity: 10, user: 'User 1' },
        { id: 2, date: '2024-01-15', item: 'Item 2', quantity: 20, user: 'User 2' },
        { id: 3, date: '2024-02-05', item: 'Item 3', quantity: 30, user: 'User 3' },
      ]

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      const filtered = DateFilterService.filterByDateRange(transactions, startDate, endDate)

      expect(filtered.length).toBe(2)
      expect(filtered[0].id).toBe(1)
      expect(filtered[1].id).toBe(2)
    })

    it('should handle empty results gracefully', () => {
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

  describe('Export Button States', () => {
    it('should show loading state during export', async () => {
      const mockExport = jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 100)
          })
      )

      render(<ExportButton onClick={mockExport} exportType="inventory" />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Should show loading state
      expect(screen.getByText(/generating/i)).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText(/generating/i)).not.toBeInTheDocument()
      })
    })

    it('should disable button when no date range selected', () => {
      render(<ExportButton onClick={jest.fn()} disabled={true} exportType="stock-in" />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })
})
