import { Pencil, Target, Trash2 } from "lucide-react";
import type { ProjectProps } from "../../../domain/entities/Project";
import { formatXAF } from "../../../shared/utils/currencyUtils";

interface ProjectCardProps {
      project: ProjectProps;
      totalIncomes: number;
      totalExpenses: number;
      onEdit: () => void;
      onDelete: () => void;
}

const ProjectCard = ({ project, totalIncomes, totalExpenses, onEdit, onDelete }: ProjectCardProps) => {
      const saved = totalIncomes - totalExpenses;
      const percent = project.targetAmount > 0
            ? Math.min(Math.max((saved / project.targetAmount) * 100, 0), 100)
            : 0;

      return (
            <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                              <span
                                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${project.color}1A`, color: project.color }}
                              >
                                    <Target className="w-5 h-5" />
                              </span>
                              <div className="min-w-0">
                                    <h3 className="font-semibold text-dark truncate">{project.name}</h3>
                                    <p className="text-xs text-gray-500">
                                          Objectif {formatXAF(project.targetAmount)}
                                    </p>
                              </div>
                        </div>

                        <div className="flex items-center gap-1">
                              <button
                                    type="button"
                                    onClick={onEdit}
                                    aria-label={`Modifier ${project.name}`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                    <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                    type="button"
                                    onClick={onDelete}
                                    aria-label={`Supprimer ${project.name}`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                    <Trash2 className="w-4 h-4" />
                              </button>
                        </div>
                  </div>

                  <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progression</span>
                              <span className="font-semibold text-dark">{percent.toFixed(0)} %</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${percent}%`, backgroundColor: project.color }}
                              />
                        </div>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                              <dt className="text-gray-500">Entrées</dt>
                              <dd className="font-semibold text-green-600">{formatXAF(totalIncomes)}</dd>
                        </div>
                        <div>
                              <dt className="text-gray-500">Sorties</dt>
                              <dd className="font-semibold text-red-600">{formatXAF(totalExpenses)}</dd>
                        </div>
                        <div>
                              <dt className="text-gray-500">Solde</dt>
                              <dd className={`font-semibold ${saved >= 0 ? "text-primary" : "text-red-600"}`}>
                                    {formatXAF(saved)}
                              </dd>
                        </div>
                  </dl>
            </div>
      );
};

export default ProjectCard;
