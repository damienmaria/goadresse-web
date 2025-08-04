import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Clock, Target, Infinity } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useUserPacks } from '../../hooks/useUserPacks';

const SearchLimitWarning: React.FC = () => {
  const { searchStatus } = useUserPacks();

  if (!searchStatus || searchStatus.canSearch) {
    return null;
  }

  const getPackIcon = (packType: string) => {
    switch (packType) {
      case 'packDecouverte':
        return <Zap size={20} className="text-blue-500" />;
      case 'packStandard':
        return <Clock size={20} className="text-green-500" />;
      case 'packIntensif':
        return <Target size={20} className="text-purple-500" />;
      case 'abonnementIllimite':
        return <Infinity size={20} className="text-primary-500" />;
      default:
        return <AlertTriangle size={20} className="text-yellow-500" />;
    }
  };

  const getPackName = (packType: string) => {
    switch (packType) {
      case 'packDecouverte':
        return STRIPE_PRODUCTS.packDecouverte.name;
      case 'packStandard':
        return STRIPE_PRODUCTS.packStandard.name;
      case 'packIntensif':
        return STRIPE_PRODUCTS.packIntensif.name;
      case 'abonnementIllimite':
        return STRIPE_PRODUCTS.abonnementIllimite.name;
      default:
        return 'Pack Premium';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <AlertTriangle size={24} className="text-yellow-500" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">
            Limite de recherches atteinte
          </h3>
          
          {searchStatus.searchType === 'free' && (
            <p className="text-gray-300 mb-4">
              Tu as utilisé tes <strong>2 recherches gratuites</strong>. 
              Pour continuer à explorer les adresses, choisis un de nos packs ou abonne-toi.
            </p>
          )}
          
          {searchStatus.searchType === 'pack' && searchStatus.currentPack && (
            <p className="text-gray-300 mb-4">
              Ton <strong>{getPackName(searchStatus.currentPack.pack_type)}</strong> est épuisé ou expiré. 
              Choisis un nouveau pack pour continuer tes recherches.
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Zap size={20} className="text-blue-500" />
              </div>
              <div className="text-sm font-medium text-blue-400">{STRIPE_PRODUCTS.packDecouverte.name}</div>
              <div className="text-xs text-gray-400">{STRIPE_PRODUCTS.packDecouverte.searches} recherches - {STRIPE_PRODUCTS.packDecouverte.price.toFixed(2).replace('.', ',')}€</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Clock size={20} className="text-green-500" />
              </div>
              <div className="text-sm font-medium text-green-400">{STRIPE_PRODUCTS.packStandard.name}</div>
              <div className="text-xs text-gray-400">{STRIPE_PRODUCTS.packStandard.searches} recherches - {STRIPE_PRODUCTS.packStandard.price.toFixed(2).replace('.', ',')}€</div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Target size={20} className="text-purple-500" />
              </div>
              <div className="text-sm font-medium text-purple-400">{STRIPE_PRODUCTS.packIntensif.name}</div>
              <div className="text-xs text-gray-400">{STRIPE_PRODUCTS.packIntensif.searches} recherches - {STRIPE_PRODUCTS.packIntensif.price.toFixed(2).replace('.', ',')}€</div>
            </div>
            
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Infinity size={20} className="text-primary-500" />
              </div>
              <div className="text-sm font-medium text-primary-400">{STRIPE_PRODUCTS.abonnementIllimite.name}</div>
              <div className="text-xs text-gray-400">Illimité - {STRIPE_PRODUCTS.abonnementIllimite.price.toFixed(2).replace('.', ',')}€/mois</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/pricing" className="flex-1">
              <Button fullWidth>
                Voir tous les packs
              </Button>
            </Link>
            <Link to="/pricing" className="flex-1">
              <Button variant="outline" fullWidth>
                Abonnement illimité
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchLimitWarning;