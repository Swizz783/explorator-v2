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

export default function ArticolForm() {
  const [stare, actiune, pending] = useActionState(adaugaArticol, stareInitiala);
  const formRef = useRef<HTMLFormElement>(null);
  const [previzualizare, setPrevizualizare] = useState<{ url: string; nume: string } | null>(null);
  const [ultimaStareGolita, setUltimaStareGolita] = useState<StareFormular>(null);

  // Golim previzualizarea in timpul randarii, o singura data per succes
  // (pattern recomandat de React pt. a "reactiona" la o schimbare de stare fara
  // un efect separat) — revocarea URL-ului vechi se face mai jos, in cleanup-ul
  // efectului legat de `previzualizare`.
  if (stare?.ok && stare !== ultimaStareGolita) {
    setUltimaStareGolita(stare);
    setPrevizualizare(null);
  }

  // Reseteaza formularul DOM (inclusiv input-ul de fisier si data) dupa un
  // succes, ca sa fie gata pentru urmatorul articol.
  useEffect(() => {
    if (stare?.ok) {
      formRef.current?.reset();
    }
  }, [stare]);

  // Revoca URL-ul de previzualizare creat la pasul anterior de fiecare data
  // cand se schimba (poza noua aleasa sau golire la succes) sau la unmount.
  useEffect(() => {
    return () => {
      if (previzualizare) URL.revokeObjectURL(previzualizare.url);
    };
  }, [previzualizare]);

  function laSchimbarePoza(e: React.ChangeEvent<HTMLInputElement>) {
    const fisier = e.target.files?.[0] ?? null;
    setPrevizualizare(fisier ? { url: URL.createObjectURL(fisier), nume: fisier.name } : null);
  }

  return (
    <form ref={formRef} action={actiune} className="mt-5 flex flex-col gap-4">
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
        <span className={clasaLabel}>Poză</span>
        <input
          type="file"
          name="poza"
          accept="image/*"
          onChange={laSchimbarePoza}
          className="text-sm text-ink file:mr-3 file:rounded-lg file:border file:border-line file:bg-plaster-2 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:border-brand"
        />
      </label>

      {previzualizare && (
        // eslint-disable-next-line @next/next/no-img-element -- preview local (blob:), next/image nu are ce optimiza aici
        <img
          src={previzualizare.url}
          alt={previzualizare.nume}
          className="aspect-video w-full max-w-[280px] rounded-lg border border-line object-cover"
        />
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
