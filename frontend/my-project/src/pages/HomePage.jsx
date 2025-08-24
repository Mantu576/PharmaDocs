// src/pages/HomePage.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

function HomePage() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            PharmaDocs
          </Link>
          <div className="space-x-6 hidden md:flex">
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-blue-500">
              Dashboard
            </Link>
            <Link to="/about" className="hover:text-blue-500">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-500">
              Contact
            </Link>
          </div>
          <div>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <div className="w-full">
        <Slider {...sliderSettings}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581090700227-4c4d4d4d4b3b"
              alt="Pharma Lab"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI-Powered Pharma Documentation
              </h1>
              <p className="max-w-2xl">
                Automate, validate, and streamline your pharma protocols,
                reports, and raw data sheets with Gemini AI.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
              alt="Research"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Faster Document Generation
              </h1>
              <p className="max-w-2xl">
                Save hours of manual work by generating compliant pharma
                documents instantly.
              </p>
            </div>
          </div>
        </Slider>
      </div>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "AMV", desc: "Automated Method Validation reports" },
              { title: "PV", desc: "Process Validation protocols & reports" },
              { title: "Stability", desc: "Stability study documentation" },
            ].map((mod) => (
              <div
                key={mod.title}
                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-3">{mod.title}</h3>
                <p className="text-gray-600 mb-4">{mod.desc}</p>
                <Link
                  to="/dashboard"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start Your PharmaDocs Journey Today
        </h2>
        <p className="mb-6">
          Choose your plan, access your modules, and let AI handle the heavy
          lifting.
        </p>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PharmaDocs. All rights reserved.
          </p>
          <div className="space-x-4 mt-3 md:mt-0">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
