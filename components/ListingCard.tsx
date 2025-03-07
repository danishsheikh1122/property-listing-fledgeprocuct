// components/ListingCard.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BadgeCheck } from "lucide-react";

const CARD_STYLES = [
  {
    titleSize: "text-2xl",
    titleWeight: "font-bold",
    priceBg: "bg-blue-100",
    borderStyle: "border-l-4 border-blue-500",
    featureMarker: "🔹",
  },
  {
    titleSize: "text-3xl",
    titleWeight: "font-extrabold",
    priceBg: "bg-green-100",
    borderStyle: "border-t-4 border-green-500",
    featureMarker: "🌟",
  },
  {
    titleSize: "text-xl",
    titleWeight: "font-semibold italic",
    priceBg: "bg-yellow-100",
    borderStyle: "shadow-lg",
    featureMarker: "•",
  },
  {
    titleSize: "text-2xl",
    titleWeight: "font-medium underline",
    priceBg: "bg-pink-100",
    borderStyle: "rounded-none",
    featureMarker: "→",
  },
  {
    titleSize: "text-2xl",
    titleWeight: "font-black",
    priceBg: "bg-purple-100",
    borderStyle: "",
    featureMarker: "✔️",
  },
];

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    location: { address: string; postal_code: string };
    prices: Array<{ type: string; amount: number }>;
    contact: { name: string; phone: string; email: string };
    features: string[];
    deposit?: number;
  };
  isContactRevealed: boolean;
  onRevealContact: (listingId: string) => Promise<boolean>;
  remainingAttempts: number;
  styleType: number;
  colorClass : string;
}
const BUTTON_COLORS: Record<string, string> = {
  "bg-gradient-to-br from-white to-gray-50": "bg-gray-200 hover:bg-gray-300 text-gray-700",
  "bg-gradient-to-br from-rose-50 to-50%": "bg-rose-200 hover:bg-rose-300 text-rose-700",
  "bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100": "bg-indigo-200 hover:bg-indigo-300 text-indigo-700",
  "bg-gradient-to-br from-green-50 to-emerald-100": "bg-green-200 hover:bg-green-300 text-green-700",
  "bg-gradient-to-br from-yellow-100 to-amber-50": "bg-yellow-200 hover:bg-yellow-300 text-yellow-700",
};



export default function ListingCard({
  listing,
  isContactRevealed,
  onRevealContact,
  remainingAttempts,
  styleType,
  colorClass,
}: ListingCardProps) {
  const [loading, setLoading] = useState(false);
  const style = CARD_STYLES[styleType % CARD_STYLES.length];


  const buttonColor = BUTTON_COLORS[colorClass] || "bg-gray-200 hover:bg-gray-300 text-gray-900"; // Default fallback

  const handleRevealContact = async () => {
    if (remainingAttempts <= 0) {
      toast.error("Click any ad to earn contact reveal attempts!");
      return;
    }

    setLoading(true);
    try {
      const success = await onRevealContact(listing.id);
      if (!success) {
        toast.error("No reveal attempts remaining. Click an ad to earn more!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`h-full min-h-[250px] flex flex-col p-6 ${style.borderStyle} transition-all hover:scale-[1.01]`}
    >
 <h3 className={`${style.titleSize} ${style.titleWeight} mb-4 flex items-start gap-x-2`}>
  <span className="flex-1">{listing.title}</span>
  <BadgeCheck className="w-8 h-8 shrink-0 self-auto text-blue-500" />
</h3>


      <div className="flex-1 space-y-4">
        {/* <p className="text-sm opacity-80 font-mono">
          📍 {listing.location.address}, {listing.location.postal_code}
        </p> */}

        <div className="flex flex-wrap gap-2">
          {Array.isArray(listing.prices) ? (
            listing.prices.map((price) => (
              <span
                key={price.type}
                className={`px-3 py-1 rounded-full text-sm ${style.priceBg} font-medium`}
              >
                {price.type}: €{price.amount}
              </span>
            ))
          ) : (
            <span>No pricing available</span>
          )}
        </div>

        {listing.features && (
          <ul className="list-none pl-0 space-y-2 text-sm">
            {listing.features.map((feature) => (
              <li key={feature} className="leading-relaxed flex items-center">
                <span className="mr-2">{style.featureMarker}</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-opacity-20">
        {isContactRevealed ? (
          <div className="space-y-2">
            <p className="font-medium">📞 {listing.contact.phone}</p>
            <p className="font-medium">📧 {listing.contact.email}</p>
            {listing.deposit && (
              <p className="text-sm">Deposit: €{listing.deposit}</p>
            )}
          </div>
        ) : (
          <Button
            onClick={handleRevealContact}
            disabled={loading}
            className={`w-full bg-black text-white hover:bg-neutral-800 ${buttonColor}`}
          >
            {loading ? "Verifying..." : "Reveal Contact Details"}
          </Button>
        )}
      </div>
    </div>
  );
}
