import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Shield, Cookie, Scale } from 'lucide-react';

interface LegalModalProps {
  type: string;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const getLegalContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'Conditions Générales d\'Utilisation',
          icon: <FileText size={24} className="text-primary-500" />,
          content: `
# Conditions Générales d'Utilisation

**Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}**

## 1. Objet

Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service GoAdresse, accessible à l'adresse [goadresse.fr], permettant aux utilisateurs de rechercher des adresses de propriétés immobilières.

## 2. Acceptation des conditions

En utilisant notre service, tu acceptes pleinement et sans réserve les présentes CGU. Si tu n'acceptes pas ces conditions, tu ne dois pas utiliser notre service.

## 3. Description du service

GoAdresse est un service qui permet de :
- Rechercher l'adresse exacte d'une propriété à partir de sa superficie et son code postal
- Visualiser les propriétés sur une carte interactive
- Obtenir des informations sur l'environnement des propriétés

## 4. Inscription et compte utilisateur

### 4.1 Création de compte
Pour accéder à certaines fonctionnalités, tu dois créer un compte en fournissant des informations exactes et à jour.

### 4.2 Responsabilité du compte
Tu es responsable de la confidentialité de tes identifiants et de toutes les activités effectuées sous ton compte.

## 5. Utilisation du service

### 5.1 Usage autorisé
Le service est destiné à un usage personnel et non commercial pour la recherche de biens immobiliers.

### 5.2 Interdictions
Il est interdit de :
- Utiliser le service à des fins illégales
- Tenter de contourner les mesures de sécurité
- Reproduire ou distribuer le contenu sans autorisation
- Utiliser des robots ou scripts automatisés

## 6. Abonnements et paiements

### 6.1 Formules
- Formule gratuite : 2 recherches par utilisateur
- Formule Premium : Recherches illimitées moyennant abonnement

### 6.2 Paiements
Les paiements sont traités de manière sécurisée via Stripe. Les abonnements sont renouvelés automatiquement.

### 6.3 Remboursements
Aucun remboursement n'est accordé sauf en cas de dysfonctionnement majeur du service.

## 7. Propriété intellectuelle

Tous les éléments du service (textes, images, logos, etc.) sont protégés par les droits de propriété intellectuelle et appartiennent à GoAdresse ou à ses partenaires.

## 8. Responsabilité

### 8.1 Limitation de responsabilité
GoAdresse ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du service.

### 8.2 Exactitude des données
Nous nous efforçons de fournir des informations exactes mais ne garantissons pas leur précision absolue.

## 9. Protection des données

Le traitement de tes données personnelles est régi par notre Politique de Confidentialité.

## 10. Modification des CGU

Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications prennent effet dès leur publication.

## 11. Résiliation

### 11.1 Par l'utilisateur
Tu peux résilier ton compte à tout moment depuis ton profil.

### 11.2 Par GoAdresse
Nous pouvons suspendre ou résilier ton compte en cas de violation des présentes CGU.

## 12. Droit applicable

Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.

## 13. Contact

Pour toute question concernant ces CGU, contacte-nous à : contact@goadresse.fr
          `
        };

      case 'privacy':
        return {
          title: 'Politique de Confidentialité',
          icon: <Shield size={24} className="text-green-500" />,
          content: `
# Politique de Confidentialité

**Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}**

## 1. Introduction

GoAdresse s'engage à protéger ta vie privée et tes données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons tes informations.

## 2. Responsable du traitement

**GoAdresse**
Site web : goadresse.fr
Email : contact@goadresse.fr

## 3. Données collectées

### 3.1 Données d'inscription
- Adresse email
- Mot de passe (chiffré)
- Date de création du compte

### 3.2 Données d'utilisation
- Historique des recherches
- Adresses IP
- Données de navigation
- Informations sur l'appareil utilisé

### 3.3 Données de paiement
- Informations de facturation (traitées par Stripe)
- Historique des transactions

## 4. Finalités du traitement

Nous utilisons tes données pour :
- Fournir et améliorer notre service
- Gérer ton compte et tes abonnements
- Assurer la sécurité de la plateforme
- Respecter nos obligations légales
- Te contacter concernant ton compte

## 5. Base légale

Le traitement de tes données repose sur :
- Ton consentement
- L'exécution du contrat de service
- Nos intérêts légitimes
- Le respect d'obligations légales

## 6. Partage des données

### 6.1 Partenaires techniques
- Supabase (hébergement des données)
- Stripe (traitement des paiements)
- Google Maps (services de cartographie)

### 6.2 Aucune vente
Nous ne vendons jamais tes données personnelles à des tiers.

## 7. Transferts internationaux

Certains de nos prestataires peuvent être situés hors de l'Union Européenne. Nous nous assurons que des garanties appropriées sont en place.

## 8. Durée de conservation

- Données de compte : Tant que ton compte est actif
- Données de paiement : 10 ans (obligation légale)
- Données de navigation : 13 mois maximum

## 9. Tes droits

Conformément au RGPD, tu disposes des droits suivants :

### 9.1 Droit d'accès
Tu peux demander l'accès à tes données personnelles.

### 9.2 Droit de rectification
Tu peux corriger tes données inexactes.

### 9.3 Droit à l'effacement
Tu peux demander la suppression de tes données.

### 9.4 Droit à la portabilité
Tu peux récupérer tes données dans un format structuré.

### 9.5 Droit d'opposition
Tu peux t'opposer au traitement de tes données.

### 9.6 Droit à la limitation
Tu peux demander la limitation du traitement.

## 10. Exercice de tes droits

Pour exercer tes droits, contacte-nous à : contact@goadresse.fr

Nous répondrons dans un délai d'un mois maximum.

## 11. Sécurité

Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger tes données :
- Chiffrement des données sensibles
- Accès restreint aux données
- Surveillance des accès
- Sauvegardes régulières

## 12. Cookies

Consulte notre politique de cookies pour plus d'informations sur l'utilisation des cookies.

## 13. Modifications

Cette politique peut être modifiée. Nous t'informerons des changements importants.

## 14. Contact

Pour toute question sur cette politique : contact@goadresse.fr

## 15. Réclamations

Tu peux déposer une réclamation auprès de la CNIL : www.cnil.fr
          `
        };

      case 'legal':
        return {
          title: 'Mentions Légales',
          icon: <Scale size={24} className="text-blue-500" />,
          content: `
# Mentions Légales

**Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}**

## 1. Éditeur du site

**Nom du service :** GoAdresse
**Site web :** goadresse.fr
**Email :** contact@goadresse.fr

## 2. Hébergement

**Hébergeur :** Supabase Inc.
**Adresse :** 970 Toa Payoh North #07-04, Singapore 318992
**Site web :** supabase.com

## 3. Directeur de publication

Le directeur de publication est le responsable éditorial du service GoAdresse.

## 4. Propriété intellectuelle

### 4.1 Contenu du site
L'ensemble du contenu du site GoAdresse (textes, images, vidéos, logos, icônes, etc.) est protégé par les droits de propriété intellectuelle.

### 4.2 Marques
GoAdresse est une marque déposée. Toute reproduction non autorisée est interdite.

### 4.3 Données cartographiques
Les cartes sont fournies par Google Maps sous licence.

### 4.4 Données cadastrales
Les données cadastrales proviennent de sources publiques françaises.

## 5. Utilisation du site

### 5.1 Accès
L'accès au site est gratuit. Certaines fonctionnalités nécessitent un abonnement.

### 5.2 Disponibilité
Nous nous efforçons d'assurer une disponibilité maximale du service, sans pouvoir la garantir.

## 6. Responsabilité

### 6.1 Contenu
GoAdresse s'efforce de fournir des informations exactes mais ne peut garantir leur précision absolue.

### 6.2 Liens externes
Le site peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables de leur contenu.

### 6.3 Utilisation
L'utilisateur est seul responsable de l'utilisation qu'il fait du service.

## 7. Données personnelles

Le traitement des données personnelles est régi par notre Politique de Confidentialité.

## 8. Cookies

L'utilisation de cookies est détaillée dans notre politique de cookies.

## 9. Droit applicable

Le site GoAdresse est soumis au droit français.

## 10. Litiges

### 10.1 Médiation
En cas de litige, nous privilégions la résolution amiable.

### 10.2 Juridiction
À défaut d'accord amiable, les tribunaux de Paris sont compétents.

## 11. Signalement

Pour signaler un contenu inapproprié : contact@goadresse.fr

## 12. Accessibilité

Nous nous efforçons de rendre notre service accessible à tous les utilisateurs.

## 13. Contact

Pour toute question concernant ces mentions légales :
**Email :** contact@goadresse.fr

## 14. Modifications

Ces mentions légales peuvent être modifiées à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.
          `
        };

      case 'cookies':
        return {
          title: 'Politique de Cookies',
          icon: <Cookie size={24} className="text-orange-500" />,
          content: `
# Politique de Cookies

**Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}**

## 1. Qu'est-ce qu'un cookie ?

Un cookie est un petit fichier texte stocké sur ton appareil lors de ta visite sur notre site. Il permet de mémoriser tes préférences et d'améliorer ton expérience.

## 2. Types de cookies utilisés

### 2.1 Cookies essentiels
Ces cookies sont nécessaires au fonctionnement du site :
- **Session utilisateur** : Maintien de ta connexion
- **Sécurité** : Protection contre les attaques
- **Préférences** : Sauvegarde de tes paramètres

**Durée :** Session ou jusqu'à déconnexion

### 2.2 Cookies de performance
Ces cookies nous aident à améliorer notre service :
- **Analytiques** : Mesure de l'audience et du comportement
- **Erreurs** : Détection et correction des problèmes
- **Performance** : Optimisation de la vitesse

**Durée :** 13 mois maximum

### 2.3 Cookies de fonctionnalité
Ces cookies améliorent ton expérience :
- **Préférences d'affichage** : Thème, langue
- **Géolocalisation** : Amélioration des recherches
- **Historique** : Sauvegarde de tes recherches récentes

**Durée :** 12 mois maximum

## 3. Cookies tiers

### 3.1 Google Maps
- **Finalité** : Affichage des cartes interactives
- **Données** : Localisation, interactions avec la carte
- **Politique** : policies.google.com/privacy

### 3.2 Stripe
- **Finalité** : Traitement sécurisé des paiements
- **Données** : Informations de transaction
- **Politique** : stripe.com/privacy

### 3.3 Supabase
- **Finalité** : Authentification et stockage des données
- **Données** : Identifiants de session
- **Politique** : supabase.com/privacy

## 4. Gestion des cookies

### 4.1 Paramètres du navigateur
Tu peux configurer ton navigateur pour :
- Accepter tous les cookies
- Refuser tous les cookies
- Être notifié avant l'installation
- Supprimer les cookies existants

### 4.2 Instructions par navigateur

**Chrome :**
1. Menu > Paramètres > Confidentialité et sécurité > Cookies

**Firefox :**
1. Menu > Options > Vie privée et sécurité > Cookies

**Safari :**
1. Préférences > Confidentialité > Cookies

**Edge :**
1. Menu > Paramètres > Cookies et autorisations de site

### 4.3 Outils de gestion
Tu peux également utiliser des outils tiers pour gérer les cookies.

## 5. Conséquences du refus

### 5.1 Cookies essentiels
Le refus peut empêcher le bon fonctionnement du site.

### 5.2 Autres cookies
Le refus peut limiter certaines fonctionnalités mais n'empêche pas l'utilisation de base.

## 6. Cookies et données personnelles

Certains cookies peuvent contenir des données personnelles. Leur traitement est régi par notre Politique de Confidentialité.

## 7. Durée de conservation

Les cookies sont automatiquement supprimés à l'expiration de leur durée de vie ou lors de la suppression manuelle.

## 8. Sécurité

Nous utilisons des cookies sécurisés (HTTPS) et des mesures de protection appropriées.

## 9. Mise à jour

Cette politique peut être mise à jour. Nous t'informerons des changements significatifs.

## 10. Tes droits

Tu disposes des mêmes droits que pour tes données personnelles (accès, rectification, suppression, etc.).

## 11. Contact

Pour toute question sur les cookies :
**Email :** contact@goadresse.fr

## 12. Plus d'informations

- Commission Nationale de l'Informatique et des Libertés (CNIL) : www.cnil.fr
- Your Online Choices : www.youronlinechoices.eu
          `
        };

      default:
        return {
          title: 'Document légal',
          icon: <FileText size={24} className="text-gray-500" />,
          content: 'Contenu non disponible.'
        };
    }
  };

  const { title, icon, content } = getLegalContent();

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Titres avec #
      if (trimmedLine.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-primary-300 mt-8 mb-6 first:mt-0">
            {trimmedLine.replace('# ', '')}
          </h1>
        );
      }
      
      // Titres avec ##
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold text-primary-400 mt-6 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      }
      
      // Titres avec ###
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-medium text-primary-500 mt-4 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      
      // Texte en gras avec **
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <p key={index} className="font-semibold text-gray-200 mb-3">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }
      
      // Listes avec -
      if (trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-300 list-disc">
            {trimmedLine.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </li>
        );
      }
      
      // Lignes vides
      if (trimmedLine === '') {
        return <div key={index} className="h-3" />;
      }
      
      // Paragraphes normaux
      return (
        <p key={index} className="mb-3 text-gray-300 leading-relaxed">
          <span dangerouslySetInnerHTML={{ 
            __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
          }} />
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-dark-700 shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-700 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500/20 rounded-lg mr-3">
              {icon}
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-invert max-w-none">
            {formatContent(content)}
          </div>

          <div className="mt-8 pt-6 border-t border-dark-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalModal;