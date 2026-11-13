export type PeriodValue = "all" | "last_7_days" | "this_month" | "last_6_months" | "this_year";

export const PERIOD_OPTIONS: ReadonlyArray<{ value: PeriodValue; label: string }> = [
      { value: "all", label: "Toutes les périodes" },
      { value: "last_7_days", label: "7 derniers jours" },
      { value: "this_month", label: "Ce mois-ci" },
      { value: "last_6_months", label: "6 derniers mois" },
      { value: "this_year", label: "Cette année" },
];

export const formatDate = (date: Date): string =>
      date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export const isDateInPeriod = (date: Date, period: PeriodValue, now: Date = new Date()): boolean => {
      if (Number.isNaN(date.getTime())) return false;

      switch (period) {
            case "all":
                  return true;

            case "last_7_days": {
                  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                  return diffInDays >= 0 && diffInDays <= 7;
            }

            case "this_month":
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

            case "last_6_months": {
                  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
                  return months >= 0 && months <= 6;
            }

            case "this_year":
                  return date.getFullYear() === now.getFullYear();

            default:
                  return true;
      }
};
