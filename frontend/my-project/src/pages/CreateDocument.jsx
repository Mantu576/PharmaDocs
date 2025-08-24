// src/pages/CreateDocument.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function CreateDocument() {
  const location = useLocation();
  const [form, setForm] = useState({
    module: '',
    docType: '',
    companyName: '',
    companyAddress: '',
    date: '',
    reviewer: '',
    checker: '',
    analyst: ''
  });
  const [stpFile, setStpFile] = useState(null);
  const [rawData, setRawData] = useState(null);
  //const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.module) {
      setForm((prev) => ({ ...prev, module: location.state.module }));
    }
  }, [location.state]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePreview = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));
    if (stpFile) fd.append('stpFile', stpFile);
    if (rawData) fd.append('rawData', rawData);
    // if (logo) fd.append('logo', logo);

    try {
      const res = await axios.post('/api/newdoc/preview', fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setPreview(res.data.preview);
    } catch (err) {
      console.error(err);
      alert('Preview failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    try {
      const res = await axios.post('/api/newdoc/commit', { preview }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Document generated');
      console.log(res.data.downloads);
    } catch (err) {
      console.error(err);
      alert('Commit failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create New Document</h2>
      <form onSubmit={handlePreview} className="grid gap-2">
        <input name="module" placeholder="Module" value={form.module} onChange={handleChange} />
        <input name="docType" placeholder="Doc Type" onChange={handleChange} />
        <input name="companyName" placeholder="Company Name" onChange={handleChange} />
        <input name="companyAddress" placeholder="Company Address" onChange={handleChange} />
        <input type="date" name="date" onChange={handleChange} />
        <input name="reviewer" placeholder="Reviewer" onChange={handleChange} />
        <input name="checker" placeholder="Checker" onChange={handleChange} />
        <input name="analyst" placeholder="Analyst" onChange={handleChange} />
        <input type="file" onChange={e => setStpFile(e.target.files[0])} />
        <input type="file" onChange={e => setRawData(e.target.files[0])} />
       {/* <input type="file" onChange={e => setLogo(e.target.files[0])} /> */}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Preview</button>
      </form>

      {loading && <p>Loading preview...</p>}

      {preview && (
        <div className="mt-4">
          <h3 className="font-bold">Preview</h3>
          <pre>{JSON.stringify(preview.ai, null, 2)}</pre>
          {preview.rawPreview && (
            <div>
              <p>Mean: {preview.rawPreview.mean}</p>
              <p>%RSD: {preview.rawPreview.rsd}</p>
              <img src={preview.rawPreview.chartBase64} alt="chart" />
            </div>
          )}
          <button onClick={handleCommit} className="bg-blue-500 text-white p-2 rounded mt-2">Generate Document</button>
        </div>
      )}
    </div>
  );
}

export default CreateDocument;