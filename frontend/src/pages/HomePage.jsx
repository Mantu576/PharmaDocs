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

  const slides = [
    {
      img: "https://plus.unsplash.com/premium_photo-1661288574208-bb062bdd7e98",
      title: "AI-Powered Pharma Documentation",
      desc: "Automate, validate, and streamline your pharma protocols, reports, and raw data sheets with Gemini AI.",
    },
    {
      img: "https://images.unsplash.com/photo-1593438002985-ce805be04da9?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Faster Document Generation",
      desc: "Save hours of manual work by generating compliant pharma documents instantly.",
    },
    {
      img: "https://images.unsplash.com/photo-1723095469034-c3cf31e32730?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Ensure Compliance & Accuracy",
      desc: "Generate FDA/ICH compliant reports with automated checks and validations.",
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1661306413039-38ea67eb761d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Seamless Collaboration",
      desc: "Enable cross-team collaboration with secure cloud-based pharma document management.",
    },
    {
      img: "https://images.unsplash.com/photo-1552288094-03a03785f2a8?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Scalable for Enterprise",
      desc: "Our platform grows with your organization to handle large-scale documentation needs.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Inline CSS fix for ARIA warning */}
      <style>
        {`
          .slick-slide[aria-hidden="true"] * {
            pointer-events: none;
            tabindex: -1;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            PharmaDocs
          </Link>
          <div className="space-x-6 hidden md:flex">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
            <Link to="/about" className="hover:text-blue-500">About</Link>
            <Link to="/contact" className="hover:text-blue-500">Contact</Link>
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
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-[600px] object-cover object-center rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="max-w-2xl">{slide.desc}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Our Modules</h2>
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
