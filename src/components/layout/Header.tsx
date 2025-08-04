import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { logoutUser, supabase } from '../../lib/supabase';
import { STRIPE_PRODUCTS } from '../../stripe-config';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Rafraîchir le profil quand l'utilisateur est présent mais le profil manque
  useEffect(() => {
    if (user && !profile) {
      console.log('🔄 Header: Utilisateur présent mais profil manquant, refresh...');
      refreshProfile();
    }
  }, [user, profile, refreshProfile]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      console.log('⏳ Déconnexion déjà en cours...');
      return;
    }

    try {
      setIsLoggingOut(true);
      console.log('🚪 DÉBUT - Clic sur le bouton de déconnexion');
      console.log('👤 Utilisateur actuel:', user?.email);
      console.log('📊 Profil actuel:', profile?.email);

      await logoutUser();
      
      console.log('✅ Déconnexion terminée, redirection vers l\'accueil');
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('❌ ERREUR lors de la déconnexion:', error?.message || error);
      
      // En cas d'erreur, rediriger quand même vers l'accueil
      // car l'utilisateur a exprimé l'intention de se déconnecter
      navigate('/', { replace: true });
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Recherche', path: '/search' },
    { name: 'Articles', path: '/articles' },
    { name: 'Tarifs', path: '/pricing' }
  ];

  const getSubscriptionPlanName = () => {
    if (profile?.is_pro) {
      return STRIPE_PRODUCTS.abonnementIllimite.name;
    }
    return 'Gratuit';
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen || location.pathname !== '/' 
          ? 'bg-dark-900/95 backdrop-blur-sm py-4 shadow-md' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-4 group" aria-label="GoAdresse - Accueil">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Effet de lueur */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
        
            {/* Conteneur responsive */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
              <img 
                src="/localisation-de-la-propriete-modified.png" 
                alt="GoAdresse - Logo" 
                className="w-full h-full object-contain transition-all duration-300 ease-in-out filter drop-shadow-lg group-hover:drop-shadow-2xl"
                width="56"
                height="56"
              />
        
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            </div>
          </motion.div>
        
          {/* Texte + slogan */}
          <div className="flex flex-col">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
        
              <h1 
                className="text-white relative z-10 leading-none"
                style={{ 
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 200,
                  letterSpacing: '0.2em',
                  fontSize: '1.8rem',
                }}
              >
                Go
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 50%, #ddd6fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Adresse
                </span>
              </h1>
            </motion.div>
        
            {/* Slogan */}
            <motion.p
              className="text-gray-400/80 text-[10px] sm:text-xs mt-2 tracking-widest"
              style={{ fontWeight: 300, letterSpacing: '0.15em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              DEVENEZ CHERCHEUR D'ADRESSES
            </motion.p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navigation principale">
          <ul className="flex space-x-8">
            {navLinks.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`text-base transition-all duration-300 relative group ${
                    location.pathname === item.path 
                      ? 'text-primary-400 font-medium' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 group-hover:w-full ${
                    location.pathname === item.path ? 'w-full' : ''
                  }`}></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm">{user.email}</span>
                    <span className="text-xs text-gray-500">{getSubscriptionPlanName()}</span>
                  </div>
                </div>
                <Link to="/profile">
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<User size={18} />}
                  >
                    Mon Profil
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<LogOut size={18} />}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  isLoading={isLoggingOut}
                >
                  {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<User size={18} />}
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              {user && (
                <div className="mb-4 pb-4 border-b border-dark-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-300 text-sm">{user.email}</span>
                      <span className="text-xs text-gray-500">{getSubscriptionPlanName()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <ul className="flex flex-col space-y-3">
                {navLinks.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className={`block py-2 px-3 rounded-lg ${
                        location.pathname === item.path 
                          ? 'bg-primary-600/20 text-primary-400 font-medium' 
                          : 'text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col space-y-3 mt-6">
                {user ? (
                  <>
                    <Link to="/profile" className="w-full">
                      <Button 
                        variant="outline" 
                        fullWidth
                        icon={<User size={18} />}
                      >
                        Mon Profil
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      fullWidth
                      icon={<LogOut size={18} />}
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      isLoading={isLoggingOut}
                    >
                      {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button 
                        variant="outline" 
                        fullWidth
                        icon={<User size={18} />}
                      >
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button fullWidth>
                        Inscription
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;