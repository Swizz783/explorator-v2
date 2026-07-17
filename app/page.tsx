import Explorator from "./components/Explorator";
import { getLocuri } from "./lib/locatii";

export default async function Home() {
  const locuri = await getLocuri();

  return (
    <div className="py-7">
      <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border border-line shadow-card">
        <Explorator locuri={locuri} />
      </div>
    </div>
  );
}
