import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { esteAdmin } from "../../lib/admin";
import { NEINDEXABIL } from "../../lib/seo";
import { createClient } from "../../lib/supabase/server";
import ArticolForm from "./ArticolForm";

export const metadata: Metadata = {
  title: "Adaugă articol · BucQuest",
  ...NEINDEXABIL,
};

/* Ruta nu apare in navigatie si e inaccesibila oricui in afara de ADMIN_EMAIL —
   pentru oricine altcineva (neautentificat sau alt cont) se comporta ca o pagina
   inexistenta (404), nu ca un ecran de "acces interzis" care ar confirma ca ruta exista. */
export default async function AdminArticolePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!esteAdmin(user?.email)) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-7 pb-16 sm:px-7 sm:py-8">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Admin
      </div>
      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Adaugă un articol nou</h2>
      <ArticolForm />
    </div>
  );
}
