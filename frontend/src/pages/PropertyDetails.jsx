import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    setUser((prev) => ({ ...prev, savedProperties: res.data.savedProperties }));
  };

  const sendInquiry = async () => {
    if (!message.trim()) return alert("Enter a message");
    try {
      await api.post("/notifications/inquiry", { propertyId: id, message });
      alert("Inquiry sent to agent");
      setShowContact(false);
      setMessage("");
    } catch {
      alert("Failed to send inquiry");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">Property not found</div>
    );

  const isSaved = user?.savedProperties?.includes(property._id);
  const hasImages = property.images?.length > 0;

  const prevImage = () => {
    if (!hasImages) return;
    setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if (!hasImages) return;
    setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="re-container pt-7">
        <button type="button" onClick={() => navigate(-1)} className="re-btn re-btn-ghost mb-5">
          Back
        </button>

        <article className="re-panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold">{property.title}</h1>
              <p className="text-slate-600 mt-1">{property.location}</p>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">Rs {property.price}</p>
          </div>

          {hasImages && (
            <section className="mt-6">
              <div className="relative">
                <img
                  src={property.images[selectedImage]}
                  className="w-full h-96 object-cover rounded-xl border border-slate-200"
                  alt="Property"
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 re-btn bg-black/50 text-white"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 re-btn bg-black/50 text-white"
                    >
                      Next
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {property.images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-lg border-2 overflow-hidden transition ${
                      selectedImage === i ? "border-blue-600 scale-[1.02]" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-24 h-20 object-cover" />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="mt-6">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-slate-700 leading-relaxed">{property.description}</p>
          </section>

          <section className="mt-6 border-t border-slate-200 pt-5">
            <h2 className="text-xl font-bold mb-2">Agent Information</h2>
            <p>
              <strong>Name:</strong> {property.createdBy?.name || "Not available"}
            </p>
            <p>
              <strong>Email:</strong> {property.createdBy?.email || "Not available"}
            </p>
            <p>
              <strong>Phone:</strong> {property.createdBy?.phone || "Not available"}
            </p>
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleSave}
              className={`re-btn ${isSaved ? "bg-emerald-700 text-white" : "re-btn-primary"}`}
            >
              {isSaved ? "Saved" : "Save Property"}
            </button>
            <button type="button" onClick={() => setShowContact(true)} className="re-btn re-btn-ghost">
              Contact Agent
            </button>
          </div>
        </article>
      </div>

      {showContact && (
        <div className="fixed inset-0 bg-slate-900/50 grid place-items-center p-4 z-40">
          <div className="re-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-extrabold mb-4">Contact Agent</h2>
            <div className="space-y-2 mb-4 text-sm">
              <a href={`mailto:${property.createdBy?.email}`} className="text-blue-700 hover:underline block">
                Email Agent
              </a>
              <a href={`tel:${property.createdBy?.phone}`} className="text-blue-700 hover:underline block">
                Call Agent
              </a>
              <a
                href={`https://wa.me/${property.createdBy?.phone}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline block"
              >
                WhatsApp Agent
              </a>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your inquiry..."
              className="re-textarea mb-4"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowContact(false)} className="re-btn re-btn-ghost">
                Cancel
              </button>
              <button type="button" onClick={sendInquiry} className="re-btn re-btn-primary">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
