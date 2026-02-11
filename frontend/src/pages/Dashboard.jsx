import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // NEW: Filter state
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch user once
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch properties whenever filters or page change
  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties", {
        params: {
          ...filters,
          page,
        },
      });

      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch properties error:", err);
    }
  };

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters({ ...filters, [e.target.name]: e.target.value });
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

  const toggleSave = async (propertyId) => {
    const res = await api.post(`/users/save/${propertyId}`);
    setUser({
      ...user,
      savedProperties: res.data.savedProperties,
    });
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

      {/* FILTER SECTION */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white p-4 rounded-xl shadow grid md:grid-cols-3 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search title..."
            value={filters.search}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />

          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />

          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* LISTINGS */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold mb-4">
          Available Listings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((p) => {
            const isExpanded = expandedId === p._id;
            const isSaved = user.savedProperties?.includes(p._id);

            return (
              <div
                key={p._id}
                className="bg-white p-5 rounded-xl shadow cursor-pointer"
                onClick={() =>
                  setExpandedId(isExpanded ? null : p._id)
                }
              >
                <h3 className="font-semibold text-blue-600">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {p.location}
                </p>
                <p className="text-sm font-medium mt-1">
                  ₹{p.price}
                </p>

                {isExpanded && (
                  <div className="mt-4 border-t pt-3 text-sm">
                    <p className="mb-3">{p.description}</p>

                    <div className="mb-3 text-gray-700">
                      <p>
                        <strong>Agent:</strong>{" "}
                        {p.createdBy?.name}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {p.createdBy?.email}
                      </p>
                      {p.createdBy?.phone && (
                        <p>
                          <strong>Phone:</strong>{" "}
                          {p.createdBy.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(p._id);
                        }}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          isSaved
                            ? "bg-green-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>

                      <button className="px-3 py-1 rounded bg-gray-800 text-white text-sm">
                        Contact Agent
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
