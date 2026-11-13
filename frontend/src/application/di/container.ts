import { apiClient } from "../../infrastructure/api/apiClient";
import { HttpAuthRepository } from "../../infrastructure/repositories/HttpAuthRepository";
import { HttpExpenseRepository } from "../../infrastructure/repositories/HttpExpenseRepository";
import { HttpIncomeRepository } from "../../infrastructure/repositories/HttpIncomeRepository";
import { HttpNotificationRepository } from "../../infrastructure/repositories/HttpNotificationRepository";
import { HttpProjectRepository } from "../../infrastructure/repositories/HttpProjectRepository";
import { HttpTransactionRepository } from "../../infrastructure/repositories/HttpTransactionRepository";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import type { IIncomeRepository } from "../../domain/repositories/IIncomeRepository";
import type { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import type { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

export interface RepositoryContainer {
      auth: IAuthRepository;
      expenses: IExpenseRepository;
      incomes: IIncomeRepository;
      projects: IProjectRepository;
      notifications: INotificationRepository;
      transactions: ITransactionRepository;
}

/**
 * Point unique de construction des repositories.
 * Les contexts et hooks consomment ces interfaces, jamais Axios directement.
 */
export const repositories: RepositoryContainer = {
      auth: new HttpAuthRepository(apiClient),
      expenses: new HttpExpenseRepository(apiClient),
      incomes: new HttpIncomeRepository(apiClient),
      projects: new HttpProjectRepository(apiClient),
      notifications: new HttpNotificationRepository(apiClient),
      transactions: new HttpTransactionRepository(apiClient),
};
