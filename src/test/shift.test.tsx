import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useShift } from "@/lib/shift";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("Existing shift behavior", () => {
  it("keeps completed tasks after remount and updates progress", async () => {
    const first = renderHook(() => useShift());
    act(() => first.result.current.toggle("t1"));
    expect(first.result.current.percent).toBe(14);
    first.unmount();
    const second = renderHook(() => useShift());
    await waitFor(() => expect(second.result.current.done).toContain("t1"));
    expect(second.result.current.doneCount).toBe(1);
  });
  it("resets tasks and the win for a new shift", () => {
    const hook = renderHook(() => useShift());
    act(() => { hook.result.current.toggle("t1"); hook.result.current.setWin("Победа"); });
    act(() => hook.result.current.reset());
    expect(hook.result.current.done).toEqual([]);
    expect(hook.result.current.win).toBeNull();
    expect(hook.result.current.percent).toBe(0);
  });
});