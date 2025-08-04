import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import SocialShare from '../../components/common/SocialShare';

const ArticleVisiteImmobiliere: React.FC = () => {
  const articleUrl = window.location.href;
  const articleTitle = 'Comment bien préparer une visite immobilière ? | GoAdresse';
  const articleDescription = 'Découvrez nos conseils pratiques pour bien préparer une visite immobilière et maximiser vos chances de trouver la maison idéale.';

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
                  src="https://images.pexels.com/photos/5998051/pexels-photo-5998051.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Couple visitant une maison moderne avec un agent immobilier professionnel"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-primary-500 text-white text-sm rounded-full mb-4">
                    Conseils
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Comment bien préparer une visite immobilière ?
                  </h1>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar size={16} className="mr-2" />
                    <span className="mr-4">27 janvier 2025</span>
                    <Clock size={16} className="mr-2" />
                    <span>5 min de lecture</span>
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
    Une visite immobilière ne se limite pas à un simple coup d'œil. Elle doit te permettre de recueillir un maximum d'informations pour prendre une décision éclairée. Voici un guide complet pour tirer profit de chaque visite et éviter les mauvaises surprises.
  </p>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">1</span>
    Anticipe avec une checklist adaptée à ton projet
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Avant même de franchir la porte du bien, il est essentiel de définir ce que tu veux observer. Une checklist personnalisée t'aide à rester concentré et à ne rien oublier, surtout si tu visites plusieurs biens dans la même journée.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Vérifie l'état général : toiture, façade, murs, sols, plafond</li>
    <li>Contrôle l'isolation thermique et phonique</li>
    <li>Note l'âge de la chaudière ou du système de chauffage</li>
    <li>Renseigne-toi sur les charges et impôts locaux</li>
    <li>Identifie les éventuels travaux réalisés ou à prévoir</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">2</span>
    Analyse chaque pièce avec attention et méthode
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Une visite réussie passe par une observation rigoureuse de chaque espace. Ne te laisse pas distraire par la décoration : concentre-toi sur l'état réel du logement et les éléments qui auront un impact sur ton confort ou ton budget futur.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Regarde les plafonds pour détecter d'éventuelles traces d'humidité</li>
    <li>Ouvre les fenêtres pour vérifier leur fonctionnement et leur état</li>
    <li>Teste les interrupteurs, prises, robinetterie et chasse d'eau</li>
    <li>Évalue la luminosité naturelle et l'orientation</li>
    <li>Vérifie la ventilation et l'aération dans les pièces d'eau</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">3</span>
    Prends le temps d'observer l\'environnement extérieur
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    L'environnement est souvent aussi important que le bien lui-même. Un logement peut être parfait sur le papier, mais se situer dans un quartier bruyant, mal desservi ou peu sécurisé. Il est donc crucial de prendre du recul et d'explorer les alentours.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Repère les commerces, écoles, transports à proximité</li>
    <li>Évalue le niveau de bruit à différents moments de la journée</li>
    <li>Regarde l'état des immeubles voisins et de la rue</li>
    <li>Teste les trajets domicile-travail si possible</li>
    <li>Discute brièvement avec un voisin ou commerçant du coin</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">4</span>
    Pose des questions précises au vendeur ou à l'agent
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Ne te contente pas de visiter passivement. Interroger le vendeur ou l'agent immobilier te permet d'en savoir plus sur le passé du bien, sur d'éventuelles anomalies ou sur les marges de négociation possibles.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Pourquoi le bien est-il mis en vente ? Depuis combien de temps ?</li>
    <li>Des offres ont-elles été faites ? Si oui, pourquoi ont-elles échoué ?</li>
    <li>Quels travaux ont été réalisés ces dernières années ?</li>
    <li>Y a-t-il eu des sinistres ou litiges récents ?</li>
    <li>Quels sont les points faibles reconnus du logement ?</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">5</span>
    Documente chaque visite pour mieux comparer
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Lorsque tu visites plusieurs biens, il devient vite difficile de tout mémoriser. Prendre des notes et des photos (avec l'accord du propriétaire) te permettra de comparer objectivement les logements visités une fois rentré chez toi.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Note les points forts et faibles de chaque logement</li>
    <li>Prends des photos claires de chaque pièce</li>
    <li>Ajoute des commentaires personnels (ressenti, ambiance, odeurs)</li>
    <li>Classe tes visites dans un dossier dédié (physique ou numérique)</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">6</span>
    Vérifie les documents obligatoires avant d'avancer
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Avant toute décision ou offre d'achat, assure-toi que tous les documents réglementaires ont été fournis. Ces éléments sont essentiels pour connaître l'état technique du bien et anticiper les frais à venir.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Dossier de diagnostics techniques (DPE, amiante, électricité…)</li>
    <li>Plan du logement et surface exacte loi Carrez</li>
    <li>Règlement de copropriété si applicable</li>
    <li>Derniers PV d'assemblée générale en copropriété</li>
    <li>Charges mensuelles, taxes foncières et autres frais</li>
  </ul>

<h2 className="text-lg font-semibold mb-4 mt-8 text-primary-400 flex items-center">
  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">7</span>
    Ne néglige pas l'émotion, mais reste rationnel
  </h2>
  <p className="text-gray-300 leading-relaxed mb-2">
    Il est normal d'avoir un coup de cœur, mais attention à ne pas ignorer des défauts majeurs. Rappelle-toi que l'achat immobilier est avant tout un projet à long terme, et qu'un bon feeling ne suffit pas.
  </p>
  <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-6">
    <li>Fais une seconde visite pour valider ton ressenti</li>
    <li>Demande l'avis d'un proche ou d'un professionnel</li>
    <li>Réévalue les points négatifs avec objectivité</li>
  </ul>

  <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/20 rounded-lg">
    <p className="text-primary-300 italic font-medium text-sm">
      Une visite immobilière réussie repose sur une bonne préparation, de l'observation et les bonnes questions. Mieux tu observes, mieux tu négocies, et plus tu achètes sereinement.
    </p>
  </div>
</div>

                {/* Call to action */}
                <div className="mt-12 p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20">
                  <h3 className="text-xl font-semibold mb-3 text-primary-400">
                    Prêt à visiter des maisons ?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Avec GoAdresse, trouve l'adresse exacte des maisons qui t'intéressent et explore leur environnement avant même de te déplacer.
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
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArticleVisiteImmobiliere;