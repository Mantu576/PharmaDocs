// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/register", {
//         email,
//         username,
//         password,
//       });
//       if (res.data.success) {
//         navigate("/login");
//       } else {
//         setError(res.data.message || "Registration failed");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Registration failed. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-16 bg-white border border-gray-200 shadow-md rounded-lg p-8">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         Register
//       </h2>
//       {error && (
//         <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleRegister} className="space-y-4">
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">
//             Username
//           </label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//             placeholder="Enter your username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">
//             Password
//           </label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>
//       <div className="mt-4 text-center text-sm text-gray-600">
//         Already have an account?{" "}
//         <a
//           href="/login"
//           className="text-blue-600 hover:underline font-medium"
//         >
//           Login
//         </a>
//         </div>
//         </div>
//     );
// }
import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        username,
        password,
      });

      if (res.data.success) {
        setMsg(res.data.msg);
        setTimeout(() => {
          window.location.href = "/login"; // redirect after 2s
        }, 2000);
      } else {
        setError(res.data.msg || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          PharmaDocs Register
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {msg && (
          <div className="bg-green-100 text-green-600 p-2 rounded mb-4 text-sm">
            {msg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
