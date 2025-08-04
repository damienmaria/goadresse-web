import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Clock, Shield, DollarSign, CreditCard, Calendar, AlertCircle, Search, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SubscriptionStatus from '../../components/subscription/SubscriptionStatus';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../lib/supabase';
import { STRIPE_PRODUCTS } from '../../stripe-config';

const ProfilePage: React.FC = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    refreshProfile();
    
    // Check for subscription success
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('subscription') === 'success') {
      setShowSuccessMessage(true);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, '/profile');
      // Hide message after 10 seconds
      setTimeout(() => setShowSuccessMessage(false), 10000);
    }
  }, [refreshProfile, location.search]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleManageSubscription = () => {
    if (profile?.is_pro) {
      // Rediriger vers le portail de facturation Stripe
      window.open('https://billing.stripe.com/p/login/00w5kC4a36RwfZrfyg2VG00', '_blank');
    } else {
      // Rediriger vers la page de tarification pour s'abonner
      navigate('/pricing');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateWithTime = (dateString: string | null) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'canceled':
        return 'bg-red-500/20 text-red-400';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'unpaid':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSubscriptionPlanName = () => {
    if (profile?.is_pro) {
      return STRIPE_PRODUCTS.abonnementIllimite.name;
    }
    return 'Gratuit';
  };

  const isSubscriptionExpiringSoon = () => {
    if (!profile?.subscription_end_date) return false;
    
    const endDate = new Date(profile.subscription_end_date);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isSubscriptionExpired = () => {
    if (!profile?.subscription_end_date) return false;
    
    const endDate = new Date(profile.subscription_end_date);
    const now = new Date();
    
    return endDate < now;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user || !profile) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen">
          <div className="container mx-auto px-4">
            <Card>
              <div className="p-8 text-center">
                <p className="text-gray-400">Impossible de charger les informations du profil.</p>
                <Button 
                  variant="outline" 
                  onClick={() => refreshProfile()}
                  className="mt-4"
                >
                  Réessayer
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mb-8 bg-green-500/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-400">Abonnement activé avec succès !</h3>
                    <p className="mt-1 text-sm text-green-300">
                      Votre abonnement {STRIPE_PRODUCTS.abonnementIllimite.name} est maintenant actif. 
                      Vous avez accès à toutes les fonctionnalités premium.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Expiry Warning */}
            {profile.is_pro && isSubscriptionExpiringSoon() && (
              <div className="mb-8 bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle size={20} className="text-yellow-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-400">Abonnement bientôt expiré</h3>
                    <p className="mt-1 text-sm text-yellow-300">
                      Votre abonnement expire le {formatDate(profile.subscription_end_date)}. 
                      Pensez à le renouveler pour continuer à profiter des fonctionnalités premium.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Expired Warning */}
            {profile.is_pro && isSubscriptionExpired() && (
              <div className="mb-8 bg-red-500/20 border border-red-500 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle size={20} className="text-red-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-400">Abonnement expiré</h3>
                    <p className="mt-1 text-sm text-red-300">
                      Votre abonnement a expiré le {formatDate(profile.subscription_end_date)}. 
                      Renouvelez-le pour retrouver l'accès aux fonctionnalités premium.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
                <p className="text-gray-400">Gérez vos informations personnelles et votre abonnement</p>
              </div>
              <Button 
                variant="outline" 
                icon={<LogOut size={18} />}
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* User Info Card */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <User size={32} className="text-primary-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{profile.email}</h2>
                      <p className="text-gray-400">Membre depuis {formatDate(profile.created_at)}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Subscription Status Card */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Shield className="mr-2" size={24} />
                    Abonnement
                  </h2>
                  
                  <div className="space-y-6">
                    <SubscriptionStatus />
                    
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard size={20} className="text-primary-500" />
                          <span>Formule actuelle</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          profile.is_pro ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {getSubscriptionPlanName()}
                        </div>
                      </div>

                      {profile.is_pro && (
                        <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <DollarSign size={20} className="text-green-500" />
                            <span>Prix mensuel</span>
                          </div>
                          <span className="text-gray-300 font-semibold">
                            {STRIPE_PRODUCTS.abonnementIllimite.price.toFixed(2).replace('.', ',')}€/mois
                          </span>
                        </div>
                      )}

                      {profile.subscription_status && (
                        <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertCircle size={20} className="text-primary-500" />
                            <span>État</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            getSubscriptionStatusColor(profile.subscription_status)
                          }`}>
                            {profile.subscription_status === 'active' ? 'Actif' : profile.subscription_status}
                          </div>
                        </div>
                      )}

                      {profile.subscription_start_date && (
                        <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Calendar size={20} className="text-primary-500" />
                            <span>Début d'abonnement</span>
                          </div>
                          <span className="text-gray-300">
                            {formatDate(profile.subscription_start_date)}
                          </span>
                        </div>
                      )}

                      {/* Date de fin d'abonnement - Seulement pour Premium */}
                      {profile.is_pro && profile.subscription_end_date && (
                        <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Calendar size={20} className={`${
                              isSubscriptionExpired() ? 'text-red-500' : 
                              isSubscriptionExpiringSoon() ? 'text-yellow-500' : 
                              'text-primary-500'
                            }`} />
                            <span>Fin d'abonnement</span>
                          </div>
                          <div className="text-right">
                            <span className={`font-semibold ${
                              isSubscriptionExpired() ? 'text-red-400' : 
                              isSubscriptionExpiringSoon() ? 'text-yellow-400' : 
                              'text-gray-300'
                            }`}>
                              {formatDate(profile.subscription_end_date)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateWithTime(profile.subscription_end_date)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Recherches effectuées - Seulement pour les utilisateurs gratuits */}
                      {!profile.is_pro && (
                        <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Search size={20} className="text-primary-500" />
                            <span>Recherches effectuées</span>
                          </div>
                          <span className="text-gray-300">
                            {profile.search_count || 0} / 2 (gratuit)
                          </span>
                        </div>
                      )}

                      {/* Manage subscription button */}
                      <div className="pt-4">
                        <Button 
                          fullWidth
                          variant={profile.is_pro ? 'outline' : 'primary'}
                          onClick={handleManageSubscription}
                          icon={profile.is_pro ? <Settings size={18} /> : <CreditCard size={18} />}
                        >
                          {profile.is_pro ? 'Gérer mon abonnement' : 'Voir notre offre Premium'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;