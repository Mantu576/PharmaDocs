// //import React from "react";
// //import { Navigate } from "react-router-dom";
// // import {jwtDecode} from "jwt-decode";

// // const ProtectedRoute = ({ children, adminOnly = false }) => {
// //   const token = localStorage.getItem("token");

// //   if (!token) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   try {
// //     const decoded = jwtDecode(token);
// //     const currentTime = Date.now() / 1000;

// //     // Check if token expired
// //     if (decoded.exp < currentTime) {
// //       localStorage.removeItem("token");
// //       return <Navigate to="/login" replace />;
// //     }

// //     // If adminOnly route, check role
// //     if (adminOnly && decoded.role !== "admin") {
// //       return <Navigate to="/unauthorized" replace />;
// //     }

// //   } catch (err) {
// //     console.error("Invalid token:", err);
// //     localStorage.removeItem("token");
// //     return <Navigate to="/login" replace />;
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (!token || token === "undefined") {
//     console.warn("No valid token found in localStorage");
//     return <Navigate to="/login" />;
//   }

//   try {
//     const decoded = jwtDecode(token);

//     // 🔒 Optional: check expiration
//     if (decoded.exp && decoded.exp * 1000 < Date.now()) {
//       console.warn("Token expired");
//       localStorage.removeItem("token");
//       return <Navigate to="/login" />;
//     }

//     return children;
//   } catch (err) {
//     console.error("Invalid token:", err.message);
//     localStorage.removeItem("token");  // 🚀 Prevents infinite crash loop
//     return <Navigate to="/login" />;
//   }
// };

// export default ProtectedRoute;
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}
