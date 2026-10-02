 import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Patients() {
  const [patients, setPatients] = useState([]);

  const [formData, setFormData] = useState({
    patient_name: "",
    DOB: "",
    gender: "",
    phone: "",
    address: "",
    blood_group: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setError("");

      const response = await fetch(`${API}/patients`);

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load patients");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.patient_name ||
      !formData.DOB ||
      !formData.gender ||
      !formData.phone ||
      !formData.address ||
      !formData.blood_group
    ) {
      setError("Please fill all patient details");
      return;
    }

    try {
      setLoading(true);

      const patientData = {
        patient_name: formData.patient_name,
        DOB: formData.DOB,
        dob: formData.DOB,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        blood_group: formData.blood_group,
      };

      console.log("Sending patient data:", patientData);

      const response = await fetch(`${API}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add patient");
      }

      alert("Patient added successfully!");

      setFormData({
        patient_name: "",
        DOB: "",
        gender: "",
        phone: "",
        address: "",
        blood_group: "",
      });

      await fetchPatients();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/patients/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete patient");
      }

      alert("Patient deleted successfully!");

      await fetchPatients();
    } catch (err) {
      console.error(err);
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
              <h2>Patients</h2>
              <p>Manage hospital patient records</p>
            </div>
          </div>

          <div className="card form-card">
            <h3>Add Patient</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Patient Name</label>

                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>

                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Blood Group</label>

                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

              </div>

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Patient"}
              </button>
            </form>
          </div>

          <div className="card table-card">
            <h3>Patient Records</h3>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Blood Group</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        style={{ textAlign: "center" }}
                      >
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.patient_id}>
                        <td>{patient.patient_id}</td>

                        <td>{patient.patient_name}</td>

                        <td>
                          {patient.DOB
                            ? new Date(
                                patient.DOB
                              ).toLocaleDateString()
                            : ""}
                        </td>

                        <td>{patient.gender}</td>

                        <td>{patient.phone}</td>

                        <td>{patient.address}</td>

                        <td>{patient.blood_group}</td>

                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                patient.patient_id
                              )
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

export default Patients;