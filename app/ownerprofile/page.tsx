// ProfilePage.tsx
'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ListingForm } from "@/components/danish/ListingForm"
import { PropertyCard } from "@/components/danish/PropertyCard"

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchProperties = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth'
        return
      }
      setUser(user)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (user) fetchProperties()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEDDF]">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-white  p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-[#d1c393] p-6 rounded-xl text-[#EBEDDF]">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.email}</h1>
            <p className="text-[#EBEDDF]/80 mt-1">
              {properties.length} properties listed
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-[#EBEDDF] text-[#333A2F] hover:bg-[#EBEDDF]/90"
            >
              + Post New Property
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-[#EBEDDF] border-[#EBEDDF] hover:bg-[#EBEDDF]/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-[#333A2F]/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-[#333A2F]/80 flex items-center justify-center p-4 z-50">
            <ListingForm
              userId={user.id}
              onClose={() => setShowForm(false)}
              onSuccess={fetchProperties}
            />
          </div>
        )}
      </main>
    </div>
  )
}

// PropertyCard component remains the same
