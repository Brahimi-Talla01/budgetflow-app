import { Button } from '../ui/Button';
import { TrendingUp, AlertCircle, CheckCircle, DollarSign, Calendar, CreditCard } from 'lucide-react';

interface NotificationComponentProps {
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const notifications = [
  { 
    id: 1, 
    title: 'Dépense importante détectée', 
    message: 'Achat de 450€ chez Supermarché Casino', 
    time: '5 min', 
    type: 'warning',
    amount: '-450.00€',
    icon: 'alert'
  },
  { 
    id: 2, 
    title: 'Budget mensuel atteint', 
    message: 'Vous avez dépensé 85% de votre budget alimentation', 
    time: '1h', 
    type: 'info',
    amount: '850€ / 1000€',
    icon: 'trending'
  },
  { 
    id: 3, 
    title: 'Paiement reçu', 
    message: 'Remboursement Netflix - Compte Partagé', 
    time: '2h', 
    type: 'success',
    amount: '+12.99€',
    icon: 'success'
  }
];

const NotificationComponent: React.FC<NotificationComponentProps> = ({ setIsNotificationOpen }) => {

      const getIcon = (iconType: string) => {
            const iconClass = "w-5 h-5";
            switch(iconType) {
                  case 'alert': return <AlertCircle className={iconClass} />;
                  case 'success': return <CheckCircle className={iconClass} />;
                  case 'trending': return <TrendingUp className={iconClass} />;
                  case 'calendar': return <Calendar className={iconClass} />;
                  case 'card': return <CreditCard className={iconClass} />;
                  default: return <DollarSign className={iconClass} />;
            }
      };

      const getTypeStyles = (type: string) => {
            switch(type) {
                  case 'success': 
                        return 'bg-green-50 text-green-600 dark:text-green-400 border-green-200';
                  case 'warning': 
                        return 'bg-orange-50 text-orange-600 dark:text-orange-400 border-orange-200';
                  case 'error': 
                        return 'bg-red-50 text-red-600 dark:text-red-400 border-red-200';
                  default: 
                        return 'bg-blue-50  text-blue-600 dark:text-blue-400 border-blue-200';
            }
      };

      const getAmountColor = (amount: string) => {
            if (amount.startsWith('+')) return 'text-green-600 dark:text-green-400';
            if (amount.startsWith('-')) return 'text-red-600 dark:text-red-400';
            return 'text-gray-600 dark:text-gray-400';
      };

      return (
            <>
                  {/* Overlay */}
                  <div 
                        className="fixed inset-0 z-40 bg-black/5"
                        onClick={() => setIsNotificationOpen(false)}
                  />
                  
                  {/* Conteneur des notifications */}
                  <div className="absolute top-12 mt-0 w-[380px] -translate-x-full md:left-auto md:right-10 md:translate-x-0 bg-white border border-gray-200  rounded-xl shadow-2xl z-1000 animate-in slide-in-from-top-2 fade-in-0 duration-300">
                  
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 ">
                              <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-dark ">
                                          Notifications
                                    </h3>
                                    <span className="bg-primary-flow text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                                          {notifications.length} nouvelles
                                    </span>
                              </div>
                        </div>

                        {/* Liste des notifications */}
                        <div className="max-h-[420px] overflow-y-auto">
                              {notifications.map((notification) => (
                                    <div 
                                          key={notification.id} 
                                          className="p-4 border-b border-gray-100  last:border-b-0 hover:bg-gray-50  transition-all duration-200 cursor-pointer group"
                                    >
                                          <div className="flex gap-3">
                                                {/* Icône */}
                                                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${getTypeStyles(notification.type)}`}>
                                                      {getIcon(notification.icon)}
                                                </div>

                                                {/* Contenu */}
                                                <div className="flex-1 min-w-0">
                                                      <div className="flex items-start justify-between gap-2">
                                                            <p className="font-semibold text-sm text-dark  line-clamp-1 group-hover:text-primary transition-colors">
                                                                  {notification.title}
                                                            </p>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                  {notification.time}
                                                            </span>
                                                      </div>
                                                      
                                                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                            {notification.message}
                                                      </p>

                                                      {/* Montant */}
                                                      {notification.amount && (
                                                            <div className="mt-2 flex items-center gap-2">
                                                                  <span className={`text-sm font-bold ${getAmountColor(notification.amount)}`}>
                                                                        {notification.amount}
                                                                  </span>
                                                            </div>
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-200 bg-gray-50 ">
                              <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    fullWidth 
                                    className="text-primary hover:bg-blue-50 font-medium"
                                    onClick={() => {
                                          setIsNotificationOpen(false);
                                    }}
                              >
                                    Voir toutes les notifications
                              </Button>
                        </div>
                  </div>
            </>
      );
};

export default NotificationComponent;