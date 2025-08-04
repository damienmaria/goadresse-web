import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles, Camera, Lock, Shield, Euro, MapPin, Users, Globe, Navigation, AlertTriangle, Search, Settings } from 'lucide-react';
import Card from '../../common/Card';

const benefits = [
  {
    icon: <Camera className="text-primary-500" size={28} />,
    title: 'Recherche par photo',
    description: 'Compare facilement les photos d\'annonces avec nos résultats pour identifier la bonne propriété.'
  },
  {
    icon: <MapPin className="text-secondary-500" size={28} />,
    title: 'Adresse exacte',
    description: 'Obtiens l\'adresse précise de la maison qui t\'intéresse grâce à sa superficie et son code postal.'
  },
  {
    icon: <Globe className="text-indigo-500" size={28} />,
    title: 'Exploration à distance',
    description: 'Découvre le quartier, les commerces, écoles et transports avant même de te déplacer.'
  },
  {
    icon: <Navigation className="text-violet-500" size={28} />,
    title: 'Calcul des distances',
    description: 'Mesure les distances vers ton travail, les écoles, la plage ou tout autre point d\'intérêt.'
  },
  {
    icon: <Euro className="text-blue-500" size={28} />,
    title: 'Économies garanties',
    description: 'Évite jusqu\'à 8% de frais d\'agence en achetant directement avec les propriétaires.'
  },
  {
    icon: <Clock className="text-emerald-500" size={28} />,
    title: 'Gain de temps',
    description: 'Évalue l\'environnement avant toute visite physique et optimise tes déplacements.'
  }
];

const Benefits: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="benefits">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
          style={{ mixBlendMode: 'lighten' }}
        ></div>
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-600/10 rounded-full blur-3xl"
          style={{ mixBlendMode: 'lighten' }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="gradient-text">GoAdresse</span> c'est aussi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card hover className="h-full p-6">
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-dark-700 rounded-lg mr-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                </div>
                <p className="text-gray-400">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Nouveau bloc d'aide pour les recherches infructueuses */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/20 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <AlertTriangle size={28} className="text-yellow-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-yellow-400">Tu ne trouves pas la maison ?</h3>
                <p className="text-gray-300 text-lg">
                  Pas de panique ! Voici quelques conseils pour optimiser ta recherche.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-800/50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Settings size={20} className="text-orange-500 mr-3" />
                  <h4 className="font-semibold text-orange-400">Ajuste tes filtres</h4>
                </div>
                <p className="text-gray-300 mb-3">
                  Élargis ta recherche en ajustant les filtres de superficie minimale et maximale.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Exemple :</strong> Si tu cherches 703 m², essaie entre 690 et 720 m²
                </div>
              </div>

              <div className="bg-dark-800/50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Search size={20} className="text-blue-500 mr-3" />
                  <h4 className="font-semibold text-blue-400">Vérifie la superficie</h4>
                </div>
                <p className="text-gray-300 mb-3">
                  Assure-toi que la surface saisie correspond à celle enregistrée dans le cadastre national.
                </p>
                <div className="text-sm text-gray-400">
                  <strong>Astuce :</strong> Parfois, l'annonce indique une superficie arrondie
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Sparkles size={20} className="text-blue-400 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-400 mb-1">Bon à savoir</h5>
                  <p className="text-gray-300 text-sm">
                    Les données cadastrales peuvent parfois différer légèrement des annonces immobilières. 
                    N'hésite pas à tester plusieurs valeurs proches de la superficie indiquée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-16 space-y-8">
          {/* Section exploration à distance */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 max-w-4xl mx-auto border border-blue-500/20">
            <h3 className="text-2xl font-bold mb-6 text-blue-400 text-center">Explore avant de te déplacer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-blue-400" />
                </div>
                <h4 className="font-semibold mb-2">Quartier</h4>
                <p className="text-gray-400 text-sm">Découvre l'ambiance et le style du quartier</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield size={24} className="text-green-400" />
                </div>
                <h4 className="font-semibold mb-2">Commerces</h4>
                <p className="text-gray-400 text-sm">Localise supermarchés, restaurants, services</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Navigation size={24} className="text-purple-400" />
                </div>
                <h4 className="font-semibold mb-2">Transports</h4>
                <p className="text-gray-400 text-sm">Évalue l'accès aux transports en commun</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} className="text-orange-400" />
                </div>
                <h4 className="font-semibold mb-2">Distances</h4>
                <p className="text-gray-400 text-sm">Calcule les temps de trajet vers tes destinations</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                <strong>Parfait si tu habites loin :</strong> Évalue l'environnement de la maison depuis chez toi 
                et ne te déplace que pour les biens qui correspondent vraiment à tes critères.
              </p>
            </div>
          </div>

          {/* Section économies */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 max-w-3xl mx-auto border border-green-500/20">
            <h3 className="text-2xl font-bold mb-4 text-green-400 text-center">Exemple concret d'économies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2 text-red-400">Avec agence</h4>
                <div className="text-3xl font-bold text-red-400 mb-2">324 000€</div>
                <p className="text-gray-400">Prix maison: 300 000€</p>
                <p className="text-gray-400">Frais agence: 24 000€ (8%)</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2 text-green-400">Achat direct</h4>
                <div className="text-3xl font-bold text-green-400 mb-2">300 000€</div>
                <p className="text-gray-400">Prix maison: 300 000€</p>
                <p className="text-gray-400">Frais agence: 0€</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-500/20 rounded-lg">
              <p className="text-green-300 font-semibold text-center">Économie réalisée : 24 000€</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;