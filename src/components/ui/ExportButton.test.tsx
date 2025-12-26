import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExportButton } from './ExportButton'

describe('ExportButton Component', () => {
  it('should render button with label', () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Export to PDF')
  })

  it('should call onClick handler when clicked', async () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockClick).toHaveBeenCalledTimes(1)
    })
  })

  it('should show loading state while exporting', async () => {
    const mockClick = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(resolve, 100)
        })
    )
    render(<ExportButton onClick={mockClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should show loading state
    expect(screen.getByText(/generating/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText(/generating/i)).not.toBeInTheDocument()
    })
  })

  it('should disable button when disabled prop is true', () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should disable button during loading', async () => {
    const mockClick = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(resolve, 100)
        })
    )
    render(<ExportButton onClick={mockClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('should accept custom label', () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} label="Download Report" />)

    expect(screen.getByText(/download report/i)).toBeInTheDocument()
  })

  it('should apply correct color for stock-in export type', () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} exportType="stock-in" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('from-emerald-500')
  })

  it('should apply correct color for stock-out export type', () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} exportType="stock-out" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('from-amber-500')
  })

  it('should apply correct color for inventory export type', () => {
    const mockClick = jest.fn()
    render(<ExportButton onClick={mockClick} exportType="inventory" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('from-blue-500')
  })

  it('should handle errors gracefully', async () => {
    const mockClick = jest.fn().mockRejectedValue(new Error('Export failed'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<ExportButton onClick={mockClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Export failed:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })
})
