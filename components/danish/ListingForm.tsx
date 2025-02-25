"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash,
  DollarSign,
  Phone,
  Mail,
  Shield,
  Home,
  MapPin,
  Tag,
  User,
} from "lucide-react";

interface ListingFormProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  location: {
    address: string;
    postal_code: string;
  };
  prices: Array<{
    type: string;
    amount: string;
  }>;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  features: string[];
  deposit: string;
  card_type: string;
  user_id: string;
}

export function ListingForm({ userId, onClose, onSuccess }: ListingFormProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    location: { address: "", postal_code: "" },
    prices: [{ type: "Studio", amount: "" }],
    contact: { name: "", phone: "", email: "" },
    features: [""],
    deposit: "",
    card_type: "standard",
    user_id: userId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNestedChange = (path: string, value: string) => {
    const paths = path.split(".");
    setFormData((prev) => ({
      ...prev,
      [paths[0]]:
        paths.length > 1
          ? { ...prev[paths[0] as keyof FormData], [paths[1]]: value }
          : value,
    }));
  };

  const handleArrayChange = (
    arrayName: "prices" | "features",
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]] as any;
      newArray[index][field] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayField = (arrayName: "prices" | "features") => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]:
        arrayName === "prices"
          ? [...prev.prices, { type: "Studio", amount: "" }]
          : [...prev.features, ""],
    }));
  };

  const removeArrayField = (
    arrayName: "prices" | "features",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    // Check all constraints
    if (!formData.title) return "Title is required";
    if (!formData.location.address) return "Address is required";
    if (!formData.contact.phone.match(/^[0-9+][0-9\s()-]{9,19}$/))
      return "Invalid phone number";
    if (
      !formData.contact.email.match(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
      )
    )
      return "Invalid email";
    if (formData.prices.some((p) => Number(p.amount) <= 0))
      return "All prices must be greater than 0";
    if (Number(formData.deposit) < 0) return "Deposit cannot be negative";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("listings").insert([
        {
          title: formData.title,
          location: formData.location,
          prices: formData.prices.map((p) => ({
            type: p.type,
            amount: Number(p.amount),
          })),
          contact: formData.contact,
          features: formData.features.filter((f) => f.trim() !== ""),
          deposit: Number(formData.deposit),
          card_type: formData.card_type,
          user_id: userId,
        },
      ]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl w-full bg-[#EBEDDF] shadow-2xl rounded-xl overflow-hidden"
    >
      <div className="bg-[#333A2F] px-6 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#EBEDDF]">
          Create New Listing
        </h1>
        <button
          onClick={onClose}
          className="text-[#EBEDDF] hover:text-[#EBEDDF]/80 text-2xl"
          aria-label="Close form"
        >
          &times;
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-8 py-6 space-y-6 max-h-[80vh] overflow-y-auto"
      >
        {error && (
          <div className="text-red-500 text-center p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-[#333A2F] font-semibold mb-2">
            Property Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleNestedChange("title", e.target.value)}
            placeholder="Cozy Apartment in Downtown Berlin"
            required
            className="bg-white border-[#333A2F]/20"
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333A2F] flex items-center gap-2">
            <MapPin size={20} /> Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#333A2F] font-medium mb-2">
                Street Address
              </label>
              <Input
                value={formData.location.address}
                onChange={(e) =>
                  handleNestedChange("location.address", e.target.value)
                }
                placeholder="Friedrichstrasse 45"
                required
                className="bg-white border-[#333A2F]/20"
              />
            </div>
            <div>
              <label className="block text-[#333A2F] font-medium mb-2">
                Postal Code
              </label>
              <Input
                value={formData.location.postal_code}
                onChange={(e) =>
                  handleNestedChange("location.postal_code", e.target.value)
                }
                placeholder="10117 Berlin"
                className="bg-white border-[#333A2F]/20"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333A2F] flex items-center gap-2">
            <Tag size={20} /> Pricing Information
          </h3>
          {formData.prices.map((price, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
            >
              <div className="md:col-span-4">
                <label className="block text-[#333A2F] font-medium mb-2">
                  Price Type
                </label>
                <select
                  value={price.type}
                  onChange={(e) =>
                    handleArrayChange("prices", index, "type", e.target.value)
                  }
                  className="w-full p-2 border border-[#333A2F]/20 rounded-md bg-white"
                >
                  <option value="Studio">Studio</option>
                  <option value="1-bedroom">1-Bedroom</option>
                  <option value="2-bedroom">2-Bedroom</option>
                  <option value="Shared">Shared</option>
                </select>
              </div>
              <div className="md:col-span-6">
                <label className="block text-[#333A2F] font-medium mb-2">
                  Amount (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
                  <Input
                    type="number"
                    value={price.amount}
                    onChange={(e) =>
                      handleArrayChange(
                        "prices",
                        index,
                        "amount",
                        e.target.value
                      )
                    }
                    placeholder="850"
                    step="0.01"
                    min="0"
                    required
                    className="pl-10 bg-white border-[#333A2F]/20"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                {formData.prices.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeArrayField("prices", index)}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayField("prices")}
            variant="outline"
            className="text-[#333A2F] border-[#333A2F]/30"
          >
            <Plus size={16} className="mr-2" /> Add Price Tier
          </Button>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333A2F] flex items-center gap-2">
            <User size={20} /> Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#333A2F] font-medium mb-2">
                Contact Name
              </label>
              <Input
                value={formData.contact.name}
                onChange={(e) =>
                  handleNestedChange("contact.name", e.target.value)
                }
                placeholder="Anna Schmidt"
                required
                className="bg-white border-[#333A2F]/20"
              />
            </div>
            <div>
              <label className="block text-[#333A2F] font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
                <Input
                  value={formData.contact.phone}
                  onChange={(e) =>
                    handleNestedChange("contact.phone", e.target.value)
                  }
                  placeholder="+49 152 9876543"
                  required
                  className="pl-10 bg-white border-[#333A2F]/20"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#333A2F] font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
                <Input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    handleNestedChange("contact.email", e.target.value)
                  }
                  placeholder="anna.schmidt@example.com"
                  required
                  className="pl-10 bg-white border-[#333A2F]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333A2F] flex items-center gap-2">
            <Home size={20} /> Property Features
          </h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Input
                value={feature}
                onChange={(e) =>
                  handleArrayChange("features", index, "", e.target.value)
                }
                placeholder="Modern kitchen"
                className="flex-1 bg-white border-[#333A2F]/20"
              />
              <Button
                type="button"
                onClick={() => removeArrayField("features", index)}
                variant="destructive"
                disabled={formData.features.length === 1}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayField("features")}
            variant="outline"
            className="text-[#333A2F] border-[#333A2F]/30"
          >
            <Plus size={16} className="mr-2" /> Add Feature
          </Button>
        </div>

        {/* Deposit & Card Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Security Deposit (€)
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
              <Input
                type="number"
                value={formData.deposit}
                onChange={(e) => handleNestedChange("deposit", e.target.value)}
                placeholder="1000"
                step="0.01"
                min="0"
                required
                className="pl-10 bg-white border-[#333A2F]/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Listing Card Type
            </label>
            <select
              value={formData.card_type}
              onChange={(e) => handleNestedChange("card_type", e.target.value)}
              className="w-full p-2 border border-[#333A2F]/20 rounded-md bg-white"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full bg-[#333A2F] text-[#EBEDDF] hover:bg-[#333A2F]/90 h-12 text-lg"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Listing"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
