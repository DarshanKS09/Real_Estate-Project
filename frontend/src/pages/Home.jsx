import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const themes = {
  ocean: {
    label: "Ocean Blue",
    hero: "from-sky-950 via-cyan-900 to-blue-800",
    chip: "bg-sky-100 text-sky-800",
    ring: "ring-sky-400",
  },
  forest: {
    label: "Forest Green",
    hero: "from-emerald-950 via-teal-900 to-green-800",
    chip: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-400",
  },
  sunset: {
    label: "Sunset Gold",
    hero: "from-amber-950 via-orange-900 to-yellow-800",
    chip: "bg-amber-100 text-amber-900",
    ring: "ring-amber-400",
  },
};

export default function Home() {
  const [themeKey, setThemeKey] = useState("ocean");
  const theme = useMemo(() => themes[themeKey], [themeKey]);

  return (
    <div className="min-h-screen pb-10">
      <section className={`bg-gradient-to-br ${theme.hero} text-white`}>
        <div className="re-container py-20">
          <div className="max-w-3xl">
            <p className={`inline-flex re-badge ${theme.chip} mb-6`}>
              Premium Real Estate Experience
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Find homes, apartments and land with a modern property workflow.
            </h1>
            <p className="mt-6 text-lg text-slate-200">
              Explore verified listings, connect with trusted agents and manage your
              interest in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="re-btn re-btn-primary px-6 py-3">
                Explore Listings
              </Link>
              <Link
                to="/register"
                className="re-btn bg-white/10 border border-white/40 text-white px-6 py-3 hover:bg-white/20"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="re-container -mt-8">
        <div className="re-panel p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Theme Selector</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(themes).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setThemeKey(key)}
                  className={`re-btn re-btn-ghost ${
                    themeKey === key ? `ring-2 ${value.ring}` : ""
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="re-container py-12">
        <h2 className="text-3xl font-extrabold mb-8">Why It Feels Better</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <article className="re-card p-6">
            <h3 className="text-xl font-bold mb-2">Verified Inventory</h3>
            <p className="text-slate-600">
              Every listing comes from a registered agent profile to reduce fake entries.
            </p>
          </article>
          <article className="re-card p-6">
            <h3 className="text-xl font-bold mb-2">Fast Discovery</h3>
            <p className="text-slate-600">
              Filter by location, price and property type with responsive interaction.
            </p>
          </article>
          <article className="re-card p-6">
            <h3 className="text-xl font-bold mb-2">Direct Contact</h3>
            <p className="text-slate-600">
              Send inquiry messages instantly to agents from the property detail page.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
