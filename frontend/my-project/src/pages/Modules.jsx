// src/pages/Modules.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/modules/available", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setModules(res.data.modules); // ✅ works with object from backend
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError(err.response?.data?.message || "Failed to fetch modules");
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Modules</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-5">
        {modules.map((mod, index) => (
          <li key={index}>{mod}</li>
        ))}
      </ul>
    </div>
  );
};

export default Modules;
