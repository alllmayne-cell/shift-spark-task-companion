import { describe, expect, it } from "vitest";
import { CSAT_CATEGORIES, RATING_POLICY, filterMemos } from "@/lib/csat";

describe("CSAT library", () => {
  it("provides eight categories", () => {
    expect(CSAT_CATEGORIES).toHaveLength(8);
  });
  it("provides multiple complete memos per category and three to five phrases", () => {
    for (const category of CSAT_CATEGORIES) {
      expect(category.memos.length).toBeGreaterThan(1);
      for (const memo of category.memos) {
        expect(memo.phrases.length).toBeGreaterThanOrEqual(3);
        expect(memo.phrases.length).toBeLessThanOrEqual(5);
        expect(memo.dialogue.length).toBeGreaterThanOrEqual(2);
        expect(memo.avoid.length).toBeGreaterThan(0);
      }
    }
  });
  it("searches only the selected category", () => {
    const category = CSAT_CATEGORIES.find((item) => item.id === "opening");
    if (!category) throw new Error("Missing category");
    expect(filterMemos(category, "Prime")).toEqual([]);
  });
  it("searches phrases, scenarios and dialogues with normalized casing and ё", () => {
    const category = CSAT_CATEGORIES.find((item) => item.id === "questions");
    if (!category) throw new Error("Missing category");
    expect(filterMemos(category, "  СЧЁТУ   НАЧИСЛЕНИЕ ").map((memo) => memo.id)).toEqual(["questions-account"]);
    expect(filterMemos(category, "Prime").map((memo) => memo.id)).toEqual(["questions-prime"]);
    expect(filterMemos(category, " ")).toHaveLength(3);
  });
  it("uses a five-point rating scale", () => {
    expect(RATING_POLICY.scale).toBe(5);
  });
  it("requires permission from the current scenario before requesting a rating", () => {
    expect(RATING_POLICY.requiresCurrentScenarioPermission).toBe(true);
  });
});