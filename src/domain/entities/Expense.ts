// Types primitifs
export type ExpenseId = number;
export type UserId = number;
export type ProjectId = number;

// Interface des propriétés
export interface ExpenseProps {
      id: ExpenseId;          
      amount: number;
      category: string;
      description?: string;   
      date: Date;             
      isActive: boolean;
      createdAt: Date;
      userId: UserId;
      projectId?: ProjectId;  
}

// Types pour la création 
export interface CreateExpenseProps {
      amount: number;
      category: string;
      description?: string;
      date: Date;
      userId: UserId;      
      projectId?: ProjectId;
}

// Interface des propriétés du formulaire (ce que le hook traitera)
export interface ExpenseFormProps {
    amount: string;          
    category: string;
    description: string;
    date: Date;
    projectId?: number | null; 
    hasProject: boolean;      
}

// Classe Entité 
export class Expense {

      private readonly props: ExpenseProps;

      constructor(props: ExpenseProps) {
            this.props = props;
      }

      // Getters 
      get id(): ExpenseId { return this.props.id; }
      get amount(): number { return this.props.amount; }
      get category(): string { return this.props.category; }
      get description(): string | undefined { return this.props.description; }
      get date(): Date { return this.props.date; }
      get isActive(): boolean { return this.props.isActive; }
      get userId(): UserId { return this.props.userId; }
      get projectId(): ProjectId | undefined { return this.props.projectId; }


      
      // Validation statique (Factory ou Validator)
      static validate(data: CreateExpenseProps): string | null {

            if (data.amount <= 0) {
                  return "Le montant doit être positif.";
            }

            if (data.category.length < 2) {
                  return "La catégorie doit avoir au moins 2 caractères.";
            }

            if (data.description && data.description.length > 255) {
                  return "Description trop longue (max 255 caractères).";
            }
            
            return null; 
      }

      // Formattage du montant
      get formattedAmount(): string {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'FCFA' }).format(this.props.amount);
      }

      // Filtrage 
      matchesSearch(query: string): boolean {
            const lowerQuery = query.toLowerCase();
            return (
                  this.props.category.toLowerCase().includes(lowerQuery) ||
                  (this.props.description?.toLowerCase().includes(lowerQuery) ?? false) ||
                  this.props.amount.toString().includes(lowerQuery)
            );
      }
}