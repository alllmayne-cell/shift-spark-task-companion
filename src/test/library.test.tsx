import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ACSAT_CRITICAL_MEMOS, ACSAT_GREEN_MEMOS, CROSS_SALES_MEMOS, OBJECTION_MEMOS, LIBRARY_MEMOS, searchLibrary } from "@/lib/library-content";
import { CSAT_CATEGORIES } from "@/lib/csat";
import { TOPICS } from "@/lib/shift";
import { LIBRARY_STORAGE_KEY, useLibraryState } from "@/lib/library-state";
import { ACSAT_POLICY } from "@/lib/acsat";
beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe("Final library", () => {
  it("preserves every existing CSAT memo unchanged", () => {
    for (const category of CSAT_CATEGORIES) for (const memo of category.memos) {
      const stored = LIBRARY_MEMOS.find(item => item.id === memo.id);
      expect(stored).toMatchObject(memo);
    }
  });
  it("retains all four existing ACSAT principles", () => {
    for (const tip of TOPICS.acsat.tips) expect([...ACSAT_CRITICAL_MEMOS, ...ACSAT_GREEN_MEMOS].some(memo => memo.principle.includes(tip))).toBe(true);
  });
  it("preserves all eight original ACSAT cards and unique saved IDs", () => {
    for (const memo of [...ACSAT_CRITICAL_MEMOS, ...ACSAT_GREEN_MEMOS]) {
      expect(LIBRARY_MEMOS.find(item => item.id === memo.id)).toMatchObject(memo);
    }
    expect(new Set(LIBRARY_MEMOS.map(memo => memo.id)).size).toBe(LIBRARY_MEMOS.length);
    expect(LIBRARY_MEMOS.some(memo => memo.id === "acsat-do-not-call")).toBe(false);
  });
  it("finds the added practical situations with the ACSAT zone filter", () => {
    const expected = ["acsat-account-question", "acsat-credit-question", "acsat-prime-question", "acsat-app-help", "acsat-thanks-services"];
    const results = searchLibrary("", ["acsat-green"], undefined, "acsat-green");
    for (const id of expected) expect(results.some(memo => memo.id === id)).toBe(true);
    expect(searchLibrary("Пароль", ["acsat-green"], ["acsat-app-help"], "acsat-green").map(memo => memo.id)).toEqual(["acsat-app-help"]);
    expect(searchLibrary("", ["acsat-critical"], expected)).toEqual([]);
  });
  it("keeps negative words contextual, not automatically banned", () => {
    expect(ACSAT_POLICY.automaticNegationBan).toBe(false);
  });
  it("does not escalate automatically based on sensitive words", () => {
    expect(ACSAT_POLICY.automaticSensitiveWordEscalation).toBe(false);
  });
  it("requires a confirmed event for congratulations", () => {
    expect(ACSAT_POLICY.congratulationsRequireConfirmedEvent).toBe(true);
  });
  it("stops sales after refusal and follows the applicable SMS procedure", () => {
    expect(ACSAT_POLICY.refusalStopsSales).toBe(true);
    expect(ACSAT_POLICY.smsRequiresApplicableProcedure).toBe(true);
  });
  it("provides eight detailed cross-sales scenarios", () => {
    expect(CROSS_SALES_MEMOS).toHaveLength(8);
    for (const memo of [...CROSS_SALES_MEMOS, ...ACSAT_CRITICAL_MEMOS, ...ACSAT_GREEN_MEMOS]) {
      expect(memo.phrases.length).toBeGreaterThanOrEqual(3);
      expect(memo.phrases.length).toBeLessThanOrEqual(5);
      expect(memo.dialogue.length).toBeGreaterThanOrEqual(2);
      expect(memo.principle.length).toBeGreaterThan(100);
      expect(memo.avoid.length).toBeGreaterThan(0);
    }
    expect(ACSAT_CRITICAL_MEMOS.length).toBeGreaterThan(1);
    expect(ACSAT_GREEN_MEMOS.length).toBeGreaterThan(1);
  });
  it("keeps objections to six situations and one or two short reactions", () => {
    expect(OBJECTION_MEMOS).toHaveLength(6);
    for (const memo of OBJECTION_MEMOS) expect(memo.phrases.length).toBeLessThanOrEqual(2);
    expect(OBJECTION_MEMOS.length).toBeLessThan(CSAT_CATEGORIES.flatMap(item => item.memos).length + ACSAT_CRITICAL_MEMOS.length + ACSAT_GREEN_MEMOS.length);
  });
  it("combines body search, section, category and favorites filters", () => {
    expect(searchLibrary("ПИН-коды", ["acsat-critical"]).map(memo => memo.id)).toEqual(["critical-data"]);
    expect(searchLibrary("Prime", ["cross-sales"])).toEqual([]);
    expect(searchLibrary("Prime", ["csat"], ["questions-prime"], "questions").map(memo => memo.id)).toEqual(["questions-prime"]);
    expect(searchLibrary("Prime", ["csat"], [], "questions")).toEqual([]);
    expect(searchLibrary("НАЧИСЛЕНИЕ СЧЁТУ", ["csat"]).map(memo => memo.id)).toEqual(["questions-account"]);
  });
  it("persists favorites after remount", async () => {
    const first = renderHook(() => useLibraryState());
    act(() => first.result.current.toggleFavorite("cross-credit"));
    first.unmount();
    const next = renderHook(() => useLibraryState());
    await waitFor(() => expect(next.result.current.favorites).toEqual(["cross-credit"]));
    act(() => next.result.current.toggleFavorite("cross-credit"));
    expect(next.result.current.favorites).toEqual([]);
  });
  it("persists recent opened memos separately from shift state", async () => {
    localStorage.setItem("my-shift-plan-v1", "unchanged");
    const first = renderHook(() => useLibraryState());
    act(() => first.result.current.visit("cross-credit"));
    act(() => first.result.current.visit("cross-savings"));
    act(() => first.result.current.visit("cross-credit"));
    first.unmount();
    const next = renderHook(() => useLibraryState());
    await waitFor(() => expect(next.result.current.recent).toEqual(["cross-credit", "cross-savings"]));
    expect(localStorage.getItem("my-shift-plan-v1")).toBe("unchanged");
  });
  it("safely handles invalid browser storage", () => {
    localStorage.setItem(LIBRARY_STORAGE_KEY, '{"favorites":[null,"unknown","cross-credit"],"recent":"bad"}');
    const hook = renderHook(() => useLibraryState());
    expect(hook.result.current.favorites).toEqual(["cross-credit"]);
    expect(hook.result.current.recent).toEqual([]);
  });
});
