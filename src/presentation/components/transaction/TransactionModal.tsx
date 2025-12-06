import { useCallback, useMemo, useState } from "react";
import { useFormValidation } from "../../../application/hooks/useFormValidation";
import { AlertCircle, Briefcase, Calendar, DollarSign, FileText, Tag, TrendingDown, TrendingUp, X } from "lucide-react";

type TransactionType = 'expense' | 'income';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any, type: TransactionType) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    
    const [transactionType, setTransactionType] = useState<TransactionType>('expense');

    const { 
        formData, 
        errors, 
        handleChange, 
        validateForm, 
        resetForm,
    } = useFormValidation(); 

    // Données fixes (Catégories et Projets)
    const expenseCategories = ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres'];
    const incomeCategories = ['Salaire', 'Freelance', 'Investissement', 'Remboursement', 'Autres'];
    const projects = [
        { id: '1', name: 'Site E-commerce' },
        { id: '2', name: 'Application Mobile' },
        { id: '3', name: 'Refonte Website' }
    ];

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            
            const submitData = {
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description || undefined,
                date: formData.date.toISOString().split('T')[0], 
                projectId: formData.hasProject && formData.projectId ? formData.projectId : undefined,
                type: transactionType,
            };

            onSubmit(submitData, transactionType);
            
            handleClose();
        }
    }, [formData, validateForm, transactionType, onSubmit, handleClose]);

    const dateInputString = useMemo(() => {
        return formData.date.toISOString().split('T')[0];
    }, [formData.date]);

    if (!isOpen) return null;
    
    const handleProjectToggle = () => {
        handleChange('hasProject', !formData.hasProject);
        if (formData.hasProject) {
            handleChange('projectId', null);
        }
    };

    const ACTIVE_CLASS = 'border-primary bg-primary-30 shadow-lg ring-4 ring-primary-flow';
    const INACTIVE_HOVER_CLASS = 'border-gray-200 hover:border-primary-30';
    const ACTIVE_TEXT_CLASS = 'text-primary';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 transform transition-all duration-300 scale-100 opacity-100">
                
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Nouvelle Transaction
                    </h2>
                    <button 
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    
                    {/* Toggle Type */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Type de transaction
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Dépense */}
                            <button
                                type="button"
                                onClick={() => setTransactionType('expense')}
                                className={`
                                    relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                    ${transactionType === 'expense'
                                        ? ACTIVE_CLASS
                                        : INACTIVE_HOVER_CLASS
                                    }
                                `}
                            >
                                <TrendingDown className={`w-6 h-6 ${transactionType === 'expense' ? ACTIVE_TEXT_CLASS : 'text-gray-400'}`} />
                                <span className={`font-semibold ${transactionType === 'expense' ? ACTIVE_TEXT_CLASS : 'text-gray-600'}`}>
                                    Dépense
                                </span>
                            </button>

                            {/* Revenu */}
                            <button
                                type="button"
                                onClick={() => setTransactionType('income')}
                                className={`
                                    relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                    ${transactionType === 'income'
                                        ? ACTIVE_CLASS
                                        : INACTIVE_HOVER_CLASS
                                    }
                                `}
                            >
                                <TrendingUp className={`w-6 h-6 ${transactionType === 'income' ? ACTIVE_TEXT_CLASS : 'text-gray-400'}`} />
                                <span className={`font-semibold ${transactionType === 'income' ? ACTIVE_TEXT_CLASS : 'text-gray-600'}`}>
                                    Revenu
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        
                        {/* Montant */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Montant *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => handleChange('amount', e.target.value)}
                                    placeholder="0.00"
                                    className={`
                                        w-full pl-10 pr-4 py-3 border-2 rounded-xl
                                        focus:outline-none focus:ring-2 transition-all
                                        ${errors.amount 
                                            ? 'border-red-500 focus:ring-red-500/20' 
                                            : 'border-gray-200 focus:border-primary focus:ring-primary-flow'
                                        }
                                        bg-white text-gray-900
                                    `}
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Catégorie / Source */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {transactionType === "expense" ? <span>Catégorie *</span> : <span>Source *</span>}
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className={`
                                        w-full pl-10 pr-4 py-3 border-2 rounded-xl appearance-none
                                        focus:outline-none focus:ring-2 transition-all
                                        ${errors.category 
                                            ? 'border-red-500 focus:ring-red-500/20' 
                                            : 'border-gray-200 focus:border-primary focus:ring-primary-flow'
                                        }
                                        bg-white text-gray-900
                                    `}
                                >
                                    <option value="">Sélectionner une {transactionType === "expense" ? 'catégorie' : 'source'}</option>
                                    {(transactionType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={dateInputString}
                                    // Mise à jour du Hook avec un objet Date
                                    onChange={(e) => handleChange('date', new Date(e.target.value))} 
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary-flow bg-white text-gray-900 transition-all"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Ajouter une note..."
                                    rows={3}
                                    maxLength={255}
                                    className={`
                                        w-full pl-10 pr-4 py-3 border-2 rounded-xl resize-none
                                        focus:outline-none focus:ring-2 transition-all
                                        ${errors.description 
                                            ? 'border-red-500 focus:ring-red-500/20' 
                                            : 'border-gray-200 focus:border-primary focus:ring-primary-flow'
                                        }
                                        bg-white text-gray-900
                                    `}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                {errors.description && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.description}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 ml-auto">
                                    {formData.description.length}/255
                                </p>
                            </div>
                        </div>

                        {/* Projet */}
                        <div className="border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Associer à un projet (Optionnel)
                                </label>
                                {/* Toggle Button */}
                                <button
                                    type="button"
                                    onClick={handleProjectToggle}
                                    className={`
                                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                                        ${formData.hasProject ? 'bg-primary' : 'bg-gray-300'}
                                    `}
                                >
                                    <span className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                                        ${formData.hasProject ? 'translate-x-6' : 'translate-x-1'}
                                    `} />
                                </button>
                            </div>

                            {formData.hasProject && (
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={formData.projectId || ''}
                                        onChange={(e) => handleChange('projectId', e.target.value)}
                                        className={`
                                            w-full pl-10 pr-4 py-3 border-2 rounded-xl appearance-none
                                            focus:outline-none focus:ring-2 transition-all
                                            ${errors.projectId 
                                                ? 'border-red-500 focus:ring-red-500/20' 
                                                : 'border-gray-200 focus:border-primary focus:ring-primary-flow'
                                            }
                                            bg-white text-gray-900
                                        `}
                                    >
                                        <option value="">Sélectionner un projet</option>
                                        {projects.map(project => (
                                            <option key={project.id} value={project.id}>{project.name}</option>
                                        ))}
                                    </select>
                                    {errors.projectId && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.projectId}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`
                                    flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all 
                                    bg-primary hover:bg-primary/90 shadow-lg shadow-primary-30
                                    cursor-pointer
                                `}
                            >
                                Ajouter {transactionType === 'expense' ? 'la dépense' : 'le revenu'}
                            </button>
                        </div>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default TransactionModal;