import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { resetPassword } from '../../lib/supabase';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
                <h1 className="text-2xl font-bold mb-2">Mot de passe oublié</h1>
                <p className="text-gray-400">
                  Entrez votre email pour réinitialiser votre mot de passe
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success ? (
                <div className="text-center">
                  <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
                    Un email de réinitialisation a été envoyé à {email}
                  </div>
                  <p className="text-gray-400 mb-6">
                    Suivez les instructions dans l'email pour réinitialiser votre mot de passe.
                  </p>
                  <Link to="/login">
                    <Button 
                      variant="outline"
                      icon={<ArrowLeft size={18} />}
                    >
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={18} />}
                    required
                  />

                  <div className="mt-6">
                    <Button
                      type="submit"
                      fullWidth
                      isLoading={loading}
                    >
                      Réinitialiser le mot de passe
                    </Button>
                  </div>

                  <div className="mt-4 text-center">
                    <Link to="/login" className="text-primary-400 hover:text-primary-300">
                      Retour à la connexion
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;