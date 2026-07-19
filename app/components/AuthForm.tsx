"use client";

import { useState } from "react";
import { login, loginWithGoogle, signup } from "../autentificare/actions";

type Props = {
  eroare?: string;
  mesaj?: string;
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

/* Formular de autentificare/inregistrare — toggle intre cele doua moduri,
   ambele trimit prin Server Actions (login/signup), plus login cu Google. */
export default function AuthForm({ eroare, mesaj }: Props) {
  const [mod, setMod] = useState<"login" | "inregistrare">("login");

  return (
    <div className="mx-auto w-full max-w-[400px] px-7 py-10">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Cont
      </div>
      <h2 className="mt-2 text-2xl font-semibold">
        {mod === "login" ? "Autentificare" : "Creează cont"}
      </h2>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMod("login")}
          className={`flex-1 rounded-full border px-3 py-[7px] text-[12.5px] font-medium transition ${
            mod === "login"
              ? "border-ink bg-ink text-plaster-2"
              : "border-line bg-card text-ink-soft hover:border-enamel"
          }`}
        >
          Am deja cont
        </button>
        <button
          type="button"
          onClick={() => setMod("inregistrare")}
          className={`flex-1 rounded-full border px-3 py-[7px] text-[12.5px] font-medium transition ${
            mod === "inregistrare"
              ? "border-ink bg-ink text-plaster-2"
              : "border-line bg-card text-ink-soft hover:border-enamel"
          }`}
        >
          Cont nou
        </button>
      </div>

      {eroare && (
        <p className="mt-4 rounded-lg border border-[#e3b8b0] bg-[#fbecea] px-3 py-2.5 text-[13px] text-[#8a3b2e]">
          {eroare}
        </p>
      )}
      {mesaj && (
        <p className="mt-4 rounded-lg border border-[#c2ddca] bg-[#e7f0ea] px-3 py-2.5 text-[13px] text-[#2c6a48]">
          {mesaj}
        </p>
      )}

      <form
        key={mod}
        action={mod === "login" ? login : signup}
        className="mt-5 flex flex-col gap-3.5"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-soft">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-line bg-plaster-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-enamel focus:outline-none"
            placeholder="nume@exemplu.ro"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-soft">Parolă</span>
          <input
            type="password"
            name="parola"
            required
            minLength={6}
            autoComplete={mod === "login" ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-line bg-plaster-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-enamel focus:outline-none"
            placeholder="minimum 6 caractere"
          />
        </label>

        <button
          type="submit"
          className="mt-1.5 inline-flex w-full items-center justify-center rounded-[9px] bg-ink px-[22px] py-[13px] text-sm font-semibold text-plaster-2 transition hover:bg-enamel-deep"
        >
          {mod === "login" ? "Intră în cont" : "Creează cont"}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.14em] text-ink-soft">
        <span className="h-px flex-1 bg-line" />
        sau
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={loginWithGoogle} className="mt-4">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-[9px] border border-line bg-card px-[22px] py-[13px] text-sm font-semibold text-ink transition hover:border-enamel"
        >
          <GoogleIcon />
          Continuă cu Google
        </button>
      </form>
    </div>
  );
}
