export interface IncomeDTO {
      incomeId: number;
      amount: number;
      source: string;
      description: string | null;
      date: string;
      isActive: boolean;
      createdAt: string;
      userId: number;
      projectId: number | null;
}
