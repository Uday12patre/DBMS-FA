const express = require("express");
const db = require("./db");
const cors = require("cors");

const caseRoutes = require('./routes/case');
// const firRoutes = require('./routes/fir');
// const suspectRoutes = require('./routes/suspect');

const app = express();
app.use(cors());
app.use(express.json());

const BASE = "/api";

app.use(`${BASE}/case`, caseRoutes);
// app.use(`${BASE}/fir`, firRoutes);
// app.use(`${BASE}/suspect`, suspectRoutes);


// ================== COMPLAINT ==================
app.post(`${BASE}/fir/complaint`, (req, res) => {
  const { complainant_name, complaint_date, description } = req.body;

  if (!complainant_name || !complaint_date)
    return res.status(400).send("Missing fields");

  db.query(
    "INSERT INTO Complaint (complainant_name, complaint_date, description) VALUES (?, ?, ?)",
    [complainant_name, complaint_date, description],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ complaint_id: result.insertId });
    }
  );
});

app.get(`${BASE}/fir/complaint`, (req, res) => {
  db.query("SELECT * FROM Complaint", (err, data) => res.json(data));
});


// ================== STATIONS ==================
app.get(`${BASE}/fir/stations`, (req, res) => {
  db.query("SELECT * FROM Police_Station", (err, data) => res.json(data));
});


// ================== FIR ==================
app.post(`${BASE}/fir`, (req, res) => {
  const { complaint_id, filed_date, station_id } = req.body;

  db.query(
    "INSERT INTO FIR (complaint_id, filed_date, station_id) VALUES (?, ?, ?)",
    [complaint_id, filed_date, station_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ fir_id: result.insertId });
    }
  );
});

app.get(`${BASE}/fir`, (req, res) => {
  db.query(`
    SELECT f.fir_id, c.complainant_name, f.filed_date, p.station_name, c.description
    FROM FIR f
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Police_Station p ON f.station_id = p.station_id
  `, (err, data) => res.json(data));
});


// ================== CASE ==================
app.post(`${BASE}/case`, (req, res) => {
  const { fir_id, crime_type_id, location_id, assigned_officer, status } = req.body;

  // Validate required fields
  if (!fir_id || !crime_type_id || !location_id || !assigned_officer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO Case_Details (fir_id, crime_type_id, location_id, assigned_officer, status) VALUES (?, ?, ?, ?, ?)",
    [fir_id, crime_type_id, location_id, assigned_officer, status],
    (err, result) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ error: "Error creating case", details: err.message });
      }
      res.json({ case_id: result.insertId });
    }
  );
});

app.get(`${BASE}/case`, (req, res) => {
  db.query(`
    SELECT c.case_id, c.status, comp.complainant_name,
           CONCAT(o.name) AS officer_name,
           l.area AS location
    FROM Case_Details c
    JOIN FIR f ON c.fir_id = f.fir_id
    JOIN Complaint comp ON f.complaint_id = comp.complaint_id
    LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
    LEFT JOIN Location l ON c.location_id = l.location_id
  `, (err, data) => res.json(data));
});


// ================== DROPDOWNS ==================
app.get(`${BASE}/case/fir-list`, (req, res) => {
  db.query("SELECT fir_id FROM FIR", (err, data) => res.json(data));
});

app.get(`${BASE}/case/crime-types`, (req, res) => {
  db.query("SELECT * FROM Crime_Type", (err, data) => res.json(data));
});

app.get(`${BASE}/case/locations`, (req, res) => {
  db.query("SELECT * FROM Location", (err, data) => res.json(data));
});

app.get(`${BASE}/case/officers`, (req, res) => {
  db.query("SELECT * FROM Officer", (err, data) => res.json(data));
});


// ================== SUSPECT ==================
app.post(`${BASE}/add-suspect`, (req, res) => {
  const { case_id, name, contact, address } = req.body;

  db.query(
    "INSERT INTO Suspect (name, contact, address) VALUES (?, ?, ?)",
    [name, contact, address],
    (err, result) => {
      if (err) return res.status(500).send(err);

      db.query(
        "INSERT INTO Case_Suspect VALUES (?, ?)",
        [case_id, result.insertId],
        () => res.send("Suspect Added")
      );
    }
  );
});


// ================== VICTIM ==================
app.post(`${BASE}/add-victim`, (req, res) => {
  const { case_id, name, contact, address } = req.body;

  db.query(
    "INSERT INTO Victim (name, contact, address) VALUES (?, ?, ?)",
    [name, contact, address],
    (err, result) => {
      if (err) return res.status(500).send(err);

      db.query(
        "INSERT INTO Case_Victim VALUES (?, ?)",
        [case_id, result.insertId],
        () => res.send("Victim Added")
      );
    }
  );
});


// ================== WITNESS ==================
app.post(`${BASE}/add-witness`, (req, res) => {
  const { case_id, name, contact, address } = req.body;

  db.query(
    "INSERT INTO Witness (name, contact, address) VALUES (?, ?, ?)",
    [name, contact, address],
    (err, result) => {
      if (err) return res.status(500).send(err);

      db.query(
        "INSERT INTO Case_Witness VALUES (?, ?)",
        [case_id, result.insertId],
        () => res.send("Witness Added")
      );
    }
  );
});


// ================== START ==================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});