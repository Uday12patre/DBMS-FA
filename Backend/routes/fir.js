const express = require("express");
const router = express.Router();
const db = require("../db");

// Add Complaint
// ================== ADD COMPLAINT ==================
router.post("/complaint", (req, res) => {
  const { complainant_name, complaint_date, description } = req.body;

  const sql = `
    INSERT INTO Complaint (complainant_name, complaint_date, description)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [complainant_name, complaint_date, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error adding complaint");
    }

    res.json({
      message: "Complaint Added Successfully",
      complaint_id: result.insertId
    });
  });
});


// ================== GET COMPLAINTS ==================
router.get("/complaint", (req, res) => {
  db.query("SELECT * FROM Complaint", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Add FIR
router.post("/", (req, res) => {
  const { complaint_id, filed_date, station_id } = req.body;

  const sql = `
    INSERT INTO FIR (complaint_id, filed_date, station_id)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [complaint_id, filed_date, station_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error adding FIR");
    }

    // ✅ RETURN JSON WITH ID
    res.json({
      message: "FIR Added Successfully",
      fir_id: result.insertId
    });
  });
});

// Query To Get FIRs (Query 1)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      f.fir_id,
      c.complainant_name,
      DATE(f.filed_date) AS filed_date,
      p.station_name,
      c.description
    FROM FIR f
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Police_Station p ON f.station_id = p.station_id
    ORDER BY f.fir_id ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching FIRs");
    }
    res.json(result);
  });
});

// Query To Get Month-Wise FIRs (Query 3)
router.get("/monthly", (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).send("Year and month required");
  }

  const sql = `
    SELECT 
      f.fir_id,
      c.complainant_name,
      DATE(f.filed_date) AS filed_date,
      p.station_name
    FROM FIR f
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Police_Station p ON f.station_id = p.station_id
    WHERE YEAR(f.filed_date) = ? 
      AND MONTH(f.filed_date) = ?
    ORDER BY f.fir_id
  `;

  db.query(sql, [year, month], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching monthly data");
    }

    res.json(result);
  });
});

// Query To Get Details of Searched FIR ID (Query 7)
router.get("/search/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      f.fir_id,
      c.complainant_name,
      DATE(f.filed_date) AS filed_date,
      p.station_name,
      c.description
    FROM FIR f
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Police_Station p ON f.station_id = p.station_id
    WHERE f.fir_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error searching FIR");
    }

    if (result.length === 0) {
      return res.json({ message: "No FIR found" });
    }

    res.json(result[0]);
  });
});

// ================== GET STATIONS ==================
router.get("/stations", (req, res) => {
  db.query("SELECT * FROM Police_Station", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching stations");
    }
    res.json(result);
  });
});

module.exports = router;