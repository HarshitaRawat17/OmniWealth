import React from 'react';
import { TrendingUp, Activity, IndianRupee } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface HeroBannerProps {
  totalValue: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ totalValue }) => {
  return (
    <div className="w-full bg-gradient-to-br from-teal-500 via-teal-600 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-teal-300 opacity-10 rounded-full blur-2xl translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-teal-100 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Portfolio Value
          </h2>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            {formatINR(totalValue)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 sm:gap-8 bg-black/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 w-full md:w-auto">
          <div>
            <div className="text-teal-100 text-xs uppercase tracking-wider font-semibold mb-1">TOTAL APPRECIATION</div>
            <div className="text-lg sm:text-xl font-bold flex items-center gap-1.5 text-white">
              <TrendingUp className="w-4 h-4 text-teal-300" />
              +₹2,40,500
            </div>
          </div>
          <div className="w-px bg-white/20 hidden sm:block"></div>
          <div>
            <div className="text-teal-100 text-xs uppercase tracking-wider font-semibold mb-1">Today's Gain</div>
            <div className="text-lg sm:text-xl font-bold flex items-center gap-1.5 text-white">
              <Activity className="w-4 h-4 text-teal-300" />
              +₹12,450
            </div>
          </div>
          <div className="w-px bg-white/20 hidden sm:block"></div>
          <div>
            <div className="text-teal-100 text-xs uppercase tracking-wider font-semibold mb-1">XIRR</div>
            <div className="text-lg sm:text-xl font-bold text-white">
              22.48%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
