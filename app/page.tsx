// app/page.tsx
import Listings from '@/components/Listings';
import supabase from '@/lib/supabase';

async function getListings() {
  const { data } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function Home() {
  const listings = await getListings();
  return <Listings initialListings={listings} />;
}