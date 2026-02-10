import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Property
          </h1>

          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Buy, rent, or explore properties with trusted agents.
            Simple. Secure. Reliable.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Properties
            </Link>

            <Link
              to="/login"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Verified Listings
            </h3>
            <p className="text-gray-600">
              All properties are listed by verified agents to ensure trust and transparency.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Trusted Agents
            </h3>
            <p className="text-gray-600">
              Work directly with professional real estate agents with proven track records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Secure Platform
            </h3>
            <p className="text-gray-600">
              Your data and interactions are protected with modern security standards.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8">
            Login now to explore properties or manage listings as an agent.
          </p>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        © {new Date().getFullYear()} RealEstate Platform. All rights reserved.
      </footer>
    </div>
  );
}
