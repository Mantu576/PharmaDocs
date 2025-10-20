import React from "react";
import axios from "axios";

export default function Subscribe() {
  const handleSubscribe = async (plan) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to subscribe");
        return;
      }

      console.log("Token being sent:", token);

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        { plan },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "₹2999/mo",
      description:
        "Perfect for individuals who are just starting out. Get access to essential features and priority support.",
      features: [
        "✔ Access to core features",
        "✔ Email support",
        "✔ 5 GB storage",
      ],
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
      titleClass: "text-blue-600",
    },
    {
      name: "Pro",
      price: "₹5999/mo",
      description:
        "Best for growing teams who need advanced features and better collaboration tools.",
      features: [
        "✔ All Basic features",
        "✔ Priority email & chat support",
        "✔ 50 GB storage",
        "✔ Team collaboration tools",
      ],
      buttonClass: "bg-green-600 hover:bg-green-700 text-white",
      titleClass: "text-green-600",
      popular: true, // mark as popular
    },
    {
      name: "Enterprise",
      price: "₹9999/mo",
      description:
        "For large organizations that need full access, premium support, and advanced customization.",
      features: [
        "✔ All Pro features",
        "✔ Dedicated account manager",
        "✔ Unlimited storage",
        "✔ Custom integrations",
      ],
      buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
      titleClass: "text-purple-600",
    },
  ];

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10">
        Choose Your Subscription Plan
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300 ${
              plan.popular ? "border-4 border-green-500" : ""
            }`}
          >
            {/* "Most Popular" Badge */}
            {plan.popular && (
              <span className="absolute top-0 right-0 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-bl-lg">
                Most Popular
              </span>
            )}

            <div>
              <h3 className={`text-2xl font-bold mb-2 ${plan.titleClass}`}>
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {plan.price}
              </p>
              <ul className="space-y-2 text-gray-700">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe(plan.name)}
              className={`mt-6 font-semibold py-2 px-4 rounded-lg w-full ${plan.buttonClass}`}
            >
              Subscribe to {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
