"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { CULOARE_STIL, CULOARE_TIP, type Stil, type Tip } from "../../data/locuri";
import { createClient } from "../../lib/supabase/client";
import { adaugaLocatie, obtineUrlUrcare, type StareFormular } from "./actions";

const TIPURI = Object.keys(CULOARE_TIP) as Tip[];
const STILURI = Object.keys(CULOARE_STIL) as Stil[];

const stareInitiala: StareFormular = null;

const clasaInput =
  "w-full rounded-lg border border-line bg-plaster-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none";
const clasaLabel = "text-[12.5px] font-medium text-ink-soft";

type Previzualizare = { url: string; nume: string };
type MetaCredit = { necesitaCredit: boolean; autor: string; sursaUrl: string; licenta: string };

const metaCreditGoala = (): MetaCredit => ({
  necesitaCredit: false,
  autor: "",
  sursaUrl: "",
  licenta: "",
});

export default function LocatieForm() {
  const [stare, actiune, pending] = useActionState(adaugaLocatie, stareInitiala);
  const formRef = useRef<HTMLFormElement>(null);
  const [previzualizari, setPrevizualizari] = useState<Previzualizare[]>([]);
  const [fisiere, setFisiere] = useState<File[]>([]);
  const [crediteMeta, setCrediteMeta] = useState<MetaCredit[]>([]);
  const [ultimaStareGolita, setUltimaStareGolita] = useState<StareFormular>(null);
  const [seUrca, setSeUrca] = useState(false);
  const [eroareUrcare, setEroareUrcare] = useState<string | null>(null);

  // Golim lista de previzualizari in timpul randarii, o singura data per succes
  // (pattern recomandat de React pt. a "reactiona" la o schimbare de stare fara
  // un efect separat) — revocarea URL-urilor vechi se face mai jos, in cleanup-ul
  // efectului legat de `previzualizari`.
  if (stare?.ok && stare !== ultimaStareGolita) {
    setUltimaStareGolita(stare);
    setPrevizualizari([]);
    setFisiere([]);
    setCrediteMeta([]);
  }

  // Reseteaza formularul DOM (inclusiv input-ul de fisiere) dupa un succes,
  // ca sa fie gata pentru urmatoarea locatie.
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
    const fisiereNoi = Array.from(e.target.files ?? []);
    setFisiere(fisiereNoi);
    setPrevizualizari(fisiereNoi.map((f) => ({ url: URL.createObjectURL(f), nume: f.name })));
    setCrediteMeta(fisiereNoi.map(() => metaCreditGoala()));
  }

  function actualizeazaCredit(index: number, parte: Partial<MetaCredit>) {
    setCrediteMeta((prev) => prev.map((m, i) => (i === index ? { ...m, ...parte } : m)));
  }

  // Pozele nu mai trec prin Server Action (limita fixa de 4.5MB/request pe
  // Vercel) — se urca direct din browser catre Supabase Storage, folosind
  // URL-uri de urcare semnate obtinute de la server, apoi se trimit doar
  // URL-urile publice rezultate catre adaugaLocatie.
  async function laSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEroareUrcare(null);

    const formEl = formRef.current;
    if (!formEl) return;

    const formData = new FormData(formEl);
    formData.delete("poze");
    formData.append("crediteMeta", JSON.stringify(crediteMeta));

    if (fisiere.length === 0) {
      startTransition(() => {
        actiune(formData);
      });
      return;
    }

    setSeUrca(true);
    try {
      const rezultat = await obtineUrlUrcare(fisiere.map((f) => f.name));
      if (!rezultat.ok) {
        setEroareUrcare(rezultat.mesaj);
        return;
      }

      const supabase = createClient();
      for (let i = 0; i < rezultat.urlUri.length; i++) {
        const { cale, token, publicUrl } = rezultat.urlUri[i];
        const fisier = fisiere[i];
        const { error } = await supabase.storage.from("locatii").uploadToSignedUrl(cale, token, fisier);

        if (error) {
          setEroareUrcare(`Nu s-a putut urca poza "${fisier.name}": ${error.message}`);
          return;
        }

        formData.append("poze", publicUrl);
      }

      startTransition(() => {
        actiune(formData);
      });
    } finally {
      setSeUrca(false);
    }
  }

  const seSalveaza = seUrca || pending;

  return (
    <form ref={formRef} onSubmit={laSubmit} className="mt-5 flex flex-col gap-4">
      {eroareUrcare && (
        <p className="rounded-lg border border-[#e3b8b0] bg-[#fbecea] px-3 py-2.5 text-[13px] text-[#8a3b2e]">
          {eroareUrcare}
        </p>
      )}
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
        <span className={clasaLabel}>Nume</span>
        <input type="text" name="nume" required className={clasaInput} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Adresă</span>
        <input type="text" name="adresa" required className={clasaInput} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className={clasaLabel}>An (opțional)</span>
          <input type="text" name="an" className={clasaInput} placeholder="ex. 1936" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={clasaLabel}>Arhitect (opțional)</span>
          <input
            type="text"
            name="arhitect"
            className={clasaInput}
            placeholder="ex: Horia Maicu — sau «Arhitect necunoscut» dacă nu se cunoaște"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className={clasaLabel}>Tip</span>
          <select name="tip" required defaultValue="" className={clasaInput}>
            <option value="" disabled>
              Alege un tip
            </option>
            {TIPURI.map((tip) => (
              <option key={tip} value={tip}>
                {tip}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={clasaLabel}>Stil (opțional)</span>
          <select name="stil" defaultValue="" className={clasaInput}>
            <option value="">— fără stil —</option>
            {STILURI.map((stil) => (
              <option key={stil} value={stil}>
                {stil}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2.5">
        <input type="checkbox" name="nerenovat" className="h-4 w-4 rounded border-line" />
        <span className="text-sm text-ink">Nerenovat</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className={clasaLabel}>Latitudine (opțional)</span>
          <input type="text" name="lat" inputMode="decimal" className={clasaInput} placeholder="ex. 44.4368" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={clasaLabel}>Longitudine (opțional)</span>
          <input type="text" name="lng" inputMode="decimal" className={clasaInput} placeholder="ex. 26.0920" />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Descriere scurtă</span>
        <textarea name="descriereScurta" required rows={2} className={clasaInput} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={clasaLabel}>Descriere lungă</span>
        <textarea name="descriereLunga" required rows={5} className={clasaInput} />
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
        disabled={seSalveaza}
        className="mt-1.5 inline-flex w-full items-center justify-center rounded-[9px] bg-ink px-[22px] py-[13px] text-sm font-semibold text-plaster-2 transition hover:bg-brand-hover disabled:opacity-60"
      >
        {seSalveaza ? "Se salvează…" : "Adaugă locația"}
      </button>
    </form>
  );
}
