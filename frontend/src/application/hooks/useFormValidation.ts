import { useState, useCallback } from 'react';
import type { CreateExpenseProps, ExpenseFormProps } from '../../domain/entities/Expense';

type FormErrors = Partial<Record<keyof ExpenseFormProps, string>>;

const initialFormData: ExpenseFormProps = {
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    projectId: null,
    hasProject: false,
};

export const useFormValidation = (initialData: Partial<ExpenseFormProps> = {}) => {
    
    // 1. État du formulaire et des erreurs
    const [formData, setFormData] = useState<ExpenseFormProps>({
        ...initialFormData,
        ...initialData,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // 2. Mise à jour générique de n'importe quel champ
    const handleChange = useCallback((
        name: keyof ExpenseFormProps,
        value: ExpenseFormProps[keyof ExpenseFormProps]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Effacer l'erreur lors de la modification
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]);

    // 3. Logique de Validation de la Présentation
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // A. Validation du Montant (UI/string checks)
        const amountValue = parseFloat(formData.amount);
        if (!formData.amount || isNaN(amountValue) || amountValue <= 0) {
            newErrors.amount = 'Le montant doit être un nombre positif (supérieur à 0)';
        }

        // B. Validation de la Catégorie
        if (!formData.category) {
            newErrors.category = 'Veuillez sélectionner une catégorie';
        }

        // C. Validation de la Description (longueur)
        if (formData.description && formData.description.length > 255) {
            newErrors.description = 'Maximum 255 caractères';
        }

        // D. Validation du Projet (logique conditionnelle de l'UI)
        if (formData.hasProject && (!formData.projectId || formData.projectId === null)) {
            newErrors.projectId = 'Veuillez sélectionner un projet si l\'option est cochée';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // 4. Préparation des données pour la soumission.
    // La validation est déclenchée à l'appel (et non pendant le rendu via useMemo) :
    // cela évite un setState en phase de rendu, qui pouvait boucler à l'infini.
    const getSubmitData = useCallback((): Omit<CreateExpenseProps, 'userId'> | null => {
        if (!validateForm()) {
            return null;
        }

        const numericAmount = parseFloat(formData.amount);

        const projectId = formData.hasProject && formData.projectId ? formData.projectId : undefined;

        return {
            amount: numericAmount,
            category: formData.category,
            description: formData.description || undefined,
            date: formData.date,
            projectId: projectId,
        };
    }, [formData, validateForm]);
    
    // 5. Nettoyage
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setErrors({});
    }, []);


    return {
        formData,
        errors,
        handleChange,
        validateForm,
        getSubmitData,
        resetForm,
        setFormData, 
    };
};