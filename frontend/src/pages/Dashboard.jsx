import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
        setProfileForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [location, sort, propertyType]);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties", { params: { location, sort, propertyType } });
      setProperties(res.data.properties);
    } catch (err) {
      console.error("Fetch properties error:", err);
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  const handleSaveProfile = async () => {
    const res = await api.put("/users/me", profileForm);
    setUser(res.data);
    setShowProfile(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">Unauthorized</div>
    );

  return (
    <div className="min-h-screen pb-10">
      <header className="re-panel rounded-none border-x-0 border-t-0">
        <div className="re-container py-4 flex items-center justify-between gap-4">
          <div>
            <p className="re-badge re-badge-soft mb-1">Buyer Dashboard</p>
            <h1 className="text-2xl font-extrabold">Welcome, {user.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowProfile((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold hover:scale-105 transition"
              title="Toggle Profile"
            >
              {user.name?.charAt(0).toUpperCase()}
            </button>
            <button type="button" onClick={handleLogout} className="re-btn bg-red-600 text-white">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="re-container mt-6 space-y-6">
        {showProfile && (
          <section className="re-panel p-6">
            <h2 className="text-xl font-bold mb-4">My Profile</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="re-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Name"
              />
              <input className="re-input bg-slate-100" value={user.email} disabled />
              <input
                className="re-input"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Phone"
              />
              <textarea
                className="re-textarea md:col-span-2"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                placeholder="Address"
              />
            </div>
            <button type="button" onClick={handleSaveProfile} className="re-btn re-btn-primary mt-4">
              Save Profile
            </button>
          </section>
        )}

        <section className="re-panel p-5">
          <h2 className="text-xl font-bold mb-4">Search & Filter</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              className="re-input"
              type="text"
              placeholder="Enter Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <select className="re-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort By Price</option>
              <option value="price_asc">Low to High</option>
              <option value="price_desc">High to Low</option>
            </select>
            <select
              className="re-select"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="land">Land</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold mb-4">Available Listings</h2>
          {properties.length === 0 && <p className="text-slate-600">No listings found.</p>}
          <div className="grid md:grid-cols-2 gap-5">
            {properties.map((p) => (
              <article
                key={p._id}
                onClick={() => navigate(`/property/${p._id}`)}
                className="re-card p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <p className="text-slate-600">{p.location}</p>
                  </div>
                  <span className="re-badge re-badge-soft">{p.propertyType}</span>
                </div>
                <p className="text-2xl font-extrabold mt-4">Rs {p.price}</p>
                <p className="text-sm text-slate-500 mt-1">Click to open full details</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
