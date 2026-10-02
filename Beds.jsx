 import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Beds() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    bed_name: "",
    bed_number: "",
    charges: "",
    status: "",
    patient_id: "",
  });

  const loadData = async () => {
    try {
      const [b, p] = await Promise.all([
        fetch(`${API}/beds`),
        fetch(`${API}/patients`),
      ]);

      setBeds(await b.json());
      setPatients(await p.json());
    } catch (err) {
      setError("Unable to load beds");
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
      const response = await fetch(`${API}/beds`, {
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

      alert("Bed added successfully!");

      setFormData({
        bed_name: "",
        bed_number: "",
        charges: "",
        status: "",
        patient_id: "",
      });

      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/beds/${id}`, {
        method: "DELETE",
      });

      alert("Bed deleted!");
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
              <h2>Beds</h2>
              <p>Manage hospital beds</p>
            </div>
          </div>

          <div className="card form-card">
            <h3>Add Bed</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Bed Name</label>
                  <input
                    name="bed_name"
                    value={formData.bed_name}
                    onChange={handleChange}
                    placeholder="Example: General Ward"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bed Number</label>
                  <input
                    name="bed_number"
                    value={formData.bed_number}
                    onChange={handleChange}
                    placeholder="Example: B-101"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Charges</label>
                  <input
                    type="number"
                    name="charges"
                    value={formData.charges}
                    onChange={handleChange}
                    placeholder="Enter charges"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Patient</label>

                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                  >
                    <option value="">No patient</option>

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

              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="primary-btn">
                Add Bed
              </button>
            </form>
          </div>

          <div className="card table-card">
            <h3>Bed Records</h3>

            <div className="table-wrapper">
              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Bed Name</th>
                    <th>Number</th>
                    <th>Charges</th>
                    <th>Status</th>
                    <th>Patient</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {beds.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No beds found
                      </td>
                    </tr>
                  ) : (
                    beds.map((bed) => (
                      <tr key={bed.bed_id}>
                        <td>{bed.bed_id}</td>
                        <td>{bed.bed_name}</td>
                        <td>{bed.bed_number}</td>
                        <td>₹{bed.charges}</td>
                        <td>{bed.status}</td>
                        <td>{bed.patient_name || "None"}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(bed.bed_id)
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

export default Beds;