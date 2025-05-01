// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Meals from "./pages/Meals";
import Billing from "./pages/Billing";
import Menu from "./pages/Menu";
import Stock from "./pages/Stock";
import Suppliers from "./pages/Suppliers";
import Feedback from "./pages/Feedback";
import LeaveRequests from "./pages/LeaveRequests";
// import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/leave" element={<LeaveRequests />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
