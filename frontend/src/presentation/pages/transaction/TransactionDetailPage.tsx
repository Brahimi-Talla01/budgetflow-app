import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Calendar, FolderOpen, Pencil, Trash2 } from "lucide-react";
import PageTitle from "../../components/ui/PageTitle";
import { Button } from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AlertBanner from "../../components/ui/AlertBanner";
import { Skeleton } from "../../components/ui/Skeleton";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";
import { useProjects } from "../../../application/context/projectContext";
import type { TransactionType } from "../../../domain/entities/Expense";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../../shared/constants/transactions";
import { formatDate } from "../../../shared/utils/dateUtils";
import { formatSignedXAF } from "../../../shared/utils/currencyUtils";

interface EditForm {
      amount: string;
      category: string;
      date: string;
      description: string;
      projectId: string;
}

const selectClassName =
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer";

const TransactionDetailPage = () => {
      const { type, id } = useParams<{ type: string; id: string }>();
      const navigate = useNavigate();

      const { expenses, loading: expensesLoading, updateExpense, deleteExpense } = useExpenses();
      const { incomes, loading: incomesLoading, updateIncome, deleteIncome } = useIncomes();
      const { projects } = useProjects();

      const transactionType: TransactionType | null =
            type === "expense" || type === "income" ? type : null;
      const transactionId = Number(id);

      const row = useMemo(() => {
            if (!transactionType || !Number.isInteger(transactionId)) return null;

            if (transactionType === "expense") {
                  const expense = expenses.find((item) => item.id === transactionId);
                  if (!expense) return null;

                  return {
                        id: expense.id,
                        type: "expense" as const,
                        label: expense.description || expense.category,
                        category: expense.category,
                        amount: expense.amount,
                        date: expense.date,
                        description: expense.description,
                        projectId: expense.projectId,
                        createdAt: expense.createdAt,
                  };
            }

            const income = incomes.find((item) => item.id === transactionId);
            if (!income) return null;

            return {
                  id: income.id,
                  type: "income" as const,
                  label: income.description || income.source,
                  category: income.source,
                  amount: income.amount,
                  date: income.date,
                  description: income.description,
                  projectId: income.projectId,
                  createdAt: income.createdAt,
            };
      }, [transactionType, transactionId, expenses, incomes]);

      const project = row?.projectId
            ? projects.find((item) => item.id === row.projectId)
            : undefined;

      const [isEditing, setIsEditing] = useState(false);
      const [form, setForm] = useState<EditForm>({
            amount: "",
            category: "",
            date: "",
            description: "",
            projectId: "",
      });
      const [error, setError] = useState<string | null>(null);
      const [saving, setSaving] = useState(false);

      const loading = expensesLoading || incomesLoading;
      const isIncome = row?.type === "income";

      const startEditing = () => {
            if (!row) return;

            setForm({
                  amount: String(row.amount),
                  category: row.category,
                  date: row.date.toISOString().split("T")[0],
                  description: row.description ?? "",
                  projectId: row.projectId ? String(row.projectId) : "",
            });
            setError(null);
            setIsEditing(true);
      };

      const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!row) return;

            const amount = Number(form.amount);

            if (!Number.isFinite(amount) || amount <= 0) {
                  setError("Le montant doit être un nombre positif.");
                  return;
            }

            if (!form.category.trim()) {
                  setError(isIncome ? "La source est obligatoire." : "La catégorie est obligatoire.");
                  return;
            }

            if (!form.date) {
                  setError("La date est obligatoire.");
                  return;
            }

            setSaving(true);

            const common = {
                  amount,
                  description: form.description.trim() || undefined,
                  date: new Date(form.date),
                  projectId: form.projectId ? Number(form.projectId) : undefined,
            };

            if (isIncome) {
                  await updateIncome(row.id, { ...common, source: form.category.trim() });
            } else {
                  await updateExpense(row.id, { ...common, category: form.category.trim() });
            }

            setSaving(false);
            setIsEditing(false);
      };

      const handleDelete = async () => {
            if (!row) return;

            const confirmed = window.confirm("Supprimer définitivement cette transaction ?");
            if (!confirmed) return;

            if (isIncome) {
                  await deleteIncome(row.id);
            } else {
                  await deleteExpense(row.id);
            }

            navigate("/dashboard/transaction");
      };

      const categories = isIncome
            ? INCOME_CATEGORIES
            : EXPENSE_CATEGORIES;
      const categoryOptions = row && !categories.includes(row.category as never)
            ? [row.category, ...categories]
            : [...categories];

      if (loading && !row) {
            return (
                  <>
                        <PageTitle title="Détail de la transaction" />
                        <Skeleton className="h-10 w-52" />
                        <Skeleton className="h-64 mt-4" />
                  </>
            );
      }

      if (!row || !transactionType) {
            return (
                  <>
                        <PageTitle title="Transaction introuvable" />
                        <div className="bg-white rounded-xl p-8 mt-4 text-center">
                              <p className="text-sm text-gray-600">Cette transaction n'existe pas ou a été supprimée.</p>
                              <Link
                                    to="/dashboard/transaction"
                                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary"
                              >
                                    <ArrowLeft className="w-4 h-4" /> Retour aux transactions
                              </Link>
                        </div>
                  </>
            );
      }

      const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

      return (
            <>
                  <PageTitle title="Détail de la transaction" />

                  <Link
                        to="/dashboard/transaction"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
                  >
                        <ArrowLeft className="w-4 h-4" /> Retour aux transactions
                  </Link>

                  <div className="bg-white rounded-xl p-5 md:p-7 mt-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                    <span
                                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                                isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                          }`}
                                    >
                                          <Icon className="w-6 h-6" />
                                    </span>
                                    <div className="min-w-0">
                                          <p className="text-xs uppercase tracking-wide text-gray-500">
                                                {isIncome ? "Revenu" : "Dépense"}
                                          </p>
                                          <h1 className="text-lg md:text-2xl font-bold text-dark truncate">
                                                {row.label}
                                          </h1>
                                    </div>
                              </div>

                              <p className={`text-xl md:text-3xl font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                                    {formatSignedXAF(row.amount, isIncome ? "in" : "out")}
                              </p>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
                              <div>
                                    <dt className="text-gray-500">{isIncome ? "Source" : "Catégorie"}</dt>
                                    <dd className="font-semibold text-dark mt-1">{row.category}</dd>
                              </div>
                              <div>
                                    <dt className="text-gray-500">Date</dt>
                                    <dd className="font-semibold text-dark mt-1 flex items-center gap-2">
                                          <Calendar className="w-4 h-4 text-gray-400" /> {formatDate(row.date)}
                                    </dd>
                              </div>
                              <div className="sm:col-span-2">
                                    <dt className="text-gray-500">Description</dt>
                                    <dd className="text-dark mt-1">{row.description || "Aucune description"}</dd>
                              </div>
                              <div>
                                    <dt className="text-gray-500">Projet associé</dt>
                                    <dd className="font-semibold text-dark mt-1">
                                          {project ? (
                                                <Link
                                                      to={`/dashboard/projet/${project.id}`}
                                                      className="inline-flex items-center gap-2 text-primary hover:underline"
                                                >
                                                      <FolderOpen className="w-4 h-4" /> {project.name}
                                                </Link>
                                          ) : (
                                                "Aucun"
                                          )}
                                    </dd>
                              </div>
                              <div>
                                    <dt className="text-gray-500">Enregistrée le</dt>
                                    <dd className="font-semibold text-dark mt-1">{formatDate(row.createdAt)}</dd>
                              </div>
                        </dl>

                        {!isEditing && (
                              <div className="flex flex-wrap gap-3 mt-7 pt-5 border-t border-gray-100">
                                    <Button icon={<Pencil className="w-4 h-4" />} onClick={startEditing}>
                                          Modifier
                                    </Button>
                                    <Button
                                          variant="danger"
                                          icon={<Trash2 className="w-4 h-4" />}
                                          onClick={() => void handleDelete()}
                                    >
                                          Supprimer
                                    </Button>
                              </div>
                        )}
                  </div>

                  {isEditing && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 md:p-7 mt-4">
                              <h2 className="text-lg font-semibold text-dark mb-4">
                                    Modifier {isIncome ? "le revenu" : "la dépense"}
                              </h2>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                          label="Montant (XAF)"
                                          type="number"
                                          min={0}
                                          step="0.01"
                                          value={form.amount}
                                          onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                                          required
                                    />

                                    <div className="space-y-1.5">
                                          <label htmlFor="detail-category" className="text-sm font-medium text-gray-700">
                                                {isIncome ? "Source" : "Catégorie"}
                                          </label>
                                          <select
                                                id="detail-category"
                                                value={form.category}
                                                onChange={(event) =>
                                                      setForm((prev) => ({ ...prev, category: event.target.value }))
                                                }
                                                className={selectClassName}
                                          >
                                                {categoryOptions.map((option) => (
                                                      <option key={option} value={option}>
                                                            {option}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>

                                    <Input
                                          label="Date"
                                          type="date"
                                          value={form.date}
                                          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                                          required
                                    />

                                    <div className="space-y-1.5">
                                          <label htmlFor="detail-project" className="text-sm font-medium text-gray-700">
                                                Projet associé
                                          </label>
                                          <select
                                                id="detail-project"
                                                value={form.projectId}
                                                onChange={(event) =>
                                                      setForm((prev) => ({ ...prev, projectId: event.target.value }))
                                                }
                                                className={selectClassName}
                                          >
                                                <option value="">Aucun projet</option>
                                                {projects.map((item) => (
                                                      <option key={item.id} value={item.id}>
                                                            {item.name}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>

                                    <div className="md:col-span-2">
                                          <Input
                                                label="Description"
                                                value={form.description}
                                                maxLength={255}
                                                onChange={(event) =>
                                                      setForm((prev) => ({ ...prev, description: event.target.value }))
                                                }
                                          />
                                    </div>
                              </div>

                              {error && (
                                    <AlertBanner kind="error" message={error} className="mt-4" />
                              )}

                              <div className="flex justify-end gap-3 mt-5">
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                                          Annuler
                                    </Button>
                                    <Button type="submit" loading={saving}>
                                          Enregistrer
                                    </Button>
                              </div>
                        </form>
                  )}
            </>
      );
};

export default TransactionDetailPage;
