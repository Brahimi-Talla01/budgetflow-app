import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import BudgetflowBranding from "../../components/auth/BudgetflowBranding"; 
import { AlertCircle } from "lucide-react";
import LoginForm, { type LoginFormDataType } from "../../components/auth/LoginForm"; 
import SecurityBadges from "../../components/auth/SecurityBadges"; 
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../../application/context/authContext";
import PageTitle from "../../components/ui/PageTitle";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { execute: doLogin, loading } = useLogin();
  const { login } = useAuth();

  const handleLogin = useCallback(async (data: Omit<LoginFormDataType, "rememberMe">) => {
    setError(null);

    const res = await doLogin({
      email: data.email,
      password: data.password,
    });

    if (res.success) {
      login(res.user);
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  }, [doLogin, login, navigate]);


  const handleForgotPassword = useCallback(() => {
    navigate("/forgot-password");
  }, [navigate]);


  return (
    <>
      <PageTitle title="Connexion" />
    
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
          <BudgetflowBranding />
          
            <h1 className="text-3xl font-bold text-center mt-6 text-gray-800">
              Connexion
            </h1>

            {/* Messages d'erreur */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <LoginForm 
                  onLogin={handleLogin}
                  onForgotPassword={handleForgotPassword}
                  isLoading={loading}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 font-caption">
                Nouveau chez BudgetFlow?{" "}
                <button 
                  type="button" 
                  onClick={() => navigate('/register')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  disabled={loading}
                >
                  Créer un compte
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

export default LoginPage;
