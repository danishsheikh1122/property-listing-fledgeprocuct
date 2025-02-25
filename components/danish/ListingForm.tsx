// components/ListingForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DollarSign, Phone, Mail, Shield } from "lucide-react";

interface ListingFormProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  address: string;
  description: string;
  property_type: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  phone: string;
  email: string;
  deposit: string;
  user_id: string;
  verified: boolean;
}

export function ListingForm({ userId, onClose, onSuccess }: ListingFormProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    address: "",
    description: "",
    property_type: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    phone: "",
    email: "",
    deposit: "",
    user_id: userId,
    verified: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("listings").insert([
        {
          ...formData,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          area: Number(formData.area),
          deposit: Number(formData.deposit),
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

        {/* Property Title */}
        <div>
          <label className="block text-[#333A2F] font-semibold mb-2">
            Property Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Modern Apartment in City Center"
            required
            className="bg-white border-[#333A2F]/20"
          />
        </div>

        {/* Property Type & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Property Type
            </label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              required
              className="w-full p-2 border border-[#333A2F]/20 rounded-md bg-white"
            >
              <option value="">Select property type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="250000"
                required
                className="pl-10 bg-white border-[#333A2F]/20"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Bedrooms
            </label>
            <Input
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="2"
              required
              className="bg-white border-[#333A2F]/20"
            />
          </div>
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Bathrooms
            </label>
            <Input
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="1"
              required
              className="bg-white border-[#333A2F]/20"
            />
          </div>
          <div>
            <label className="block text-[#333A2F] font-semibold mb-2">
              Area (sqm)
            </label>
            <Input
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
              placeholder="75"
              required
              className="bg-white border-[#333A2F]/20"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[#333A2F] font-semibold mb-2">
            Address
          </label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full property address"
            required
            className="bg-white border-[#333A2F]/20"
            rows={3}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#333A2F] font-semibold mb-2">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the property"
            className="bg-white border-[#333A2F]/20"
            rows={4}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#333A2F]">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#333A2F] font-semibold mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="pl-10 bg-white border-[#333A2F]/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#333A2F] font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="pl-10 bg-white border-[#333A2F]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Deposit */}
        <div>
          <label className="block text-[#333A2F] font-semibold mb-2">
            Security Deposit
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333A2F]/50" />
            <Input
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleChange}
              placeholder="1000"
              required
              className="pl-10 bg-white border-[#333A2F]/20"
            />
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
