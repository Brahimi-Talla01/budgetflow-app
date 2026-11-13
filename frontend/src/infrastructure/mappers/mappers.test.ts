import { describe, expect, it } from "vitest";
import { ExpenseMapper } from "./ExpenseMapper";
import { IncomeMapper } from "./IncomeMapper";
import { NotificationMapper } from "./NotificationMapper";
import { ProjectMapper } from "./ProjectMapper";
import { UserMapper } from "./UserMapper";

describe("ExpenseMapper", () => {
      const dto = {
            expenseId: 12,
            amount: 1500,
            category: "Transport",
            description: null,
            date: "2026-02-01",
            isActive: true,
            createdAt: "2026-02-01T10:00:00",
            userId: 3,
            projectId: null,
      };

      it("convertit un DTO en modèle du domaine", () => {
            const expense = ExpenseMapper.toDomain(dto);

            expect(expense.id).toBe(12);
            expect(expense.date).toBeInstanceOf(Date);
            expect(expense.createdAt).toBeInstanceOf(Date);
            expect(expense.description).toBeUndefined();
            expect(expense.projectId).toBeUndefined();
      });

      it("conserve le payload attendu par l'API", () => {
            const payload = ExpenseMapper.toApi({
                  amount: 200,
                  category: "Loisirs",
                  description: "Cinéma",
                  date: "2026-03-01",
                  projectId: 5,
            });

            expect(payload).toEqual({
                  amount: 200,
                  category: "Loisirs",
                  description: "Cinéma",
                  date: "2026-03-01",
                  projectId: 5,
            });
      });
});

describe("IncomeMapper", () => {
      it("convertit un DTO revenu", () => {
            const income = IncomeMapper.toDomain({
                  incomeId: 4,
                  amount: 90000,
                  source: "Salaire",
                  description: "Paie",
                  date: "2026-01-05",
                  isActive: true,
                  createdAt: "2026-01-05T08:00:00",
                  userId: 3,
                  projectId: 2,
            });

            expect(income.id).toBe(4);
            expect(income.source).toBe("Salaire");
            expect(income.projectId).toBe(2);
      });
});

describe("ProjectMapper", () => {
      it("convertit un DTO projet", () => {
            const project = ProjectMapper.toDomain({
                  projectId: 7,
                  name: "Voyage",
                  targetAmount: 500000,
                  color: "#26D0FF",
                  createdAt: "2026-01-01T00:00:00",
                  userId: 3,
            });

            expect(project).toMatchObject({ id: 7, name: "Voyage", targetAmount: 500000 });
            expect(project.createdAt).toBeInstanceOf(Date);
      });
});

describe("NotificationMapper", () => {
      it("convertit un DTO notification", () => {
            const notification = NotificationMapper.toDomain({
                  notificationId: 9,
                  title: "Nouvelle dépense",
                  message: "Vous avez ajouté une dépense.",
                  link: "/dashboard/transaction/expense/12",
                  isRead: false,
                  createdAt: "2026-01-02T09:30:00",
                  userId: 3,
            });

            expect(notification.id).toBe(9);
            expect(notification.link).toBe("/dashboard/transaction/expense/12");
            expect(notification.isRead).toBe(false);
            expect(notification.createdAt).toBeInstanceOf(Date);
      });
});

describe("UserMapper", () => {
      it("convertit un DTO utilisateur avec rôle", () => {
            const user = UserMapper.toDomain({
                  userId: 3,
                  firstname: "Awa",
                  lastname: "Test",
                  email: "awa@budgetflow.test",
                  isActive: true,
                  createdAt: "2026-01-01T00:00:00",
                  lastLogin: null,
                  role: { roleId: 2, name: "user" },
            });

            expect(user.id).toBe(3);
            expect(user.role?.name).toBe("user");
            expect(user.lastLogin).toBeUndefined();
            expect(user.createdAt).toBeInstanceOf(Date);
      });
});
