import React from 'react';
import { motion } from 'framer-motion';

const COLOR_VARIANTS = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  red: "bg-red-50 text-red-600 border-red-100"
};

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-6 flex items-center justify-between border ${COLOR_VARIANTS[color] || COLOR_VARIANTS.blue}`}
    >
      <div>
        <p className="text-sm font-semibold opacity-80 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-white transition-colors">
          {value}
        </h3>
      </div>
      
      <div className={`p-4 rounded-2xl ${COLOR_VARIANTS[color] || COLOR_VARIANTS.blue} bg-white/50 border shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default StatCard;