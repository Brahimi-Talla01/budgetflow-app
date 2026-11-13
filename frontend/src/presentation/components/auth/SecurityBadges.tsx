import { ShieldCheck, Lock, type LucideIcon } from "lucide-react"; 

interface Badge {
    id: number;
    icon: LucideIcon; 
    title: string;
    description: string;
}

const SecurityBadges = () => {
      const badges: Badge[] = [
            {
                  id: 1,
                  icon: ShieldCheck, 
                  title: 'Sécurité',
                  description: 'Vos données sont chiffrées selon les standards bancaires (AES-256).'
            },
            {
                  id: 2,
                  icon: Lock,
                  title: 'Connexion 256-bit SSL',
                  description: 'Toutes les communications sont protégées par chiffrement SSL/TLS.'
            }
      ];

      return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {badges.map((badge) => {
                  
                        const IconComponent = badge.icon;

                        return (
                              <div
                                    key={badge.id}
                                    className="flex items-center space-x-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
                              >
                                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                                          <IconComponent className="text-green-500 w-4 h-4" /> 
                                    </div>
                                    <div className="min-w-0">
                                          <p className="text-sm font-medium text-gray-800">
                                                {badge.title}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                                {badge.description}
                                          </p>
                                    </div>
                              </div>
                        );
                  })}
            </div>
      );
};

export default SecurityBadges;