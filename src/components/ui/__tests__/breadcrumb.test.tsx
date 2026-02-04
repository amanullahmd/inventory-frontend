import React from 'react'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from '../breadcrumb'

describe('Breadcrumb Component', () => {
  describe('Rendering', () => {
    it('should render breadcrumb navigation', () => {
      render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Items', href: '/items' },
            { label: 'Item Details', current: true },
          ]}
        />
      )

      const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(nav).toBeInTheDocument()
    })

    it('should render all breadcrumb items', () => {
      render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Items', href: '/items' },
            { label: 'Item Details', current: true },
          ]}
        />
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Items')).toBeInTheDocument()
      expect(screen.getByText('Item Details')).toBeInTheDocument()
    })
  })

  describe('Links', () => {
    it('should render links for non-current items', () => {
      render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Items', href: '/items' },
          ]}
        />
      )

      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')

      const itemsLink = screen.getByRole('link', { name: /items/i })
      expect(itemsLink).toHaveAttribute('href', '/items')
    })

    it('should not render link for current item', () => {
      render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Current Page', current: true },
          ]}
        />
      )

      const currentLink = screen.queryByRole('link', { name: /current page/i })
      expect(currentLink).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label on nav', () => {
      render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Current', current: true },
          ]}
        />
      )

      const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    })

    it('should mark current item with aria-current', () => {
      const { container } = render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Current Page', current: true },
          ]}
        />
      )

      const currentItem = container.querySelector('[aria-current="page"]')
      expect(currentItem).toBeInTheDocument()
      expect(currentItem).toHaveTextContent('Current Page')
    })
  })

  describe('Separators', () => {
    it('should render separators between items', () => {
      const { container } = render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Items', href: '/items' },
            { label: 'Current', current: true },
          ]}
        />
      )

      const separators = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '/'
      )
      expect(separators.length).toBeGreaterThan(0)
    })

    it('should not render separator after last item', () => {
      const { container } = render(
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Last Item', current: true },
          ]}
        />
      )

      const listItems = container.querySelectorAll('li')
      const lastItem = listItems[listItems.length - 1]
      const separator = Array.from(lastItem.querySelectorAll('span')).find(
        (span) => span.textContent === '/'
      )
      expect(separator).toBeUndefined()
    })
  })

  describe('Single Item', () => {
    it('should render single breadcrumb item', () => {
      render(
        <Breadcrumb
          items={[
            { label: 'Home', current: true },
          ]}
        />
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  describe('Empty Items', () => {
    it('should render empty breadcrumb with no items', () => {
      render(<Breadcrumb items={[]} />)

      const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(nav).toBeInTheDocument()
    })
  })
})
