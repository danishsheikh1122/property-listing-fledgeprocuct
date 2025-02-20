'use client';

import { FC } from 'react';
import { ArrowRight } from 'lucide-react';

interface PromoCardProps {
  title: string;
  subtitle: string;
  id: string;
  disclaimer: string;
}

const gradients = [
  "from-pink-400 to-purple-600",
  "from-blue-400 to-indigo-600",
  "from-green-400 to-teal-600",
  "from-orange-400 to-red-600"
];

const PromoCard: FC<PromoCardProps> = ({ title, subtitle, id, disclaimer }) => {
  const gradient = gradients[parseInt(id, 10) % gradients.length];
  
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-xl p-6 w-full max-w-md`}>
      <h2 className="text-2xl font-extrabold mb-2">{title}</h2>
      <p className="text-lg mb-4">{subtitle}</p>
      <p className="text-sm opacity-80 mb-6">DISCLAIMER: {disclaimer}</p>
      <div className="flex justify-end">
        <button className="text-white flex items-center gap-2 text-lg font-semibold">
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default PromoCard;
