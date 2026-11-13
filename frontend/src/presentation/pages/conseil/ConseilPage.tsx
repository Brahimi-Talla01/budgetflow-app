import { useMemo } from "react";
import { AlertCircle, CheckCircle2, Lightbulb, PiggyBank, Target, Wallet } from "lucide-react";
import PageTitle from "../../components/ui/PageTitle";
import { useExpenses } from "../../../application/context/expenseContext";
import { useIncomes } from "../../../application/context/incomeContext";
import { formatXAF } from "../../../shared/utils/currencyUtils";

const ADVICE = [
      {
            icon: Wallet,
            title: "La règle 50 / 30 / 20",
            description:
                  "Répartissez vos revenus : 50 % pour les besoins essentiels, 30 % pour les envies et 20 % pour l'épargne et le remboursement de dettes.",
      },
      {
            icon: PiggyBank,
            title: "Un fonds d'urgence",
            description:
                  "Visez l'équivalent de trois à six mois de dépenses courantes, placé sur un support disponible immédiatement.",
      },
      {
            icon: Target,
            title: "Des objectifs chiffrés",
            description:
                  "Créez un projet par objectif (voyage, achat, épargne de sécurité) et rattachez-y vos transactions pour suivre la progression réelle.",
      },
      {
            icon: Lightbulb,
            title: "Suivez vos dépenses chaque semaine",
            description:
                  "Un point hebdomadaire de dix minutes suffit pour repérer une dérive avant qu'elle ne s'installe dans le mois.",
      },
];

const ConseilPage = () => {
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();

      const totals = useMemo(() => {
            const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

            const byCategory = new Map<string, number>();
            for (const expense of expenses) {
                  byCategory.set(expense.category, (byCategory.get(expense.category) ?? 0) + expense.amount);
            }

            const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];

            return {
                  totalIncomes,
                  totalExpenses,
                  balance: totalIncomes - totalExpenses,
                  savingsRate: totalIncomes > 0 ? ((totalIncomes - totalExpenses) / totalIncomes) * 100 : 0,
                  topCategory,
            };
      }, [incomes, expenses]);

      const isHealthy = totals.balance >= 0;

      return (
            <>
                  <PageTitle title="Conseils" />

                  <div>
                        <h1 className="text-xl md:text-3xl font-bold text-dark">Conseils</h1>
                        <p className="text-sm text-gray-600 mt-2">
                              Des repères simples pour garder le contrôle de votre budget.
                        </p>
                  </div>

                  <div className="mt-4">
                        {totals.totalIncomes === 0 && totals.totalExpenses === 0 ? (
                              <div className="bg-white rounded-xl p-5 flex gap-3 text-sm text-gray-600">
                                    <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                                    <p>
                                          Ajoutez vos revenus et vos dépenses pour obtenir un conseil
                                          personnalisé à partir de votre situation.
                                    </p>
                              </div>
                        ) : (
                              <div
                                    className={`rounded-xl p-5 flex gap-3 text-sm border ${
                                          isHealthy
                                                ? "bg-green-50 border-green-200 text-green-800"
                                                : "bg-orange-50 border-orange-200 text-orange-800"
                                    }`}
                              >
                                    {isHealthy ? (
                                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    ) : (
                                          <AlertCircle className="w-5 h-5 shrink-0" />
                                    )}

                                    <div className="space-y-1">
                                          <p className="font-semibold">
                                                {isHealthy
                                                      ? `Vous épargnez ${totals.savingsRate.toFixed(0)} % de vos revenus.`
                                                      : "Vos dépenses dépassent vos revenus."}
                                          </p>
                                          <p>
                                                {isHealthy
                                                      ? `Solde positif de ${formatXAF(totals.balance)}. ${
                                                              totals.topCategory
                                                                    ? `Votre poste le plus lourd reste « ${totals.topCategory[0]} » (${formatXAF(totals.topCategory[1])}).`
                                                                    : ""
                                                        }`
                                                      : `Solde négatif de ${formatXAF(Math.abs(totals.balance))}. Commencez par réduire le poste « ${
                                                              totals.topCategory?.[0] ?? "le plus important"
                                                        } ».`}
                                          </p>
                                    </div>
                              </div>
                        )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ADVICE.map((item) => {
                              const Icon = item.icon;
                              return (
                                    <article key={item.title} className="bg-white rounded-xl p-5">
                                          <div className="flex items-center gap-3 mb-2">
                                                <span className="w-10 h-10 rounded-xl bg-primary-flow text-primary flex items-center justify-center">
                                                      <Icon className="w-5 h-5" />
                                                </span>
                                                <h2 className="font-semibold text-dark">{item.title}</h2>
                                          </div>
                                          <p className="text-sm text-gray-600 leading-relaxed">
                                                {item.description}
                                          </p>
                                    </article>
                              );
                        })}
                  </div>
            </>
      );
};

export default ConseilPage;
