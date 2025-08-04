import React from 'react';
import { motion } from 'framer-motion';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-dark-900" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Section supprimée car elle était en double avec Benefits.tsx */}
        
        {/* Call to action uniquement */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-gray-300 mb-6">
            Rejoins les milliers d'acheteurs qui économisent grâce à notre service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/search"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer ma recherche
            </motion.a>
            <motion.a
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-600 text-primary-400 hover:bg-primary-600/20 font-medium rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Voir les tarifs
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;