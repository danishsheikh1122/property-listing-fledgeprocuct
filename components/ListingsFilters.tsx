// components/ListingsFilter.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Update FilterOptions type to match parent component's state
export type FilterOptions = {
  sortBy: "recent" | "price_low" | "price_high"
  priceRange: string
  searchQuery: string
}

export default function ListingsFilter({
  onFilterChange,
}: {
  onFilterChange: (filters: Partial<FilterOptions>) => void
}) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    sortBy: "recent",
    priceRange: "all",
  })

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-12 px-4 text-gray-700 bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Listings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sort By</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => handleFilterChange("sortBy", value as "recent" | "price_low" | "price_high")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price Range</label>
            <Select 
              value={filters.priceRange} 
              onValueChange={(value) => handleFilterChange("priceRange", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-1000">€0 - €1,000</SelectItem>
                <SelectItem value="1000-5000">€1,000 - €5,000</SelectItem>
                <SelectItem value="5000+">€5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}