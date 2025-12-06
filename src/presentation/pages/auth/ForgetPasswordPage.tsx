import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import BudgetflowBranding from "../../components/auth/BudgetflowBranding"; 
import SecurityBadges from "../../components/auth/SecurityBadges"; 
import Input from "../../components/ui/Input"; 
import { Button } from "../../components/ui/Button"; 
import { AlertCircle, ArrowLeft, Send } from "lucide-react";


const ForgetPasswordPage = () => {
    const navigate: NavigateFunction = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (e: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    };

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!validateEmail(email)) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }

        setIsLoading(true);
        console.log('Demande de réinitialisation pour:', email);

        // Simuler un appel API POST /forgot-password
        setTimeout(() => {
            setIsLoading(false);
            if (email === 'notfound@example.com') {
                setError("Aucun utilisateur trouvé avec cette adresse email.");
            } else {
                setSuccessMessage("Un lien de réinitialisation a été envoyé à votre adresse email.");
            }
        }, 2000);
    }, [email]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
                    <BudgetflowBranding />
                    
                    <h1 className="text-3xl font-bold text-center mt-6 text-gray-800">
                        Mot de passe oublié
                    </h1>
                    
                    <p className="text-center text-gray-600 mt-2 mb-8">
                        Entrez votre adresse email pour recevoir le lien de réinitialisation.
                    </p>

                    {/* Afficher les messages d'erreur/succès */}
                    {(error || successMessage) && (
                        <div className="mt-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4 flex items-center space-x-2">
                                    <Send className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{successMessage}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Formulaire de réinitialisation */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="votre.email@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={error}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            variant="primary" 
                            size="md"
                            fullWidth 
                            loading={isLoading}
                            disabled={isLoading || successMessage.length > 0} // Désactiver après succès
                        >
                            Envoyer le lien de réinitialisation
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <Button
                            onClick={() => navigate('/login')}
                            variant="ghost"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                            disabled={isLoading}
                        >
                              <div className="flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> 
                                    <span>Retour à la connexion</span>
                              </div>
                        </Button>
                    </div>
                    
                    <SecurityBadges />

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-muted-foreground font-caption">
                            © {new Date().getFullYear()} BudgetFlow. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;