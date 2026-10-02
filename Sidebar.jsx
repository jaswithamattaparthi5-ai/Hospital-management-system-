import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { path: "/", icon: "🏠", label: "Dashboard" },
    { path: "/patients", icon: "🧑‍⚕️", label: "Patients" },
    { path: "/doctors", icon: "👨‍⚕️", label: "Doctors" },
    { path: "/appointments", icon: "📅", label: "Appointments" },
    { path: "/beds", icon: "🛏️", label: "Beds" },
    { path: "/treatments", icon: "💊", label: "Treatments" },
    { path: "/payments", icon: "💳", label: "Payments" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🏥</div>

        <div>
          <h2>MedCare</h2>
          <span>Hospital Management</span>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;