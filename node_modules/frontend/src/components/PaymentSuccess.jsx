import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updatePlan = async () => {
      const params = new URLSearchParams(location.search);
      const plan = params.get("plan");

      if (!plan) {
        alert("No plan found in payment URL");
        return;
      }

      // Define modules per plan
      let modules = [];
      if (plan === "Basic") modules = ["AMV"];
      if (plan === "Pro") modules = ["AMV", "PV", "Stability"];
      if (plan === "Enterprise") modules = ["AMV", "PV", "Stability", "Degradation"];

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in to update your subscription");
          navigate("/login");
          return;
        }

        await axios.put(
          "http://localhost:5000/api/user/me/plan",
          { plan, modules },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert(`Payment Successful! You are now on the ${plan} plan.`);
        navigate("/dashboard");
      } catch (err) {
        console.error("Error updating plan:", err);
        alert("Failed to update subscription. Please contact support.");
      }
    };

    updatePlan();
  }, [location, navigate]);

  return <h2 className="p-4">Processing payment, please wait...</h2>;
}
