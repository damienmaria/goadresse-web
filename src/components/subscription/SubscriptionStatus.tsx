import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import LoadingSpinner from '../common/LoadingSpinner';

const SubscriptionStatus: React.FC = () => {
  const { subscription, loading, error } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-gray-400">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <XCircle size={20} className="text-red-500 mr-2" />
        <span className="text-red-400">Erreur lors du chargement</span>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="flex items-center p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
        <AlertTriangle size={20} className="text-gray-500 mr-2" />
        <span className="text-gray-400">Aucun abonnement actif</span>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'canceled':
        return <XCircle size={20} className="text-red-500" />;
      case 'past_due':
        return <Clock size={20} className="text-yellow-500" />;
      default:
        return <AlertTriangle size={20} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'canceled':
        return 'Annulé';
      case 'past_due':
        return 'En retard';
      case 'incomplete':
        return 'Incomplet';
      case 'trialing':
        return 'Période d\'essai';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'canceled':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'past_due':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${getStatusColor(subscription.subscription_status || '')}`}>
      <div className="flex items-center">
        {getStatusIcon(subscription.subscription_status || '')}
        <div className="ml-3">
          <div className="font-medium">
            {STRIPE_PRODUCTS.abonnementIllimite.name}
          </div>
          <div className="text-sm opacity-75">
            {getStatusText(subscription.subscription_status || '')}
          </div>
        </div>
      </div>
      
      {subscription.current_period_end && (
        <div className="text-right text-sm">
          <div>Prochaine échéance</div>
          <div className="opacity-75">
            {new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;