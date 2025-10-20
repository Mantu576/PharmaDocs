import React from "react";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">PharmaDocs</h1>
          <nav className="space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4 mt-6">
        <p>© {new Date().getFullYear()} PharmaDocs. All Rights Reserved.</p>
        <p className="text-sm">Powered by AI-driven Compliance Automation</p>
      </footer>
    </div>
  );
}

export default Layout;
