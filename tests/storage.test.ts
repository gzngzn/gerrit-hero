import { describe, expect, it } from "vitest";
import { detectGerritPage } from "../src/shared/storage";

describe("detectGerritPage", () => {
  it("detects change view from pathname", () => {
    expect(detectGerritPage("/c/project/+/12345")).toBe("change-view");
  });

  it("detects change view from hash routing", () => {
    expect(detectGerritPage("/", "#/c/project/+/12345")).toBe("change-view");
  });

  it("detects dashboard", () => {
    expect(detectGerritPage("/dashboard/self")).toBe("dashboard");
    expect(detectGerritPage("/")).toBe("dashboard");
  });

  it("detects search from hash routing", () => {
    expect(detectGerritPage("/", "#/q/status:open")).toBe("search");
  });
});
