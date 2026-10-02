 import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_id: "",
    treatment_name: "",
    treatment_date: "",
  });

  const loadData = async () => {
    try {
      const [t, p, a] = await Promise.all([
        fetch(`${API}/treatments`),
        fetch(`${API}/patients`),
        fetch(`${API}/appointments`),
      ]);

      setTreatments(await t.json());
      setPatients(await p.json());
      setAppointments(await a.json());
    } catch (err) {
      setError("Unable to load treatments");
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
      const response = await fetch(`${API}/treatments`, {
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

      alert("Treatment added successfully!");

      setFormData({
        patient_id: "",
        appointment_id: "",
        treatment_name: "",
        treatment_date: "",
      });

      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/treatments/${id}`, {
        method: "DELETE",
      });

      alert("Treatment deleted!");
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
              <h2>Treatments</h2>
              <p>Manage patient treatments</p>
            </div>
          </div>

          <div className="card form-card">
            <h3>Add Treatment</h3>

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
                  <label>Appointment</label>

                  <select
                    name="appointment_id"
                    value={formData.appointment_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select appointment
                    </option>

                    {appointments.map((a) => (
                      <option
                        key={a.appointment_id}
                        value={a.appointment_id}
                      >
                        #{a.appointment_id} -{" "}
                        {a.patient_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Treatment Name</label>

                  <input
                    name="treatment_name"
                    value={formData.treatment_name}
                    onChange={handleChange}
                    placeholder="Enter treatment"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Treatment Date</label>

                  <input
                    type="date"
                    name="treatment_date"
                    value={formData.treatment_date}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="primary-btn">
                Add Treatment
              </button>
            </form>
          </div>

          <div className="card table-card">
            <h3>Treatment Records</h3>

            <div className="table-wrapper">
              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Treatment</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {treatments.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No treatments found
                      </td>
                    </tr>
                  ) : (
                    treatments.map((t) => (
                      <tr key={t.treatment_id}>
                        <td>{t.treatment_id}</td>
                        <td>{t.patient_name}</td>
                        <td>{t.treatment_name}</td>
                        <td>
                          {new Date(
                            t.treatment_date
                          ).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(t.treatment_id)
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

export default Treatments;