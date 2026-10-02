 import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctor_name: "",
    specialization: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API}/doctors`);
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add doctor");
      }

      alert("Doctor added successfully!");

      setFormData({
        doctor_name: "",
        specialization: "",
        phone: "",
        email: "",
      });

      fetchDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/doctors/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("Doctor deleted successfully!");
      fetchDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="page-content">
          <div className="page-title">
            <div>
              <h2>Doctors</h2>
              <p>Manage hospital doctors</p>
            </div>
          </div>

          <div className="card form-card">
            <h3>Add Doctor</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Doctor Name</label>
                  <input
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    placeholder="Enter doctor name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Enter specialization"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="primary-btn">
                Add Doctor
              </button>
            </form>
          </div>

          <div className="card table-card">
            <h3>Doctor Records</h3>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No doctors found
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doctor) => (
                      <tr key={doctor.doctor_id}>
                        <td>{doctor.doctor_id}</td>
                        <td>{doctor.doctor_name}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.phone}</td>
                        <td>{doctor.email}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(doctor.doctor_id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Doctors;