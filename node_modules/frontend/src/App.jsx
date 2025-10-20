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
import Layout from "./components/Layout";
import Modules from "./pages/Modules"
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/auth/protectedRoute";
import AdminPanel from "./components/AdminPanel";
import UserDashboard from "./components/dashboard/userDashboard";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import STPUploader from "./components/STPUploader";
import RAWDataUploader from "./components/RAWDataUploader";
import Subscribe from "./components/Subscribe";
import PaymentSuccess from "./components/PaymentSuccess";
import DocumentHistory from "./components/DocumentHistory"; 
import CreateDocument from "./pages/CreateDocument";
import ResetPassword from "./pages/ResetPassword"; // Import ResetPassword component
import ForgotPassword from "./pages/ForgotPassword"; // Import ForgotPassword component


function App() {
  
  return (
    <Router>
       <Routes>
        {/* Wrap all routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/available" element={<Modules />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/create-document" element={<ProtectedRoute><CreateDocument /></ProtectedRoute>} />
          <Route path="/stp" element={<ProtectedRoute><STPUploader /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><RAWDataUploader /></ProtectedRoute>} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/history" element={<ProtectedRoute><DocumentHistory /></ProtectedRoute>} />
        </Route>
      </Routes>
      {/* <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes> */}
      <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
</Routes>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected User Dashboard */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            //<ProtectedRoute adminOnly>
              <AdminPanel />
            //</ProtectedRoute>
          }
        />
        {/* <Route path="/create-document" element={<ProtectedRoute><CreateDocument /></ProtectedRoute>} />
        <Route
          path="/stp"
          element={
            <ProtectedRoute>
               <STPUploader />
           </ProtectedRoute>
             
          
          }
        /> */}
        {/* <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <RAWDataUploader />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route path="/subscribe" element={<Subscribe />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <DocumentHistory />
            </ProtectedRoute>
          }
          /> */}

        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
