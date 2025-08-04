import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Calculator } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import SocialShare from '../../components/common/SocialShare';

const ArticleEstimationBien: React.FC = () => {
  const articleUrl = window.location.href;
  const articleTitle = 'Comment estimer la valeur de son bien immobilier ? | GoAdresse';
  const articleDescription = 'Guide complet pour estimer efficacement la valeur de votre bien immobilier. Méthodes, outils et conseils d\'experts pour une estimation réaliste.';

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
                  src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Agent immobilier analysant des documents d'estimation avec calculatrice et graphiques de prix"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-full mb-4 flex items-center w-fit">
                    <Calculator size={14} className="mr-1" />
                    Estimation
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Comment estimer la valeur de son bien immobilier ?
                  </h1>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar size={16} className="mr-2" />
                    <span className="mr-4">27 janvier 2025</span>
                    <Clock size={16} className="mr-2" />
                    <span>7 min de lecture</span>
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
                    Estimer la valeur de son bien immobilier est une étape cruciale, que ce soit pour une vente, une succession ou un projet de financement. Une bonne estimation permet d'éviter les erreurs coûteuses et d'adopter une stratégie adaptée. Voici un guide complet pour estimer efficacement la valeur de ton bien.
                  </p>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">1</span>
                    Analyse le marché local et les biens comparables
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Pour commencer, il est indispensable de bien connaître le marché immobilier local. Les prix peuvent varier fortement selon la ville, le quartier ou même la rue. Observer les biens similaires vendus récemment te donnera une première idée réaliste.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
                    <li>Identifie des biens comparables en surface, état et localisation</li>
                    <li>Consulte les annonces immobilières et bases de données spécialisées</li>
                    <li>Prends en compte la date des transactions (plus récentes, mieux c'est)</li>
                  </ul>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">2</span>
                    Évalue les caractéristiques spécifiques de ton bien
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Chaque bien possède des atouts ou des défauts qui influencent sa valeur. Il faut les prendre en compte pour affiner l'estimation.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
                    <li>Surface habitable et nombre de pièces</li>
                    <li>État général (rénovations, vétusté, entretien)</li>
                    <li>Exposition, luminosité et vue</li>
                    <li>Équipements : balcon, garage, jardin, cave</li>
                    <li>Accessibilité et proximité des commodités</li>
                  </ul>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">3</span>
                    Utilise des outils en ligne et demande des avis professionnels
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Les outils d'estimation en ligne sont pratiques pour obtenir une fourchette de prix rapidement. Cependant, ils ne remplacent pas l'expertise d'un professionnel.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
                    <li>Teste plusieurs simulateurs pour comparer les résultats</li>
                    <li>Fais appel à un agent immobilier pour une estimation personnalisée</li>
                    <li>Consulte un expert immobilier pour une évaluation précise et objective</li>
                  </ul>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">4</span>
                    Prends en compte les tendances du marché et la conjoncture économique
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    La valeur d'un bien immobilier peut évoluer rapidement selon la conjoncture économique et les tendances du marché. Il est donc important de rester informé.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
                    <li>Observe l'évolution des prix dans ta région sur les derniers mois</li>
                    <li>Analyse l'impact des taux d'intérêt sur la demande immobilière</li>
                    <li>Considère les projets d'urbanisme ou d'infrastructures à venir</li>
                  </ul>

                  <h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">5</span>
                    Sois réaliste et prépare-toi à ajuster ton estimation
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Une bonne estimation tient compte de tous les éléments précédents, mais il faut aussi rester pragmatique. Un prix trop élevé peut faire fuir les acheteurs, tandis qu'un prix trop bas te fera perdre de l'argent.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
                    <li>Prends en compte le temps moyen de vente dans ta zone</li>
                    <li>Sois prêt à ajuster ton prix selon les retours des visites</li>
                    <li>Considère une marge de négociation réaliste</li>
                  </ul>

                  <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                    <p className="text-primary-300 italic font-medium text-sm">
                      Estimer la valeur de son bien immobilier demande méthode, recherche et pragmatisme. En combinant analyse du marché, caractéristiques du bien et conseils d'experts, tu maximises tes chances de réussir ta vente au meilleur prix.
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-12 p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20">
                  <h3 className="text-xl font-semibold mb-3 text-primary-400">
                    Trouve l'adresse exacte avec GoAdresse
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Avec notre service, trouve l'adresse exacte des maisons qui t'intéressent et explore leur environnement pour mieux estimer leur valeur.
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

export default ArticleEstimationBien;