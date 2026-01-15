/**
 * Unit Tests for PWA UI Components
 * Feature: pwa-implementation
 * 
 * Validates: Requirements 4.2, 4.3, 5.1, 5.2, 8.2, 8.4
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { UpdateNotification } from '@/components/pwa/UpdateNotification';

describe('PWA UI Components', () => {
  describe('OfflineIndicator', () => {
    // Requirement 5.1: Display offline indicator when offline
    it('should display when offline', () => {
      render(<OfflineIndicator isOffline={true} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('You are offline')).toBeInTheDocument();
    });

    // Requirement 5.2: Hide indicator when online
    it('should not display when online', () => {
      render(<OfflineIndicator isOffline={false} />);
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('should have accessible role', () => {
      render(<OfflineIndicator isOffline={true} />);
      
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('InstallPrompt', () => {
    const mockOnInstall = jest.fn();
    const mockOnDismiss = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    // Requirement 4.2, 4.3: Show install prompt
    it('should display when visible', () => {
      render(
        <InstallPrompt
          isVisible={true}
          onInstall={mockOnInstall}
          onDismiss={mockOnDismiss}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Install App')).toBeInTheDocument();
    });

    it('should not display when not visible', () => {
      render(
        <InstallPrompt
          isVisible={false}
          onInstall={mockOnInstall}
          onDismiss={mockOnDismiss}
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should call onInstall when install button clicked', () => {
      render(
        <InstallPrompt
          isVisible={true}
          onInstall={mockOnInstall}
          onDismiss={mockOnDismiss}
        />
      );
      
      fireEvent.click(screen.getByText('Install'));
      expect(mockOnInstall).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when dismiss button clicked', () => {
      render(
        <InstallPrompt
          isVisible={true}
          onInstall={mockOnInstall}
          onDismiss={mockOnDismiss}
        />
      );
      
      fireEvent.click(screen.getByText('Not now'));
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when X button clicked', () => {
      render(
        <InstallPrompt
          isVisible={true}
          onInstall={mockOnInstall}
          onDismiss={mockOnDismiss}
        />
      );
      
      fireEvent.click(screen.getByLabelText('Dismiss install prompt'));
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have accessible labels', () => {
      render(
        <InstallPrompt
          isVisible={true}
          onInstall={mockOnInstall}
          onDismiss={mockOnDismiss}
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'install-prompt-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'install-prompt-description');
    });
  });

  describe('UpdateNotification', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDismiss = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    // Requirement 8.2: Show update notification
    it('should display when visible', () => {
      render(
        <UpdateNotification
          isVisible={true}
          onUpdate={mockOnUpdate}
          onDismiss={mockOnDismiss}
        />
      );
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Update available')).toBeInTheDocument();
    });

    it('should not display when not visible', () => {
      render(
        <UpdateNotification
          isVisible={false}
          onUpdate={mockOnUpdate}
          onDismiss={mockOnDismiss}
        />
      );
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    // Requirement 8.4: Handle update acceptance
    it('should call onUpdate when update button clicked', () => {
      render(
        <UpdateNotification
          isVisible={true}
          onUpdate={mockOnUpdate}
          onDismiss={mockOnDismiss}
        />
      );
      
      fireEvent.click(screen.getByText('Update'));
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when dismiss button clicked', () => {
      render(
        <UpdateNotification
          isVisible={true}
          onUpdate={mockOnUpdate}
          onDismiss={mockOnDismiss}
        />
      );
      
      fireEvent.click(screen.getByLabelText('Dismiss update notification'));
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have accessible role', () => {
      render(
        <UpdateNotification
          isVisible={true}
          onUpdate={mockOnUpdate}
          onDismiss={mockOnDismiss}
        />
      );
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });
  });
});
