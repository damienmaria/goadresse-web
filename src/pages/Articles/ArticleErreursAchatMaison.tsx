import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, AlertTriangle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import SocialShare from '../../components/common/SocialShare';

const ArticleErreursAchatMaison: React.FC = () => {
  const articleUrl = window.location.href;
  const articleTitle = 'Les 5 erreurs à éviter quand tu achètes une maison | GoAdresse';
  const articleDescription = 'Évite les pièges fréquents lors de l\'achat d\'une maison grâce à nos conseils pratiques. Découvre les 5 erreurs à ne pas commettre.';

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
                  src="https://images.pexels.com/photos/7578915/pexels-photo-7578915.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Homme réfléchissant devant une maison, symbolisant les décisions importantes lors d'un achat immobilier"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-red-500 text-white text-sm rounded-full mb-4 flex items-center w-fit">
                    <AlertTriangle size={14} className="mr-1" />
                    Erreurs à éviter
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Les 5 erreurs à éviter quand tu achètes une maison
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
    Acheter une maison est une étape majeure dans une vie. C'est un projet enthousiasmant, mais aussi complexe, qui demande une bonne préparation. Pour t'aider à éviter les mauvaises surprises, voici les 5 erreurs les plus fréquentes à ne pas commettre lorsqu'on se lance dans l'achat d'un bien immobilier.
  </p>

  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
    <div className="flex items-start">
      <AlertTriangle size={24} className="text-red-400 mr-3 mt-1 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-red-400 mb-2">Attention aux pièges</h3>
        <p className="text-gray-300 text-sm">
          Ces erreurs peuvent compromettre ton projet, te faire perdre du temps… et de l'argent. Mieux vaut les connaître en amont pour les éviter sereinement.
        </p>
      </div>
    </div>
  </div>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">1</span>
  Ne pas définir son budget global avec précision
</h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Se concentrer uniquement sur le prix d'achat sans anticiper tous les frais annexes est une erreur courante. Ton budget doit refléter la réalité de ton projet, pas seulement le prix affiché.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Intègre les frais de notaire, de garantie et de dossier bancaire</li>
    <li>Prends en compte les éventuels travaux à réaliser</li>
    <li>Ajoute les coûts d'assurance emprunteur, de déménagement, etc.</li>
    <li>Prévois une marge de sécurité pour les imprévus</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">2</span>
    Se précipiter sans comparer plusieurs biens
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Tomber amoureux du premier bien visité est humain… mais risqué. Comparer plusieurs logements permet de mieux comprendre le marché, les prix et les opportunités.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Planifie au moins 3 à 5 visites dans différentes zones</li>
    <li>Prends des notes et photos pour comparer objectivement</li>
    <li>Observe les écarts de prix pour des biens similaires</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">3</span>
    Négliger l'importance de l\'emplacement
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    L'emplacement est souvent plus déterminant que le logement lui-même. Un bien peut être parfait, mais mal situé, il peut vite devenir un poids au quotidien ou à la revente.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Renseigne-toi sur le quartier : sécurité, calme, dynamisme</li>
    <li>Teste les temps de trajet vers ton travail ou les écoles</li>
    <li>Regarde les projets d'urbanisme à venir dans la zone</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">4</span>
    Ne pas vérifier l'état réel du logement
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Un bien en apparence propre peut cacher des défauts importants. Il est crucial de ne pas se fier à une simple impression visuelle, mais de procéder à des vérifications approfondies.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Demande tous les diagnostics techniques à jour</li>
    <li>Inspecte les murs, plafonds, fenêtres, toiture, etc.</li>
    <li>Si besoin, fais appel à un expert ou un artisan indépendant</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">5</span>
    Oublier de penser à la revente future
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Même si tu achètes pour y vivre, il faut penser à demain. Un bien difficile à revendre peut devenir un frein si ta situation change. Anticiper la revente, c'est sécuriser ton investissement.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Privilégie un bien dans une zone recherchée</li>
    <li>Évite les biens atypiques ou trop spécifiques</li>
    <li>Renseigne-toi sur l'évolution du marché local</li>
  </ul>

  <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
    <p className="text-green-300 italic font-medium text-sm">
      En évitant ces erreurs fréquentes, tu prends une longueur d'avance pour réussir ton achat immobilier avec plus de sérénité, de recul et de sécurité.
    </p>
  </div>
</div>

                {/* Call to action */}
                <div className="mt-12 p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20">
                  <h3 className="text-xl font-semibold mb-3 text-primary-400">
                    Évite ces erreurs avec GoAdresse
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Avec notre service, explore l'environnement des maisons à distance et prends des décisions éclairées avant de te déplacer.
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
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArticleErreursAchatMaison;