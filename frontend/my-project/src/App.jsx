// import React from 'react';
// import STPUploader from './components/STPUploader';
// import RAWDataUploader from './components/RAWDataUploader';
// import AdminPanel from './components/AdminPanel';

// function App() {
//   return (
//     <div>
//       <h1>PharmaDocs AI Platform</h1>
//       <AdminPanel />
//       <STPUploader />
//       <RAWDataUploader />
//     </div>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPanel from "./components/AdminPanel";
import UserDashboard from "./components/dashboard/userDashboard";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import STPUploader from "./components/STPUploader";
import RAWDataUploader from "./components/RAWDataUploader";
import Subscribe from "./components/subscribe";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            //<ProtectedRoute adminOnly>
              <AdminPanel />
            //</ProtectedRoute>
          }
        />
        <Route
          path="/stp"
          element={
            //<ProtectedRoute>
               <STPUploader />
           // </ProtectedRoute>
             
          
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <RAWDataUploader />
            </ProtectedRoute>
          }
        />

        <Route path="/subscribe" element={<Subscribe />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
