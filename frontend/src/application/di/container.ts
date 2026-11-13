import { apiClient } from "../../infrastructure/api/apiClient";
import { HttpAuthRepository } from "../../infrastructure/repositories/HttpAuthRepository";
import { HttpExpenseRepository } from "../../infrastructure/repositories/HttpExpenseRepository";
import { HttpIncomeRepository } from "../../infrastructure/repositories/HttpIncomeRepository";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import type { IIncomeRepository } from "../../domain/repositories/IIncomeRepository";

export interface RepositoryContainer {
      auth: IAuthRepository;
      expenses: IExpenseRepository;
      incomes: IIncomeRepository;
}

/**
 * Point unique de construction des repositories.
 * Les contexts et hooks consomment ces interfaces, jamais Axios directement.
 */
export const repositories: RepositoryContainer = {
      auth: new HttpAuthRepository(apiClient),
      expenses: new HttpExpenseRepository(apiClient),
      incomes: new HttpIncomeRepository(apiClient),
};
