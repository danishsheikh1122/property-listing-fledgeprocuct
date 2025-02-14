// components/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search listings..."
          className="pl-12 h-12 text-lg rounded-xl border-2 border-gray-200 bg-white/95"
        />
      </div>
    </div>
  );
}