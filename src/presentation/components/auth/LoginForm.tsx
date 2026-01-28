import React, { useState, useCallback } from 'react';
import Input from '../ui/Input'; 
import { Eye, EyeOff } from 'lucide-react'; 
import { Checkbox } from '../ui/Checkbox'; 
import { Button } from '../ui/Button'; 

export type LoginFormDataType = {
  email: string; 
  password: string;
  rememberMe: boolean;
};

interface LoginFormProps {
  onLogin: (data: Omit<LoginFormDataType, 'rememberMe'>) => void; 
  onForgotPassword: () => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword, isLoading }) => {
  const [formData, setFormData] = useState<LoginFormDataType>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  // Utilisation de useCallback pour optimiser la fonction de changement d'état
  const handleInputChange = useCallback((field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && validateForm()) {
      onLogin({ email: formData.email, password: formData.password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Champ Email  */}
        <Input
          label="Email"
          type="email"
          placeholder="Entrez votre email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          disabled={isLoading}
        />

        {/* Champ Mot de passe avec icône Eye */}
        <div className="relative">
          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
            disabled={isLoading}
            className="w-full pr-10" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 mt-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Checkbox "Se souvenir de moi" */}
        <Checkbox
          label="Se souvenir de moi"
          checked={formData.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e.target.checked)} 
          disabled={isLoading}
          className="cursor-pointer"
        />

        {/* Lien Mot de passe oublié */}
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-lg font-medium text-primary hover:text-primary/90 transition-colors cursor-pointer"
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
      </div>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        variant="primary" 
        size="md"
        fullWidth 
        loading={isLoading}
        disabled={isLoading}
      >
        Se connecter
      </Button>
    </form>
  );

}

export default LoginForm;