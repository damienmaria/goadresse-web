import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Link, 
  Check,
  MessageCircle,
  X
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  url, 
  title, 
  description, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description)
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Email',
      icon: <Mail size={20} />,
      url: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleNativeShare = async () => {
    // Check if we're on localhost - if so, skip native share and use custom modal
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (navigator.share && !isLocalhost) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        setIsOpen(false);
      } catch (error) {
        // Fallback to custom share modal when native share fails
        setIsOpen(true);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        aria-label="Partager l'article"
      >
        <Share2 size={16} className="mr-2" />
        Partager
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-full right-0 mt-2 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 p-6 z-50 w-64"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Partager</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Social Platforms - Icons only */}
              <div className="grid grid-cols-3 gap-4 justify-items-center mb-6">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-all hover:scale-110 ${platform.color}`}
                    title={platform.name}
                  >
                    {platform.icon}
                  </button>
                ))}
              </div>

              {/* Copy Link */}
              <div className="border-t border-dark-700 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-dark-700 rounded-lg px-3 py-2 text-sm text-gray-300 truncate">
                    {url}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                    title={copied ? 'Copié !' : 'Copier le lien'}
                  >
                    {copied ? (
                      <Check size={16} />
                    ) : (
                      <Link size={16} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;