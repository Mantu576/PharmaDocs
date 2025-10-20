import React, { useEffect, useState } from "react";
import axios from "axios";

function DocumentHistory() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/history/my-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    }
    loadHistory();
  }, [token]);

  const downloadFile = (filename) => {
    window.open(`http://localhost:5000/uploads/${filename}`, "_blank");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📁 My Document History
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white text-left">
              <th className="p-3">File Name</th>
              <th className="p-3">Module</th>
              <th className="p-3">Type</th>
              <th className="p-3">Generated On</th>
              <th className="p-3 text-center">Download</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((doc, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-indigo-50 transition-colors"
                >
                  <td className="p-3">{doc.filename}</td>
                  <td className="p-3">{doc.module}</td>
                  <td className="p-3">{doc.fileType}</td>
                  <td className="p-3">
                    {new Date(doc.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => downloadFile(doc.filename)}
                      className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      ⬇ Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500 italic"
                >
                  No document history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentHistory;
