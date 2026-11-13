import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import BudgetflowBranding from "../../components/auth/BudgetflowBranding"; 
import { AlertCircle } from "lucide-react";
import RegisterForm, { type RegisterFormDataType } from "../../components/auth/RegisterForm"; 
import SecurityBadges from "../../components/auth/SecurityBadges"; 
import { useRegister } from "../../hooks/useRegister";
import PageTitle from "../../components/ui/PageTitle";

const RegisterPage = () => {

  const { execute: doRegister, loading } = useRegister();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = useCallback(async (data: RegisterFormDataType & { roleId: number }) => {
    setError(null); 
    try {
      const res = await doRegister(data);

      if (res?.success) {
        setError(null);

        navigate('/login', { state: { success: 'Compte créé avec succès !' } });
        return;
      }

      setError(res.message || "Une erreur est survenue.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de l'inscription.");
    }
  }, [doRegister, navigate]);


  return (
    <>
      <PageTitle title="Inscription" />
    
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            <BudgetflowBranding />
          
            <h1 className="text-3xl font-bold text-center mt-6 text-gray-800">
              Créer un compte
            </h1>

            {/* Afficher les messages d'erreur */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <RegisterForm 
                onRegister={handleRegister}
                isLoading={loading} 
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 font-caption">
                Vous avez déjà un compte? {' '}
                <button 
                  type="button" 
                  onClick={() => navigate('/login')} // Navigation vers /login
                  className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  disabled={loading}
                >
                  Se connecter
                </button>
              </p>
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
    </>
  );
};

export default RegisterPage;