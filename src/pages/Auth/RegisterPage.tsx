import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { registerUser, loginWithGoogle } from '../../lib/supabase';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await registerUser(email, password);
      navigate('/search');
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      // Check for specific Supabase error codes
      if (error.message.includes('user_already_exists')) {
        setError('Un compte existe déjà avec cet email. Veuillez vous connecter.');
      } else if (error.message.includes('invalid email')) {
        setError('Format d\'email invalide');
      } else if (error.message.includes('weak password')) {
        setError('Le mot de passe est trop faible');
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle();
      // La redirection se fait automatiquement via Supabase
    } catch (error: any) {
      console.error('Error signing up with Google:', error);
      setError('Une erreur est survenue lors de l\'inscription avec Google');
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Créer un compte GoAdresse</h1>
                <p className="text-gray-400">
                  Rejoignez-nous pour commencer à rechercher des parcelles
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Google Sign Up Button */}
              <div className="mb-6">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleGoogleRegister}
                  isLoading={googleLoading}
                  disabled={loading || googleLoading}
                  className="border-gray-600 hover:bg-gray-700/50"
                >
                  <div className="flex items-center justify-center">
                    {!googleLoading && (
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Continuer avec Google
                  </div>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-800 text-gray-400">ou</span>
                </div>
              </div>

              <form onSubmit={handleRegister}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                  disabled={loading || googleLoading}
                  icon={<UserPlus size={18} />}
                >
                  Créer un compte
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="text-primary-400 hover:text-primary-300">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RegisterPage;