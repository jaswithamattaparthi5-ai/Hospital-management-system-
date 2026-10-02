import { useLocation } from "react-router-dom";

function Topbar() {
  const location = useLocation();

  const pageNames = {
    "/": "Dashboard",
    "/patients": "Patients",
    "/doctors": "Doctors",
    "/appointments": "Appointments",
    "/beds": "Beds",
    "/treatments": "Treatments",
    "/payments": "Payments",
  };

  const currentPage = pageNames[location.pathname] || "Dashboard";

  return (
    <header className="topbar">
      <h1>{currentPage}</h1>

      <div className="admin">
        <div className="admin-avatar">A</div>
        <span>Admin</span>
      </div>
    </header>
  );
}

export default Topbar;