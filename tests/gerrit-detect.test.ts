import { describe, expect, it } from "vitest";
import { isGerritPage } from "../src/shared/gerrit-detect";

describe("isGerritPage", () => {
  it("detects gr-app element", () => {
    const app = document.createElement("gr-app");
    document.body.append(app);
    expect(isGerritPage()).toBe(true);
    app.remove();
  });

  it("detects change URL path", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/c/project/+/12345", hash: "" },
      writable: true,
    });
    expect(isGerritPage()).toBe(true);
  });

  it("detects hash-based routing", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/", hash: "#/c/project/+/12345" },
      writable: true,
    });
    expect(isGerritPage()).toBe(true);
  });

  it("returns false on unrelated page", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/about", hash: "" },
      writable: true,
    });
    document.body.innerHTML = "";
    expect(isGerritPage()).toBe(false);
  });
});
