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
  "bg-gradient-to-br from-purple-600 to-pink-500 text-white",
  "bg-gradient-to-t from-cyan-500 to-blue-600 text-white",
  "bg-gradient-to-bl from-green-400 to-emerald-600 text-gray-900",
  "bg-gradient-to-tr from-red-500 to-orange-400 text-white",
  "bg-gradient-to-br from-yellow-300 to-amber-500 text-gray-900",
];

const FONTS = [
  "font-sans",
  "font-serif",
  "font-mono",
  "font-display",
  "font-handwriting",
];

const CARD_STYLES = [
  {
    titleSize: "text-2xl",
    titleWeight: "font-bold",
    priceBg: "bg-white/20 text-white",
    borderStyle: "border-l-8 border-cyan-300",
    featureMarker: "🔹",
  },
  {
    titleSize: "text-3xl",
    titleWeight: "font-extrabold",
    priceBg: "bg-black/20 text-white",
    borderStyle: "border-t-8 border-purple-400",
    featureMarker: "🌟",
  },
  {
    titleSize: "text-xl",
    titleWeight: "font-semibold italic",
    priceBg: "bg-white/20 text-white",
    borderStyle: "shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]",
    featureMarker: "•",
  },
  {
    titleSize: "text-2xl",
    titleWeight: "font-medium underline",
    priceBg: "bg-black/20 text-white",
    borderStyle: "rounded-none border-4 border-yellow-400",
    featureMarker: "→",
  },
  {
    titleSize: "text-2xl",
    titleWeight: "font-black",
    priceBg: "bg-white/20 text-white",
    borderStyle: "border-4 border-green-500",
    featureMarker: "✔️",
  },
];

const AD_TEMPLATES = [
  {
    title: "Premium Office Spaces 🏢",
    content: "Exclusive deals for tech startups!",
    color: "from-blue-600 to-purple-500",
    border: "border-cyan-300",
    font: "font-serif",
    style: "border-l-8 border-cyan-300",
    emoji: "🚀",
  },
  {
    title: "Luxury Apartments 🌆",
    content: "Waterfront views & modern amenities",
    color: "from-rose-600 to-pink-500",
    border: "border-rose-300",
    font: "font-display",
    style: "shadow-[0_0_30px_-5px_rgba(255,100,100,0.5)]",
    emoji: "🌟",
  },
  {
    title: "Co-Working Hub 🖥️",
    content: "24/7 access • Free coffee • Meeting rooms",
    color: "from-emerald-500 to-green-600",
    border: "border-emerald-300",
    font: "font-mono",
    style: "rounded-none border-t-8 border-green-400",
    emoji: "💡",
  },
  {
    title: "Retail Spaces 🛍️",
    content: "High foot traffic locations available",
    color: "from-amber-500 to-orange-400",
    border: "border-amber-300",
    font: "font-bold",
    style: "border-dashed border-4 border-yellow-400",
    emoji: "📍",
  },
  {
    title: "Industrial Warehouses �",
    content: "Secure storage solutions",
    color: "from-indigo-600 to-blue-500",
    border: "border-indigo-300",
    font: "font-extrabold",
    style: "border-8 border-purple-300",
    emoji: "🛡️",
  },
];

const ads = Array(10)
  .fill(null)
  .map((_, i) => {
    const template = AD_TEMPLATES[i % AD_TEMPLATES.length];
    return {
      id: `ad-${i}`,
      type: "ad",
      title: `${template.emoji} ${template.title}`,
      content: template.content,
      height: 200 + ((i * 50) % 300),
      template: { ...template, index: i },
    };
  });

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

  const getFontIndex = useCallback((id: string) => {
    return parseInt(id.slice(-2), 16) % FONTS.length;
  }, []);

  const getStyleType = useCallback((id: string) => {
    return parseInt(id.slice(-2), 16) % CARD_STYLES.length;
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
    setCooldownEnd(Date.now() + 30000);
    toast.success("+1 reveal attempt earned!");
  }, [cooldownEnd, timeLeft]);

  const getAdStyle = useCallback(
    (ad: (typeof ads)[number]) => {
      const t = ad.template;
      const isCooling = Date.now() < cooldownEnd;
      return `
      bg-gradient-to-br ${t.color}
      border-4 ${t.border}
      ${t.font}
      ${t.style}
      ${
        isCooling
          ? "opacity-75 cursor-not-allowed"
          : "hover:shadow-xl cursor-pointer hover:scale-[1.02]"
      }
      transition-all duration-300
    `;
    },
    [cooldownEnd]
  );

  const handleSearch = useCallback((query: string) => {
    setFilters((p) => ({ ...p, searchQuery: query }));
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((p) => ({ ...p, ...newFilters }));
  }, []);

  return (
    <div className="container py-8">
      <Toaster position="bottom-right" toastOptions={{ 
        style: {
          background: '#4F46E5',
          color: '#fff',
          border: '2px solid #818CF8'
        }
      }} />
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <SearchBar onSearch={handleSearch} />
        <ListingsFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20">
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
            const ad = item as (typeof ads)[number];
            return (
              <div
                key={ad.id}
                className={`w-full flex flex-col p-6 rounded-xl ${getAdStyle(
                  ad
                )}`}
                style={{ minHeight: ad.height }}
                onClick={handleAdClick}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase font-bold opacity-90">
                    Partner Offer
                  </span>
                  {Date.now() < cooldownEnd && (
                    <span className="text-xs opacity-75">
                      (Cooldown active)
                    </span>
                  )}
                </div>

                <h3
                  className={`text-2xl mb-3 ${
                    ad.template.index % 2 === 0
                      ? "text-gradient from-cyan-300 to-blue-500"
                      : "underline decoration-wavy"
                  }`}
                >
                  {ad.title}
                </h3>

                <p className="text-lg mb-4">{ad.content}</p>

                <div className="mt-auto text-sm opacity-90">
                  {Date.now() < cooldownEnd
                    ? "New offers available soon"
                    : "Click to continue"}
                </div>
              </div>
            );
          }

          const listing = item as Listing;
          const colorClass = COLORS[getColorIndex(listing.id)];
          const fontClass = FONTS[getFontIndex(listing.id)];
          const styleType = getStyleType(listing.id);
          const borderStyle = CARD_STYLES[styleType].borderStyle;

          return (
            <div
              key={listing.id}
              className={`w-full ${colorClass} ${fontClass} rounded-xl shadow-lg hover:shadow-xl transition-all ${borderStyle} overflow-hidden`}
            >
              <ListingCard
                listing={listing}
                isContactRevealed={revealedContacts.includes(listing.id)}
                onRevealContact={handleRevealContact}
                remainingAttempts={remainingAttempts}
                styleType={styleType}
              />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}