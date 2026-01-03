'use client';

import { useState, useEffect, useCallback } from 'react';
import { Item, StockOutRequest, ApiError } from '@/lib/types';
import apiClient from '@/lib/api/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface StockOutFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function StockOutForm({ onSuccess, onError }: StockOutFormProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [errors, setErrors] = useState<{
    itemId?: string;
    quantity?: string;
    general?: string;
  }>({});

  const loadItems = useCallback(async () => {
    try {
      setIsLoadingItems(true);
      const response = await apiClient.getItems();
      setItems(response);
    } catch (error) {
      const apiError = error as ApiError;
      onError?.(apiError.message || 'Failed to load items');
    } finally {
      setIsLoadingItems(false);
    }
  }, [onError]);

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!selectedItemId) {
      newErrors.itemId = 'Please select an item';
    }

    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0';
    }

    // Check for insufficient stock
    const selectedItem = items.find(item => item.id === selectedItemId);
    if (selectedItem && quantityNum > selectedItem.currentStock) {
      newErrors.quantity = `Insufficient stock. Available: ${selectedItem.currentStock} units`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      const stockOutData: StockOutRequest = {
        itemId: selectedItemId,
        quantity: parseFloat(quantity),
        note: note.trim() || undefined,
      };

      await apiClient.removeStock(stockOutData);
      
      // Reset form on success
      setSelectedItemId('');
      setQuantity('');
      setNote('');
      
      // Reload items to get updated stock levels
      await loadItems();
      
      onSuccess?.('Stock removed successfully');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 400) {
        // Handle insufficient stock error from server
        if (apiError.message.toLowerCase().includes('insufficient')) {
          setErrors({ quantity: apiError.message });
        } else {
          setErrors({ general: apiError.message });
        }
      } else {
        onError?.(apiError.message || 'Failed to remove stock');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    
    // Clear quantity error when user starts typing
    if (errors.quantity) {
      setErrors(prev => ({ ...prev, quantity: undefined }));
    }
  };

  const selectedItem = items.find(item => item.id === selectedItemId);
  const quantityNum = parseFloat(quantity);
  const hasInsufficientStock = selectedItem && !isNaN(quantityNum) && quantityNum > selectedItem.currentStock;

  if (isLoadingItems) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="medium" text="Loading items..." />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto card animate-slide-in">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-secondary-900">Remove Stock</h2>
        <p className="text-sm text-secondary-600 mt-1">Decrease inventory levels for existing items</p>
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Selection */}
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-secondary-700 mb-2">
              Select Item *
            </label>
            <select
              id="itemId"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className={errors.itemId ? 'input-error' : 'input-base'}
              disabled={isLoading}
            >
              <option value="">Choose an item...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (SKU: {item.sku}) - Available: {item.currentStock}
                </option>
              ))}
            </select>
            {errors.itemId && (
              <p className="mt-2 text-sm text-error-600 animate-slide-in">{errors.itemId}</p>
            )}
          </div>

          {/* Current Stock Display */}
          {selectedItem && (
            <div className={`p-4 rounded-lg border animate-bounce-in ${
              selectedItem.currentStock === 0 
                ? 'bg-error-50 border-error-200' 
                : selectedItem.currentStock <= 5
                ? 'bg-warning-50 border-warning-200'
                : 'bg-secondary-50 border-secondary-200'
            }`}>
              <h4 className="text-sm font-medium text-secondary-900 mb-2">Item Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary-600">Available Stock:</span>
                  <span className={`ml-2 font-medium ${
                    selectedItem.currentStock === 0 
                      ? 'text-error-700' 
                      : selectedItem.currentStock <= 5
                      ? 'text-warning-700'
                      : 'text-secondary-900'
                  }`}>
                    {selectedItem.currentStock} units
                  </span>
                </div>
                <div>
                  <span className="text-secondary-600">Unit Cost:</span>
                  <span className="ml-2 font-medium text-secondary-900">
                    {selectedItem.unitCost !== undefined ? `$${selectedItem.unitCost.toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>
              {selectedItem.currentStock === 0 && (
                <div className="mt-3 p-2 bg-error-100 rounded-md animate-pulse">
                  <p className="text-sm text-error-700 font-medium flex items-center">
                    No stock available for this item
                  </p>
                </div>
              )}
              {selectedItem.currentStock > 0 && selectedItem.currentStock <= 5 && (
                <div className="mt-3 p-2 bg-warning-100 rounded-md">
                  <p className="text-sm text-warning-700 font-medium flex items-center">
                    Low stock warning
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-secondary-700 mb-2">
              Quantity to Remove *
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="0.01"
              step="0.01"
              max={selectedItem?.currentStock || undefined}
              className={errors.quantity || hasInsufficientStock ? 'input-error' : 'input-base'}
              placeholder="Enter quantity"
              disabled={isLoading || (selectedItem && selectedItem.currentStock === 0)}
            />
            {errors.quantity && (
              <p className="mt-2 text-sm text-error-600 animate-slide-in">{errors.quantity}</p>
            )}
            {hasInsufficientStock && !errors.quantity && (
              <p className="mt-2 text-sm text-error-600 animate-slide-in">
                Insufficient stock. Available: {selectedItem.currentStock} units
              </p>
            )}
            {selectedItem && quantityNum > 0 && quantityNum <= selectedItem.currentStock && (
              <div className="mt-2 p-2 bg-success-50 border border-success-200 rounded-md animate-fade-in">
                <p className="text-sm text-success-700 flex items-center">
                  Remaining after removal: {(selectedItem.currentStock - quantityNum).toFixed(2)} units
                </p>
              </div>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-secondary-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="input-base resize-none"
              placeholder="Add a note about this stock removal..."
              disabled={isLoading}
            />
          </div>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 animate-slide-in">
              <p className="text-sm text-error-600">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || 
              !selectedItemId || 
              !quantity || 
              hasInsufficientStock ||
              (selectedItem && selectedItem.currentStock === 0)
            }
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isLoading || 
              !selectedItemId || 
              !quantity || 
              hasInsufficientStock ||
              (selectedItem && selectedItem.currentStock === 0)
                ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                : 'btn-error hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="spinner w-4 h-4 mr-2"></div>
                Removing Stock...
              </span>
            ) : (
              'Remove Stock'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
