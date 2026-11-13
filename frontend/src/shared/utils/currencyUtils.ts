export const formatXAF = (value: number): string =>
      `${value.toLocaleString("fr-FR")} XAF`;

/** Préfixe le montant par + (entrée d'argent) ou - (sortie d'argent). */
export const formatSignedXAF = (value: number, direction: "in" | "out"): string =>
      `${direction === "in" ? "+" : "-"}${formatXAF(Math.abs(value))}`;
