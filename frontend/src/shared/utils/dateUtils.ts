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

/** Format lisible pour une notification : « il y a 5 min », « il y a 2 j », sinon la date. */
export const formatRelativeTime = (date: Date, now: Date = new Date()): string => {
      const diffInMs = now.getTime() - date.getTime();

      if (Number.isNaN(diffInMs) || diffInMs < 0) return formatDate(date);

      const minutes = Math.floor(diffInMs / 60_000);
      if (minutes < 1) return "à l'instant";
      if (minutes < 60) return `il y a ${minutes} min`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `il y a ${hours} h`;

      const days = Math.floor(hours / 24);
      if (days < 7) return `il y a ${days} j`;

      return formatDate(date);
};

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
