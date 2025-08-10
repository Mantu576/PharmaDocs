import React, { useState } from 'react';
import axios from 'axios';

function STPUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [logo, setLogo] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccessMsg('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('stpFile', file);
    formData.append('companyName', companyName);
    formData.append('reviewer', reviewer);
    formData.append('logo', logo);

    setUploading(true);
    setSuccessMsg('');

    try {
      const response = await axios.post('http://localhost:5000/api/docs/stp', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'PharmaDocs_Report.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMsg('✅ Report generated and downloaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Upload STP Document
      </h2>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Choose a .txt or .docx file:
          </label>
          <input
            type="file"
            accept=".txt,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 cursor-pointer"
          />

        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Company Name:
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Reviewer:
          </label>
          <input
            type="text"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Logo:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 cursor-pointer"
          />

        </div>
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md transition duration-300 ${
            uploading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload & Generate Report'}
        </button>
      </form>

      {successMsg && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
          {successMsg}
        </div>
      )}
    </div>
  );
}

export default STPUploader;
