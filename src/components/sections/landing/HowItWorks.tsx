import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Search, Globe, Users } from 'lucide-react';

const steps = [
  {
    icon: <Camera size={28} />,
    title: 'Repère la maison',
    description: 'Trouve une maison qui t\'intéresse sur une annonce immobilière. Récupère la superficie de la parcelle (appelle l\'agence si nécessaire).',
    color: 'bg-primary-500'
  },
  {
    icon: <Search size={28} />,
    title: 'Recherche l\'adresse',
    description: 'Saisis la superficie exacte et le code postal de la ville où se trouve la maison dans notre outil de recherche.',
    color: 'bg-secondary-500'
  },
  {
    icon: <Globe size={28} />,
    title: 'Explore l\'environnement',
    description: 'Avec l\'adresse exacte, explore le quartier, les commerces, calcule les distances vers ton travail, les écoles, etc.',
    color: 'bg-indigo-500'
  },
  {
    icon: <Users size={28} />,
    title: 'Visite et achète',
    description: 'Rends-toi directement à l\'adresse en connaissance de cause et achète avec le propriétaire. Économise jusqu\'à 8% !',
    color: 'bg-violet-500'
  }
];

const HowItWorks: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 bg-dark-900" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir <span className="gradient-text">GoAdresse</span></h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Découvre les avantages qui font de notre service l'outil indispensable pour acheter en direct 
            et explorer l'environnement d'une maison avant même de te déplacer.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500/30 transition-all duration-300 relative"
              variants={item}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${step.color} w-14 h-14 rounded-full flex items-center justify-center text-white`}>
                  {step.icon}
                </div>
                <div className="text-2xl font-bold text-primary-500/30">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 space-y-8">
          {/* Section exploration à distance */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 max-w-4xl mx-auto border border-blue-500/20">
            <h3 className="text-2xl font-bold mb-6 text-blue-400 text-center">Avantage de l'exploration à distance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-300">Tu habites loin ?</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Évalue le quartier sans te déplacer</li>
                  <li>• Vérifie la proximité des commodités</li>
                  <li>• Calcule les temps de trajet</li>
                  <li>• Explore avec Street View</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-green-300">Gain de temps</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Ne visite que les biens intéressants</li>
                  <li>• Prépare tes questions en amont</li>
                  <li>• Optimise tes déplacements</li>
                  <li>• Achète en connaissance de cause</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section économies */}
          <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">Pourquoi éviter les agences ?</h3>
            <p className="text-gray-300 mb-6 text-center">
              Les frais d'agence immobilière peuvent représenter jusqu'à 8% du prix de vente de la maison. 
              En achetant directement avec le propriétaire, tu économises ces frais tout en ayant un contact direct et transparent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-2">8%</div>
                <p className="text-gray-400">d'économies possibles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-500 mb-2">0€</div>
                <p className="text-gray-400">de frais d'agence</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-500 mb-2">100%</div>
                <p className="text-gray-400">de transparence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;