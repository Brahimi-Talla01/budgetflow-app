export interface TransactionDTO {
      id: number;
      type: "expense" | "income";
      label: string;
      category: string;
      amount: number;
      date: string;
      description: string | null;
      projectId: number | null;
}

export interface PaginationDTO {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasPrevious: boolean;
      hasNext: boolean;
}

export interface TransactionsResponseDTO {
      items: TransactionDTO[];
      pagination: PaginationDTO;
      summary: {
            incomes: number;
            expenses: number;
            balance: number;
      };
      categories: string[];
}
