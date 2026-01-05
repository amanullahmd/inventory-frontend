'use client';

import { useState, useEffect } from 'react';
import { Item } from '@/lib/types';
import { StockOutRequest, StockOutType } from '@/lib/services/stockOutService';

interface StockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockOutRequest) => Promise<void>;
  items: Item[];
  initialData?: any; // StockOutResponse but simpler for prop
  title: string;
}

export default function StockOutModal({ isOpen, onClose, onSubmit, items, initialData, title }: StockOutModalProps) {
  const [stockOutType, setStockOutType] = useState<StockOutType>(StockOutType.BRANCH_TRANSFER);
  const [itemId, setItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setStockOutType(initialData.stockOutType);
        setItemId(String(initialData.itemId));
        setQuantity(String(initialData.quantity));
        setNote(initialData.note || '');
        setDate(initialData.stockOutDate ? new Date(initialData.stockOutDate).toISOString().slice(0, 16) : '');
      } else {
        setStockOutType(StockOutType.BRANCH_TRANSFER);
        setItemId('');
        setQuantity('');
        setNote('');
        setDate(new Date().toISOString().slice(0, 16));
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!itemId) {
      setError('Please select an item');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    const selectedItem = items.find(i => String(i.id) === String(itemId));
    // If editing (initialData exists), we need to consider that the user might be *increasing* the stock out,
    // or we might just check against currentStock + oldQuantity.
    // However, the backend handles complex validation.
    // Frontend check is good for immediate feedback on create.
    if (!initialData && selectedItem && qty > selectedItem.currentStock) {
      setError(`Insufficient stock. Available: ${selectedItem.currentStock}`);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        stockOutType,
        itemId: parseInt(itemId),
        quantity: qty,
        note,
        date: date ? new Date(date).toISOString() : undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedItem = items.find(i => String(i.id) === String(itemId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Type</label>
            <select
              value={stockOutType}
              onChange={(e) => setStockOutType(e.target.value as StockOutType)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            >
              {Object.values(StockOutType).map((type) => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Item</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              disabled={!!initialData} // Disable item change on edit for simplicity, or allow it
            >
              <option value="">Select Item...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (SKU: {item.sku}) - Stock: {item.currentStock}
                </option>
              ))}
            </select>
            {selectedItem && (
              <p className="text-xs text-muted-foreground mt-1">
                Current Stock: {selectedItem.currentStock}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Quantity (Units)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Note / Reason</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="e.g. Branch Transfer to London..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
