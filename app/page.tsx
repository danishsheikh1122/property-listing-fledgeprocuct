// app/page.tsx
import Listings from '@/components/Listings';
import supabase from '@/lib/supabase';

async function getListings() {
  const { data, error } = await supabase
    .from('listings')
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
