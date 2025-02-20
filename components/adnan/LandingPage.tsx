import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, BedDouble, Bath, Square } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="text-xl font-bold">
            RentEase
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Rent
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              List Property
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          <Button variant="outline">Sign In</Button>
        </div>
      </header>
      <main className="flex-grow">
        <section className="py-20 text-center bg-muted">
          <div className="container px-4 mx-auto">
            <h1 className="mb-4 text-4xl font-bold">Find Your Perfect Rental</h1>
            <p className="mb-8 text-lg text-muted-foreground">Discover apartments and homes for rent in your area</p>
            <div className="flex items-center max-w-2xl p-2 mx-auto bg-white rounded-lg shadow-sm">
              <Input
                type="text"
                placeholder="Enter city, neighborhood, or ZIP"
                className="flex-grow border-none shadow-none"
              />
              <Button type="submit" className="ml-2">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <h2 className="mb-8 text-2xl font-bold">Featured Listings</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden bg-white rounded-lg shadow-md">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=Apartment ${i}`}
                    alt={`Apartment ${i}`}
                    width={400}
                    height={200}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-semibold">Modern Apartment in Downtown</h3>
                    <div className="flex items-center mb-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">123 Main St, Cityville</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <BedDouble className="w-4 h-4 mr-1" />
                        <span>2 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>2 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span>1000 sqft</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">$1,500/mo</span>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                View All Listings
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 bg-muted">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 RentEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

