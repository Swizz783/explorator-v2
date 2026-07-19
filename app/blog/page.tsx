import type { Metadata } from "next";
import ArticolCard from "../components/ArticolCard";
import { getArticole } from "../lib/articole";

export const metadata: Metadata = {
  title: "Blog · BucQuest",
};

export default async function BlogPage() {
  let articole: Awaited<ReturnType<typeof getArticole>> = [];
  try {
    articole = await getArticole();
  } catch {
    articole = [];
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-7 py-8 pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Blog
      </div>
      <h2 className="mt-2 text-2xl font-semibold">Articole</h2>

      {articole.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">Momentan nu sunt articole publicate.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articole.map((a) => (
            <ArticolCard key={a.id} articol={a} />
          ))}
        </div>
      )}
    </div>
  );
}
