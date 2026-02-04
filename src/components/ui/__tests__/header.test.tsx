import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Header,
  HeaderNav,
  HeaderNavItem,
  HeaderActions,
  HeaderUserMenu,
} from '../header'

describe('Header Component', () => {
  describe('Header', () => {
    it('should render header element', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })

    it('should render with logo', () => {
      render(
        <Header logo={<div data-testid="logo">Logo</div>} />
      )
      expect(screen.getByTestId('logo')).toBeInTheDocument()
    })

    it('should render children', () => {
      render(
        <Header>
          <div data-testid="child">Child Content</div>
        </Header>
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('should be sticky by default', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('sticky')
    })

    it('should not be sticky when sticky prop is false', () => {
      const { container } = render(<Header sticky={false} />)
      const header = container.querySelector('header')
      expect(header).not.toHaveClass('sticky')
    })
  })

  describe('HeaderNav', () => {
    it('should render navigation container', () => {
      const { container } = render(<HeaderNav />)
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should render nav items', () => {
      render(
        <HeaderNav>
          <HeaderNavItem href="/">Home</HeaderNavItem>
          <HeaderNavItem href="/items">Items</HeaderNavItem>
        </HeaderNav>
      )

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument()
    })
  })

  describe('HeaderNavItem', () => {
    it('should render as link', () => {
      render(<HeaderNavItem href="/test">Test Link</HeaderNavItem>)
      const link = screen.getByRole('link', { name: /test link/i })
      expect(link).toHaveAttribute('href', '/test')
    })

    it('should apply active styling when active prop is true', () => {
      const { container } = render(
        <HeaderNavItem href="/test" active>
          Test Link
        </HeaderNavItem>
      )
      const link = container.querySelector('a')
      expect(link).toHaveClass('bg-blue-100')
    })

    it('should apply inactive styling when active prop is false', () => {
      const { container } = render(
        <HeaderNavItem href="/test" active={false}>
          Test Link
        </HeaderNavItem>
      )
      const link = container.querySelector('a')
      expect(link).toHaveClass('text-gray-700')
    })
  })

  describe('HeaderActions', () => {
    it('should render actions container', () => {
      const { container } = render(
        <HeaderActions>
          <button>Action 1</button>
          <button>Action 2</button>
        </HeaderActions>
      )
      const div = container.querySelector('div')
      expect(div).toBeInTheDocument()
    })

    it('should render multiple action items', () => {
      render(
        <HeaderActions>
          <button>Theme Toggle</button>
          <button>Sign Out</button>
        </HeaderActions>
      )

      expect(screen.getByRole('button', { name: /theme toggle/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })
  })

  describe('HeaderUserMenu', () => {
    it('should render user menu', () => {
      const { container } = render(<HeaderUserMenu />)
      const div = container.querySelector('div')
      expect(div).toBeInTheDocument()
    })

    it('should display user name', () => {
      render(<HeaderUserMenu userName="John Doe" />)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should display user role', () => {
      render(<HeaderUserMenu userRole="Administrator" />)
      expect(screen.getByText('Administrator')).toBeInTheDocument()
    })

    it('should display both name and role', () => {
      render(
        <HeaderUserMenu
          userName="Jane Smith"
          userRole="Manager"
        />
      )
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Manager')).toBeInTheDocument()
    })

    it('should render avatar placeholder', () => {
      const { container } = render(<HeaderUserMenu />)
      const avatar = container.querySelector('div.h-8.w-8')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should render complete header with all components', () => {
      render(
        <Header logo={<div>Logo</div>}>
          <HeaderNav>
            <HeaderNavItem href="/" active>
              Home
            </HeaderNavItem>
            <HeaderNavItem href="/items">Items</HeaderNavItem>
          </HeaderNav>
          <HeaderActions>
            <HeaderUserMenu userName="John" userRole="Admin" />
            <button>Sign Out</button>
          </HeaderActions>
        </Header>
      )

      expect(screen.getByText('Logo')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument()
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })
  })
})
