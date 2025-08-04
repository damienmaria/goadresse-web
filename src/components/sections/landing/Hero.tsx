import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Map, Euro, Home, MapPin, Camera, Globe, Eye, Navigation, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';

const Hero: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Coordonnées exactes spécifiées
  const exampleLocation = {
    lat: 47.674742,
    lng: 1.235289
  };

  // Charger l'API Google Maps
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
          reject(new Error('Google Maps API key not configured'));
          return;
        }

        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          const checkGoogle = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogle);
              resolve();
            }
          }, 100);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps API'));

        document.head.appendChild(script);
      });
    };

    loadGoogleMapsAPI()
      .then(() => {
        setIsMapLoaded(true);
        setMapError(null);
      })
      .catch((error) => {
        setMapError(error.message || 'Erreur lors du chargement de Google Maps');
        setIsMapLoaded(false);
      });
  }, []);

  // Initialiser la carte Google Maps
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.google) {
      return;
    }

    try {
      // Créer la carte
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: exampleLocation,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
        },
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        backgroundColor: '#1f2937'
      });

      // Ajouter un marqueur pour la maison trouvée
      const marker = new google.maps.Marker({
        position: exampleLocation,
        map: googleMapRef.current,
        title: '12 rue des forges, 41330 La Chapelle-Vendômoise',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 8.954 20 20 20s20-8.954 20-20C40 8.954 31.046 0 20 0z" fill="#dc2626"/>
              <path d="M20 40L15 45L20 50L25 45Z" fill="#dc2626"/>
              <circle cx="20" cy="20" r="16" fill="#ffffff" opacity="0.2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">🏠</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 50),
          anchor: new google.maps.Point(20, 50)
        },
        animation: google.maps.Animation.DROP
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      setMapError('Erreur lors de l\'initialisation de la carte');
    }
  }, [isMapLoaded]);

  const steps = [
    {
      number: "1",
      title: "Repère une maison sur une annonce immobilière",
      description: "Note le code postal et la superficie du terrain. Si la superficie n'est pas précisée, contacte l'agence pour l'obtenir.",
      icon: <Camera className="text-red-500" size={24} />,
      color: "red"
    },
    {
      number: "2", 
      title: "Recherche sur GoAdresse",
      description: "Saisis le code postal et la superficie pour retrouver les parcelles correspondantes dans la commune.",
      icon: <Search className="text-blue-500" size={24} />,
      color: "blue"
    },
    {
      number: "3",
      title: "Analyse les résultats", 
      description: "Compare-les avec les vues satellite et Street View sur Google Maps. Repère les détails visuels : toiture, clôture, arbres, portail, etc.",
      icon: <Eye className="text-purple-500" size={24} />,
      color: "purple"
    },
    {
      number: "4",
      title: "Identifie la maison exacte",
      description: "Une fois la correspondance faite, note l'adresse. Explore les alentours à distance : quartier, commerces, écoles, transports.",
      icon: <MapPin className="text-green-500" size={24} />,
      color: "green"
    },
    {
      number: "5",
      title: "Déplace-toi sur place",
      description: "Visite le quartier pour t'en imprégner. Si la maison te plaît, contacte directement le propriétaire, sans passer par l'agence.",
      icon: <Navigation className="text-orange-500" size={24} />,
      color: "orange"
    }
  ];

  return (
    <section className="relative min-h-screen pt-24 flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent z-0"></div>
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #7C3AED 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 py-16">
        <div className="flex flex-col items-center justify-center">
          {/* Contenu principal centré */}
          <motion.div 
            className="text-center max-w-4xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="gradient-text">Trouve l'adresse</span>, explore, achète en direct
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Tu as repéré une maison sur une annonce ? <br />
              GoAdresse t'aide à retrouver son adresse exacte grâce à sa superficie et son code postal. <br />
              Explore l'environnement à distance et contacte directement le propriétaire, sans passer par une agence. <br />
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/search">
                <Button 
                  icon={<Search size={20} />}
                  size="lg"
                >
                  Commencer la recherche
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline"
                  icon={<Map size={20} />}
                  size="lg"
                >
                  Voir nos abonnements
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Section Comment ça fonctionne - DÉPLACÉE ICI */}
          <motion.div 
            className="text-center mb-16 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça <span className="gradient-text">fonctionne</span></h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Notre processus simple en 5 étapes te permet de trouver l'adresse exacte d'une maison repérée sur une annonce, 
              d'explorer son environnement à distance et d'acheter directement avec le propriétaire.
            </p>
          </motion.div>
          
          {/* Section des étapes avec descriptions et images */}
          <motion.div 
            className="w-full max-w-7xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="relative">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
              
              {/* Layout horizontal avec descriptions et images uniformes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col relative">
                    {/* Numéro d'étape avec flèche */}
                    <motion.div 
                      className="flex items-center justify-center mb-4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        step.color === 'red' ? 'bg-red-500' :
                        step.color === 'blue' ? 'bg-blue-500' :
                        step.color === 'purple' ? 'bg-purple-500' :
                        step.color === 'green' ? 'bg-green-500' :
                        'bg-orange-500'
                      }`}>
                        {step.number}
                      </div>
                      
                      {/* Flèche vers l'étape suivante */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:flex absolute left-full top-1/2 transform -translate-y-1/2 translate-x-2 z-10">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                            className="flex items-center"
                          >
                            <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                            <ArrowRight size={20} className="text-primary-500 ml-1" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>

                    {/* Description de l'étape */}
                    <motion.div 
                      className="mb-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    >
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${
                        step.color === 'red' ? 'bg-red-500/20' :
                        step.color === 'blue' ? 'bg-blue-500/20' :
                        step.color === 'purple' ? 'bg-purple-500/20' :
                        step.color === 'green' ? 'bg-green-500/20' :
                        'bg-orange-500/20'
                      }`}>
                        {step.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-white leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>

                    {/* Image correspondante - DIMENSIONS UNIFORMES */}
                    <motion.div 
                      className="relative rounded-2xl shadow-2xl overflow-hidden w-full h-80 bg-dark-800"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    >
                      {index === 0 && (
                        // 1. Annonce SeLoger
                        <div className="w-full h-full bg-white p-4 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-blue-600 font-bold text-lg">SeLoger</div>
                            <div className="text-xs text-gray-500">Ref: 123456</div>
                          </div>
                          
                          <div className="relative rounded-lg overflow-hidden mb-3 flex-1">
                            <img 
                              src="https://images.pexels.com/photos/14078226/pexels-photo-14078226.jpeg" 
                              alt="Maison en vente" 
                              className="w-full h-full object-cover"
                              style={{ objectPosition: 'center 30%' }}
                            />
                            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              VENTE
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              8 photos
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-gray-900">285 000 €</div>
                            <div className="text-sm text-gray-600">Maison • 4 pièces • 85 m²</div>
                            <div className="text-sm text-gray-600 font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                              Terrain: 703 m²
                            </div>
                            <div className="text-sm text-gray-600">41330 La Chapelle-Vendômoise</div>
                          </div>
                        </div>
                      )}

                      {index === 1 && (
                        // 2. Interface GoAdresse
                        <div className="w-full h-full bg-dark-800 p-4 flex flex-col">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg mr-2"></div>
                            <div className="text-white font-bold">GoAdresse</div>
                          </div>
                          
                          <div className="space-y-3 flex-1">
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">Code postal</label>
                              <div className="bg-dark-700 rounded px-3 py-2 text-white">41330</div>
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">Superficie (m²)</label>
                              <div className="bg-dark-700 rounded px-3 py-2 text-white">703</div>
                            </div>
                            <div className="bg-primary-600 text-white rounded px-4 py-2 text-center font-semibold">
                              Rechercher
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              <div className="text-green-400 text-sm">✓ 3 parcelles trouvées</div>
                              <div className="bg-dark-700 rounded p-2 text-xs text-gray-300">
                                • 12 rue des Forges (703 m²)
                                <br />• 8 rue du Moulin (698 m²)
                                <br />• 15 allée des Chênes (710 m²)
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        // 3. Analyse des photos
                        <div className="w-full h-full bg-gray-900 flex flex-col">
                          <div className="flex-1 relative">
                            <img 
                              src="https://images.pexels.com/photos/14078226/pexels-photo-14078226.jpeg" 
                              alt="Vue satellite" 
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              Vue satellite
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-800">
                            <div className="text-white text-sm font-semibold mb-2">Comparaison visuelle</div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                              <div>✓ Toiture rouge</div>
                              <div>✓ Portail blanc</div>
                              <div>✓ 2 arbres</div>
                              <div>✓ Clôture bois</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {index === 3 && (
                        // 4. Carte Google Maps
                        mapError ? (
                          <div className="w-full h-full bg-dark-700 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin size={48} className="text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400 font-semibold">Carte non disponible</p>
                              <p className="text-gray-500 text-sm">Configuration Google Maps requise</p>
                            </div>
                          </div>
                        ) : !isMapLoaded ? (
                          <div className="w-full h-full bg-dark-700 flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                              <p className="text-gray-400 font-semibold">Chargement de la carte...</p>
                            </div>
                          </div>
                        ) : (
                          <div 
                            ref={mapRef}
                            className="w-full h-full"
                          />
                        )
                      )}

                      {index === 4 && (
                        // 5. Homme devant la maison
                        <img 
                          src="https://images.pexels.com/photos/7578915/pexels-photo-7578915.jpeg" 
                          alt="Homme devant une maison" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;