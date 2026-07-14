"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LOCURI } from "../data/locuri";

const STORAGE_KEY = "explorer2_visited";

/* Sursa unica pentru progresul de vizitare — acelasi localStorage key ca in
   proiectul vechi (ProgressStore), ca sa fie usor de inlocuit cu un backend
   mai tarziu fara sa schimbi logica din carduri/modal/header. */
type VisitedContextValue = {
  visited: Set<string>;
  toggle: (nume: string) => void;
  total: number;
};

const VisitedContext = createContext<VisitedContextValue | null>(null);

export function VisitedProvider({ children }: { children: ReactNode }) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  /* Incarcarea din localStorage se face dupa montare (nu in SSR),
     ca sa evitam neconcordante de hidratare intre server si client. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const nume: string[] = raw ? JSON.parse(raw) : [];
      setVisited(new Set(nume));
    } catch {
      // localStorage indisponibil (mod privat etc.) — ramanem cu Set gol.
    }
  }, []);

  function toggle(nume: string) {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(nume)) next.delete(nume);
      else next.add(nume);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignoram esecul de scriere (spatiu plin, mod privat etc.)
      }
      return next;
    });
  }

  const value = useMemo(
    () => ({ visited, toggle, total: LOCURI.length }),
    [visited],
  );

  return (
    <VisitedContext.Provider value={value}>
      {children}
    </VisitedContext.Provider>
  );
}

export function useVisited() {
  const ctx = useContext(VisitedContext);
  if (!ctx) throw new Error("useVisited trebuie folosit in VisitedProvider");
  return ctx;
}
