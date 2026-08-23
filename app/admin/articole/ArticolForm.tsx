"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { adaugaArticol, type StareFormular } from "./actions";

const stareInitiala: StareFormular = null;

const clasaInput =
  "w-full rounded-lg border border-line bg-plaster-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none";
const clasaLabel = "text-[12.5px] font-medium text-ink-soft";

/* Data de azi, in format YYYY-MM-DD (local, nu UTC — toISOString() ar putea
   sari o zi in urma/inainte langa miezul noptii, in functie de fus). */
function azi(): string {
  const d = new Date();
  const an = d.getFullYear();
  const luna = String(d.getMonth() + 1).padStart(2, "0");
  const zi = String(d.getDate()).padStart(2, "0");
  return `${an}-${luna}-${zi}`;
}

type Previzualizare = { url: string; nume: string };
type MetaCredit = { necesitaCredit: boolean; autor: string; sursaUrl: string; licenta: string };

const metaCreditGoala = (): MetaCredit => ({
  necesitaCredit: false,
  autor: "",
  sursaUrl: "",
  licenta: "",
});

export default function ArticolForm() {
  const [stare, actiune, pending] = useActionState(adaugaArticol, stareInitiala);
  const formRef = useRef<HTMLFormElement>(null);
  const [previzualizari, setPrevizualizari] = useState<Previzualizare[]>([]);
  const [crediteMeta, setCrediteMeta] = useState<MetaCredit[]>([]);
  const [ultimaStareGolita, setUltimaStareGolita] = useState<StareFormular>(null);

  // Golim lista de previzualizari in timpul randarii, o singura data per succes
  // (pattern recomandat de React pt. a "reactiona" la o schimbare de stare fara
  // un efect separat) — revocarea URL-urilor vechi se face mai jos, in cleanup-ul
  // efectului legat de `previzualizari`.
  if (stare?.ok && stare !== ultimaStareGolita) {
    setUltimaStareGolita(stare);
    setPrevizualizari([]);
    setCrediteMeta([]);
  }

  // Reseteaza formularul DOM (inclusiv input-ul de fisiere si data) dupa un
  // succes, ca sa fie gata pentru urmatorul articol.
  useEffect(() => {
    if (stare?.ok) {
      formRef.current?.reset();
    }
  }, [stare]);

  // Revoca URL-urile de previzualizare create la pasul anterior de fiecare data
  // cand lista se schimba (fisiere noi alese sau golire la succes) sau la unmount.
  useEffect(() => {
    return () => {
      previzualizari.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previzualizari]);

  function laSchimbareFisiere(e: React.ChangeEvent<HTMLInputElement>) {
    const fisiere = Array.from(e.target.files ?? []);
    setPrevizualizari(fisiere.map((f) => ({ url: URL.createObjectURL(f), nume: f.name })));
    setCrediteMeta(fisiere.map(() => metaCreditGoala()));
  }

  function actualizeazaCredit(index: number, parte: Partial<MetaCredit>) {
    setCrediteMeta((prev) => prev.map((m, i) => (i === index ? { ...m, ...parte } : m)));
  }

  return (
    <form ref={formRef} action={actiune} className="mt-5 flex flex-col gap-4">
      <input type="hidden" name="crediteMeta" value={JSON.stringify(crediteMeta)} />
      {stare && !stare.ok && (
        <p className="rounded-lg border border-[#e3b8b0] bg-[#fbecea] px-3 py-2.5 text-[13px] text-[#8a3b2e]">
          {stare.mesaj}
        </p>
      )}
      {stare?.ok && (
        <p className="rounded-lg border border-[#c2ddca] bg-[#e7f0ea] px-3 py-2.5 text-[13px] text-[#2c6a48]">
          {stare.mesaj}
        </p>
      )}

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Titlu</span>
        <input type="text" name="titlu" required className={clasaInput} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Rezumat</span>
        <textarea name="rezumat" required rows={2} className={clasaInput} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Conținut</span>
        <textarea name="continut" required rows={8} className={clasaInput} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Data publicării</span>
        <input type="date" name="dataPublicare" required defaultValue={azi()} className={clasaInput} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Poze</span>
        <input
          type="file"
          name="poze"
          accept="image/*"
          multiple
          onChange={laSchimbareFisiere}
          className="text-sm text-ink file:mr-3 file:rounded-lg file:border file:border-line file:bg-plaster-2 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:border-brand"
        />
      </label>

      {previzualizari.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {previzualizari.map((p, i) => {
            const meta = crediteMeta[i] ?? metaCreditGoala();
            return (
              <div key={p.url} className="flex flex-col gap-2 rounded-lg border border-line bg-plaster-2 p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- preview local (blob:), next/image nu are ce optimiza aici */}
                <img
                  src={p.url}
                  alt={p.nume}
                  className="aspect-square w-full rounded-md border border-line object-cover"
                />
                <label className="flex items-center gap-2 text-[12px] text-ink">
                  <input
                    type="checkbox"
                    checked={meta.necesitaCredit}
                    onChange={(e) => actualizeazaCredit(i, { necesitaCredit: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-line"
                  />
                  Nu e poza mea — are nevoie de credit
                </label>
                {meta.necesitaCredit && (
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Autor"
                      value={meta.autor}
                      onChange={(e) => actualizeazaCredit(i, { autor: e.target.value })}
                      className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-[12px] text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Sursă (link)"
                      value={meta.sursaUrl}
                      onChange={(e) => actualizeazaCredit(i, { sursaUrl: e.target.value })}
                      className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-[12px] text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Licență (ex: CC BY-SA 4.0)"
                      value={meta.licenta}
                      onChange={(e) => actualizeazaCredit(i, { licenta: e.target.value })}
                      className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-[12px] text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1.5 inline-flex w-full items-center justify-center rounded-[9px] bg-ink px-[22px] py-[13px] text-sm font-semibold text-plaster-2 transition hover:bg-brand-hover disabled:opacity-60"
      >
        {pending ? "Se salvează…" : "Adaugă articolul"}
      </button>
    </form>
  );
}
