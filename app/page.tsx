import Explorator from "./components/Explorator";

export default function Home() {
  return (
    <div className="py-7">
      <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border border-line shadow-card">
        <Explorator />
      </div>
    </div>
  );
}
