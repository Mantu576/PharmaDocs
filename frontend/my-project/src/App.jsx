import React from 'react';
import STPUploader from './components/STPUploader';
import RAWDataUploader from './components/RAWDataUploader';
import AdminPanel from './components/AdminPanel';


function App() {
  return (
    <div>
      <h1>PharmaDocs AI Platform</h1>
      <AdminPanel />
      <STPUploader />
      <RAWDataUploader />
    </div>
  );
}

export default App;
