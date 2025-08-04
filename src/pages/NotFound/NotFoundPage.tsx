import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                404
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Page non trouvée</h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button 
                  icon={<Home size={18} />}
                >
                  Retour à l'accueil
                </Button>
              </Link>
              <Link to="/search">
                <Button 
                  variant="outline"
                  icon={<Search size={18} />}
                >
                  Rechercher une parcelle
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFoundPage;