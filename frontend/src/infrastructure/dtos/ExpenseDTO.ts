export interface ExpenseDTO {
      expenseId: number;
      amount: number;
      category: string;
      description: string | null;
      date: string;       
      isActive: boolean;
      createdAt: string;  
      userId: number;
      projectId: number | null;
}