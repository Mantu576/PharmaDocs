// src/pages/UserDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-700">
          PharmaDocs
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/available")} // ✅ corrected
          >
            📚 Modules
          </button>
          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/stp")}
          >
            📄 STP Upload
          </button>
          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/create-document")}
          >
            📝 Create Document
          </button>
          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/upload")}
          >
            📊 Raw Data Upload
          </button>
          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/subscribe")}
          >
            💳 Subscription
          </button>
          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/history")}
          >
            📜 Document History
          </button>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
          <span className="text-gray-500">Welcome, User</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <p className="text-gray-600">
              Select an option from the sidebar to get started.
            </p>
          </div>
        </main>
      </div>
    </div>
  )}
