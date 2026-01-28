// Types primitifs
export type IncomeId = number;
export type UserId = number;
export type ProjectId = number;

export interface IncomeProps {
  id: IncomeId;
  amount: number;
  source: string;
  description?: string;
  date: Date;
  isActive: boolean;
  createdAt: Date;
  userId: UserId;
  projectId?: ProjectId;
}

export interface CreateIncomeProps {
  amount: number;
  source: string;
  description?: string;
  date: Date;
  userId: UserId;
  projectId?: ProjectId;
}

export interface CreateIncomeDTO {
  amount: number;
  source: string;
  description?: string;
  date: string;
  projectId?: number;
}

export interface UpdateIncomeDTO {
  amount?: number;
  source?: string;
  description?: string;
  date?: string;     
  projectId?: number | null;
}


export interface IncomeFormProps {
  amount: string;
  source: string;
  description: string;
  date: Date;
  projectId?: number | null;
  hasProject: boolean;
}

export class Income {

  private readonly props: IncomeProps;

  constructor(props: IncomeProps) {
    this.props = props;
  }

  // Getters
  get id(): IncomeId { return this.props.id; }
  get amount(): number { return this.props.amount; }
  get source(): string { return this.props.source; }
  get description(): string | undefined { return this.props.description; }
  get date(): Date { return this.props.date; }
  get isActive(): boolean { return this.props.isActive; }
  get userId(): UserId { return this.props.userId; }
  get projectId(): ProjectId | undefined { return this.props.projectId; }

  // Validation
  static validate(data: CreateIncomeProps): string | null {

    if (data.amount <= 0) {
      return "Le montant doit être positif.";
    }

    if (data.source.length < 2) {
      return "La source doit avoir au moins 2 caractères.";
    }

    if (data.description && data.description.length > 255) {
      return "Description trop longue (max 255 caractères).";
    }

    return null;
  }

  // Formatage
  get formattedAmount(): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "FCFA",
    }).format(this.props.amount);
  }

  // Recherche
  matchesSearch(query: string): boolean {
    const q = query.toLowerCase();
    return (
      this.props.source.toLowerCase().includes(q) ||
      (this.props.description?.toLowerCase().includes(q) ?? false) ||
      this.props.amount.toString().includes(q)
    );
  }
}
