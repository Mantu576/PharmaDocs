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

      console.log("Token being sent:", token); // Debug

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        { plan },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Choose Your Plan</h2>
      <button onClick={() => handleSubscribe("Basic")} className="bg-blue-500 text-white px-4 py-2 rounded">
        Basic - ₹2999/mo
      </button>
      <button onClick={() => handleSubscribe("Pro")} className="bg-green-500 text-white px-4 py-2 rounded">
        Pro - ₹5999/mo
      </button>
      <button onClick={() => handleSubscribe("Enterprise")} className="bg-purple-500 text-white px-4 py-2 rounded">
        Enterprise - ₹9999/mo
      </button>
    </div>
  );
}

// import React from "react";
// import axios from "axios";

// export default function Subscribe() {
//   const handleSubscribe = async (plan) => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log(token);
//       if (!token) {
//         alert("You must be logged in to subscribe");
//         return;
//       }

//       const res = await axios.post(
//         "http://localhost:5000/api/payment/create-checkout-session",
//         { plan },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       window.location.href = res.data.url; // Stripe checkout page
//     } catch (err) {
//       console.error(err);
//       alert("Payment failed");
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-xl font-bold">Choose Your Plan</h2>
//       <button onClick={() => handleSubscribe("Basic")} className="bg-blue-500 text-white px-4 py-2 rounded">
//         Basic - ₹2999/mo
//       </button>
//       <button onClick={() => handleSubscribe("Pro")} className="bg-green-500 text-white px-4 py-2 rounded">
//         Pro - ₹5999/mo
//       </button>
//       <button onClick={() => handleSubscribe("Enterprise")} className="bg-purple-500 text-white px-4 py-2 rounded">
//         Enterprise - ₹9999/mo
//       </button>
//     </div>
//   );
// }
