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

  useEffect(() => {
    Promise.all([api.get("/users/me"), api.get("/properties")])
      .then(([userRes, propRes]) => {
        setUser(userRes.data);
        setProperties(propRes.data);
        setProfileForm({
          name: userRes.data.name || "",
          phone: userRes.data.phone || "",
          address: userRes.data.address || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  const handleSaveProfile = async () => {
    const res = await api.put("/users/me", profileForm);
    setUser(res.data);
    setShowProfile(false); // ✅ CLOSE profile panel after save
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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            Welcome, {user.name}
          </h1>

          <div className="flex items-center gap-4">
            {/* Profile avatar */}
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

      {/* Profile Section */}
      {showProfile && (
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">My Profile</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
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
              placeholder="Phone"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <textarea
              placeholder="Address"
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

      {/* Listings */}
      <div className="max-w-6xl mx-auto px-6 py-10">
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

                    {/* ✅ Agent contact details */}
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

                    {/* Actions */}
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

                      <button
                        className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
                      >
                        Contact Agent
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
