import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import LegalModal from '../common/LegalModal';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedLegal, setSelectedLegal] = useState<string | null>(null);
  
  const handleLegalClick = (type: string) => {
    setSelectedLegal(type);
  };

  return (
    <>
      <footer className="bg-dark-900 border-t border-dark-700 pt-16 pb-8" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">GoAdresse</h3>
              <p className="text-gray-400 mb-6">
                Trouve l'adresse exacte d'une maison grâce à sa superficie et son code postal. 
                Explore l'environnement à distance et achète directement avec les propriétaires.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label="Suivez-nous sur Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Mentions légales</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleLegalClick('terms')}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-left"
                  >
                    Conditions générales d'utilisation
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLegalClick('privacy')}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-left"
                  >
                    Politique de confidentialité
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLegalClick('legal')}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-left"
                  >
                    Mentions légales
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLegalClick('cookies')}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-left"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="flex items-center">
                <Mail size={18} className="text-primary-500 mr-3 flex-shrink-0" />
                <a 
                  href="mailto:contact@goadresse.fr"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  contact@goadresse.fr
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-700 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              &copy; {currentYear} GoAdresse. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {selectedLegal && (
        <LegalModal
          type={selectedLegal}
          onClose={() => setSelectedLegal(null)}
        />
      )}
    </>
  );
};

export default Footer;