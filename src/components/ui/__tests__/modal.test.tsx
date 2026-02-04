import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useModal,
} from '../modal'

describe('Modal Component', () => {
  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={jest.fn()}>
          <ModalContent>
            <div>Modal Content</div>
          </ModalContent>
        </Modal>
      )

      const modal = container.querySelector('[role="dialog"]')
      expect(modal).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <div>Modal Content</div>
          </ModalContent>
        </Modal>
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should render children when open', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <div data-testid="modal-child">Modal Content</div>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByTestId('modal-child')).toBeInTheDocument()
    })
  })

  describe('Modal Closing', () => {
    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      const { container } = render(
        <Modal isOpen={true} onClose={onClose}>
          <ModalContent>
            <div>Modal Content</div>
          </ModalContent>
        </Modal>
      )

      const backdrop = container.querySelector('[aria-hidden="true"]')
      if (backdrop) {
        await user.click(backdrop)
      }

      expect(onClose).toHaveBeenCalled()
    })

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      render(
        <Modal isOpen={true} onClose={onClose}>
          <ModalContent>
            <div>Modal Content</div>
          </ModalContent>
        </Modal>
      )

      await user.keyboard('{Escape}')

      expect(onClose).toHaveBeenCalled()
    })

    it('should not call onClose when Escape is pressed and modal is closed', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      render(
        <Modal isOpen={false} onClose={onClose}>
          <ModalContent>
            <div>Modal Content</div>
          </ModalContent>
        </Modal>
      )

      await user.keyboard('{Escape}')

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('ModalContent', () => {
    it('should render modal content', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <div data-testid="content">Content</div>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('should have dialog role', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('ModalHeader', () => {
    it('should render modal header', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalHeader>
              <div data-testid="header">Header</div>
            </ModalHeader>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByTestId('header')).toBeInTheDocument()
    })
  })

  describe('ModalTitle', () => {
    it('should render modal title', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByText('Modal Title')).toBeInTheDocument()
    })

    it('should render as h2 element', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
          </ModalContent>
        </Modal>
      )

      const title = container.querySelector('h2')
      expect(title).toHaveTextContent('Modal Title')
    })
  })

  describe('ModalCloseButton', () => {
    it('should render close button', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Title</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
          </ModalContent>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toBeInTheDocument()
    })

    it('should call onClose when clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      render(
        <Modal isOpen={true} onClose={onClose}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Title</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
          </ModalContent>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Close modal')
      await user.click(closeButton)

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('ModalBody', () => {
    it('should render modal body', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalBody>
              <div data-testid="body">Body Content</div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByTestId('body')).toBeInTheDocument()
    })
  })

  describe('ModalFooter', () => {
    it('should render modal footer', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalFooter>
              <div data-testid="footer">Footer</div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('should render footer buttons', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <ModalFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    })
  })

  describe('useModal Hook', () => {
    it('should throw error when used outside Modal', () => {
      const TestComponent = () => {
        useModal()
        return null
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => render(<TestComponent />)).toThrow(
        'useModal must be used within a Modal component'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Body Overflow', () => {
    it('should hide body overflow when modal is open', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should restore body overflow when modal closes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <Modal isOpen={false} onClose={jest.fn()}>
          <ModalContent>
            <div>Content</div>
          </ModalContent>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('Complete Modal', () => {
    it('should render complete modal with all parts', () => {
      const onClose = jest.fn()

      render(
        <Modal isOpen={true} onClose={onClose}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirm Action</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to proceed?</p>
            </ModalBody>
            <ModalFooter>
              <button onClick={onClose}>Cancel</button>
              <button>Confirm</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    })
  })
})
