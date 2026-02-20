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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift: Gift | null;
  onSave: (gift: Omit<Gift, 'id'>) => void;
  categories: string[];
}

const initialFormData = {
  name: '',
  quantity: 1,
  category: '',
  available: true,
};

export function GiftModal({ open, onOpenChange, gift, onSave, categories }: GiftModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    if (gift) {
      setFormData({
        name: gift.name,
        quantity: gift.quantity,
        category: gift.category,
        available: gift.available,
      });
    } else {
      setFormData(initialFormData);
    }
    setIsAddingCategory(false);
    setNewCategory('');
  }, [gift, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryToUse = isAddingCategory && newCategory ? newCategory : formData.category;
    onSave({
      ...formData,
      category: categoryToUse,
    });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle>
            {gift ? 'Edit Gift' : 'Add New Gift'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Gift Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Amazon Gift Card"
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

          <div className="space-y-2">
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
          </div>

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