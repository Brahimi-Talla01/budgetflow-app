/** Lit un cookie non httpOnly (par exemple le jeton CSRF). */
export const readCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;

      const entry = document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith(`${name}=`));

      if (!entry) return null;

      return decodeURIComponent(entry.slice(name.length + 1));
};
