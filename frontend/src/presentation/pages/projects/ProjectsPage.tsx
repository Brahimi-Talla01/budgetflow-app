import { useMemo, useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import PageTitle from "../../components/ui/PageTitle";
import AlertBanner, { type FeedbackKind } from "../../components/ui/AlertBanner";
import { Button } from "../../components/ui/Button";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectForm from "../../components/projects/ProjectForm";
import { useProjects } from "../../../application/context/projectContext";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";
import type { CreateProjectPayload, ProjectProps } from "../../../domain/entities/Project";

interface Feedback {
      kind: FeedbackKind;
      message: string;
}

const ProjectsPage = () => {
      const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();

      const [isFormOpen, setIsFormOpen] = useState(false);
      const [editingProject, setEditingProject] = useState<ProjectProps | null>(null);
      const [submitting, setSubmitting] = useState(false);
      const [feedback, setFeedback] = useState<Feedback | null>(null);

      // Agrégats par projet, calculés à partir des transactions déjà chargées.
      const projectTotals = useMemo(() => {
            const totals = new Map<number, { incomes: number; expenses: number }>();

            for (const income of incomes) {
                  if (!income.projectId) continue;
                  const current = totals.get(income.projectId) ?? { incomes: 0, expenses: 0 };
                  current.incomes += income.amount;
                  totals.set(income.projectId, current);
            }

            for (const expense of expenses) {
                  if (!expense.projectId) continue;
                  const current = totals.get(expense.projectId) ?? { incomes: 0, expenses: 0 };
                  current.expenses += expense.amount;
                  totals.set(expense.projectId, current);
            }

            return totals;
      }, [incomes, expenses]);

      const openCreateForm = () => {
            setEditingProject(null);
            setIsFormOpen(true);
      };

      const openEditForm = (project: ProjectProps) => {
            setEditingProject(project);
            setIsFormOpen(true);
      };

      const closeForm = () => {
            setIsFormOpen(false);
            setEditingProject(null);
      };

      const handleSubmit = async (payload: CreateProjectPayload) => {
            setSubmitting(true);

            const success = editingProject
                  ? await updateProject(editingProject.id, payload)
                  : await createProject(payload);

            setSubmitting(false);

            if (!success) {
                  setFeedback({ kind: "error", message: "L'enregistrement du projet a échoué." });
                  return;
            }

            setFeedback({
                  kind: "success",
                  message: editingProject ? "Projet mis à jour." : "Projet créé.",
            });
            closeForm();
      };

      const handleDelete = async (project: ProjectProps) => {
            const confirmed = window.confirm(`Supprimer le projet « ${project.name} » ?`);
            if (!confirmed) return;

            const success = await deleteProject(project.id);

            setFeedback(
                  success
                        ? { kind: "success", message: "Projet supprimé." }
                        : { kind: "error", message: "La suppression du projet a échoué." }
            );
      };

      return (
            <>
                  <PageTitle title="Projets" />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                              <h1 className="text-xl md:text-3xl font-bold text-dark">Projets</h1>
                              <p className="text-sm text-gray-600 mt-2">
                                    Suivez vos objectifs d'épargne et rattachez-y vos transactions.
                              </p>
                        </div>

                        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateForm}>
                              Nouveau projet
                        </Button>
                  </div>

                  {feedback && (
                        <AlertBanner
                              kind={feedback.kind}
                              message={feedback.message}
                              onClose={() => setFeedback(null)}
                              className="mt-4"
                        />
                  )}

                  {isFormOpen && (
                        <div className="mt-4">
                              <ProjectForm
                                    project={editingProject}
                                    submitting={submitting}
                                    onSubmit={handleSubmit}
                                    onCancel={closeForm}
                              />
                        </div>
                  )}

                  {loading && projects.length === 0 ? (
                        <div className="flex justify-center items-center py-16">
                              <span className="w-9 h-9 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                        </div>
                  ) : projects.length === 0 ? (
                        <div className="bg-white rounded-xl mt-4 flex flex-col items-center justify-center py-14 text-center">
                              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <FolderOpen className="w-7 h-7 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500 mb-4">
                                    Aucun projet pour le moment.
                              </p>
                              <Button size="sm" onClick={openCreateForm}>
                                    Créer votre premier projet
                              </Button>
                        </div>
                  ) : (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                              {projects.map((project) => {
                                    const totals = projectTotals.get(project.id);
                                    return (
                                          <ProjectCard
                                                key={project.id}
                                                project={project}
                                                totalIncomes={totals?.incomes ?? 0}
                                                totalExpenses={totals?.expenses ?? 0}
                                                onEdit={() => openEditForm(project)}
                                                onDelete={() => void handleDelete(project)}
                                          />
                                    );
                              })}
                        </div>
                  )}
            </>
      );
};

export default ProjectsPage;
