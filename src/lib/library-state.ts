import { useEffect, useState } from "react";
import { LIBRARY_MEMOS } from "./library-content";
export const LIBRARY_STORAGE_KEY = "my-shift-library-v1";
export type LibraryState = { favorites: string[]; recent: string[] };
const empty: LibraryState = { favorites: [], recent: [] };
const ids = new Set(LIBRARY_MEMOS.map(memo => memo.id));
const listeners = new Set<(state: LibraryState) => void>();
export function readLibraryState(): LibraryState {
  try {
    const value = JSON.parse(localStorage.getItem(LIBRARY_STORAGE_KEY) ?? "{}");
    const clean = (list: unknown): string[] => Array.isArray(list) ? [...new Set(list.filter((id): id is string => typeof id === "string" && ids.has(id)))] : [];
    return { favorites: clean(value?.favorites), recent: clean(value?.recent).slice(0, 8) };
  } catch { return empty; }
}
export function toggleLibraryFavorite(state: LibraryState, id: string): LibraryState {
  if (!ids.has(id)) return state;
  return { ...state, favorites: state.favorites.includes(id) ? state.favorites.filter(item => item !== id) : [...state.favorites, id] };
}
export function recordLibraryVisit(state: LibraryState, id: string): LibraryState {
  if (!ids.has(id)) return state;
  return { ...state, recent: [id, ...state.recent.filter(item => item !== id)].slice(0, 8) };
}
export function useLibraryState() {
  const [state, setState] = useState<LibraryState>(empty);
  const [storageUnavailable, setUnavailable] = useState(false);
  useEffect(() => {
    setState(readLibraryState());
    listeners.add(setState);
    const sync = (event: StorageEvent) => { if (event.key === LIBRARY_STORAGE_KEY || event.key === null) setState(readLibraryState()); };
    window.addEventListener("storage", sync);
    return () => { listeners.delete(setState); window.removeEventListener("storage", sync); };
  }, []);
  function update(next: LibraryState) {
    try { localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(next)); setUnavailable(false); }
    catch { setUnavailable(true); }
    listeners.forEach(listener => listener(next));
  }
  return { ...state, storageUnavailable, toggleFavorite: (id: string) => update(toggleLibraryFavorite(state, id)), visit: (id: string) => update(recordLibraryVisit(state, id)) };
}
