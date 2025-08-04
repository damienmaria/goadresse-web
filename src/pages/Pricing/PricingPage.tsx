import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Zap, Clock, Target, Infinity, CreditCard, Loader2, Users } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { createCheckoutSession } from '../../stripe/checkout';
import { STRIPE_PRODUCTS } from '../../stripe-config';

const PricingPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  
  const isPro = profile?.is_pro || false;

  const handlePurchase = async (productKey: keyof typeof STRIPE_PRODUCTS) => {
    if (!user) {
      window.location.href = '/login?redirect=pricing'; 
      return;
    }
    
    try {
      setLoadingProduct(productKey);
      const product = STRIPE_PRODUCTS[productKey];
      
      await createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        customerId: profile?.stripe_customer_id,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoadingProduct(null);
    }
  };

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2).replace('.', ',');
  };

  const offers = [
    {
      key: 'packDecouverte' as const,
      ...STRIPE_PRODUCTS.packDecouverte,
      icon: <Zap size={24} className="text-blue-500" />,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      popular: false,
      cta: 'Essayer pour 4,90 €'
    },
    {
      key: 'packSerenite' as const,
      ...STRIPE_PRODUCTS.packSerenite,
      icon: <Clock size={24} className="text-green-500" />,
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      popular: true,
      cta: 'S\'abonner pour 9 €/mois'
    },
    {
      key: 'packLiberte' as const,
      ...STRIPE_PRODUCTS.packLiberte,
      icon: <Infinity size={24} className="text-primary-500" />,
      color: 'from-primary-500/20 to-secondary-500/20',
      borderColor: 'border-primary-500/30',
      popular: false,
      cta: 'Accès illimité – 18 €/mois'
    }
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Nos <span className="gradient-text">Offres</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Choisissez la formule qui vous correspond : un pack ponctuel pour tester 
                ou un abonnement flexible pour une recherche régulière.
              </p>
            </motion.div>

            {/* Offers Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="relative"
                >
                  {offer.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star size={14} className="mr-1" />
                        Populaire
                      </span>
                    </div>
                  )}
                  
                  <div className={`bg-gradient-to-r ${offer.color} p-1 rounded-2xl h-full`}>
                    <Card className="p-6 h-full flex flex-col">
                      <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                          {offer.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                        <p className="text-gray-400 text-sm">{offer.description}</p>
                      </div>

                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold mb-2">
                          {formatPrice(offer.price)}€
                          {offer.mode === 'subscription' && <span className="text-lg text-gray-400">/mois</span>}
                        </div>
                        {offer.mode === 'payment' && (
                          <p className="text-sm text-gray-500">
                            {offer.searches} recherches • {offer.validity} jours
                          </p>
                        )}
                        {offer.mode === 'subscription' && (
                          <p className="text-sm text-gray-500">
                            {offer.searches === 'unlimited' ? 'Recherches illimitées' : `${offer.searches} recherches/mois`}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 mb-6">
                        <ul className="space-y-2 text-sm">
                          {offer.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        fullWidth
                        variant={offer.popular ? 'primary' : 'outline'}
                        onClick={() => handlePurchase(offer.key)}
                        isLoading={loadingProduct === offer.key}
                        disabled={loadingProduct !== null}
                        icon={loadingProduct === offer.key ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                      >
                        {loadingProduct === offer.key ? 'Redirection...' : offer.cta}
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Features Section */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Toutes les offres incluent</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  'Recherche par superficie et code postal',
                  'Adresses exactes des maisons',
                  'Visualisation sur carte interactive',
                  'Redirection vers Google Maps',
                  'Visualisation de la parcelle',
                  'Exploration du quartier à distance'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-dark-800 rounded-lg">
                    <CheckCircle2 size={20} className="text-primary-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div 
              className="mt-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Quelle différence entre les packs et les abonnements ?</h3>
                  <p className="text-gray-400 text-sm">
                    Le Pack Découverte est un achat unique sans renouvellement. Les Packs Sérénité et Liberté sont des abonnements mensuels sans engagement que vous pouvez annuler à tout moment.
                  </p>
                </div>

                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Puis-je annuler mon abonnement ?</h3>
                  <p className="text-gray-400 text-sm">
                    Oui, vous pouvez annuler votre abonnement à tout moment depuis votre profil. 
                    Vous garderez l'accès jusqu'à la fin de la période payée.
                  </p>
                </div>

                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Le Pack Découverte expire-t-il ?</h3>
                  <p className="text-gray-400 text-sm">
                    Oui, le Pack Découverte est valable 30 jours après l'achat. 
                    Les recherches non utilisées sont perdues à l'expiration.
                  </p>
                </div>

                <div className="bg-dark-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Puis-je changer de formule ?</h3>
                  <p className="text-gray-400 text-sm">
                    Vous pouvez passer d'un pack à un abonnement à tout moment. 
                    Pour changer d'abonnement, contactez notre support.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;