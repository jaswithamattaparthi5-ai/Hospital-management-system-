const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= MYSQL =================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err.message);
  } else {
    console.log("MySQL Connected Successfully!");
  }
});

// ================= HOME =================

app.get("/", (req, res) => {
  res.json({
    message: "Hospital Management System API is running",
  });
});

// ================= DASHBOARD =================

app.get("/api/dashboard", (req, res) => {
  const tables = [
    ["patients", "PATIENT"],
    ["doctors", "DOCTOR"],
    ["appointments", "APPOINTMENT"],
    ["beds", "BED"],
    ["treatments", "TREATMENT"],
    ["payments", "PAYMENT"],
  ];

  const result = {};
  let completed = 0;

  tables.forEach(([key, table]) => {
    db.query(`SELECT COUNT(*) AS count FROM ${table}`, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      result[key] = rows[0].count;
      completed++;

      if (completed === tables.length) {
        res.json(result);
      }
    });
  });
});

// ================= PATIENTS =================

// GET PATIENTS
app.get("/api/patients", (req, res) => {
  db.query(
    "SELECT * FROM PATIENT ORDER BY patient_id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(result);
    }
  );
});

// ADD PATIENT
app.post("/api/patients", (req, res) => {
  console.log("Patient data received:", req.body);

  const patient_name = req.body.patient_name;
  const DOB = req.body.DOB || req.body.dob;
  const gender = req.body.gender;
  const phone = req.body.phone;
  const address = req.body.address;
  const blood_group = req.body.blood_group;

  if (!patient_name || !DOB || !gender || !phone || !address || !blood_group) {
    return res.status(400).json({
      error: "Please fill all patient details",
    });
  }

  const sql = `
    INSERT INTO PATIENT
    (patient_name, DOB, gender, phone, address, blood_group)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patient_name,
      DOB,
      gender,
      phone,
      address,
      blood_group,
    ],
    (err, result) => {
      if (err) {
        console.log("Add patient error:", err.message);

        return res.status(500).json({
          error: err.message,
        });
      }

      console.log("Patient added:", result.insertId);

      res.status(201).json({
        message: "Patient added successfully",
        patient_id: result.insertId,
      });
    }
  );
});

// DELETE PATIENT
app.delete("/api/patients/:id", (req, res) => {
  db.query(
    "DELETE FROM PATIENT WHERE patient_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Patient deleted successfully",
      });
    }
  );
});

// ================= DOCTORS =================

// GET
app.get("/api/doctors", (req, res) => {
  db.query(
    "SELECT * FROM DOCTOR ORDER BY doctor_id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(result);
    }
  );
});

// ADD
app.post("/api/doctors", (req, res) => {
  const {
    doctor_name,
    specialization,
    phone,
    email,
  } = req.body;

  const sql = `
    INSERT INTO DOCTOR
    (doctor_name, specialization, phone, email)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [doctor_name, specialization, phone, email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Doctor added successfully",
        doctor_id: result.insertId,
      });
    }
  );
});

// DELETE
app.delete("/api/doctors/:id", (req, res) => {
  db.query(
    "DELETE FROM DOCTOR WHERE doctor_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Doctor deleted successfully" });
    }
  );
});

// ================= APPOINTMENTS =================

// GET
app.get("/api/appointments", (req, res) => {
  const sql = `
    SELECT
      a.appointment_id,
      a.patient_id,
      a.doctor_id,
      a.reason,
      a.appointment_date,
      p.patient_name,
      d.doctor_name
    FROM APPOINTMENT a
    LEFT JOIN PATIENT p
      ON a.patient_id = p.patient_id
    LEFT JOIN DOCTOR d
      ON a.doctor_id = d.doctor_id
    ORDER BY a.appointment_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

// ADD
app.post("/api/appointments", (req, res) => {
  const {
    patient_id,
    doctor_id,
    reason,
    appointment_date,
  } = req.body;

  const sql = `
    INSERT INTO APPOINTMENT
    (patient_id, doctor_id, reason, appointment_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [patient_id, doctor_id, reason, appointment_date],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Appointment added successfully",
        appointment_id: result.insertId,
      });
    }
  );
});

// DELETE
app.delete("/api/appointments/:id", (req, res) => {
  db.query(
    "DELETE FROM APPOINTMENT WHERE appointment_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Appointment deleted successfully" });
    }
  );
});

// ================= BEDS =================

// GET
app.get("/api/beds", (req, res) => {
  const sql = `
    SELECT
      b.bed_id,
      b.bed_name,
      b.bed_number,
      b.charges,
      b.status,
      b.patient_id,
      p.patient_name
    FROM BED b
    LEFT JOIN PATIENT p
      ON b.patient_id = p.patient_id
    ORDER BY b.bed_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

// ADD
app.post("/api/beds", (req, res) => {
  const {
    bed_name,
    bed_number,
    charges,
    status,
    patient_id,
  } = req.body;

  const sql = `
    INSERT INTO BED
    (bed_name, bed_number, charges, status, patient_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      bed_name,
      bed_number,
      charges,
      status,
      patient_id || null,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Bed added successfully",
        bed_id: result.insertId,
      });
    }
  );
});

// DELETE
app.delete("/api/beds/:id", (req, res) => {
  db.query(
    "DELETE FROM BED WHERE bed_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Bed deleted successfully" });
    }
  );
});

// ================= TREATMENTS =================

// GET
app.get("/api/treatments", (req, res) => {
  const sql = `
    SELECT
      t.treatment_id,
      t.patient_id,
      t.appointment_id,
      t.treatment_name,
      t.treatment_date,
      p.patient_name
    FROM TREATMENT t
    LEFT JOIN PATIENT p
      ON t.patient_id = p.patient_id
    ORDER BY t.treatment_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

// ADD
app.post("/api/treatments", (req, res) => {
  const {
    patient_id,
    appointment_id,
    treatment_name,
    treatment_date,
  } = req.body;

  const sql = `
    INSERT INTO TREATMENT
    (patient_id, appointment_id, treatment_name, treatment_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patient_id,
      appointment_id,
      treatment_name,
      treatment_date,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Treatment added successfully",
        treatment_id: result.insertId,
      });
    }
  );
});

// DELETE
app.delete("/api/treatments/:id", (req, res) => {
  db.query(
    "DELETE FROM TREATMENT WHERE treatment_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Treatment deleted successfully" });
    }
  );
});

// ================= PAYMENTS =================

// GET
app.get("/api/payments", (req, res) => {
  const sql = `
    SELECT
      py.payment_id,
      py.treatment_id,
      py.patient_id,
      py.total_amount,
      py.payment_mode,
      t.treatment_name,
      p.patient_name
    FROM PAYMENT py
    LEFT JOIN TREATMENT t
      ON py.treatment_id = t.treatment_id
    LEFT JOIN PATIENT p
      ON py.patient_id = p.patient_id
    ORDER BY py.payment_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

// ADD
app.post("/api/payments", (req, res) => {
  const {
    treatment_id,
    patient_id,
    total_amount,
    payment_mode,
  } = req.body;

  const sql = `
    INSERT INTO PAYMENT
    (treatment_id, patient_id, total_amount, payment_mode)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      treatment_id,
      patient_id,
      total_amount,
      payment_mode,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Payment added successfully",
        payment_id: result.insertId,
      });
    }
  );
});

// DELETE
app.delete("/api/payments/:id", (req, res) => {
  db.query(
    "DELETE FROM PAYMENT WHERE payment_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Payment deleted successfully" });
    }
  );
});

// ================= START SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});