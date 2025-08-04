import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { getAddressInfo } from '../../lib/openrouter';

interface AddressInfoModalProps {
  address: string;
  onClose: () => void;
}

const AddressInfoModal: React.FC<AddressInfoModalProps> = ({ address, onClose }) => {
  const [info, setInfo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAddressInfo = async () => {
      try {
        setLoading(true);
        setError('');
        const addressInfo = await getAddressInfo(address);
        setInfo(addressInfo);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressInfo();
  }, [address]);

  const getEmojiForTitle = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    // Quartier et environnement
    if (titleLower.includes('quartier') || titleLower.includes('environnement') || titleLower.includes('secteur')) {
      return '🏘️';
    }
    
    // Commodités et services
    if (titleLower.includes('commodité') || titleLower.includes('service') || titleLower.includes('proximité')) {
      return '🛍️';
    }
    
    // Commerces et magasins
    if (titleLower.includes('commerce') || titleLower.includes('magasin') || titleLower.includes('boutique')) {
      return '🏪';
    }
    
    // Écoles et éducation
    if (titleLower.includes('école') || titleLower.includes('éducation') || titleLower.includes('établissement scolaire')) {
      return '🏫';
    }
    
    // Transports
    if (titleLower.includes('transport') || titleLower.includes('métro') || titleLower.includes('bus') || titleLower.includes('gare')) {
      return '🚌';
    }
    
    // Santé et médical
    if (titleLower.includes('santé') || titleLower.includes('médical') || titleLower.includes('hôpital') || titleLower.includes('pharmacie')) {
      return '🏥';
    }
    
    // Loisirs et culture
    if (titleLower.includes('loisir') || titleLower.includes('culture') || titleLower.includes('cinéma') || titleLower.includes('théâtre')) {
      return '🎭';
    }
    
    // Parcs et espaces verts
    if (titleLower.includes('parc') || titleLower.includes('espace vert') || titleLower.includes('jardin')) {
      return '🌳';
    }
    
    // Restaurants et alimentation
    if (titleLower.includes('restaurant') || titleLower.includes('alimentation') || titleLower.includes('café') || titleLower.includes('boulangerie')) {
      return '🍽️';
    }
    
    // Sécurité
    if (titleLower.includes('sécurité') || titleLower.includes('police') || titleLower.includes('gendarmerie')) {
      return '🛡️';
    }
    
    // Immobilier et prix
    if (titleLower.includes('immobilier') || titleLower.includes('prix') || titleLower.includes('marché')) {
      return '🏠';
    }
    
    // Points d'intérêt
    if (titleLower.includes('point') && titleLower.includes('intérêt') || titleLower.includes('attraction')) {
      return '📍';
    }
    
    // Ambiance et vie locale
    if (titleLower.includes('ambiance') || titleLower.includes('vie locale') || titleLower.includes('atmosphère')) {
      return '🌟';
    }
    
    // Accessibilité
    if (titleLower.includes('accessibilité') || titleLower.includes('accès')) {
      return '♿';
    }
    
    // Caractéristiques générales
    if (titleLower.includes('caractéristique') || titleLower.includes('description')) {
      return '📋';
    }
    
    // Avantages et inconvénients
    if (titleLower.includes('avantage') || titleLower.includes('plus')) {
      return '✅';
    }
    if (titleLower.includes('inconvénient') || titleLower.includes('moins')) {
      return '❌';
    }
    
    // Recommandations
    if (titleLower.includes('recommandation') || titleLower.includes('conseil')) {
      return '💡';
    }
    
    // Conclusion
    if (titleLower.includes('conclusion') || titleLower.includes('résumé') || titleLower.includes('synthèse')) {
      return '📝';
    }
    
    // Informations générales
    if (titleLower.includes('information') || titleLower.includes('détail')) {
      return 'ℹ️';
    }
    
    // Par défaut
    return '📌';
  };

  const formatText = (text: string) => {
    // Nettoyer le texte des balises de réflexion DeepSeek
    const cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/g, '') // Supprimer les balises <think>
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Supprimer les balises **text** (pas de conversion en gras)
      .replace(/\n\n/g, '\n') // Réduire les doubles sauts de ligne
      .trim();

    return cleanedText.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Titres avec ##
      if (trimmedLine.startsWith('## ')) {
        const titleText = trimmedLine.replace('## ', '');
        const emoji = getEmojiForTitle(titleText);
        return (
          <h3 key={index} className="text-lg font-semibold text-primary-400 mt-6 mb-3 flex items-center">
            <span className="mr-2 text-xl">{emoji}</span>
            {titleText}
          </h3>
        );
      }
      
      // Titres avec #
      if (trimmedLine.startsWith('# ')) {
        const titleText = trimmedLine.replace('# ', '');
        const emoji = getEmojiForTitle(titleText);
        return (
          <h2 key={index} className="text-xl font-bold text-primary-300 mt-6 mb-4 flex items-center">
            <span className="mr-2 text-2xl">{emoji}</span>
            {titleText}
          </h2>
        );
      }
      
      // Titres avec ###
      if (trimmedLine.startsWith('### ')) {
        const titleText = trimmedLine.replace('### ', '');
        const emoji = getEmojiForTitle(titleText);
        return (
          <h4 key={index} className="text-base font-medium text-primary-500 mt-4 mb-2 flex items-center">
            <span className="mr-2">{emoji}</span>
            {titleText}
          </h4>
        );
      }
      
      // Listes avec -
      if (trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-300 list-disc">
            <span>{trimmedLine.replace('- ', '')}</span>
          </li>
        );
      }
      
      // Listes numérotées
      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-300 list-decimal">
            <span>{trimmedLine.replace(/^\d+\.\s/, '')}</span>
          </li>
        );
      }
      
      // Lignes vides
      if (trimmedLine === '') {
        return <div key={index} className="h-2" />;
      }
      
      // Paragraphes normaux
      return (
        <p key={index} className="mb-3 text-gray-300 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-dark-700 shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-700 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500/20 rounded-lg mr-3">
              <MapPin size={24} className="text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Informations sur l'adresse</h2>
              <p className="text-gray-400 text-sm">{address}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="relative mb-6">
                  <Loader2 size={48} className="text-primary-500 animate-spin mx-auto" />
                  <Sparkles size={20} className="text-secondary-500 absolute top-0 right-0 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyse en cours...</h3>
                <p className="text-gray-400 mb-2">Notre IA analyse cette adresse pour vous</p>
                <p className="text-sm text-gray-500">
                  Recherche d'informations sur le quartier, les commodités et l'environnement
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <ExternalLink size={20} className="text-red-500 mr-2" />
                <h3 className="font-semibold">Erreur lors de la récupération des informations</h3>
              </div>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && info && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 p-4 rounded-lg border border-primary-500/20">
                <div className="flex items-center mb-2">
                  <Sparkles size={16} className="text-primary-500 mr-2" />
                  <span className="text-sm font-medium text-primary-400">
                    Informations générées par IA (DeepSeek R1)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Ces informations sont générées automatiquement par intelligence artificielle. 
                  Nous recommandons de vérifier les détails importants sur place.
                </p>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="space-y-2">
                  {formatText(info)}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dark-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <ExternalLink size={14} className="mr-1" />
                    Propulsé par OpenRouter.ai
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddressInfoModal;