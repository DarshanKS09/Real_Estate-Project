import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AgentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [myProperties, setMyProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] =
    useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "house",
  });

  const [images, setImages] = useState([]);

  const fetchNotifications = async () => {
    const res = await api.get("/notifications/my");
    setNotifications(res.data);
  };

  const fetchMyProperties = async () => {
    const res = await api.get("/properties/my");
    setMyProperties(res.data);
  };

  useEffect(() => {
    Promise.all([
      api.get("/users/me"),
      fetchNotifications(),
      fetchMyProperties(),
    ])
      .then(([userRes]) => {
        setUser(userRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const handleLogout = async () => {
    await api.post("/auth/logout");
    navigate("/");
  };

  const openNotificationDetails = (n) => {
    setSelectedNotification(n);
    setShowNotifications(false);
  };

  const closeNotificationDetails = async () => {
    if (!selectedNotification) return;

    if (!selectedNotification.isRead) {
      await api.put(
        `/notifications/${selectedNotification._id}/read`
      );
      fetchNotifications();
    }

    setSelectedNotification(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", Number(formData.price));
      submitData.append("location", formData.location);
      submitData.append(
        "propertyType",
        formData.propertyType
      );

      for (let i = 0; i < images.length; i++) {
        submitData.append("images", images[i]);
      }

      if (editingProperty) {
        await api.put(
          `/properties/${editingProperty._id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setMessage("Property updated");
      } else {
        await api.post("/properties", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Property created");
      }

      fetchMyProperties();
      setShowForm(false);
      setEditingProperty(null);
      setImages([]);
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        propertyType: "house",
      });
    } catch {
      setMessage("Failed to save property");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    await api.delete(`/properties/${id}`);
    fetchMyProperties();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            Agent Dashboard
          </h1>

          <div className="flex items-center gap-4 relative">
            <div
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="cursor-pointer relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">
                  {unreadCount}
                </span>
              )}
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        {!showForm ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <h2 className="font-semibold text-lg mb-2">
                My Listings
              </h2>

              {myProperties.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No listings yet
                </p>
              ) : (
                <ul className="space-y-2">
                  {myProperties.map((p) => (
                    <li
                      key={p._id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-sm">
                        {p.title} — ₹{p.price}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProperty(p);
                            setFormData({
                              title: p.title,
                              description: p.description,
                              price: p.price,
                              location: p.location,
                              propertyType:
                                p.propertyType,
                            });
                            setShowForm(true);
                          }}
                          className="text-xs px-2 py-1 bg-yellow-400 text-white rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(p._id)
                          }
                          className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
              >
                ➕ Add New Property
              </button>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingProperty
                ? "Edit Property"
                : "Add New Property"}
            </h2>

            {message && (
              <p className="mb-3 text-sm text-blue-600">
                {message}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full border p-2 rounded"
              />

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="w-full border p-2 rounded"
              />

              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="house">House</option>
                <option value="apartment">
                  Apartment
                </option>
                <option value="land">Land</option>
              </select>

              {/* IMAGE UPLOAD */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages(e.target.files)
                }
                className="w-full"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingProperty
                  ? "Update Property"
                  : "Create Property"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
