import React from "react";

function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">About PharmaDocs</h2>
      <p className="text-gray-700 leading-relaxed">
        PharmaDocs is an AI-powered documentation platform designed for the pharmaceutical 
        industry. Our mission is to simplify compliance, accelerate report generation, and 
        ensure alignment with global pharmacopeias (USP, IP, BP).
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Our Vision</h3>
      <p className="text-gray-700 leading-relaxed">
        To revolutionize pharmaceutical documentation by combining artificial intelligence 
        with regulatory expertise — ensuring accuracy, efficiency, and compliance.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Why Choose Us?</h3>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>AI-driven compliance validation</li>
        <li>Automated protocol and report generation</li>
        <li>Subscription-based plans for teams & enterprises</li>
        <li>Secure cloud-based document management</li>
      </ul>
    </div>
  );
}

export default About;
