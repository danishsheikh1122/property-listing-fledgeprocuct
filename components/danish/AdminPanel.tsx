"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Home,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminPanel() {
  const supabase = createClient();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return false;
      }

      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data.is_admin);
      return data.is_admin;
    } catch (err) {
      setError("Failed to verify admin status");
      return false;
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const isAdmin = await checkAdminStatus();
      if (!isAdmin) return;

      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          user:user_id (id, email)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (
    propertyId: string,
    currentStatus: boolean
  ) => {
    try {
      setUpdating(propertyId);
      const { error } = await supabase
        .from("listings")
        .update({ verified: !currentStatus })
        .eq("id", propertyId);

      if (error) throw error;
      toast.success(`Property ${!currentStatus ? "verified" : "unverified"}`);
      fetchProperties();
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // if (!isAdmin && !loading) {
  //   return (
  //     <div className="max-w-7xl mx-auto p-8 text-center">
  //       <ShieldAlert className="h-16 w-16 mx-auto text-red-500" />
  //       <h1 className="text-2xl font-bold mt-4">Unauthorized Access</h1>
  //       <p className="text-gray-600 mt-2">
  //         You don't have permission to view this page
  //       </p>
  //     </div>
  //   );
  // }
  const PropertyDetailModal = ({ property }: { property: any }) => (
    <Dialog open={!!property} onOpenChange={() => setSelectedProperty(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-primary">
            <Home className="h-6 w-6 text-secondary" />
            {property?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-secondary p-4 rounded-lg border border-primary">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-primary">Property Owner</p>
                <p className="text-primary">
                  {property?.user?.email || "No owner information"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary p-4 rounded-lg border border-primary">
              <p className="text-sm text-primary/80">Price</p>
              <p className="font-semibold text-primary">
                ${Number(property?.price).toLocaleString()}
              </p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-primary">
              <p className="text-sm text-primary/80">Bedrooms</p>
              <p className="font-semibold text-primary">{property?.bedrooms}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-primary">
              <p className="text-sm text-primary/80">Bathrooms</p>
              <p className="font-semibold text-primary">
                {property?.bathrooms}
              </p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-primary">
              <p className="text-sm text-primary/80">Area</p>
              <p className="font-semibold text-primary">{property?.area} sqm</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              property?.verified ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {property?.verified ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-yellow-600" />
              )}
              <span className="font-medium text-primary">
                {property?.verified
                  ? "Verified Property"
                  : "Pending Verification"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Description
            </h3>
            <p className="text-primary/80 whitespace-pre-line">
              {property?.description || "No description provided"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Address</h3>
            <p className="text-primary/80">{property?.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary/80">Email</p>
                <p className="text-primary/80">{property?.email}</p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Phone</p>
                <p className="text-primary/80">{property?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Security Deposit</p>
                <p className="text-primary/80">
                  ${Number(property?.deposit).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Listed Date</p>
                <p className="text-primary/80">
                  {new Date(property?.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Property Management</h1>
        <Button
          variant="outline"
          onClick={fetchProperties}
          disabled={loading}
          className="border-primary text-primary hover:bg-secondary"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-primary overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="text-primary">Property</TableHead>
              <TableHead className="text-primary">Price</TableHead>
              <TableHead className="text-primary">Type</TableHead>
              <TableHead className="text-primary">Status</TableHead>
              <TableHead className="text-primary">Owner</TableHead>
              <TableHead className="text-primary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-primary/70"
                >
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className="cursor-pointer hover:bg-secondary/30"
                >
                  <TableCell className="font-medium text-primary">
                    {property.title}
                  </TableCell>
                  <TableCell className="text-primary">
                    ${Number(property.price).toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize text-primary">
                    {property.property_type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={property.verified ? "default" : "secondary"}
                      className="gap-1.5 w-fit bg-primary text-white"
                    >
                      {property.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-primary">
                    {property.user?.email || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={property.verified ? "destructive" : "default"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVerification(property.id, property.verified);
                      }}
                      disabled={updating === property.id}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      {updating === property.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : property.verified ? (
                        "Unverify"
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PropertyDetailModal property={selectedProperty} />
    </div>
  );
}
