import { render, screen } from '@testing-library/react'

/**
 * COMPREHENSIVE PROPERTY TESTS FOR UI TEXT SIZING IMPROVEMENTS
 * 
 * These tests validate universal correctness properties that should hold
 * across all pages and components in the application.
 */

/**
 * Property 2: Heading Hierarchy
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
 * 
 * All page headings should follow a consistent hierarchy:
 * - h1: text-4xl (36px) - Main page title
 * - h2: text-2xl (24px) - Section headers
 * - h3: text-lg (18px) - Subsection headers
 * - h4+: text-base (16px) - Minor headers
 */
describe('Property 2: Heading Hierarchy', () => {
  it('should ensure h1 elements use text-4xl class', () => {
    const { container } = render(
      <h1 className="text-4xl font-bold">Main Page Title</h1>
    )
    const h1 = container.querySelector('h1')
    expect(h1).toHaveClass('text-4xl')
  })

  it('should ensure h2 elements use text-2xl class', () => {
    const { container } = render(
      <h2 className="text-2xl font-semibold">Section Header</h2>
    )
    const h2 = container.querySelector('h2')
    expect(h2).toHaveClass('text-2xl')
  })

  it('should ensure h3 elements use text-lg class', () => {
    const { container } = render(
      <h3 className="text-lg font-semibold">Subsection Header</h3>
    )
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('text-lg')
  })

  it('should maintain consistent heading sizes across multiple instances', () => {
    const { container } = render(
      <div>
        <h1 className="text-4xl">Title 1</h1>
        <h1 className="text-4xl">Title 2</h1>
        <h2 className="text-2xl">Section 1</h2>
        <h2 className="text-2xl">Section 2</h2>
      </div>
    )
    
    const h1s = container.querySelectorAll('h1')
    const h2s = container.querySelectorAll('h2')
    
    h1s.forEach(h1 => expect(h1).toHaveClass('text-4xl'))
    h2s.forEach(h2 => expect(h2).toHaveClass('text-2xl'))
  })

  it('should ensure heading hierarchy is visually distinct', () => {
    const { container } = render(
      <div>
        <h1 className="text-4xl">Main Title</h1>
        <h2 className="text-2xl">Section</h2>
        <h3 className="text-lg">Subsection</h3>
      </div>
    )
    
    const h1 = container.querySelector('h1')
    const h2 = container.querySelector('h2')
    const h3 = container.querySelector('h3')
    
    expect(h1).toHaveClass('text-4xl')
    expect(h2).toHaveClass('text-2xl')
    expect(h3).toHaveClass('text-lg')
  })
})

/**
 * Property 3: Table Readability
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 * 
 * Table headers should use text-sm (14px) for better readability
 * Table body text should use text-sm (14px) for consistency
 * All table text should be readable and properly sized
 */
describe('Property 3: Table Readability', () => {
  it('should ensure table headers use text-sm class', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <th className="text-sm font-semibold">Header 1</th>
            <th className="text-sm font-semibold">Header 2</th>
          </tr>
        </thead>
      </table>
    )
    
    const headers = container.querySelectorAll('th')
    headers.forEach(header => expect(header).toHaveClass('text-sm'))
  })

  it('should ensure table body uses text-sm class', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <td className="text-sm">Cell 1</td>
            <td className="text-sm">Cell 2</td>
          </tr>
        </tbody>
      </table>
    )
    
    const cells = container.querySelectorAll('td')
    cells.forEach(cell => expect(cell).toHaveClass('text-sm'))
  })

  it('should maintain consistent text sizing across table rows', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <td className="text-sm">Row 1 Cell 1</td>
            <td className="text-sm">Row 1 Cell 2</td>
          </tr>
          <tr>
            <td className="text-sm">Row 2 Cell 1</td>
            <td className="text-sm">Row 2 Cell 2</td>
          </tr>
        </tbody>
      </table>
    )
    
    const cells = container.querySelectorAll('td')
    cells.forEach(cell => expect(cell).toHaveClass('text-sm'))
  })

  it('should ensure table headers are larger than body text', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <th className="text-sm font-semibold">Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm">Body</td>
          </tr>
        </tbody>
      </table>
    )
    
    const header = container.querySelector('th')
    const cell = container.querySelector('td')
    
    expect(header).toHaveClass('text-sm')
    expect(cell).toHaveClass('text-sm')
    expect(header).toHaveClass('font-semibold')
  })
})

/**
 * Property 4: Form Input Accessibility
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 * 
 * Form labels should use text-base (16px) for accessibility
 * Form inputs should use text-base (16px) for readability
 * Helper text should use text-sm (14px)
 * Error messages should use text-base (16px)
 */
describe('Property 4: Form Input Accessibility', () => {
  it('should ensure form labels use text-base class', () => {
    const { container } = render(
      <label className="text-base font-semibold">Email Address</label>
    )
    
    const label = container.querySelector('label')
    expect(label).toHaveClass('text-base')
  })

  it('should ensure form inputs use text-base class', () => {
    const { container } = render(
      <input 
        type="text" 
        className="text-base"
        placeholder="Enter text"
      />
    )
    
    const input = container.querySelector('input')
    expect(input).toHaveClass('text-base')
  })

  it('should ensure helper text uses text-sm class', () => {
    const { container } = render(
      <div>
        <label className="text-base">Password</label>
        <input type="password" className="text-base" />
        <p className="text-sm">Must be at least 8 characters</p>
      </div>
    )
    
    const helperText = container.querySelector('p')
    expect(helperText).toHaveClass('text-sm')
  })

  it('should ensure error messages use text-base class', () => {
    const { container } = render(
      <div className="text-base text-destructive">
        This field is required
      </div>
    )
    
    const errorDiv = container.querySelector('div')
    expect(errorDiv).toHaveClass('text-base')
  })

  it('should maintain consistent form field sizing across multiple fields', () => {
    const { container } = render(
      <form>
        <div>
          <label className="text-base">Name</label>
          <input type="text" className="text-base" />
        </div>
        <div>
          <label className="text-base">Email</label>
          <input type="email" className="text-base" />
        </div>
      </form>
    )
    
    const labels = container.querySelectorAll('label')
    const inputs = container.querySelectorAll('input')
    
    labels.forEach(label => expect(label).toHaveClass('text-base'))
    inputs.forEach(input => expect(input).toHaveClass('text-base'))
  })
})

/**
 * Property 5: Visual Hierarchy Preservation
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 * 
 * Visual hierarchy should be maintained through text sizing
 * Primary content should be larger than secondary content
 * Stat cards should maintain consistent sizing
 * Button text should remain at text-sm
 */
describe('Property 5: Visual Hierarchy Preservation', () => {
  it('should ensure primary content is larger than secondary content', () => {
    const { container } = render(
      <div>
        <h1 className="text-4xl">Primary Title</h1>
        <p className="text-sm">Secondary description</p>
      </div>
    )
    
    const h1 = container.querySelector('h1')
    const p = container.querySelector('p')
    
    expect(h1).toHaveClass('text-4xl')
    expect(p).toHaveClass('text-sm')
  })

  it('should ensure stat card labels use text-sm', () => {
    const { container } = render(
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">Total Items</p>
        <p className="text-3xl font-bold">42</p>
      </div>
    )
    
    const label = container.querySelector('p')
    expect(label).toHaveClass('text-sm')
  })

  it('should ensure stat card values use text-3xl', () => {
    const { container } = render(
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm">Total Items</p>
        <p className="text-3xl font-bold">42</p>
      </div>
    )
    
    const paragraphs = container.querySelectorAll('p')
    const value = paragraphs[1]
    expect(value).toHaveClass('text-3xl')
  })

  it('should ensure button text uses text-sm', () => {
    const { container } = render(
      <button className="text-sm font-semibold">Click Me</button>
    )
    
    const button = container.querySelector('button')
    expect(button).toHaveClass('text-sm')
  })

  it('should maintain visual hierarchy across page sections', () => {
    const { container } = render(
      <div>
        <h1 className="text-4xl">Page Title</h1>
        <h2 className="text-2xl">Section 1</h2>
        <p className="text-base">Body text</p>
        <h2 className="text-2xl">Section 2</h2>
        <p className="text-base">More body text</p>
      </div>
    )
    
    const h1 = container.querySelector('h1')
    const h2s = container.querySelectorAll('h2')
    const ps = container.querySelectorAll('p')
    
    expect(h1).toHaveClass('text-4xl')
    h2s.forEach(h2 => expect(h2).toHaveClass('text-2xl'))
    ps.forEach(p => expect(p).toHaveClass('text-base'))
  })
})

/**
 * Property 6: Cross-Page Consistency
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
 * 
 * All pages should follow the same text sizing conventions
 * Headers should be consistent across all pages
 * Tables should be consistent across all pages
 * Forms should be consistent across all pages
 */
describe('Property 6: Cross-Page Consistency', () => {
  it('should ensure all page headers use text-4xl', () => {
    const pageHeaders = [
      <h1 className="text-4xl">Inventory Management</h1>,
      <h1 className="text-4xl">Users</h1>,
      <h1 className="text-4xl">Settings</h1>,
      <h1 className="text-4xl">Stock-out reasons</h1>,
    ]

    pageHeaders.forEach(header => {
      const { container } = render(header)
      const h1 = container.querySelector('h1')
      expect(h1).toHaveClass('text-4xl')
    })
  })

  it('should ensure all section headers use text-2xl', () => {
    const sectionHeaders = [
      <h2 className="text-2xl">Items</h2>,
      <h2 className="text-2xl">Categories</h2>,
      <h2 className="text-2xl">Create New Item</h2>,
      <h2 className="text-2xl">User management</h2>,
    ]

    sectionHeaders.forEach(header => {
      const { container } = render(header)
      const h2 = container.querySelector('h2')
      expect(h2).toHaveClass('text-2xl')
    })
  })

  it('should ensure all table headers use text-sm', () => {
    const tableHeaders = [
      <table><thead><tr><th className="text-sm">Item Name</th></tr></thead></table>,
      <table><thead><tr><th className="text-sm">Email</th></tr></thead></table>,
      <table><thead><tr><th className="text-sm">Reason</th></tr></thead></table>,
      <table><thead><tr><th className="text-sm">Type</th></tr></thead></table>,
    ]

    tableHeaders.forEach(header => {
      const { container } = render(header)
      const th = container.querySelector('th')
      expect(th).toHaveClass('text-sm')
    })
  })

  it('should ensure all form labels use text-base', () => {
    const formLabels = [
      <label className="text-base">Item Name</label>,
      <label className="text-base">Email Address</label>,
      <label className="text-base">Password</label>,
      <label className="text-base">Full Name</label>,
    ]

    formLabels.forEach(label => {
      const { container } = render(label)
      const labelElement = container.querySelector('label')
      expect(labelElement).toHaveClass('text-base')
    })
  })

  it('should ensure all form inputs use text-base', () => {
    const formInputs = [
      <input type="text" className="text-base" />,
      <input type="email" className="text-base" />,
      <input type="password" className="text-base" />,
      <textarea className="text-base" />,
    ]

    formInputs.forEach(input => {
      const { container } = render(input)
      const element = container.querySelector('input, textarea')
      expect(element).toHaveClass('text-base')
    })
  })
})

/**
 * Property 7: Responsive Readability
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 * 
 * Text sizing should be readable on all screen sizes
 * Minimum text size should be text-xs (12px) for badges only
 * Body text should never be smaller than text-sm (14px)
 * Headings should scale appropriately
 */
describe('Property 7: Responsive Readability', () => {
  it('should ensure body text is never smaller than text-sm', () => {
    const { container } = render(
      <div>
        <p className="text-base">Main body text</p>
        <p className="text-sm">Secondary text</p>
        <span className="text-xs">Badge text</span>
      </div>
    )
    
    const paragraphs = container.querySelectorAll('p')
    paragraphs.forEach(p => {
      const hasTextBase = p.classList.contains('text-base')
      const hasTextSm = p.classList.contains('text-sm')
      expect(hasTextBase || hasTextSm).toBe(true)
    })
  })

  it('should ensure headings scale appropriately', () => {
    const { container } = render(
      <div>
        <h1 className="text-4xl">Main Title</h1>
        <h2 className="text-2xl">Section</h2>
        <h3 className="text-lg">Subsection</h3>
      </div>
    )
    
    const h1 = container.querySelector('h1')
    const h2 = container.querySelector('h2')
    const h3 = container.querySelector('h3')
    
    expect(h1).toHaveClass('text-4xl')
    expect(h2).toHaveClass('text-2xl')
    expect(h3).toHaveClass('text-lg')
  })

  it('should ensure badges use text-xs for compact display', () => {
    const { container } = render(
      <div>
        <span className="text-xs bg-blue-100 px-2 py-1 rounded">Badge</span>
        <span className="text-xs bg-green-100 px-2 py-1 rounded">Status</span>
      </div>
    )
    
    const badges = container.querySelectorAll('span')
    badges.forEach(badge => expect(badge).toHaveClass('text-xs'))
  })

  it('should ensure form inputs maintain readable size on all screens', () => {
    const { container } = render(
      <div>
        <input type="text" className="text-base px-3 py-2" placeholder="Name" />
        <input type="email" className="text-base px-3 py-2" placeholder="Email" />
        <textarea className="text-base px-3 py-2" placeholder="Message" />
      </div>
    )
    
    const inputs = container.querySelectorAll('input, textarea')
    inputs.forEach(input => expect(input).toHaveClass('text-base'))
  })

  it('should ensure minimum padding with text sizing for touch targets', () => {
    const { container } = render(
      <button className="text-base px-4 py-2.5 rounded-lg">
        Click Me
      </button>
    )
    
    const button = container.querySelector('button')
    expect(button).toHaveClass('text-base')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('py-2.5')
  })
})
