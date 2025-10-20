import React, { useState } from "react";
import axios from "axios";

function RAWDataUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload a .csv or .xlsx file");

    const formData = new FormData();
    formData.append("dataFile", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/raw/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(res.data);
      console.log("Parsed data:", res.data);
      if (res.data && res.data.length) {
        console.log("First row keys:", Object.keys(res.data[0]));
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white border border-gray-200 shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Upload Raw Data (.csv or .xlsx)
      </h2>

      <form onSubmit={handleUpload} className="space-y-5">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700 cursor-pointer"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-300 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload & Calculate"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Auto-Calculated Summary
          </h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              <strong>Column:</strong> {result.column}
            </li>
            <li>
              <strong>Count:</strong> {result.count}
            </li>
            <li>
              <strong>Mean:</strong> {result.mean}
            </li>
            <li>
              <strong>Standard Deviation:</strong> {result.stdDev}
            </li>
            <li>
              <strong>%RSD:</strong> {result.rsd}%
            </li>
          </ul>
          <div>
            <h4>Auto-Generated Chart:</h4>
            <img
              src={result.chartImage}
              alt="Graph"
              style={{ width: "80%", border: "1px solid gray" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RAWDataUploader;
