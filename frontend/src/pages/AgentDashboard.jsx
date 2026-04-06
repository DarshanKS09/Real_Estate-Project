import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
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
    Promise.all([api.get("/users/me"), fetchNotifications(), fetchMyProperties()])
      .then(([userRes]) => setUser(userRes.data))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
      await api.put(`/notifications/${selectedNotification._id}/read`);
      fetchNotifications();
    }
    setSelectedNotification(null);
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setEditingProperty(null);
    setShowForm(false);
    setImages([]);
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      propertyType: "house",
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
      submitData.append("propertyType", formData.propertyType);
      for (let i = 0; i < images.length; i += 1) submitData.append("images", images[i]);

      if (editingProperty) {
        await api.put(`/properties/${editingProperty._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Property updated");
      } else {
        await api.post("/properties", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Property created");
      }

      fetchMyProperties();
      resetForm();
    } catch {
      setMessage("Failed to save property");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    await api.delete(`/properties/${id}`);
    fetchMyProperties();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pb-10">
      <header className="re-panel rounded-none border-x-0 border-t-0">
        <div className="re-container py-4 flex items-center justify-between gap-4">
          <div>
            <p className="re-badge re-badge-soft mb-1">Agent Worksp</p>
            <h1 className="text-2xl font-extrabold">Hello, {user?.name || "Agent"}</h1>
          </div>
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="re-btn re-btn-ghost relative"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full bg-red-600 text-white text-xs grid place-items-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            <button type="button" onClick={handleLogout} className="re-btn bg-red-600 text-white">
              Logout
            </button>
            {showNotifications && (
              <div className="absolute top-14 right-0 w-80 re-panel p-2 z-20 max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500 p-3">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      type="button"
                      onClick={() => openNotificationDetails(n)}
                      className={`text-left w-full p-3 rounded-lg transition ${
                        n.isRead ? "hover:bg-slate-50" : "bg-sky-50 hover:bg-sky-100"
                      }`}
                    >
                      <p className="font-semibold text-sm">{n.title || "Property Inquiry"}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {n.message || "You have a new message from an interested buyer."}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="re-container mt-6">
        {!showForm ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-extrabold">My Listings</h2>
              <button
                type="button"
                onClick={() => {
                  setEditingProperty(null);
                  setShowForm(true);
                }}
                className="re-btn re-btn-primary"
              >
                Add New Property
              </button>
            </div>

            {myProperties.length === 0 ? (
              <div className="re-panel p-6 text-slate-600">No listings yet</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myProperties.map((p) => (
                  <article key={p._id} className="re-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">{p.title}</h3>
                        <p className="text-slate-600 text-sm">{p.location}</p>
                      </div>
                      <span className="re-badge re-badge-soft">{p.propertyType}</span>
                    </div>
                    <p className="text-xl font-extrabold mt-3">Rs {p.price}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProperty(p);
                          setFormData({
                            title: p.title,
                            description: p.description,
                            price: p.price,
                            location: p.location,
                            propertyType: p.propertyType,
                          });
                          setShowForm(true);
                        }}
                        className="re-btn bg-amber-500 text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id)}
                        className="re-btn bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="re-panel p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-extrabold">
                {editingProperty ? "Edit Property" : "Add New Property"}
              </h2>
              <button type="button" onClick={resetForm} className="re-btn re-btn-ghost">
                Cancel
              </button>
            </div>

            {message && <p className="mb-3 text-sm font-semibold text-blue-700">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="re-input"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="re-textarea"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="re-input"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="re-input"
              />
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="re-select"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
              </select>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                className="re-input"
              />
              <button type="submit" className="re-btn re-btn-primary">
                {editingProperty ? "Update Property" : "Create Property"}
              </button>
            </form>
          </section>
        )}
      </main>

      {selectedNotification && (
        <div className="fixed inset-0 bg-slate-900/45 grid place-items-center p-4 z-30">
          <div className="re-panel w-full max-w-xl p-6">
            <h3 className="text-xl font-extrabold mb-2">
              {selectedNotification.title || "Property Inquiry"}
            </h3>
            <p className="text-slate-700 mb-6">
              {selectedNotification.message || "No message body provided."}
            </p>
            <button type="button" onClick={closeNotificationDetails} className="re-btn re-btn-primary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
