'use client';
import { useState, useEffect } from 'react';
import { Gift } from '@/src/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface GiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift: Gift | null;
  onSave: (gift: Omit<Gift, 'id'>) => void;
  
}

const initialFormData = {
  name: '',
  quantity: 1,
  available: true,
};

function getGiftFormData(gift: Gift | null) {
  if (!gift) {
    return { ...initialFormData };
  }

  return {
    name: gift.name,
    quantity: gift.quantity,
    available: gift.available,
  };
}

export function GiftModal({ open, onOpenChange, gift, onSave }: GiftModalProps) {
  const [formData, setFormData] = useState(() => getGiftFormData(gift));

  // ✅ Reset form when modal opens or gift changes
  useEffect(() => {
    if (open) {
      setFormData(getGiftFormData(gift));
    }
  }, [open, gift]);

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData({ ...initialFormData });
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ ...initialFormData });
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    if (field === 'quantity') {
      const numValue = typeof value === 'string' ? parseInt(value) || 0 : typeof value === 'number' ? value : 0;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle>
            {gift ? 'Edit Gift' : 'Add New Gift'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" >
          <div className="space-y-2">
            <Label htmlFor="name">Gift Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter Gift Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Available</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity || 0}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Category</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="text-xs text-primary"
              >
                {isAddingCategory ? 'Select Existing' : '+ New Category'}
              </Button>
            </div>
            {isAddingCategory ? (
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                required
              />
            ) : (
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div> */}

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="available" className="text-sm font-medium">
                Available for Wheel
              </Label>
              <p className="text-xs text-muted-foreground">
                Gift will appear on the birthday spin wheel
              </p>
            </div>
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => handleChange('available', checked)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-red-700 border-red-700 hover:text-red-800 hover:border-red-800 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              {gift ? 'Save Changes' : 'Add Gift'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
