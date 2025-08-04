export const STRIPE_PRODUCTS = {
  packDecouverte: {
    id: 'prod_SgG4slTu7fmqgP',
    priceId: 'price_1RktYSCDtQVtv7ZiHXydtiaF',
    name: 'Pack Découverte',
    description: '5 recherches pour tester GoAdresse sans abonnement',
    price: 4.90,
    currency: 'EUR',
    mode: 'payment' as const,
    searches: 5,
    validity: 30, // jours
    features: [
      'Utilisables pendant 30 jours',
      'Idéal pour une première prise en main',
      'Aucun renouvellement automatique'
    ]
  },
  packSerenite: {
    id: 'prod_SgG6gMc4JmMBke', 
    priceId: 'price_1RktaeCDtQVtv7Zix7h45gKh', 
    name: 'Pack Sérénité',
    description: '15 recherches par mois, renouvelées automatiquement',
    price: 9.90,
    currency: 'EUR',
    mode: 'subscription' as const,
    searches: 15,
    features: [
      'Sans engagement : annulation à tout moment',
      'Idéal pour ceux qui recherchent régulièrement',
      'Recherches renouvelées chaque mois'
    ]
  },
  packLiberte: {
    id: 'prod_SS1AxVyREeAhll',
    priceId: 'price_1Rai8fCDtQVtv7ZijgYCQeyD',
    name: 'Pack Liberté',
    description: 'Recherches illimitées, sans limite mensuelle',
    price: 18.00,
    currency: 'EUR',
    mode: 'subscription' as const,
    searches: 'unlimited',
    features: [
      'Sans engagement : annulation en un clic',
      'Parfait pour les périodes de recherche active',
      'Idéal pour les familles'
    ]
  },
} as const;