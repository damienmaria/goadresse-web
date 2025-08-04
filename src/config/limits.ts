// Configuration des limites pour les différentes formules
export const SEARCH_LIMITS = {
  // Nombre maximum de recherches avec résultats pour la version gratuite
  FREE_SEARCHES_WITH_RESULTS: 2,
  
  // Autres limites potentielles
  MAX_RESULTS_PER_SEARCH: 50,
  
  // Messages d'erreur
  MESSAGES: {
    LIMIT_REACHED: 'Tu as atteint ta limite de recherches gratuites avec résultats. Passe à la version Premium pour continuer.',
    NO_RESULTS_FOUND: 'Aucune parcelle trouvée correspondant à tes critères. Cette recherche ne compte pas dans ta limite.',
  }
} as const;