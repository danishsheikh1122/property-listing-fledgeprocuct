import Listings from '@/components/Listings';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

async function getListings() {
  const supabase = createServerActionClient({ cookies }); // No need for `() => cookies()`

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const listings = await getListings();
  return <Listings initialListings={listings} />;
}
