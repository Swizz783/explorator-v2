"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Loc } from "../data/locuri";
import { calculeazaAchievements } from "../lib/achievements";
import { createClient } from "../lib/supabase/client";

const STORAGE_KEY = "explorer2_visited";
const DURATA_TOAST_MS = 3500;
const DURATA_IESIRE_MS = 300;

/* Sursa unica pentru progresul de vizitare. Vizitatori neautentificati: localStorage,
   ca inainte. Utilizatori autentificati: Supabase (tabelul `vizitat`), ca progresul
   sa fie acelasi pe orice calculator — vezi `userId`/`initialVisited` mai jos. */
type VisitedContextValue = {
  visited: Set<string>;
  toggle: (nume: string) => void;
  total: number;
};

type Toast = {
  id: string;
  titlu: string;
  subtitlu: string;
  iese?: boolean;
};

const VisitedContext = createContext<VisitedContextValue | null>(null);

export function VisitedProvider({
  total,
  userId,
  initialVisited,
  locuri,
  children,
}: {
  total: number;
  userId: string | null;
  initialVisited: string[];
  locuri: Loc[];
  children: ReactNode;
}) {
  const [visited, setVisited] = useState<Set<string>>(() => new Set(initialVisited));
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* Pentru utilizatori autentificati, progresul vine deja din Supabase prin
     `initialVisited` (incarcat server-side in layout) — nu mai citim localStorage. */
  useEffect(() => {
    if (userId) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const nume: string[] = raw ? JSON.parse(raw) : [];
      setVisited(new Set(nume));
    } catch {
      // localStorage indisponibil (mod privat etc.) — ramanem cu Set gol.
    }
  }, [userId]);

  function afiseazaToast(titlu: string, subtitlu: string) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, titlu, subtitlu }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, iese: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, DURATA_IESIRE_MS);
    }, DURATA_TOAST_MS);
  }

  /* Compara achievements inainte/dupa toggle si anunta prin toast doar
     categoriile care tocmai au devenit complete (0 -> 100%). */
  function anuntaAchievementsNoi(setAnterior: Set<string>, setNou: Set<string>) {
    const inainte = calculeazaAchievements(locuri, setAnterior);
    const dupa = calculeazaAchievements(locuri, setNou);

    for (const a of dupa) {
      if (a.total === 0 || a.vizitate !== a.total) continue;
      const anterior = inainte.find((x) => x.id === a.id);
      const eraDejaComplet = anterior ? anterior.vizitate === anterior.total : false;
      if (!eraDejaComplet) {
        afiseazaToast(a.nume, `${a.eticheta}: ${a.vizitate}/${a.total}`);
      }
    }
  }

  function toggle(nume: string) {
    const vaFiVizitat = !visited.has(nume);
    const next = new Set(visited);
    if (vaFiVizitat) next.add(nume);
    else next.delete(nume);
    setVisited(next);
    anuntaAchievementsNoi(visited, next);

    if (!userId) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignoram esecul de scriere (spatiu plin, mod privat etc.)
      }
      return;
    }

    const supabase = createClient();
    const request = vaFiVizitat
      ? supabase.from("vizitat").upsert({ user_id: userId, locatie_nume: nume })
      : supabase.from("vizitat").delete().match({ user_id: userId, locatie_nume: nume });

    request.then(({ error }) => {
      if (!error) return;
      console.error("Nu am putut sincroniza progresul cu Supabase:", error.message);
      // Revenim la starea dinainte daca scrierea in Supabase a esuat.
      setVisited((prev) => {
        const revert = new Set(prev);
        if (vaFiVizitat) revert.delete(nume);
        else revert.add(nume);
        return revert;
      });
    });
  }

  const value: VisitedContextValue = { visited, toggle, total };

  return (
    <VisitedContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-[280px] rounded-[11px] border border-[#e8d2a8] bg-[#f3e7d4] px-4 py-3 shadow-card transition-all duration-300 ${
              t.iese ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8a5a1f]">
              Realizare deblocată
            </div>
            <div className="mt-1 text-[14.5px] font-semibold text-[#5a3f16]">{t.titlu}</div>
            <div className="mt-0.5 text-[12px] text-[#8a6a30]">{t.subtitlu}</div>
          </div>
        ))}
      </div>
    </VisitedContext.Provider>
  );
}

export function useVisited() {
  const ctx = useContext(VisitedContext);
  if (!ctx) throw new Error("useVisited trebuie folosit in VisitedProvider");
  return ctx;
}
