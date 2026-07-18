import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { createClient } from "../lib/supabase/server";

export const metadata: Metadata = {
  title: "Autentificare · BucQuest",
};

type Props = {
  searchParams: Promise<{ eroare?: string; mesaj?: string }>;
};

export default async function AutentificarePage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { eroare, mesaj } = await searchParams;

  return <AuthForm eroare={eroare} mesaj={mesaj} />;
}
