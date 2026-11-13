import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import Input from "../ui/Input";
import type { CreateProjectPayload, ProjectProps } from "../../../domain/entities/Project";

interface ProjectFormProps {
      project?: ProjectProps | null;
      submitting: boolean;
      onSubmit: (payload: CreateProjectPayload) => void;
      onCancel: () => void;
}

const DEFAULT_COLOR = "#26D0FF";

const ProjectForm = ({ project, submitting, onSubmit, onCancel }: ProjectFormProps) => {
      const [name, setName] = useState(project?.name ?? "");
      const [targetAmount, setTargetAmount] = useState(
            project ? String(project.targetAmount) : ""
      );
      const [color, setColor] = useState(project?.color ?? DEFAULT_COLOR);
      const [error, setError] = useState<string | null>(null);

      const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const trimmedName = name.trim();
            const amount = Number(targetAmount);

            if (trimmedName.length < 2 || trimmedName.length > 50) {
                  setError("Le nom du projet doit contenir entre 2 et 50 caractères.");
                  return;
            }

            if (!Number.isFinite(amount) || amount <= 0) {
                  setError("L'objectif doit être un montant positif.");
                  return;
            }

            setError(null);
            onSubmit({ name: trimmedName, targetAmount: amount, color });
      };

      return (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-dark mb-4">
                        {project ? "Modifier le projet" : "Nouveau projet"}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                              label="Nom du projet"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              placeholder="Voyage, épargne de sécurité..."
                              required
                              disabled={submitting}
                        />

                        <Input
                              label="Objectif (XAF)"
                              type="number"
                              min={1}
                              step="0.01"
                              value={targetAmount}
                              onChange={(event) => setTargetAmount(event.target.value)}
                              placeholder="500000"
                              required
                              disabled={submitting}
                        />

                        <div className="space-y-1.5">
                              <label htmlFor="project-color" className="text-sm font-medium text-gray-700">
                                    Couleur
                              </label>
                              <input
                                    id="project-color"
                                    type="color"
                                    value={color}
                                    onChange={(event) => setColor(event.target.value)}
                                    disabled={submitting}
                                    className="h-10 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-1"
                              />
                        </div>
                  </div>

                  {error && <p className="mt-3 text-sm text-error">{error}</p>}

                  <div className="mt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
                              Annuler
                        </Button>
                        <Button type="submit" loading={submitting}>
                              {project ? "Enregistrer" : "Créer le projet"}
                        </Button>
                  </div>
            </form>
      );
};

export default ProjectForm;
