 import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    beds: 0,
    treatments: 0,
    payments: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API}/dashboard`);
        const data = await response.json();

        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="page-content">

          <div className="hero">
            <div>
              <h2>Welcome to MedCare 🏥</h2>
              <p>
                Hospital Management System
              </p>
            </div>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">🧑‍⚕️</div>
              <div>
                <h3>{stats.patients}</h3>
                <p>Patients</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div>
                <h3>{stats.doctors}</h3>
                <p>Doctors</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div>
                <h3>{stats.appointments}</h3>
                <p>Appointments</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛏️</div>
              <div>
                <h3>{stats.beds}</h3>
                <p>Beds</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div>
                <h3>{stats.treatments}</h3>
                <p>Treatments</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💳</div>
              <div>
                <h3>{stats.payments}</h3>
                <p>Payments</p>
              </div>
            </div>

          </div>

          <div className="quick-section">
            <h2>Quick Access</h2>

            <div className="quick-grid">

              <Link to="/patients" className="quick-card">
                🧑‍⚕️
                <span>Patients</span>
              </Link>

              <Link to="/doctors" className="quick-card">
                👨‍⚕️
                <span>Doctors</span>
              </Link>

              <Link to="/appointments" className="quick-card">
                📅
                <span>Appointments</span>
              </Link>

              <Link to="/beds" className="quick-card">
                🛏️
                <span>Beds</span>
              </Link>

              <Link to="/treatments" className="quick-card">
                💊
                <span>Treatments</span>
              </Link>

              <Link to="/payments" className="quick-card">
                💳
                <span>Payments</span>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;