import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, LogOut, Clock, Search, User, AlertTriangle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../lib/supabase';
import { getUserPayment } from '../../lib/supabase';
import { Payment } from '../../types/payment';
import { handleStripePortal } from '../../stripe/checkout';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { firebaseUser, userData, refreshUserData } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const subscriptionSuccess = searchParams.get('subscription') === 'success';
  
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (firebaseUser) {
        try {
          const userPayment = await getUserPayment(firebaseUser.uid);
          setPayment(userPayment);
        } catch (error) {
          console.error('Error fetching payment info:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPaymentInfo();
    
    if (subscriptionSuccess) {
      refreshUserData();
      // Clear the URL parameter
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [firebaseUser, refreshUserData, subscriptionSuccess]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const handleManageSubscription = async () => {
    if (userData?.stripeCustomerId) {
      await handleStripePortal(userData.stripeCustomerId);
    } else {
      navigate('/pricing');
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
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
          <div className="max-w-4xl mx-auto">
            {subscriptionSuccess && (
              <motion.div 
                className="mb-8 bg-green-500/20 border border-green-500 rounded-lg p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-400">Abonnement réussi</h3>
                    <div className="mt-2 text-sm text-green-300">
                      <p>Votre abonnement Premium a été activé avec succès. Vous avez maintenant accès à toutes les fonctionnalités.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-gray-400">Gérez votre compte et votre abonnement</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="col-span-2"
              >
                <Card className="h-full">
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                        <User size={24} className="text-primary-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Informations du compte</h2>
                        <p className="text-gray-400 text-sm">Détails de votre profil</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <div className="bg-dark-700 rounded-lg px-4 py-2">
                          {firebaseUser?.email}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Compte créé le</label>
                        <div className="bg-dark-700 rounded-lg px-4 py-2 flex items-center">
                          <Clock size={16} className="mr-2 text-gray-500" />
                          {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'Non disponible'}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          variant="outline" 
                          icon={<LogOut size={18} />}
                          onClick={handleLogout}
                        >
                          Se déconnecter
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full">
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center mr-4">
                        <CreditCard size={24} className="text-secondary-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Abonnement</h2>
                        <p className="text-gray-400 text-sm">Gérez votre formule</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className={`px-3 py-1 inline-block rounded-full text-sm font-medium mb-2 ${
                        userData?.isPro ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {userData?.isPro ? 'Premium' : 'Gratuit'}
                      </div>
                      
                      {userData?.isPro ? (
                        <>
                          <p className="text-sm text-gray-400 mb-2">
                            Votre abonnement Premium est actif.
                          </p>
                          {payment && (
                            <p className="text-sm text-gray-400">
                              Prochain paiement: {new Date(payment.startDate.seconds * 1000).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Passez à la formule Premium pour accéder à toutes les fonctionnalités.
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      fullWidth
                      variant={userData?.isPro ? 'outline' : 'primary'}
                      onClick={handleManageSubscription}
                    >
                      {userData?.isPro ? 'Gérer l\'abonnement' : 'S\'abonner maintenant'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                      <Search size={24} className="text-indigo-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Dernières recherches</h2>
                      <p className="text-gray-400 text-sm">Historique de vos recherches récentes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center p-8 text-center">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={28} className="text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Aucune recherche récente</h3>
                      <p className="text-gray-400 mb-6">
                        Vous n'avez pas encore effectué de recherche. Commencez dès maintenant !
                      </p>
                      <Button 
                        onClick={() => navigate('/search')}
                        icon={<Search size={18} />}
                      >
                        Lancer une recherche
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardPage;