// src/pages/Admin/AdminDashboard.js
import React from "react";
import { Link, useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import carImage from "../../assets/porsche.jpg";
import DashboardMain from "./DashboardMain";
import AdminAgencyStats from "./AdminAgencyStats";
import AdminCustomerStats from "./AdminCustomerStats";
import AdminUsers from "./AdminUsers";
import UpdateUser from "./UpdateUser";
import AdminFeedback from "../ContactUs/AdminFeedback";
import AgencyVerificationList from "./AgencyVerificationList";
import CustomerVerificationList from "./CustomerVerificationList";
import AgencyList from "./AgencyList";
import AdminAgencyCars from "./AdminAgencyCars";

const AdminDashboard = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Check if user is admin
  if (authData.role !== "Admin") {
    navigate("/");
    return null;
  }

  // Helper function to determine if a menu item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="car-image">
            <img src={carImage} alt="Car" />
          </div>
        </div>
        <ul className="sidebar-menu">
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className={isActive("/admin/manageUsers") || location.pathname.startsWith("/admin/update-user") ? "active" : ""}>
            <Link to="/admin/manageUsers">User Management</Link>
          </li>
          <li className={isActive("/admin/agency-stats") ? "active" : ""}>
            <Link to="/admin/agency-stats">Agency Stats</Link>
          </li>
          <li className={isActive("/admin/customer-stats") ? "active" : ""}>
            <Link to="/admin/customer-stats">Customer Stats</Link>
          </li>
          <li className={isActive("/admin/feedback") ? "active" : ""}>
            <Link to="/admin/feedback">Feedback</Link>
          </li>
          <li className={isActive("/admin/agency-verification-list") ? "active" : ""}>
            <Link to="/admin/agency-verification-list">Agency Verifications</Link>
          </li>
          <li className={isActive("/admin/customer-verification-list") ? "active" : ""}>
            <Link to="/admin/customer-verification-list">Customer Verifications</Link>
          </li>
        </ul>
        {/* <button className="logout-btn" onClick={handleLogout}>
          LOG OUT
        </button> */}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          <Routes>
            <Route path="/dashboard" element={<DashboardMain />} />
            <Route path="/manageUsers" element={<AdminUsers />} />
            <Route path="/agency-stats" element={<AdminAgencyStats />} />
            <Route path="/customer-stats" element={<AdminCustomerStats />} />
            <Route path="/feedback" element={<AdminFeedback />} />
            <Route path="/agency-verification-list" element={<AgencyVerificationList />} />
            <Route path="/customer-verification-list" element={<CustomerVerificationList />} />
            <Route path="/update-user/:userId" element={<UpdateUser />} />

            <Route path="/agencyList" element={<AgencyList/>}/>
            <Route path="/agency/cars/:id" element={<AdminAgencyCars/>}/>
          </Routes>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 250px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          // justify-content: space-between;
          border-right: 3px solid #f0c040;
        }

        .sidebar-header h3 {
          color: #000;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
        }

        .sidebar-menu li {
          margin-bottom: 10px;
        }

        .sidebar-menu li a {
          color: #000;
          text-decoration: none;
          font-size: 18px;
          padding: 10px;
          display: block;
          border-radius: 5px;
        }

        .sidebar-menu li.active a,
        .sidebar-menu li a:hover {
          background-color: #f0c040;
          color: #000;
        }

        .logout-btn {
          background-color: #dc3545;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          text-transform: uppercase;
        }

        .logout-btn:hover {
          background-color: #c82333;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 20px;
          background-color: #f8f9fa;
        }

        .content-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .car-image img {
          width: 100%;
          max-width: 300px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .charts {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .chart-container {
          flex: 1;
          background-color: #fff;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .best-sellers {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .best-sellers h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .best-sellers table {
          width: 100%;
          border-collapse: collapse;
        }

        .best-sellers th,
        .best-sellers td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .best-sellers th {
          background-color: #343a40;
          color: #fff;
        }

        .best-sellers tr:nth-child(even) {
          background-color: #f2f2f2;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;