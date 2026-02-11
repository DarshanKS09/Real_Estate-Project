import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, userRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get("/users/me"),
        ]);

        setProperty(propertyRes.data);
        setUser(userRes.data);
      } catch {
        console.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleSave = async () => {
    const res = await api.post(`/users/save/${id}`);
    setUser({
      ...user,
      savedProperties: res.data.savedProperties,
    });
  };

  const sendInquiry = async () => {
    if (!message.trim()) return alert("Enter a message");

    try {
      await api.post("/notifications/inquiry", {
        propertyId: id,
        message,
      });

      alert("Inquiry sent to agent");
      setShowContact(false);
      setMessage("");
    } catch {
      alert("Failed to send inquiry");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Property not found
      </div>
    );
  }

  const isSaved = user?.savedProperties?.includes(property._id);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-2">
            {property.title}
          </h1>
          <p className="text-gray-600 mb-2">
            {property.location}
          </p>
          <p className="text-xl font-semibold mb-6">
            ₹{property.price}
          </p>

          {/* IMAGES */}
          {property.images?.length > 0 && (
            <div className="mb-6">
              <img
                src={property.images[selectedImage]}
                className="w-full h-96 object-cover rounded-lg"
                alt="Property"
              />

              <div className="flex gap-3 mt-4">
                {property.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(i)}
                    className={`w-24 h-24 object-cover rounded cursor-pointer border ${
                      selectedImage === i
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">
              Description
            </h2>
            <p>{property.description}</p>
          </div>

          <div className="mb-6 border-t pt-4">
            <h2 className="font-semibold text-lg mb-2">
              Agent Information
            </h2>
            <p>
              <strong>Name:</strong>{" "}
              {property.createdBy?.name}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {property.createdBy?.email}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {property.createdBy?.phone}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={toggleSave}
              className={`px-4 py-2 rounded text-white ${
                isSaved
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
            >
              {isSaved ? "Saved" : "Save Property"}
            </button>

            <button
              onClick={() => setShowContact(true)}
              className="px-4 py-2 bg-gray-800 text-white rounded"
            >
              Contact Agent
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT MODAL */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Contact Agent
            </h2>

            <div className="space-y-2 mb-4 text-sm">
              <a
                href={`mailto:${property.createdBy?.email}`}
                className="text-blue-600 block"
              >
                📧 Email Agent
              </a>

              <a
                href={`tel:${property.createdBy?.phone}`}
                className="text-blue-600 block"
              >
                📞 Call Agent
              </a>

              <a
                href={`https://wa.me/${property.createdBy?.phone}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 block"
              >
                💬 WhatsApp Agent
              </a>
            </div>

            <textarea
              placeholder="Write your inquiry..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowContact(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={sendInquiry}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
