import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Target, Trash2 } from "lucide-react";
import PageTitle from "../../components/ui/PageTitle";
import AlertBanner, { type FeedbackKind } from "../../components/ui/AlertBanner";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import ProjectForm from "../../components/projects/ProjectForm";
import TransactionList from "../../components/transactions/TransactionList";
import type { TransactionRow } from "../../components/transactions/types";
import { useProjects } from "../../../application/context/projectContext";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";
import type { CreateProjectPayload } from "../../../domain/entities/Project";
import { formatXAF } from "../../../shared/utils/currencyUtils";

interface Feedback {
      kind: FeedbackKind;
      message: string;
}

const ProjectDetailPage = () => {
      const { projectId } = useParams<{ projectId: string }>();
      const navigate = useNavigate();
      const { projects, loading, updateProject, deleteProject } = useProjects();
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();

      const id = Number(projectId);
      const project = projects.find((item) => item.id === id);

      const [isEditing, setIsEditing] = useState(false);
      const [submitting, setSubmitting] = useState(false);
      const [feedback, setFeedback] = useState<Feedback | null>(null);

      const totals = useMemo(() => {
            const totalIncomes = incomes
                  .filter((income) => income.projectId === id)
                  .reduce((sum, income) => sum + income.amount, 0);
            const totalExpenses = expenses
                  .filter((expense) => expense.projectId === id)
                  .reduce((sum, expense) => sum + expense.amount, 0);

            return { totalIncomes, totalExpenses, saved: totalIncomes - totalExpenses };
      }, [incomes, expenses, id]);

      const rows = useMemo<TransactionRow[]>(() => {
            const expenseRows: TransactionRow[] = expenses
                  .filter((expense) => expense.projectId === id)
                  .map((expense) => ({
                        key: `expense-${expense.id}`,
                        id: expense.id,
                        type: "expense",
                        label: expense.description || expense.category,
                        category: expense.category,
                        amount: expense.amount,
                        date: expense.date,
                        description: expense.description,
                        projectId: expense.projectId,
                  }));

            const incomeRows: TransactionRow[] = incomes
                  .filter((income) => income.projectId === id)
                  .map((income) => ({
                        key: `income-${income.id}`,
                        id: income.id,
                        type: "income",
                        label: income.description || income.source,
                        category: income.source,
                        amount: income.amount,
                        date: income.date,
                        description: income.description,
                        projectId: income.projectId,
                  }));

            return [...expenseRows, ...incomeRows].sort((a, b) => b.date.getTime() - a.date.getTime());
      }, [expenses, incomes, id]);

      const handleUpdate = async (payload: CreateProjectPayload) => {
            if (!project) return;

            setSubmitting(true);
            const success = await updateProject(project.id, payload);
            setSubmitting(false);

            if (!success) {
                  setFeedback({ kind: "error", message: "La mise à jour du budget a échoué." });
                  return;
            }

            setFeedback({ kind: "success", message: "Budget mis à jour." });
            setIsEditing(false);
      };

      const handleDelete = async () => {
            if (!project) return;

            const confirmed = window.confirm(
                  `Supprimer le projet « ${project.name} » ? Les transactions liées seront conservées sans projet.`
            );
            if (!confirmed) return;

            const success = await deleteProject(project.id);

            if (!success) {
                  setFeedback({ kind: "error", message: "La suppression du projet a échoué." });
                  return;
            }

            navigate("/dashboard/projet");
      };

      if (loading && !project) {
            return (
                  <>
                        <PageTitle title="Détail du projet" />
                        <Skeleton className="h-10 w-52" />
                        <Skeleton className="h-72 mt-4" />
                  </>
            );
      }

      if (!project) {
            return (
                  <>
                        <PageTitle title="Projet introuvable" />
                        <div className="bg-white rounded-xl p-8 mt-4 text-center">
                              <p className="text-sm text-gray-600">Ce projet n'existe pas ou a été supprimé.</p>
                              <Link
                                    to="/dashboard/projet"
                                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary"
                              >
                                    <ArrowLeft className="w-4 h-4" /> Retour aux projets
                              </Link>
                        </div>
                  </>
            );
      }

      const percent = project.targetAmount > 0
            ? Math.min(Math.max((totals.saved / project.targetAmount) * 100, 0), 100)
            : 0;
      const remaining = Math.max(project.targetAmount - totals.saved, 0);

      return (
            <>
                  <PageTitle title="Détail du projet" />

                  <Link
                        to="/dashboard/projet"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
                  >
                        <ArrowLeft className="w-4 h-4" /> Retour aux projets
                  </Link>

                  {feedback && (
                        <AlertBanner
                              kind={feedback.kind}
                              message={feedback.message}
                              onClose={() => setFeedback(null)}
                              className="mt-4"
                        />
                  )}

                  <div className="bg-white rounded-xl p-5 md:p-7 mt-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                    <span
                                          className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
                                          style={{ backgroundColor: `${project.color}1A`, color: project.color }}
                                    >
                                          <Target className="w-6 h-6" />
                                    </span>
                                    <div className="min-w-0">
                                          <p className="text-xs uppercase tracking-wide text-gray-500">Budget / objectif</p>
                                          <h1 className="text-lg md:text-2xl font-bold text-dark truncate">
                                                {project.name}
                                          </h1>
                                    </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          icon={<Pencil className="w-4 h-4" />}
                                          onClick={() => setIsEditing((value) => !value)}
                                    >
                                          {isEditing ? "Fermer" : "Modifier"}
                                    </Button>
                                    <Button
                                          variant="danger"
                                          size="sm"
                                          icon={<Trash2 className="w-4 h-4" />}
                                          onClick={() => void handleDelete()}
                                    >
                                          Supprimer
                                    </Button>
                              </div>
                        </div>

                        <div className="mt-6">
                              <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-500">Progression</span>
                                    <span className="font-semibold text-dark">
                                          {percent.toFixed(0)} % · objectif {formatXAF(project.targetAmount)}
                                    </span>
                              </div>
                              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                          className="h-full rounded-full transition-all"
                                          style={{ width: `${percent}%`, backgroundColor: project.color }}
                                    />
                              </div>
                        </div>

                        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-sm">
                              <div>
                                    <dt className="text-gray-500">Entrées</dt>
                                    <dd className="font-semibold text-green-600 mt-1">{formatXAF(totals.totalIncomes)}</dd>
                              </div>
                              <div>
                                    <dt className="text-gray-500">Sorties</dt>
                                    <dd className="font-semibold text-red-600 mt-1">{formatXAF(totals.totalExpenses)}</dd>
                              </div>
                              <div>
                                    <dt className="text-gray-500">Épargne</dt>
                                    <dd className={`font-semibold mt-1 ${totals.saved >= 0 ? "text-primary" : "text-red-600"}`}>
                                          {formatXAF(totals.saved)}
                                    </dd>
                              </div>
                              <div>
                                    <dt className="text-gray-500">Reste à atteindre</dt>
                                    <dd className="font-semibold text-dark mt-1">{formatXAF(remaining)}</dd>
                              </div>
                        </dl>
                  </div>

                  {isEditing && (
                        <div className="mt-4">
                              <ProjectForm
                                    project={project}
                                    submitting={submitting}
                                    onSubmit={handleUpdate}
                                    onCancel={() => setIsEditing(false)}
                              />
                        </div>
                  )}

                  <div className="bg-white rounded-xl p-5 md:p-6 mt-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                              <h2 className="text-lg font-semibold text-dark">Transactions du budget</h2>
                              <span className="text-sm text-gray-500">
                                    {rows.length} transaction{rows.length > 1 ? "s" : ""}
                              </span>
                        </div>

                        <div className="mt-3">
                              <TransactionList
                                    rows={rows}
                                    onSelect={(row) =>
                                          navigate(`/dashboard/transaction/${row.type}/${row.id}`)
                                    }
                                    emptyMessage="Aucune transaction n'est rattachée à ce budget pour le moment."
                              />
                        </div>
                  </div>
            </>
      );
};

export default ProjectDetailPage;
