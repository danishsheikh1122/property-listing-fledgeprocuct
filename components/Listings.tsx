// components/Listings.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Masonry from "react-masonry-css";
import ListingCard from "./ListingCard";
import SearchBar from "./SearchBar";
import ListingsFilter from "./ListingsFilters";
import toast, { Toaster } from "react-hot-toast";

const breakpointColumns = {
  default: 3,
  1100: 3,
  800: 2,
  600: 1,
};

const COLORS = [
  "bg-white text-gray-900",
  "bg-neutral-100 text-gray-900",
  "bg-neutral-900 text-white",
  "bg-neutral-800 text-neutral-100",
];

const ads = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: `ad-${i}`,
    type: "ad",
    title: `Sponsored Listing ${i + 1}`,
    content: `Special Offer! Discount up to ${(i * 5) % 50}%`,
    height: 200 + ((i * 50) % 300),
  }));

interface Listing {
  id: string;
  title: string;
  location: { address: string; postal_code: string };
  prices: Array<{ type: string; amount: number }>;
  contact: { name: string; phone: string; email: string };
  features: string[];
  deposit?: number;
  created_at: string;
}

export default function Listings({
  initialListings,
}: {
  initialListings: Listing[];
}) {
  const [listings] = useState<Listing[]>(initialListings);
  const [filters, setFilters] = useState({
    searchQuery: "",
    sortBy: "recent",
    priceRange: "all",
  });
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [revealedContacts, setRevealedContacts] = useState<string[]>([]);
  const [cooldownEnd, setCooldownEnd] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownEnd]);

  const enhancedListings = useMemo(() => {
    const merged: Array<Listing | (typeof ads)[number]> = [];
    let adCounter = 0;

    listings.forEach((listing, index) => {
      merged.push(listing);
      if ((index + 1) % 4 === 0 && ads[adCounter]) {
        merged.push(ads[adCounter]);
        adCounter = (adCounter + 1) % ads.length;
      }
    });

    return merged;
  }, [listings]);

  const getColorIndex = useCallback((id: string) => {
    return parseInt(id.slice(-2), 16) % COLORS.length;
  }, []);

  const filteredListings = useMemo(() => {
    return enhancedListings
      .filter((item) => {
        if (item.type === "ad") return true;

        const listing = item as Listing;
        const searchMatch = listing.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());
        const priceMatch =
          filters.priceRange === "all" ||
          listing.prices.some((price) => {
            const [min, max] = filters.priceRange.split("-");
            const numericMin = Number(min);
            const numericMax = max === "+" ? Infinity : Number(max);
            return price.amount >= numericMin && price.amount <= numericMax;
          });

        return searchMatch && priceMatch;
      })
      .sort((a, b) => {
        if (a.type === "ad" || b.type === "ad") return 0;
        const listingA = a as Listing;
        const listingB = b as Listing;

        if (filters.sortBy === "price_low")
          return listingA.prices[0].amount - listingB.prices[0].amount;
        if (filters.sortBy === "price_high")
          return listingB.prices[0].amount - listingA.prices[0].amount;
        return (
          new Date(listingB.created_at).getTime() -
          new Date(listingA.created_at).getTime()
        );
      });
  }, [enhancedListings, filters]);

  const handleRevealContact = useCallback(
    async (listingId: string) => {
      if (remainingAttempts <= 0) return false;

      setRemainingAttempts((prev) => prev - 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRevealedContacts((prev) => [...prev, listingId]);
      return true;
    },
    [remainingAttempts]
  );

  const handleAdClick = useCallback(() => {
    if (Date.now() < cooldownEnd) {
      toast.error(`Wait ${timeLeft}s before clicking another ad`);
      return;
    }

    setRemainingAttempts((prev) => prev + 1);
    setCooldownEnd(Date.now() + 30000); // 30-second cooldown
    toast.success("+1 reveal attempt earned!");
  }, [cooldownEnd, timeLeft]);

  const handleSearch = useCallback((query: string) => {
    setFilters((p) => ({ ...p, searchQuery: query }));
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((p) => ({ ...p, ...newFilters }));
  }, []);

  return (
    <div className="container py-8">
      <Toaster position="bottom-right" />
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <SearchBar onSearch={handleSearch} />
        <ListingsFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="mb-4 p-4 bg-neutral-100 rounded-lg">
        <p className="text-sm font-medium">
          🔥 Remaining Reveal Attempts: {remainingAttempts} | Cooldown:{" "}
          {timeLeft > 0 ? `${timeLeft}s remaining` : "Ready!"}
        </p>
      </div>

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-4 -ml-4"
        columnClassName="flex flex-col gap-4 pl-4"
      >
        {filteredListings.map((item) => {
          if (item.type === "ad") {
            return (
              <div
                key={item.id}
                className={`w-full flex flex-col p-6 rounded-xl shadow-lg transition-all
                  ${
                    Date.now() < cooldownEnd
                      ? "bg-blue-100 border-2 border-blue-300 cursor-not-allowed"
                      : "bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl cursor-pointer"
                  }
                `}
                style={{ minHeight: item.height }}
                onClick={handleAdClick}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase font-bold text-blue-600">
                    Sponsored
                  </span>
                  {Date.now() < cooldownEnd && (
                    <span className="text-xs text-blue-500">
                      (Cooldown active)
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-600">{item.content}</p>
                <div className="mt-4 text-sm text-blue-500">
                  {Date.now() < cooldownEnd
                    ? "Come back later for more attempts"
                    : "Click to earn 1 reveal attempt"}
                </div>
              </div>
            );
          }

          const listing = item as Listing;
          const colorClass = COLORS[getColorIndex(listing.id)];

          return (
            <div
              key={listing.id}
              className={`w-full ${colorClass} rounded-xl shadow-lg p-6 flex-grow`}
            >
              <ListingCard
                listing={listing}
                isContactRevealed={revealedContacts.includes(listing.id)}
                onRevealContact={handleRevealContact}
                remainingAttempts={remainingAttempts}
              />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
