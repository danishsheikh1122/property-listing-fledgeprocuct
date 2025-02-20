// app/page.tsx
import Header from "@/components/adnan/Header";
import Hero from "@/components/adnan/Hero";
import LandingPage from "@/components/adnan/LandingPage";
import Listings from "@/components/Listings";
import supabase from "@/lib/supabase";
import RealEstateCard from "@/components/adnan/Card";
import PromoCard from "@/components/adnan/AdBlock";

async function getListings() {
  const { data } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

const properties = [
  {
    title: "Paradise Land as dddddd asds",
    location: "Berlin, Germany",
    phone: "+82 2323 23 2",
    price: "$45,000",
    type: "Apartment",
    verified: true,
  },
  {
    title: "Sunset Villa",
    location: "Los Angeles, USA",
    phone: "+1 323 555 0198",
    price: "$750,000",
    type: "Villa",
    verified: false,
  },
  {
    title: "Skyline Loft",
    location: "New York, USA",
    phone: "+1 212 555 1234",
    price: "$1,200,000",
    type: "Penthouse",
    verified: true,
  },
  {
    title: "Cozy Cottage",
    location: "Edinburgh, Scotland",
    phone: "+44 131 555 6789",
    price: "$250,000",
    type: "Cottage",
    verified: false,
  },
  {
    title: "Seaside Retreat",
    location: "Sydney, Australia",
    phone: "+61 2 5551 9876",
    price: "$890,000",
    type: "Beach House",
    verified: true,
  },
  {
    title: "Spacious Family Home with a Large Backyard",
    location: "Perth, Australia",
    phone: "+61 8 5554 1234",
    price: "$950,000",
    type: "Family Home",
    verified: true,
  },
  {
    title: "Rustic Farmhouse Surrounded by Rolling Hills",
    location: "Adelaide, Australia",
    phone: "+61 8 5555 5678",
    price: "$1,100,000",
    type: "Farmhouse",
    verified: false,
  },
  {
    title: "Charming Studio Apartment Near the Beach",
    location: "Gold Coast, Australia",
    phone: "+61 7 5556 9101",
    price: "$480,000",
    type: "Studio",
    verified: true,
  },
  {
    title: "Elegant Penthouse with Stunning Skyline Views",
    location: "Sydney, Australia",
    phone: "+61 2 5557 1122",
    price: "$2,300,000",
    type: "Penthouse",
    verified: true,
  },
  {
    title: "Quaint Countryside Retreat with a Private Lake",
    location: "Canberra, Australia",
    phone: "+61 2 5558 3344",
    price: "$1,500,000",
    type: "Country House",
    verified: false,
  },
  {
    title: "Stylish Loft in the Heart of the Arts District",
    location: "Melbourne, Australia",
    phone: "+61 3 5559 5566",
    price: "$820,000",
    type: "Loft",
    verified: true,
  },
];

const promoAds = [
  {
    id: "1",
    title: "10% OFF on Amazon",
    subtitle: "Get exclusive discounts on your favorite products.",
    disclaimer: "Limited time offer. Terms and conditions apply.",
  },
  {
    id: "2",
    title: "Flat 20% OFF on Electronics",
    subtitle: "Upgrade your gadgets at the best prices.",
    disclaimer: "Valid for selected items only.",
  },
  {
    id: "3",
    title: "Buy 1 Get 1 Free on Fashion",
    subtitle: "Refresh your wardrobe with the latest trends.",
    disclaimer: "Applicable only on selected brands.",
  },
  {
    id: "4",
    title: "Exclusive Travel Deals",
    subtitle: "Save big on your next adventure.",
    disclaimer: "Hurry! Limited seats available.",
  },
];

export default async function Home() {
  const listings = await getListings();
  
  return (
    <>
      <Header />
      <Hero />
      <div className="p-4 bg-white">
        {/* Masonry Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-row-dense">
          {properties.map((property, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <RealEstateCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
