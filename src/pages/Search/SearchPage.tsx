import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Lock, CreditCard, Star, Map, Info, AlertTriangle, Loader2, ExternalLink, Sparkles, Eye, EyeOff } from 'lucide-react';
import pako from 'pako';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import AddressInfoModal from '../../components/common/AddressInfoModal';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { SEARCH_LIMITS } from '../../config/limits';

interface Commune {
  nom: string;
  code: string;
}

interface CadastreFeature {
  type: string;
  properties: {
    id: string;
    commune: string;
    prefixe: string;
    section: string;
    numero: string;
    contenance: number;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface CadastreResponse {
  type: string;
  features: CadastreFeature[];
  totalFound?: number;
}

interface AddressResult {
  house_number?: string;
  road?: string;
  postcode?: string;
  village?: string;
  county?: string;
  error?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const MAX_RESULTS = SEARCH_LIMITS.MAX_RESULTS_PER_SEARCH;

const SearchPage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [codePostal, setCodePostal] = useState('');
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<string>('');
  const [surfaceType, setSurfaceType] = useState<'exact' | 'range'>('exact');
  const [exactSurface, setExactSurface] = useState('');
  const [minSurface, setMinSurface] = useState('');
  const [maxSurface, setMaxSurface] = useState('');
  
  const [searchResults, setSearchResults] = useState<CadastreResponse | null>(null);
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [selectedAddressForInfo, setSelectedAddressForInfo] = useState<string | null>(null);

  // Google Maps state - simplifié
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [forceMapRefresh, setForceMapRefresh] = useState(0);
  
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Configuration de la carte
  const defaultCenter = {
    lat: 46.603354,
    lng: 1.888334
  };

  // Filtrer les résultats valides pour la carte
  const validAddressResults = useMemo(() => {
    return addressResults.filter(result => 
      result.coordinates && 
      !isNaN(result.coordinates.lat) && 
      !isNaN(result.coordinates.lng) &&
      isFinite(result.coordinates.lat) &&
      isFinite(result.coordinates.lng) &&
      result.coordinates.lat !== 0 &&
      result.coordinates.lng !== 0
    );
  }, [addressResults]);

  // Calculer le centre de la carte
  const mapCenter = useMemo(() => {
    if (!validAddressResults.length) return defaultCenter;
    
    const avgLat = validAddressResults.reduce((sum, result) => sum + result.coordinates!.lat, 0) / validAddressResults.length;
    const avgLng = validAddressResults.reduce((sum, result) => sum + result.coordinates!.lng, 0) / validAddressResults.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [validAddressResults]);

  // Charger l'API Google Maps - simplifié
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

  // FONCTION POUR FORCER L'AFFICHAGE DE LA CARTE
  const forceMapDisplay = useCallback(() => {
    if (!isMapLoaded || !mapRef.current || !window.google || !validAddressResults.length) {
      return;
    }

    console.log('🗺️ AFFICHAGE DE LA CARTE');

    try {
      // Nettoyer complètement les anciens marqueurs
      markersRef.current.forEach(marker => {
        marker.setMap(null);
        google.maps.event.clearInstanceListeners(marker);
      });
      markersRef.current = [];

      // Fermer l'InfoWindow
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // Créer ou recréer la carte COMPLÈTEMENT
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 12,
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

      // Créer une nouvelle InfoWindow
      infoWindowRef.current = new google.maps.InfoWindow();

      console.log(`🎯 Ajout de ${validAddressResults.length} marqueurs`);

      // Ajouter les marqueurs avec animation
      validAddressResults.forEach((address, index) => {
        if (!address.coordinates) return;

        const marker = new google.maps.Marker({
          position: {
            lat: address.coordinates.lat,
            lng: address.coordinates.lng
          },
          map: googleMapRef.current,
          title: user ? formatAddress(address) : 'Connectez-vous pour voir l\'adresse',
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 8.954 20 20 20s20-8.954 20-20C40 8.954 31.046 0 20 0z" fill="#dc2626"/>
                <path d="M20 40L15 45L20 50L25 45Z" fill="#dc2626"/>
                <circle cx="20" cy="20" r="16" fill="#ffffff" opacity="0.2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${index + 1}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(40, 50),
            anchor: new google.maps.Point(20, 50)
          },
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          setSelectedMarker(index);
          
          if (infoWindowRef.current) {
            const content = user ? `
              <div style="color: #1f2937; padding: 12px; max-width: 280px; font-family: Arial, sans-serif;">
                <h3 style="font-weight: 600; margin: 0 0 8px 0; font-size: 16px; color: #dc2626;">
                  Adresse #${index + 1}
                </h3>
                <p style="font-weight: 500; margin: 0 0 6px 0; font-size: 14px; color: #374151;">
                  ${address.error ? `<span style="color: #dc2626;">${address.error}</span>` : formatAddress(address)}
                </p>
                ${address.coordinates ? `
                  <p style="font-size: 12px; color: #6b7280; margin: 0; font-family: monospace;">
                    📍 ${address.coordinates.lat.toFixed(6)}, ${address.coordinates.lng.toFixed(6)}
                  </p>
                ` : ''}
              </div>
            ` : `
              <div style="color: #1f2937; padding: 12px; max-width: 280px; font-family: Arial, sans-serif; text-align: center;">
                <h3 style="font-weight: 600; margin: 0 0 8px 0; font-size: 16px; color: #dc2626;">
                  🔒 Adresse #${index + 1}
                </h3>
                <p style="font-weight: 500; margin: 0 0 6px 0; font-size: 14px; color: #374151;">
                  Connectez-vous pour voir l'adresse exacte
                </p>
                <a href="/login" style="color: #7c3aed; text-decoration: underline; font-size: 12px;">
                  Se connecter
                </a>
              </div>
            `;
            
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(googleMapRef.current, marker);
          }
        });

        markersRef.current.push(marker);
      });

      // Ajuster la vue avec délai pour s'assurer que tout est chargé
      setTimeout(() => {
        if (!googleMapRef.current) return;

        if (validAddressResults.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          validAddressResults.forEach(address => {
            if (address.coordinates) {
              bounds.extend(new google.maps.LatLng(address.coordinates.lat, address.coordinates.lng));
            }
          });
          googleMapRef.current.fitBounds(bounds);
          
          google.maps.event.addListenerOnce(googleMapRef.current, 'bounds_changed', () => {
            if (googleMapRef.current && googleMapRef.current.getZoom()! > 16) {
              googleMapRef.current.setZoom(16);
            }
          });
        } else if (validAddressResults.length === 1) {
          googleMapRef.current.setCenter(mapCenter);
          googleMapRef.current.setZoom(15);
        }

        // FORCER LE REDIMENSIONNEMENT ET LE RENDU
        google.maps.event.trigger(googleMapRef.current, 'resize');
      }, 200);

      console.log('✅ Carte affichée avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage de la carte:', error);
      setMapError('Erreur lors de l\'affichage de la carte');
    }
  }, [isMapLoaded, user, validAddressResults, mapCenter]);

  // Déclencher l'affichage de la carte quand les résultats arrivent - UN SEUL DÉCLENCHEMENT
  useEffect(() => {
    if (validAddressResults.length > 0) {
      console.log('🚀 Nouveaux résultats détectés, affichage de la carte...');
      
      // UN SEUL déclenchement avec délai court pour s'assurer que le DOM est prêt
      setTimeout(() => {
        forceMapDisplay();
      }, 300);
    }
  }, [validAddressResults, forceMapDisplay]);

  // Forcer le refresh quand l'état change
  useEffect(() => {
    if (forceMapRefresh > 0) {
      forceMapDisplay();
    }
  }, [forceMapRefresh, forceMapDisplay]);

  // Refresh profile data when the page loads
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  // Récupération des communes
  useEffect(() => {
    const fetchCommunes = async () => {
      if (codePostal.length === 5) {
        setIsLoadingCommunes(true);
        try {
          const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom,code&format=json`);
          const data = await response.json();
          setCommunes(data);
          setSelectedCommune('');
        } catch (error) {
          console.error('Error fetching communes:', error);
          setCommunes([]);
        } finally {
          setIsLoadingCommunes(false);
        }
      } else {
        setCommunes([]);
        setSelectedCommune('');
      }
    };

    fetchCommunes();
  }, [codePostal]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateCentroid = (coordinates: number[][][]): [number, number] => {
    let totalPoints = 0;
    let sumLon = 0;
    let sumLat = 0;

    if (coordinates.length > 0 && coordinates[0].length > 0) {
      coordinates[0].forEach(point => {
        if (Array.isArray(point) && point.length === 2) {
          const [lon, lat] = point;
          if (!isNaN(lon) && !isNaN(lat) && isFinite(lon) && isFinite(lat)) {
            sumLon += lon;
            sumLat += lat;
            totalPoints++;
          }
        }
      });
    }

    if (totalPoints === 0) {
      console.warn('No valid points found in coordinates');
      return [NaN, NaN];
    }

    return [sumLon / totalPoints, sumLat / totalPoints];
  };

  const fetchAddress = async (coordinates: number[][][]): Promise<AddressResult> => {
    const maxRetries = 3;
    let retryCount = 0;
    
    const [lon, lat] = calculateCentroid(coordinates);
    
    if (isNaN(lon) || isNaN(lat) || !isFinite(lon) || !isFinite(lat)) {
      return {
        error: 'Coordonnées invalides pour cette parcelle',
        coordinates: { lat: NaN, lng: NaN }
      };
    }
    
    while (retryCount < maxRetries) {
      try {
        if (retryCount > 0) {
          await sleep(1000 * Math.pow(2, retryCount - 1));
        }
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          {
            headers: {
              'User-Agent': 'GoAdresse/1.0 (https://goadresse.fr; contact@goadresse.fr)'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch address: ${response.status}`);
        }
        
        const data = await response.json();
        return {
          house_number: data.address?.house_number,
          road: data.address?.road,
          postcode: data.address?.postcode,
          village: data.address?.village,
          county: data.address?.county,
          coordinates: { lat, lng: lon }
        };
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount === maxRetries) {
          return {
            error: 'Impossible de récupérer l\'adresse après plusieurs tentatives',
            coordinates: { lat, lng: lon }
          };
        }
      }
    }
    
    return {
      error: 'Une erreur inattendue s\'est produite',
      coordinates: { lat, lng: lon }
    };
  };
  
  const validateSearch = (): boolean => {
    setSearchError('');
    
    if (!codePostal) {
      setSearchError('Le code postal est requis');
      return false;
    }

    if (!selectedCommune) {
      setSearchError('La commune est requise');
      return false;
    }
    
    if (surfaceType === 'exact' && !exactSurface) {
      setSearchError('La superficie exacte de la parcelle est requise');
      return false;
    }
    
    if (surfaceType === 'range') {
      if (!minSurface || !maxSurface) {
        setSearchError('Les superficies minimale ET maximale de la parcelle sont requises');
        return false;
      }
      
      const min = parseInt(minSurface);
      const max = parseInt(maxSurface);
      
      if (min >= max) {
        setSearchError('La superficie minimale doit être inférieure à la superficie maximale');
        return false;
      }
    }
    
    return true;
  };
  
  const fetchCadastreData = async (
    inseeCode: string,
    minArea: number,
    maxArea: number
  ): Promise<CadastreResponse> => {
    const departmentCode = inseeCode.substring(0, 2);
    const url = `https://cadastre.data.gouv.fr/data/etalab-cadastre/2024-01-01/geojson/communes/${departmentCode}/${inseeCode}/cadastre-${inseeCode}-parcelles.json.gz`;
    
    try {
      setSearchStep('Téléchargement des données cadastrales...');
      const response = await fetch(url);
      const gzippedData = await response.blob();
      
      setSearchStep('Décompression et analyse des données...');
      const arrayBuffer = await gzippedData.arrayBuffer();
      const decompressed = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });
      const jsonData = JSON.parse(decompressed);
      
      setSearchStep('Filtrage des parcelles par superficie...');
      const filteredFeatures = jsonData.features.filter((feature: CadastreFeature) => {
        const area = feature.properties.contenance;
        return area >= minArea && area <= maxArea;
      });
      
      const totalFound = filteredFeatures.length;
      const limitedFeatures = filteredFeatures.slice(0, MAX_RESULTS);
      
      const results = {
        type: "FeatureCollection",
        features: limitedFeatures,
        totalFound
      };
      
      return results;
    } catch (error) {
      console.error('Error fetching cadastre data:', error);
      throw new Error('Erreur lors de la récupération des données cadastrales');
    }
  };

  const updateSearchCount = async () => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ search_count: (profile.search_count || 0) + 1 })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshProfile();
    } catch (error) {
      console.error('Error updating search count:', error);
    }
  };

  const checkSearchLimit = () => {
    if (!user) return true; // Permettre la recherche même sans connexion
    if (!profile) return false;
    
    if (!profile.is_pro && (profile.search_count || 0) >= SEARCH_LIMITS.FREE_SEARCHES_WITH_RESULTS) {
      setSearchError(SEARCH_LIMITS.MESSAGES.LIMIT_REACHED);
      return false;
    }
    
    return true;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSearch()) {
      return;
    }

    // Pour les utilisateurs connectés, vérifier les limites
    if (user && !checkSearchLimit()) {
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchStep('Initialisation de la recherche...');
      setHasSearched(true);
      setSearchResults(null);
      setAddressResults([]);
      setSelectedMarker(null);
      
      // Nettoyer les anciens marqueurs IMMÉDIATEMENT
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      const min = surfaceType === 'exact' ? parseInt(exactSurface) : parseInt(minSurface);
      const max = surfaceType === 'exact' ? parseInt(exactSurface) : parseInt(maxSurface);
      
      // Récupérer les données cadastrales
      const cadastreResults = await fetchCadastreData(selectedCommune, min, max);
      setSearchResults(cadastreResults);
      
      // Vérifier s'il y a des résultats et incrémenter le compteur si nécessaire
      const hasResults = cadastreResults.features.length > 0;
      
      if (hasResults && user && !profile?.is_pro) {
        await updateSearchCount();
        setSearchStep('Recherche terminée ! Récupération des adresses...');
      } else if (!hasResults) {
        setSearchStep('Aucun résultat trouvé - Cette recherche ne compte pas dans ta limite.');
      } else {
        setSearchStep('Recherche terminée ! Récupération des adresses...');
      }
      
      // Récupérer les adresses seulement si l'utilisateur est connecté et qu'il y a des résultats
      if (user && hasResults) {
        const addresses: AddressResult[] = [];
        for (let i = 0; i < cadastreResults.features.length; i++) {
          const feature = cadastreResults.features[i];
          setSearchStep(`Récupération de l'adresse ${i + 1}/${cadastreResults.features.length}...`);
          const address = await fetchAddress(feature.geometry.coordinates);
          addresses.push(address);
          await sleep(1000);
        }
        setAddressResults(addresses);
      } else if (!user && hasResults) {
        // Pour les utilisateurs non connectés, créer des adresses factices pour la démonstration
        const mockAddresses: AddressResult[] = [];
        for (let i = 0; i < cadastreResults.features.length; i++) {
          const feature = cadastreResults.features[i];
          const [lon, lat] = calculateCentroid(feature.geometry.coordinates);
          mockAddresses.push({
            house_number: '••',
            road: '•••••••••••••••••••',
            postcode: codePostal,
            village: '••••••••••••',
            county: '••••••••••••',
            coordinates: { lat, lng: lon }
          });
        }
        setAddressResults(mockAddresses);
      }
      
      setSearchStep('Recherche terminée !');
      
      // FORCER L'AFFICHAGE DE LA CARTE APRÈS LA RECHERCHE
      console.log('🎯 RECHERCHE TERMINÉE - AFFICHAGE DE LA CARTE');
      setForceMapRefresh(prev => prev + 1);
      
    } catch (error) {
      console.error('Error searching parcels:', error);
      setSearchError('Une erreur est survenue lors de la recherche');
    } finally {
      setIsSearching(false);
      setSearchStep('');
    }
  };

  const formatAddress = (address: AddressResult): string => {
    if (address.error) return 'Adresse non disponible';
    
    return [
      address.house_number,
      address.road,
      address.postcode,
      address.village,
      address.county
    ].filter(Boolean).join(', ');
  };

  const openInMaps = (address: AddressResult) => {
    if (!user) return; // Bloquer pour les utilisateurs non connectés
    
    if (!address.coordinates || isNaN(address.coordinates.lat) || isNaN(address.coordinates.lng)) {
      return;
    }
    
    const { lat, lng } = address.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Fonction pour ouvrir la parcelle dans geojson.io
  const openParcelInGeojson = (feature: CadastreFeature) => {
    if (!user) return; // Bloquer pour les utilisateurs non connectés
    
    const geojsonData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            nom: `Parcelle ${feature.properties.section}${feature.properties.numero}`,
            superficie: `${feature.properties.contenance}m²`,
            commune: feature.properties.commune,
            section: feature.properties.section,
            numero: feature.properties.numero
          },
          geometry: feature.geometry
        }
      ]
    };
    
    const jsonString = JSON.stringify(geojsonData);
    const encodedData = encodeURIComponent(jsonString);
    const geojsonUrl = `https://geojson.io/#data=data:application/json,${encodedData}`;
    
    window.open(geojsonUrl, '_blank');
  };

  const remainingSearches = useMemo(() => {
    if (!user || !profile) return 0;
    if (profile.is_pro) return '∞';
    return Math.max(0, SEARCH_LIMITS.FREE_SEARCHES_WITH_RESULTS - (profile.search_count || 0));
  }, [user, profile]);

  const onMarkerClick = useCallback((index: number) => {
    setSelectedMarker(selectedMarker === index ? null : index);
  }, [selectedMarker]);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Trouve l'<span className="gradient-text">adresse exacte</span> de la maison</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Tu as repéré une maison sur une annonce ? Saisis la <strong>superficie de la parcelle</strong> (terrain) 
                et le code postal pour obtenir l'adresse exacte. Explore ensuite l'environnement à distance.
              </p>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-xl mx-auto">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Astuce :</strong> La superficie de la parcelle est généralement indiquée dans l'annonce. 
                  Si elle n'est pas visible, appelle l\'agence qui te la fournira.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8">
                {user && !profile?.is_pro && (
                  <div className="p-4 bg-primary-500/10 border-b border-primary-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center mb-1">
                          <Info size={20} className="text-primary-500 mr-2" />
                          <span className="text-lg">
                            Il te reste {remainingSearches} recherches gratuites.
                          </span>
                        </div>
                        <span className="text-lg text-primary-500 font-medium">
                          Passe en Premium pour des recherches illimitées.
                        </span>
                      </div>
                      <Link to="/pricing">
                        <Button size="sm" variant="outline">
                          Passer en Premium
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSearch} className="p-6">
                  {searchError && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                      {searchError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Code postal
                      </label>
                      <Input
                        type="text"
                        placeholder="Ex: 75001"
                        value={codePostal}
                        onChange={(e) => setCodePostal(e.target.value)}
                        maxLength={5}
                        pattern="[0-9]*"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Commune
                      </label>
                      <select
                        className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        disabled={isLoadingCommunes || communes.length === 0}
                      >
                        <option value="">
                          {isLoadingCommunes 
                            ? 'Chargement des communes...' 
                            : communes.length === 0 
                              ? 'Saisis un code postal valide' 
                              : 'Sélectionne une commune'
                          }
                        </option>
                        {communes.map((commune) => (
                          <option key={commune.code} value={commune.code}>
                            {commune.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Type de recherche par superficie de parcelle
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex items-center justify-center ${
                          surfaceType === 'exact' 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                        }`}
                        onClick={() => setSurfaceType('exact')}
                      >
                        <Filter size={18} className="mr-2" />
                        Superficie exacte
                      </button>
                      <button
                        type="button"
                        className={`p-3 rounded-lg flex items-center justify-center ${
                          surfaceType === 'range' 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                        }`}
                        onClick={() => setSurfaceType('range')}
                      >
                        <Filter size={18} className="mr-2" />
                        Plage de superficie
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {surfaceType === 'exact' ? (
                      <motion.div
                        key="exact"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Superficie exacte de la parcelle (m²)
                          </label>
                          <Input
                            type="number"
                            placeholder="Ex: 800 (superficie du terrain)"
                            value={exactSurface}
                            onChange={(e) => setExactSurface(e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Il s'agit de la superficie du terrain (parcelle), pas de la maison
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="range"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Superficie minimale de la parcelle (m²)
                            </label>
                            <Input
                              type="number"
                              placeholder="Ex: 700"
                              value={minSurface}
                              onChange={(e) => setMinSurface(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Superficie maximale de la parcelle (m²)
                            </label>
                            <Input
                              type="number"
                              placeholder="Ex: 900"
                              value={maxSurface}
                              onChange={(e) => setMaxSurface(e.target.value)}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">
                          Il s'agit de la superficie du terrain (parcelle), pas de la maison
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isSearching}
                    icon={<Search size={18} />}
                    disabled={!selectedCommune || isLoadingCommunes || (user && !profile?.is_pro && (profile?.search_count || 0) >= SEARCH_LIMITS.FREE_SEARCHES_WITH_RESULTS)}
                  >
                    Rechercher l'adresse
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Loading message during search */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <Card>
                  <div className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <Loader2 size={48} className="text-primary-500 animate-spin" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary-500/20"></div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">Recherche en cours...</h3>
                      
                      <div className="bg-dark-700 rounded-lg p-4 mb-4 min-h-[60px] flex items-center justify-center">
                        <p className="text-primary-400 font-medium">
                          {searchStep || 'Préparation de la recherche...'}
                        </p>
                      </div>
                      
                      <div className="max-w-md text-center space-y-2">
                        <p className="text-gray-400">
                          Nous analysons les données cadastrales pour trouver les parcelles correspondant à tes critères.
                        </p>
                        <p className="text-sm text-gray-500">
                          Cette opération peut prendre quelques instants, merci de patienter...
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
            
            {hasSearched && searchResults && !isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <Card className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                          {searchResults.features.length} parcelle{searchResults.features.length > 1 ? 's' : ''} trouvée{searchResults.features.length > 1 ? 's' : ''}
                          {searchResults.totalFound && searchResults.totalFound > MAX_RESULTS && (
                            <span className="text-gray-400"> (sur {searchResults.totalFound} au total)</span>
                          )}
                        </h2>
                        {validAddressResults.length > 0 && (
                          <div className="text-sm text-gray-400">
                            {validAddressResults.length} adresse{validAddressResults.length > 1 ? 's' : ''} localisée{validAddressResults.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Message si aucun résultat trouvé */}
                      {searchResults.features.length === 0 && (
                        <div className="mb-6 bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-3 rounded-lg">
                          <div className="flex items-start">
                            <Info size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold mb-1">Aucune parcelle trouvée</h3>
                              <p className="text-sm">
                                {SEARCH_LIMITS.MESSAGES.NO_RESULTS_FOUND}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Warning message if results were limited */}
                      {searchResults.totalFound && searchResults.totalFound > MAX_RESULTS && (
                        <div className="mb-6 bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-4 py-3 rounded-lg">
                          <div className="flex items-start">
                            <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold mb-1">Trop de résultats trouvés</h3>
                              <p className="text-sm">
                                Nous avons trouvé {searchResults.totalFound} parcelles correspondant à tes critères, 
                                mais nous n'affichons que les {MAX_RESULTS} premières. 
                                Pour obtenir des résultats plus précis, réduis la plage de superficie.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message pour les utilisateurs non connectés */}
                      {!user && searchResults.features.length > 0 && (
                        <div className="mb-6 bg-primary-500/20 border border-primary-500 text-primary-300 px-4 py-3 rounded-lg">
                          <div className="flex items-start">
                            <Eye size={20} className="text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold mb-1">Aperçu des résultats</h3>
                              <p className="text-sm mb-3">
                                Nous avons trouvé {searchResults.features.length} parcelle{searchResults.features.length > 1 ? 's' : ''} correspondant à tes critères ! 
                                Les adresses sont floutées pour préserver la confidentialité.
                              </p>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Link to="/login">
                                  <Button size="sm" className="text-xs">
                                    Se connecter pour voir les adresses
                                  </Button>
                                </Link>
                                <Link to="/register">
                                  <Button size="sm" variant="outline" className="text-xs">
                                    Créer un compte gratuit
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Map Section */}
                      <div className="mb-6">
                        {mapError ? (
                          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg">
                            <div className="flex items-center">
                              <AlertTriangle size={20} className="text-red-500 mr-2" />
                              <div>
                                <h3 className="font-semibold">Erreur de carte</h3>
                                <p>{mapError}</p>
                              </div>
                            </div>
                          </div>
                        ) : !isMapLoaded ? (
                          <div className="flex items-center justify-center h-[500px] bg-dark-700 rounded-lg">
                            <div className="text-center">
                              <Loader2 size={32} className="text-primary-500 animate-spin mx-auto mb-4" />
                              <p className="text-gray-400">Chargement de Google Maps...</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Vérification de la clé API et initialisation...
                              </p>
                            </div>
                          </div>
                        ) : validAddressResults.length > 0 ? (
                          <div className="bg-dark-700 rounded-lg overflow-hidden relative">
                            <div className="p-4 bg-dark-600 border-b border-dark-500">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">
                                  {user ? 'Carte des adresses trouvées' : 'Aperçu de la localisation'}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {!user && (
                                    <div className="flex items-center text-xs text-gray-400">
                                      <EyeOff size={14} className="mr-1" />
                                      Adresses floutées
                                    </div>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setForceMapRefresh(prev => prev + 1)}
                                    icon={<Map size={16} />}
                                  >
                                    Actualiser la carte
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <div 
                                ref={mapRef}
                                style={{ width: '100%', height: '500px' }}
                                className="rounded-b-lg"
                              />
                              {!user && (
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] rounded-b-lg flex items-center justify-center">
                                  <div className="bg-dark-800/90 p-6 rounded-lg text-center border border-primary-500/30">
                                    <Lock size={32} className="text-primary-500 mx-auto mb-3" />
                                    <h3 className="font-semibold mb-2">Carte floutée</h3>
                                    <p className="text-sm text-gray-400 mb-4">
                                      Connectez-vous pour voir la carte en haute définition
                                    </p>
                                    <Link to="/login">
                                      <Button size="sm">Se connecter</Button>
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[200px] bg-dark-700 rounded-lg">
                            <div className="text-center">
                              <MapPin size={48} className="text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">Aucune adresse localisée pour afficher la carte</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Les adresses seront affichées dès qu'elles seront géolocalisées
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
{/* Address Results List */}
{addressResults.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-base sm:text-lg font-semibold mb-4">
      {user ? 'Liste des adresses trouvées' : 'Aperçu des adresses (floutées)'}
    </h3>
    {addressResults.map((address, index) => (
      <div
        key={index}
        className={`p-4 bg-dark-700 rounded-lg transition-colors duration-200 relative ${
          selectedMarker === index ? 'ring-2 ring-primary-500 bg-dark-600' : 'hover:bg-dark-600'
        } ${!user ? 'filter blur-[1px]' : ''}`}
      >
        {!user && (
          <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
            <div className="bg-dark-800/90 px-3 py-1 rounded text-xs text-gray-400 border border-gray-600">
              <Lock size={12} className="inline mr-1" />
              Connectez-vous pour voir
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-2">
          <div
            className="flex items-start flex-1 cursor-pointer overflow-hidden"
            onClick={() => {
              if (user && validAddressResults.some((_, i) => i === index)) {
                setSelectedMarker(selectedMarker === index ? null : index);
              }
            }}
          >
            <div className="flex items-center mr-3 mt-1 sm:mt-0">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                {index + 1}
              </div>
              <MapPin
                size={20}
                className={`flex-shrink-0 mt-0.5 ${
                  selectedMarker === index
                    ? 'text-primary-500'
                    : address.coordinates &&
                      !isNaN(address.coordinates.lat) &&
                      !isNaN(address.coordinates.lng)
                    ? 'text-green-400'
                    : 'text-gray-400'
                }`}
              />
            </div>
            <div className="flex-1 overflow-hidden break-words">
              {address.error ? (
                <p className="text-sm sm:text-base text-red-400">{address.error}</p>
              ) : (
                <p className="text-sm sm:text-base text-gray-300">
                  {formatAddress(address)}
                </p>
              )}
              {address.coordinates &&
                !isNaN(address.coordinates.lat) &&
                !isNaN(address.coordinates.lng) && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {user ? 'Localisée' : 'Position disponible'} •
                    {user
                      ? ` Coordonnées: ${address.coordinates.lat.toFixed(6)}, ${address.coordinates.lng.toFixed(6)}`
                      : ' Coordonnées masquées'}
                  </p>
                )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-4 mt-2 sm:mt-0 flex-shrink-0 justify-start sm:justify-end">
            {/* Bouton Ouvrir dans Maps */}
            {!address.error &&
              address.coordinates &&
              !isNaN(address.coordinates.lat) &&
              !isNaN(address.coordinates.lng) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (user ? openInMaps(address) : null)}
                  icon={user ? <ExternalLink size={16} /> : <Lock size={16} />}
                  disabled={!user}
                  className={!user ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {user ? 'Ouvrir dans Maps' : 'Maps'}
                </Button>
              )}

            {/* Bouton Voir parcelle */}
            {searchResults && searchResults.features[index] && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  user ? openParcelInGeojson(searchResults.features[index]) : null
                }
                icon={user ? <Map size={16} /> : <Lock size={16} />}
                disabled={!user}
                className={!user ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {user ? 'Voir parcelle' : 'Parcelle'}
              </Button>
            )}

            {/* Bouton Infos IA */}
            {!address.error && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  user ? setSelectedAddressForInfo(formatAddress(address)) : null
                }
                icon={user ? <Sparkles size={16} /> : <Lock size={16} />}
                disabled={!user}
                className={!user ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {user ? 'Infos IA' : 'IA'}
              </Button>
            )}
          </div>
        </div>
      </div>
    ))}
                          
                          {/* Call to action pour les utilisateurs non connectés */}
                          {!user && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg border border-primary-500/30">
                              <div className="text-center">
                                <h3 className="text-xl font-semibold mb-3">🔓 Débloquez toutes les fonctionnalités</h3>
                                <p className="text-gray-300 mb-4">
                                  Créez un compte gratuit pour accéder aux adresses exactes, à la carte interactive, 
                                  aux liens Google Maps et à toutes nos fonctionnalités premium.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                  <Link to="/register">
                                    <Button icon={<Eye size={18} />}>
                                      Créer un compte gratuit
                                    </Button>
                                  </Link>
                                  <Link to="/login">
                                    <Button variant="outline">
                                      J'ai déjà un compte
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Address Info Modal */}
      {selectedAddressForInfo && (
        <AddressInfoModal
          address={selectedAddressForInfo}
          onClose={() => setSelectedAddressForInfo(null)}
        />
      )}
    </>
  );
};

export default SearchPage;