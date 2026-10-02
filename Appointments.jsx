 import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    reason: "",
    appointment_date: "",
  });

  const loadData = async () => {
    try {
      const [a, p, d] = await Promise.all([
        fetch(`${API}/appointments`),
        fetch(`${API}/patients`),
        fetch(`${API}/doctors`),
      ]);

      setAppointments(await a.json());
      setPatients(await p.json());
      setDoctors(await d.json());
    } catch (err) {
      setError("Unable to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("Appointment added successfully!");

      setFormData({
        patient_id: "",
        doctor_id: "",
        reason: "",
        appointment_date: "",
      });

      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/appointments/${id}`, {
        method: "DELETE",
      });

      alert("Appointment deleted!");
      loadData();
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
              <h2>Appointments</h2>
              <p>Manage patient appointments</p>
            </div>
          </div>

          <div className="card form-card">
            <h3>Add Appointment</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Patient</label>

                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select patient</option>

                    {patients.map((p) => (
                      <option
                        key={p.patient_id}
                        value={p.patient_id}
                      >
                        {p.patient_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Doctor</label>

                  <select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select doctor</option>

                    {doctors.map((d) => (
                      <option
                        key={d.doctor_id}
                        value={d.doctor_id}
                      >
                        {d.doctor_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason</label>

                  <input
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Reason for appointment"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Appointment Date</label>

                  <input
                    type="datetime-local"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="primary-btn">
                Add Appointment
              </button>
            </form>
          </div>

          <div className="card table-card">
            <h3>Appointment Records</h3>

            <div className="table-wrapper">
              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a.appointment_id}>
                        <td>{a.appointment_id}</td>
                        <td>{a.patient_name}</td>
                        <td>{a.doctor_name}</td>
                        <td>{a.reason}</td>
                        <td>
                          {new Date(
                            a.appointment_date
                          ).toLocaleString()}
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(a.appointment_id)
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

export default Appointments;