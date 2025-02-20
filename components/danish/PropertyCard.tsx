// components/PropertyCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert } from "lucide-react"

export function PropertyCard({ property }: { property: any }) {
  return (
    <Card className="bg-white border-[#EBEDDF] hover:shadow-lg transition-shadow h-full flex flex-col group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-[#333A2F]">{property.title}</CardTitle>
          <Badge 
            variant={property.verified ? "default" : "destructive"} 
            className="flex items-center gap-1.5"
          >
            {property.verified ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                Verified
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                Pending Verification
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3 text-[#333A2F]">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-sm text-[#333A2F]/70">Price</p>
            <p className="font-semibold">${Number(property.price).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#333A2F]/70">Type</p>
            <p className="capitalize">{property.property_type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#333A2F]/70">Bedrooms</p>
            <p>{property.bedrooms}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#333A2F]/70">Bathrooms</p>
            <p>{property.bathrooms}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-[#333A2F]/70">Address</p>
          <p className="text-sm line-clamp-2">{property.address}</p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-[#EBEDDF] pt-4">
        <Button 
          variant="outline" 
          className="w-full text-[#333A2F] border-[#333A2F]/20 hover:bg-[#333A2F]/10 hover:text-[#333A2F]"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}