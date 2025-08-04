import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      className={`bg-dark-800 rounded-xl overflow-hidden border border-dark-700 ${hover ? 'hover:border-primary-500/50' : ''} ${className}`}
      whileHover={hover ? { y: -5, boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.1)' } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;