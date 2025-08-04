import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: 'Comment puis-je trouver la superficie d\'une maison sur une annonce ?',
    answer: 'La superficie de la parcelle est généralement indiquée dans les détails de l\'annonce immobilière. Si elle n\'est pas visible, n\'hésite pas à appeler l\'agence qui te fournira cette information. C\'est une donnée obligatoire qu\'ils possèdent toujours.'
  },
  {
    question: 'Comment explorer l\'environnement d\'une maison à distance ?',
    answer: 'Une fois l\'adresse obtenue, tu peux utiliser Google Maps pour explorer le quartier, Google Street View pour voir l\'environnement, calculer les distances vers ton travail, les écoles, les commerces. Tu peux aussi vérifier les transports en commun et les services à proximité.'
  },
  {
    question: 'Comment être sûr que j\'ai trouvé la bonne maison ?',
    answer: 'Notre système te permet de comparer les photos de l\'annonce avec les résultats de recherche. Tu peux également utiliser la vue satellite et Street View pour confirmer que l\'environnement correspond bien aux photos de l\'annonce.'
  },
  {
    question: 'Est-ce légal de contacter directement le propriétaire ?',
    answer: 'Absolument ! Il est parfaitement légal de contacter directement un propriétaire. Beaucoup de propriétaires apprécient même cette approche directe qui leur évite également de payer les frais d\'agence.'
  },
  {
    question: 'Combien puis-je économiser en évitant l\'agence ?',
    answer: 'Les frais d\'agence immobilière représentent généralement entre 5% et 8% du prix de vente. Sur une maison à 300 000€, cela représente une économie potentielle de 15 000€ à 24 000€.'
  },
  {
    question: 'Cela fonctionne-t-il si j\'habite loin de la maison ?',
    answer: 'C\'est même l\'un des principaux avantages ! Avoir l\'adresse te permet d\'explorer complètement l\'environnement à distance : quartier, commerces, écoles, transports, distances. Tu ne te déplaces qu\'après avoir validé que tout correspond à tes critères.'
  },
  {
    question: 'Que faire si le propriétaire refuse d\'acheter directement ?',
    answer: 'Certains propriétaires préfèrent passer par leur agence. Dans ce cas, respecte leur choix. Tu peux toujours négocier le prix en tenant compte des frais d\'agence que tu es prêt à partager.'
  },
  {
    question: 'Puis-je utiliser ce service pour tous types de biens ?',
    answer: 'Notre service fonctionne principalement pour les maisons individuelles avec terrain. Il est moins efficace pour les appartements ou les biens sans parcelle cadastrale distincte.'
  }
];

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions <span className="gradient-text">fréquentes</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Retrouve les réponses aux questions les plus courantes sur notre méthode pour trouver l'adresse d'une maison, 
            explorer son environnement à distance et acheter directement avec le propriétaire.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <button
                className={`w-full text-left p-6 rounded-lg flex justify-between items-center transition-all duration-200 ${
                  activeIndex === index 
                    ? 'bg-dark-800 border-l-4 border-primary-500' 
                    : 'bg-dark-900 hover:bg-dark-800'
                }`}
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-medium pr-4">{item.question}</h3>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 flex-shrink-0 ${
                    activeIndex === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-dark-800 rounded-b-lg border-l-4 border-primary-500 text-gray-300">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;