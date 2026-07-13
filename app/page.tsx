import Harta from "./components/HartaClient";

export default function Home() {
  return (
    <div className="py-7">
      <div className="h-[70vh] overflow-hidden rounded-xl border border-line shadow-card">
        <Harta />
      </div>
    </div>
  );
}
