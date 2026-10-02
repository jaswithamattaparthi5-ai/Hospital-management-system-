 import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = "http://localhost:5000/api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    treatment_id: "",
    patient_id: "",
    total_amount: "",
    payment_mode: "",
  });

  const loadData = async () => {
    try {
      const [p, pt, t] = await Promise.all([
        fetch(`${API}/payments`),
        fetch(`${API}/patients`),
        fetch(`${API}/treatments`),
      ]);

      setPayments(await p.json());
      setPatients(await pt.json());
      setTreatments(await t.json());
    } catch (err) {
      setError("Unable to load payments");
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
      const response = await fetch(`${API}/payments`, {
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

      alert("Payment added successfully!");

      setFormData({
        treatment_id: "",
        patient_id: "",
        total_amount: "",
        payment_mode: "",
      });

      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/payments/${id}`, {
        method: "DELETE",
      });

      alert("Payment deleted!");
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
              <h2>Payments</h2>
              <p>Manage hospital payments</p>
            </div>
          </div>

          <div className="card form-card">
            <h3>Add Payment</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Treatment</label>

                  <select
                    name="treatment_id"
                    value={formData.treatment_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select treatment</option>

                    {treatments.map((t) => (
                      <option
                        key={t.treatment_id}
                        value={t.treatment_id}
                      >
                        #{t.treatment_id} -{" "}
                        {t.treatment_name}
                      </option>
                    ))}
                  </select>
                </div>

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
                  <label>Total Amount</label>

                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Mode</label>

                  <select
                    name="payment_mode"
                    value={formData.payment_mode}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select payment mode</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">
                      Net Banking
                    </option>
                  </select>
                </div>

              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="primary-btn">
                Add Payment
              </button>
            </form>
          </div>

          <div className="card table-card">
            <h3>Payment Records</h3>

            <div className="table-wrapper">
              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Treatment</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.payment_id}>
                        <td>{p.payment_id}</td>
                        <td>{p.patient_name}</td>
                        <td>{p.treatment_name}</td>
                        <td>₹{p.total_amount}</td>
                        <td>{p.payment_mode}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(p.payment_id)
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

export default Payments;