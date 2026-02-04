import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
} from '../skeleton'
import { Spinner, Loading } from '../spinner'
import { Progress, StepProgress } from '../progress'

describe('Loading Components', () => {
  describe('Skeleton', () => {
    it('should render skeleton', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('should render rectangular skeleton by default', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('div')
      expect(skeleton).toHaveClass('rounded-lg')
    })

    it('should render circular skeleton', () => {
      const { container } = render(<Skeleton variant="circular" />)
      const skeleton = container.querySelector('div')
      expect(skeleton).toHaveClass('rounded-full')
    })

    it('should render text skeleton', () => {
      const { container } = render(<Skeleton variant="text" />)
      const skeleton = container.querySelector('div')
      expect(skeleton).toHaveClass('rounded-lg')
    })

    it('should apply custom width and height', () => {
      const { container } = render(
        <Skeleton width={100} height={50} />
      )
      const skeleton = container.querySelector('div')
      expect(skeleton).toHaveStyle('width: 100px; height: 50px')
    })

    it('should apply custom width and height as strings', () => {
      const { container } = render(
        <Skeleton width="50%" height="20px" />
      )
      const skeleton = container.querySelector('div')
      expect(skeleton).toHaveStyle('width: 50%; height: 20px')
    })
  })

  describe('SkeletonText', () => {
    it('should render multiple skeleton lines', () => {
      const { container } = render(<SkeletonText lines={3} />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBe(3)
    })

    it('should render default 3 lines', () => {
      const { container } = render(<SkeletonText />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBe(3)
    })

    it('should make last line shorter', () => {
      const { container } = render(<SkeletonText lines={2} />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      const lastSkeleton = skeletons[skeletons.length - 1]
      expect(lastSkeleton).toHaveClass('w-3/4')
    })
  })

  describe('SkeletonCard', () => {
    it('should render skeleton card', () => {
      const { container } = render(<SkeletonCard />)
      const card = container.querySelector('div')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-lg')
    })

    it('should render card with multiple skeleton elements', () => {
      const { container } = render(<SkeletonCard />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Spinner', () => {
    it('should render spinner', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
    })

    it('should render small spinner', () => {
      const { container } = render(<Spinner size="sm" />)
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-4')
      expect(spinner).toHaveClass('h-4')
    })

    it('should render medium spinner by default', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-6')
      expect(spinner).toHaveClass('h-6')
    })

    it('should render large spinner', () => {
      const { container } = render(<Spinner size="lg" />)
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-8')
      expect(spinner).toHaveClass('h-8')
    })

    it('should have aria-hidden attribute', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Loading', () => {
    it('should render loading component', () => {
      const { container } = render(<Loading />)
      const spinner = container.querySelector('svg')
      expect(spinner).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Loading label="Loading..." />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render spinner with custom size', () => {
      const { container } = render(<Loading spinnerSize="lg" />)
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-8')
    })
  })

  describe('Progress', () => {
    it('should render progress bar', () => {
      const { container } = render(<Progress value={50} />)
      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toBeInTheDocument()
    })

    it('should set aria attributes', () => {
      const { container } = render(<Progress value={50} max={100} />)
      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('should calculate percentage correctly', () => {
      const { container } = render(<Progress value={50} max={100} />)
      const fill = container.querySelector('[role="progressbar"] > div')
      expect(fill).toHaveStyle('width: 50%')
    })

    it('should clamp value between 0 and 100%', () => {
      const { container: container1 } = render(<Progress value={150} max={100} />)
      const fill1 = container1.querySelector('[role="progressbar"] > div')
      expect(fill1).toHaveStyle('width: 100%')

      const { container: container2 } = render(<Progress value={-50} max={100} />)
      const fill2 = container2.querySelector('[role="progressbar"] > div')
      expect(fill2).toHaveStyle('width: 0%')
    })

    it('should show label when showLabel is true', () => {
      render(<Progress value={50} max={100} showLabel />)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('should apply variant classes', () => {
      const { container } = render(<Progress value={50} variant="success" />)
      const fill = container.querySelector('[role="progressbar"] > div')
      expect(fill).toHaveClass('bg-green-500')
    })
  })

  describe('StepProgress', () => {
    it('should render step progress', () => {
      const { container } = render(
        <StepProgress
          steps={['Step 1', 'Step 2', 'Step 3']}
          currentStep={0}
        />
      )
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should render all steps', () => {
      render(
        <StepProgress
          steps={['Step 1', 'Step 2', 'Step 3']}
          currentStep={0}
        />
      )
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Step 3')).toBeInTheDocument()
    })

    it('should highlight current step', () => {
      const { container } = render(
        <StepProgress
          steps={['Step 1', 'Step 2', 'Step 3']}
          currentStep={1}
        />
      )
      const circles = container.querySelectorAll('div.flex.h-8.w-8')
      expect(circles[1]).toHaveClass('bg-blue-500')
    })

    it('should show checkmark for completed steps', () => {
      const { container } = render(
        <StepProgress
          steps={['Step 1', 'Step 2', 'Step 3']}
          currentStep={2}
        />
      )
      const circles = container.querySelectorAll('div.flex.h-8.w-8')
      expect(circles[0]).toHaveTextContent('✓')
      expect(circles[1]).toHaveTextContent('✓')
    })

    it('should show step numbers for incomplete steps', () => {
      const { container } = render(
        <StepProgress
          steps={['Step 1', 'Step 2', 'Step 3']}
          currentStep={0}
        />
      )
      const circles = container.querySelectorAll('div.flex.h-8.w-8')
      expect(circles[1]).toHaveTextContent('2')
      expect(circles[2]).toHaveTextContent('3')
    })
  })
})
