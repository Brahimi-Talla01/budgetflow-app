import { afterEach, describe, expect, it } from "vitest";
import { readCookie } from "./cookies";

describe("readCookie", () => {
      afterEach(() => {
            document.cookie = "csrf_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      });

      it("retourne null quand le cookie est absent", () => {
            expect(readCookie("csrf_access_token")).toBeNull();
      });

      it("retourne la valeur du cookie", () => {
            document.cookie = "csrf_access_token=jeton-123; path=/";

            expect(readCookie("csrf_access_token")).toBe("jeton-123");
      });

      it("décode les valeurs encodées", () => {
            document.cookie = `csrf_access_token=${encodeURIComponent("a b/c")}; path=/`;

            expect(readCookie("csrf_access_token")).toBe("a b/c");
      });
});
