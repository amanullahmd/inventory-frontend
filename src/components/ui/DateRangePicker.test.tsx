import { render, screen, fireEvent } from '@testing-library/react'
import { DateRangePicker } from './DateRangePicker'

describe('DateRangePicker Component', () => {
  it('should render date input fields', () => {
    const mockCallback = jest.fn()
    render(<DateRangePicker onDateRangeChange={mockCallback} />)

    const startInput = screen.getByLabelText(/start date/i)
    const endInput = screen.getByLabelText(/end date/i)

    expect(startInput).toBeInTheDocument()
    expect(endInput).toBeInTheDocument()
  })

  it('should call onDateRangeChange when valid dates are selected', () => {
    const mockCallback = jest.fn()
    render(<DateRangePicker onDateRangeChange={mockCallback} />)

    const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement
    const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement

    fireEvent.change(startInput, { target: { value: '2024-01-01' } })
    fireEvent.change(endInput, { target: { value: '2024-01-31' } })

    expect(mockCallback).toHaveBeenCalled()
    const [startDate, endDate] = mockCallback.mock.calls[mockCallback.mock.calls.length - 1]
    expect(startDate.toISOString().split('T')[0]).toBe('2024-01-01')
    expect(endDate.toISOString().split('T')[0]).toBe('2024-01-31')
  })

  it('should show error when end date is before start date', () => {
    const mockCallback = jest.fn()
    render(<DateRangePicker onDateRangeChange={mockCallback} />)

    const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement
    const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement

    fireEvent.change(startInput, { target: { value: '2024-01-31' } })
    fireEvent.change(endInput, { target: { value: '2024-01-01' } })

    expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument()
  })

  it('should disable inputs when disabled prop is true', () => {
    const mockCallback = jest.fn()
    render(<DateRangePicker onDateRangeChange={mockCallback} disabled={true} />)

    const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement
    const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement

    expect(startInput.disabled).toBe(true)
    expect(endInput.disabled).toBe(true)
  })

  it('should clear error when dates are corrected', () => {
    const mockCallback = jest.fn()
    render(<DateRangePicker onDateRangeChange={mockCallback} />)

    const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement
    const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement

    // Set invalid range
    fireEvent.change(startInput, { target: { value: '2024-01-31' } })
    fireEvent.change(endInput, { target: { value: '2024-01-01' } })
    expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument()

    // Fix the range
    fireEvent.change(endInput, { target: { value: '2024-02-01' } })
    expect(screen.queryByText(/end date must be after start date/i)).not.toBeInTheDocument()
  })

  it('should accept custom label', () => {
    const mockCallback = jest.fn()
    render(
      <DateRangePicker
        onDateRangeChange={mockCallback}
        label="Custom Date Range"
      />
    )

    expect(screen.getByText('Custom Date Range')).toBeInTheDocument()
  })
})
