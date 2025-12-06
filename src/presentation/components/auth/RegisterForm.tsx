import React, { useState, useCallback } from 'react';
import Input from '../ui/Input'; 
import { Eye, EyeOff } from 'lucide-react'; 
import { Button } from '../ui/Button'; 

// Schéma de données basé sur UserCreateSchema du backend
export type RegisterFormDataType = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

// RoleId est hardcodé pour l'utilisateur standard (ex: 2)
const USER_ROLE_ID = 2; 

interface RegisterFormProps {
  // Le composant envoie toutes les données du formulaire + le roleId au conteneur parent
  onRegister: (data: RegisterFormDataType & { roleId: number }) => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, isLoading }) => {
  const [formData, setFormData] = useState<RegisterFormDataType>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    
    // --- Validation basée sur UserCreateSchema ---
    
    // Règle: firstname (Min 2, Max 20)
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Le prénom est requis';
    } else if (formData.firstname.length < 2 || formData.firstname.length > 20) {
      newErrors.firstname = 'Le prénom doit contenir entre 2 et 20 caractères';
    }
    
    // Règle: lastname (Min 2, Max 20)
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Le nom est requis';
    } else if (formData.lastname.length < 2 || formData.lastname.length > 20) {
      newErrors.lastname = 'Le nom doit contenir entre 2 et 20 caractères';
    }

    // Règle: email (Requis, format valide)
    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Règle: password (Min 6)
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && validateForm()) {
      // Construction du payload incluant le roleId hardcodé
      const payload = {
        ...formData,
        roleId: USER_ROLE_ID,
      };
      onRegister(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champ Prénom */}
        <Input
          label="Prénom"
          type="text"
          placeholder="John"
          value={formData.firstname}
          onChange={(e) => handleInputChange('firstname', e.target.value)}
          error={errors.firstname}
          required
          disabled={isLoading}
        />
        
        {/* Champ Nom */}
        <Input
          label="Nom"
          type="text"
          placeholder="Doe"
          value={formData.lastname}
          onChange={(e) => handleInputChange('lastname', e.target.value)}
          error={errors.lastname}
          required
          disabled={isLoading}
        />
      </div>

      {/* Champ Email */}
      <Input
        label="Email"
        type="email"
        placeholder="votre.email@exemple.com"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        required
        disabled={isLoading}
      />

      {/* Champ Mot de passe avec icône Eye */}
      <div className="relative">
        <Input
          label="Mot de passe (min. 6 caractères)"
          type={showPassword ? 'text' : 'password'}
          placeholder="Créez votre mot de passe"
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
          className="absolute right-3 mt-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          disabled={isLoading}
        >
          {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
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
        Créer un compte
      </Button>
      
      <p className="text-sm text-gray-500 text-center pt-2">
        En vous inscrivant, vous acceptez nos conditions d'utilisation.
      </p>
    </form>
  );
}

export default RegisterForm;