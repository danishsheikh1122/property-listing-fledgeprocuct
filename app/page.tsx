"use client"; // ✅ Fix by using a client component

import { useEffect, useState } from "react";
import Listings from "@/components/Listings";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const supabase = createClientComponentClient();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        return;
      }
      setListings(data || []);
    }

    fetchListings();
  }, []);

  return <Listings initialListings={listings} />;
}
