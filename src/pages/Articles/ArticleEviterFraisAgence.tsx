import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import SocialShare from '../../components/common/SocialShare';

const ArticleEviterFraisAgence: React.FC = () => {
  const articleUrl = window.location.href;
  const articleTitle = 'Comment éviter les frais d\'agence immobilière avec GoAdresse | GoAdresse';
  const articleDescription = 'Découvrez comment économiser jusqu\'à 8% sur votre achat immobilier en évitant les frais d\'agence grâce à GoAdresse. Achetez en direct avec le propriétaire.';

  return (
    <>
      {/* SEO Meta Tags */}
      <title>{articleTitle}</title>
      <meta
        name="description"
        content={articleDescription}
      />
      
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Navigation */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/articles">
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<ArrowLeft size={16} />}
                >
                  Retour aux articles
                </Button>
              </Link>
            </motion.div>

            <article className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700">
              {/* Header de l'article */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Homme calculant les économies réalisées en évitant les frais d'agence immobilière"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm rounded-full mb-4 flex items-center w-fit">
                    <DollarSign size={14} className="mr-1" />
                    Économies
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Comment éviter les frais d'agence immobilière avec GoAdresse
                  </h1>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar size={16} className="mr-2" />
                    <span className="mr-4">27 janvier 2025</span>
                    <Clock size={16} className="mr-2" />
                    <span>6 min de lecture</span>
                  </div>
                </div>
              </motion.div>

              {/* Contenu de l'article */}
              <motion.div 
                className="p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Bouton de partage */}
                <div className="flex justify-end mb-6">
                  <SocialShare
                    url={articleUrl}
                    title={articleTitle}
                    description={articleDescription}
                  />
                </div>

                <div className="prose prose-invert max-w-none text-sm">
                  <p className="mb-6 text-gray-300 leading-relaxed">
                    Tu cherches à <strong>trouver l'adresse d'une maison</strong> repérée sur une annonce ? Tu veux <strong>récupérer une adresse précise</strong> pour éviter de passer par une agence immobilière ? GoAdresse est la solution idéale. Cet outil te permet de localiser une maison à partir de son code postal et de sa superficie, et d'explorer son environnement avant même de te déplacer. Voici un guide pratique en 5 étapes pour utiliser GoAdresse et économiser les frais d'agence.
                  </p>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">1</span>
                    Repère une maison sur une annonce immobilière
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Sur des sites comme LeBonCoin ou SeLoger, identifie une maison qui t’intéresse. Note le code postal ainsi que la superficie du terrain. Ces deux informations sont essentielles pour effectuer ta recherche sur GoAdresse. Si la superficie n’est pas mentionnée, n’hésite pas à appeler l’agence pour l’obtenir.
                  </p>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">2</span>
                    Recherche l'adresse avec GoAdresse
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Une fois le code postal et la superficie en main, rends-toi sur GoAdresse. L’outil te propose instantanément les parcelles cadastrales correspondant à ces critères. En quelques clics, tu accèdes à une liste de biens potentiels et peux ainsi <strong>retrouver une adresse facilement</strong>.
                  </p>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">3</span>
                    Analyse les résultats pour retrouver l'adresse exacte
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Compare les différentes adresses proposées grâce aux vues satellite et Street View de Google Maps. Repère les éléments visuels uniques de la maison (forme du toit, couleur du portail, présence d’un arbre ou d’une clôture). C’est à cette étape que tu vas pouvoir <strong>identifier l’adresse exacte</strong> du bien recherché.
                  </p>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">4</span>
                    Explore le quartier à distance
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Une fois la maison retrouvée visuellement, note l’adresse précise. Tu peux alors explorer les alentours : qualité du quartier, présence de commerces, écoles, transports… autant d’informations essentielles pour valider ton intérêt avant tout déplacement.
                  </p>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">5</span>
                    Rends-toi sur place et contacte le propriétaire
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Si tout te semble cohérent et que la maison répond à tes critères, rends-toi sur place pour confirmer ton ressenti. Tu peux alors tenter d’entrer directement en contact avec le propriétaire (boîte aux lettres, voisins, etc.) et <strong>éviter ainsi de passer par une agence</strong>.
                  </p>

                  <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                    <p className="text-primary-300 italic font-medium text-sm">
                      GoAdresse est l'outil parfait pour <strong>trouver une adresse à partir d'une annonce</strong>, <strong>récupérer l'adresse d'une maison</strong> ou encore <strong>identifier un bien sans agence</strong>. Grâce à cette méthode, tu gagnes du temps, tu explores à distance et tu économises jusqu’à 8 % sur le prix d’achat. Une solution simple, rapide et efficace.
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-12 p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20">
                  <h3 className="text-xl font-semibold mb-3 text-primary-400">
                    Commence à économiser avec GoAdresse
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Trouve l'adresse exacte des maisons qui t'intéressent et contacte directement les propriétaires pour économiser des milliers d'euros.
                  </p>
                  <Link to="/search">
                    <Button>
                      Commencer ma recherche
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </article>

            {/* Articles similaires */}
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-6">Articles similaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                  <Link to="/articles/comment-bien-preparer-visite-immobiliere" className="block hover:bg-dark-700 rounded-lg p-4 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://images.pexels.com/photos/5998051/pexels-photo-5998051.jpeg?auto=compress&cs=tinysrgb&w=200" 
                        alt="Comment bien préparer une visite immobilière"
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-primary-400 mb-2">
                          Comment bien préparer une visite immobilière ?
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Découvrez nos conseils pratiques pour bien préparer une visite immobilière...
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                  <Link to="/articles/erreurs-eviter-achat-maison" className="block hover:bg-dark-700 rounded-lg p-4 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://images.pexels.com/photos/7578915/pexels-photo-7578915.jpeg?auto=compress&cs=tinysrgb&w=200" 
                        alt="Les 5 erreurs à éviter quand tu achètes une maison"
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-primary-400 mb-2">
                          Les 5 erreurs à éviter quand tu achètes une maison
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Évite les pièges fréquents lors de l'achat d'une maison grâce à nos conseils pratiques...
                        </p>
                      </div>
                    </div>
                  </Link>
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

export default ArticleEviterFraisAgence;