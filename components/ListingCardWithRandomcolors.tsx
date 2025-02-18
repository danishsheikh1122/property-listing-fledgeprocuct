"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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
}

export default function ListingCard({
  listing,
  isContactRevealed,
  onRevealContact,
  remainingAttempts,
  styleType,
}: ListingCardProps) {
  const [loading, setLoading] = useState(false);
  const style = CARD_STYLES[styleType % CARD_STYLES.length];

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
    <div className="h-full min-h-[250px] flex flex-col p-6 transition-all hover:scale-[1.01]">
      <h3 className={`${style.titleSize} ${style.titleWeight} mb-4`}>
        {listing.title}
      </h3>

      <div className="flex-1 space-y-4">
        <p className="text-sm opacity-90 font-mono">
          📍 {listing.location.address}, {listing.location.postal_code}
        </p>

        <div className="flex flex-wrap gap-2">
          {listing.prices.map((price) => (
            <span
              key={price.type}
              className={`px-3 py-1 rounded-full text-sm ${style.priceBg} font-medium backdrop-blur-sm`}
            >
              {price.type}: €{price.amount}
            </span>
          ))}
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

      <div className="mt-6 pt-4 border-t border-white/20">
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
            className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all hover:scale-[1.02]"
          >
            {loading ? "Verifying..." : "Reveal Contact Details"}
          </Button>
        )}
      </div>
    </div>
  );
}