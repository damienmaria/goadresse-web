import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
import { useAuth } from '../../../context/AuthContext';
import { createCheckoutSession } from '../../../stripe/checkout';
import { STRIPE_PRODUCTS } from '../../../stripe-config';

const features = [
  'Recherche par superficie et code postal',
  'Adresses exactes des maisons',
  'Recherches illimitées',
  'Visualisation sur carte interactive',
  'Redirection vers Google Maps',
  'Visualisation de la parcelle',
  'Exploration du quartier à distance'
];

const PricingPreview: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const isPro = profile?.is_pro || false;

  const handleQuickSubscription = async () => {
    if (!user) {
      window.location.href = '/login?redirect=pricing';
      return;
    }
    
    try {
      setIsLoading(true);
      await createCheckoutSession({
        priceId: STRIPE_PRODUCTS.packLiberte.priceId,
        mode: 'subscription',
        customerId: profile?.stripe_customer_id,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-dark-900" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos <span className="gradient-text">offres</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choisissez la formule qui vous correspond : des packs ponctuels pour tester 
            ou l'abonnement illimité pour une recherche intensive.
          </p>
        </div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 p-1 rounded-2xl">
            <div className="bg-dark-800 rounded-xl overflow-hidden">
              <div className="p-8 border-b border-dark-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs rounded-full mb-3">RECOMMANDÉ</span>
                    <h3 className="text-2xl font-bold mb-2">{STRIPE_PRODUCTS.packLiberte.name}</h3>
                    <p className="text-gray-400">{STRIPE_PRODUCTS.packLiberte.description}</p>
                  </div>
                  <div className="mt-6 md:mt-0 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-2">
                      <span className="text-3xl font-bold">{STRIPE_PRODUCTS.packLiberte.price % 1 === 0 ? STRIPE_PRODUCTS.packLiberte.price.toFixed(0) : STRIPE_PRODUCTS.packLiberte.price.toFixed(2).replace('.', ',')}€</span>
                      <span className="text-gray-400">/mois</span>
                    </div>
                    <p className="text-sm text-gray-500">{STRIPE_PRODUCTS.packLiberte.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-lg font-semibold mb-4">Pack Liberté :</h4>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 size={20} className="text-primary-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {isPro ? (
                    <Button 
                      fullWidth 
                      disabled 
                      className="bg-green-600 hover:bg-green-600"
                    >
                      Déjà abonné
                    </Button>
                  ) : (
                    <>
                      <Button 
                        fullWidth
                        size="lg"
                        onClick={handleQuickSubscription}
                        isLoading={isLoading}
                        icon={isLoading ? <Loader2 size={18} className="animate-spin" /> : undefined}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Redirection...' : 'Accès illimité – 18€/mois'}
                      </Button>
                      <Link to="/pricing" className="block w-full sm:w-auto">
                        <Button 
                          variant="outline"
                          size="lg"
                          fullWidth
                          icon={<ChevronRight size={20} />}
                        >
                          Voir toutes les offres
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default PricingPreview;