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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, userRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get("/users/me"),
        ]);

        setProperty(propertyRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleSave = async () => {
    try {
      const res = await api.post(`/users/save/${id}`);
      setUser({
        ...user,
        savedProperties: res.data.savedProperties,
      });
    } catch {
      console.error("Save failed");
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
          {/* TITLE */}
          <h1 className="text-2xl font-bold mb-2">
            {property.title}
          </h1>
          <p className="text-gray-600 mb-2">
            {property.location}
          </p>
          <p className="text-xl font-semibold mb-6">
            ₹{property.price}
          </p>

          {/* IMAGE SECTION */}
          {property.images && property.images.length > 0 && (
            <div className="mb-6">
              <img
                src={property.images[selectedImage]}
                alt="Property"
                className="w-full h-96 object-cover rounded-lg"
              />

              <div className="flex gap-3 mt-4 overflow-x-auto">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Thumbnail"
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`w-24 h-24 object-cover rounded cursor-pointer border ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">
              Description
            </h2>
            <p className="text-gray-700">
              {property.description}
            </p>
          </div>

          {/* AGENT INFO */}
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
            {property.createdBy?.phone && (
              <p>
                <strong>Phone:</strong>{" "}
                {property.createdBy.phone}
              </p>
            )}
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

            <button className="px-4 py-2 bg-gray-800 text-white rounded">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
