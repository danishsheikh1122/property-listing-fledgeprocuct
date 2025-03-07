"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Masonry from "react-masonry-css";
import ListingCard from "./ListingCard";
import SearchBar from "./SearchBar";
import ListingsFilter from "./ListingsFilters";
import toast, { Toaster } from "react-hot-toast";
import HeroSection from "./adnan/Hero";

const breakpointColumns = {
  default: 3,
  1100: 3,
  800: 2,
  600: 1,
};

const COLORS = [
  "bg-gradient-to-br from-white to-gray-50",
  "bg-gradient-to-br from-rose-50 to-50%",
  "bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100",
  "bg-gradient-to-br from-green-50 to-emerald-100",
  "bg-gradient-to-br from-yellow-100 to-amber-50",
];

const FONTS = [
  "font-poppins",      // Google Font
  "font-playfair",     // Google Font
  "font-space-mono",   // Google Font
  "font-lora",         // Google Font
  "font-archivo",      // Google Font
];

const BORDER_STYLES = [
  "border-l-[6px] border-t-2 border-r-2 border-b-2 border-blue-600",
  "clip-path-polygon shadow-[inset_0_-4px_0_0_rgba(79,70,229,0.4)]",
  "border-4 border-dashed border-emerald-500/50",
  "shadow-[0_0_0_4px_white,0_0_0_6px_#4f46e5]",
  "before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-10 relative isolate",
  "border-2 border-black/10 hover:border-black/30 transition-all",
  "bg-white/50 backdrop-blur-sm border border-white/30 shadow-sm",
];

const CARD_STYLES = [
  {
    titleSize: "text-2xl",
    titleWeight: "font-bold tracking-tight",
    priceBg: "bg-blue-100/50 border border-blue-200",
    borderStyle: "border-l-4 border-blue-500 shadow-lg",
    featureMarker: "🔹",
    className: "hover:-rotate-1 transition-transform",
  },
  {
    titleSize: "text-3xl",
    titleWeight: "font-black uppercase tracking-wider",
    priceBg: "bg-gradient-to-r from-green-100 to-green-50 border border-green-200",
    borderStyle: "rounded-xl overflow-hidden shadow-2xl",
    featureMarker: "▸",
    className: "hover:translate-y-2 transition-transform",
  },
  {
    titleSize: "text-xl",
    titleWeight: "font-semibold italic",
    priceBg: "bg-yellow-100/40 border-2 border-dashed border-yellow-400",
    borderStyle: "rounded-none border-b-4 border-black",
    featureMarker: "•",
    className: "hover:skew-y-1 transition-transform",
  },
  {
    titleSize: "text-2xl",
    titleWeight: "font-medium underline decoration-wavy",
    priceBg: "bg-pink-100/60 shadow-inner",
    borderStyle: "border-2 border-black/20 hover:border-black/40",
    featureMarker: "→",
    className: "hover:scale-[1.02] transition-transform",
  },
  {
    titleSize: "text-2xl",
    titleWeight: "font-black font-space-mono",
    priceBg: "bg-purple-100/80 border border-purple-300",
    borderStyle: "clip-path-hexagon shadow-xl",
    featureMarker: "✔️",
    className: "hover:rotate-1 transition-transform",
  },
];

const AD_TEMPLATES = [
  {
    title: "Premium Office Spaces 🏢",
    content: "Exclusive deals for tech startups!",
    color: "from-blue-100 to-blue-50",
    border: "border-blue-200",
    font: "font-playfair",
    style: "border-l-4 border-blue-500 shadow-xl",
    emoji: "🚀",
    className: "hover:shadow-blue-200/40",
  },
  {
    title: "Luxury Apartments 🌆",
    content: "Waterfront views & modern amenities",
    color: "from-rose-100 via-pink-50 to-rose-50",
    border: "border-rose-200",
    font: "font-poppins",
    style: "shadow-lg hover:shadow-rose-200/40",
    emoji: "🌟",
    className: "hover:-translate-y-2",
  },
  {
    title: "Co-Working Hub 🖥️",
    content: "24/7 access • Free coffee • Meeting rooms",
    color: "from-emerald-100 to-emerald-50",
    border: "border-emerald-200",
    font: "font-space-mono",
    style: "rounded-none border-b-4 border-emerald-500",
    emoji: "💡",
    className: "hover:skew-x-2",
  },
  {
    title: "Retail Spaces 🛍️",
    content: "High foot traffic locations available",
    color: "from-amber-100 to-amber-50",
    border: "border-amber-200",
    font: "font-archivo",
    style: "border-dashed border-2 border-amber-500",
    emoji: "📍",
    className: "hover:rotate-2",
  },
  {
    title: "Industrial Warehouses 🏭",
    content: "Secure storage solutions",
    color: "from-stone-100 to-stone-50",
    border: "border-stone-300",
    font: "font-lora",
    style: "border-2 border-stone-500 shadow-md",
    emoji: "🛡️",
    className: "hover:scale-[1.02]",
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
      border-2 ${t.border}
      ${t.font}
      ${t.style}
      ${
        isCooling
          ? "opacity-75 cursor-not-allowed"
          : "hover:shadow-xl cursor-pointer"
      }
      transition-all duration-300
      ${ad.template.index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"}
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
    <>
    <HeroSection></HeroSection>
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
                  <span className="text-xs uppercase font-bold opacity-75">
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
                      ? "text-gradient"
                      : "underline decoration-wavy"
                  }`}
                >
                  {ad.title}
                </h3>

                <p className="text-lg mb-4">{ad.content}</p>

                <div className="mt-auto text-sm opacity-75">
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

          return (
            <div
              key={listing.id}
              className={`w-full ${colorClass} ${fontClass} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}
            >
              <ListingCard
                listing={listing}
                isContactRevealed={revealedContacts.includes(listing.id)}
                onRevealContact={handleRevealContact}
                remainingAttempts={remainingAttempts}
                styleType={styleType}
                colorClass={colorClass}
              />
            </div>
          );
        })}
      </Masonry>
    </div>
    </>
  );
}
