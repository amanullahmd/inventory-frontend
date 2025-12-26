'use client';

import { useState, useEffect, useCallback } from 'react';
import { Item, StockInRequest, ApiError } from '@/lib/types';
import apiClient from '@/lib/api/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface StockInFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function StockInForm({ onSuccess, onError }: StockInFormProps) {
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

      const stockInData: StockInRequest = {
        itemId: selectedItemId,
        quantity: parseFloat(quantity),
        note: note.trim() || undefined,
      };

      await apiClient.addStock(stockInData);
      
      // Reset form on success
      setSelectedItemId('');
      setQuantity('');
      setNote('');
      
      // Reload items to get updated stock levels
      await loadItems();
      
      onSuccess?.('Stock added successfully');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 400) {
        setErrors({ general: apiError.message });
      } else {
        onError?.(apiError.message || 'Failed to add stock');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedItem = items.find(item => item.id === selectedItemId);

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
        <h2 className="text-xl font-semibold text-secondary-900">Add Stock</h2>
        <p className="text-sm text-secondary-600 mt-1">Increase inventory levels for existing items</p>
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
                  {item.name} (SKU: {item.sku}) - Current Stock: {item.currentStock}
                </option>
              ))}
            </select>
            {errors.itemId && (
              <p className="mt-2 text-sm text-error-600">{errors.itemId}</p>
            )}
          </div>

          {/* Current Stock Display */}
          {selectedItem && (
            <div className="bg-secondary-50 border border-secondary-200 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-secondary-900 mb-2">Item Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary-600">Current Stock:</span>
                  <span className="ml-2 font-medium text-secondary-900">{selectedItem.currentStock} units</span>
                </div>
                <div>
                  <span className="text-secondary-600">Unit Cost:</span>
                  <span className="ml-2 font-medium text-secondary-900">${selectedItem.unitCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-secondary-700 mb-2">
              Quantity to Add *
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.01"
              step="0.01"
              className={errors.quantity ? 'input-error' : 'input-base'}
              placeholder="Enter quantity"
              disabled={isLoading}
            />
            {errors.quantity && (
              <p className="mt-2 text-sm text-error-600">{errors.quantity}</p>
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
              placeholder="Add a note about this stock addition..."
              disabled={isLoading}
            />
          </div>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <p className="text-sm text-error-600">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedItemId || !quantity}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isLoading || !selectedItemId || !quantity
                ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="spinner w-4 h-4 mr-2"></div>
                Adding Stock...
              </span>
            ) : (
              'Add Stock'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}