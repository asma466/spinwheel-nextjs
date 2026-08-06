'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      {/* <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-background"
      /> */}
        <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="w-full h-11 rounded-full border border-gray-300 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}
