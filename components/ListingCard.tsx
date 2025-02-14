// components/ListingCard.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

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
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRevealContact = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowContact(true);
    setLoading(false);
  };

  return (
    <div className="h-full min-h-[250px] flex flex-col">

      <h3 className="text-xl font-bold mb-4">{listing.title}</h3>
      
      <div className="flex-1 space-y-4">
        <p className="text-sm opacity-80">
          📍 {listing.location.address}, {listing.location.postal_code}
        </p>

        <div className="flex flex-wrap gap-2">
          {listing.prices.map((price) => (
            <span
              key={price.type}
              className="px-3 py-1 rounded-full text-sm bg-black/10 font-medium"
            >
              {price.type}: €{price.amount}
            </span>
          ))}
        </div>

        {listing.features && (
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {listing.features.map((feature) => (
              <li key={feature} className="leading-relaxed">{feature}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-opacity-20">
        {showContact ? (
          <div className="space-y-2">
            <p className="font-medium">📞 {listing.contact.phone}</p>
            <p className="font-medium">📧 {listing.contact.email}</p>
            {listing.deposit && <p className="text-sm">Deposit: €{listing.deposit}</p>}
          </div>
        ) : (
          <Button
            onClick={handleRevealContact}
            disabled={loading}
            className="w-full bg-black text-white hover:bg-neutral-800"
          >
            {loading ? 'Verifying...' : 'Reveal Contact Details'}
          </Button>
        )}
      </div>
    </div>
  );
}