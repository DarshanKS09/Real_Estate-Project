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

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

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
      const res = await api.get("/properties", {
        params: {
          location,
          sort,
          propertyType,
        },
      });

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

  const highlightMatch = (text) => {
    if (!location) return text;
    const regex = new RegExp(`(${location})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            Welcome, {user.name}
          </h1>

          <div className="flex items-center gap-4">
            <div
              onClick={() => setShowProfile(!showProfile)}
              className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer"
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* PROFILE */}
      {showProfile && (
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">My Profile</h2>

          <div className="space-y-3">
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />

            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <textarea
              value={profileForm.address}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  address: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            />

            <button
              onClick={handleSaveProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="">Sort By Price</option>
            <option value="price_asc">Low → High</option>
            <option value="price_desc">High → Low</option>
          </select>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="">All Types</option>
            <option value="land">Land</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
      </div>

      {/* LISTINGS */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold mb-4">
          Available Listings
        </h2>

        {properties.length === 0 && (
          <p className="text-gray-500">No listings found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/property/${p._id}`)}
              className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition"
            >
              {/* IMAGE */}
              {p.images && p.images.length > 0 ? (
                <img
                  src={p.images[0]}
                  alt="Property"
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-xl">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-blue-600">
                  {p.title}
                </h3>

                <p
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(p.location),
                  }}
                />

                <p className="text-sm font-medium mt-1">
                  ₹{p.price}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Type: {p.propertyType}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
