'use client';

import { FC } from 'react';
import { Heart, Share2, BadgeCheck, MapPin, Phone } from 'lucide-react';

interface PropertyCardProps {
  title: string;
  location: string;
  phone: string;
  price: string;
  type: string;
  verified?: boolean;
}

const PropertyCard: FC<PropertyCardProps> = ({
  title,
  location,
  phone,
  price,
  type,
  verified = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 w-full">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-1 w-full">
          <h2 className="text-3xl font-bold break-words flex-1 max-w-[30ch] flex items-center">
            {title}
          </h2>
        </div>
        <div className="flex gap-2">
        {verified && <BadgeCheck className="text-blue-500 leading-none ml-2" size={28} />}
        </div>
      </div>
      <p className="text-gray-500 flex items-center gap-2 text-base">
        <MapPin size={18} className="leading-none" /> <span className="flex-1">{location}</span>
      </p>
      <p className="text-gray-500 flex items-center gap-2 text-base">
        <a href={`tel:${phone}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <Phone size={18} className="leading-none" /> <span>{phone}</span>
        </a>
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xl font-bold">{price}</span>
        <span className="text-sm font-medium text-[#D1C6B4]">• {type.toUpperCase()}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="w-full bg-[#D1C6B4] text-[#fffdf9] py-3 rounded-lg font-semibold">
          View Details
        </button>
        <button className="bg-white text-white px-4 rounded-lg flex items-center justify-center">
          <Heart size={24} color='black'/>
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
