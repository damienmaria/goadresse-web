import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { STRIPE_PRODUCTS } from '../../stripe-config';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const handleSuccess = async () => {
      if (sessionId) {
        // Refresh user profile to get updated subscription status
        await refreshProfile();
        setIsLoading(false);
      } else {
        // If no session ID, redirect to pricing
        navigate('/pricing');
      }
    };

    handleSuccess();
  }, [sessionId, refreshProfile, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold mb-4">
                Paiement <span className="gradient-text">réussi</span> !
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Félicitations ! Ton achat a été traité avec succès.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-dark-800 rounded-xl p-8 mb-8 border border-dark-700"
            >
              <h2 className="text-2xl font-semibold mb-6">Tu as maintenant accès à :</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-dark-700 rounded-lg">
                  <CheckCircle size={20} className="text-green-500 mr-3" />
                  <span>Adresses exactes des maisons</span>
                </div>
                <div className="flex items-center p-4 bg-dark-700 rounded-lg">
                  <CheckCircle size={20} className="text-green-500 mr-3" />
                  <span>Visualisation sur carte</span>
                </div>
                <div className="flex items-center p-4 bg-dark-700 rounded-lg">
                  <CheckCircle size={20} className="text-green-500 mr-3" />
                  <span>Redirection vers Google Maps</span>
                </div>
                <div className="flex items-center p-4 bg-dark-700 rounded-lg">
                  <CheckCircle size={20} className="text-green-500 mr-3" />
                  <span>Visualisation de la parcelle</span>
                </div>
                <div className="flex items-center p-4 bg-dark-700 rounded-lg">
                  <CheckCircle size={20} className="text-green-500 mr-3" />
                  <span>Exploration du quartier</span>
                </div>
                <div className="flex items-center p-4 bg-dark-700 rounded-lg">
                  <CheckCircle size={20} className="text-green-500 mr-3" />
                  <span>Support client prioritaire</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/search')}
                icon={<Search size={18} />}
                size="lg"
              >
                Commencer ma recherche
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                icon={<ArrowRight size={18} />}
                size="lg"
              >
                Voir mon profil
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Besoin d'aide ?</h3>
              <p className="text-gray-300 mb-4">
                Notre équipe est là pour t'accompagner dans l'utilisation de GoAdresse.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.href = 'mailto:contact@goadresse.fr'}
              >
                Nous contacter
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SuccessPage;