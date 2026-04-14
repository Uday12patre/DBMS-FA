const express = require("express");
const router = express.Router();
const db = require("../db");


// ================== DASHBOARD STATS ==================
router.get("/stats", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalFIR FROM FIR", (err, firResult) => {
    if (err) return res.status(500).send(err);

    stats.firs = firResult[0].totalFIR;

    db.query("SELECT COUNT(*) AS totalCases FROM Case_Details", (err, caseResult) => {
      if (err) return res.status(500).send(err);

      stats.cases = caseResult[0].totalCases;

      db.query(
        "SELECT COUNT(*) AS openCases FROM Case_Details WHERE status = 'Open'",
        (err, openResult) => {
          if (err) return res.status(500).send(err);

          stats.open = openResult[0].openCases;

          res.json(stats);
        }
      );
    });
  });
});


// ================== GET ALL CASES ==================
// Query To Get Cases (Query 2)  
router.get("/", (req, res) => {
  let orderBy = 'cd.fir_id ASC';
  
  if (req.query.sort === 'crime_type') {
    orderBy = 'ct.type_name ASC';
  } else if (req.query.sort === 'officer') {
    orderBy = 'o.name ASC';
  } else if (req.query.sort === 'status') {
    orderBy = 'cd.status ASC';
  }

  const sql = `
    SELECT 
      cd.case_id,
      cd.fir_id,
      c.complainant_name,
      c.description,
      o.name AS officer_name,
      CONCAT(l.area, ' (', l.city, ')') AS location,
      ct.type_name AS crime_type,
      cd.status
    FROM Case_Details cd
    JOIN FIR f ON cd.fir_id = f.fir_id
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    LEFT JOIN Officer o ON cd.assigned_officer = o.officer_id
    LEFT JOIN Location l ON cd.location_id = l.location_id
    LEFT JOIN Crime_Type ct ON cd.crime_type_id = ct.crime_type_id
    ORDER BY ${orderBy}
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching cases");
    }
    res.json(result);
  });
});

// ================== COUNT CASES BY CRIME TYPE ==================
router.get("/crime-count", (req, res) => {
  const sql = `
    SELECT 
      COALESCE(ct.type_name, 'Unspecified') AS crime_type,
      COUNT(cd.case_id) AS case_count
    FROM Case_Details cd
    LEFT JOIN Crime_Type ct ON cd.crime_type_id = ct.crime_type_id
    GROUP BY ct.type_name
    ORDER BY case_count DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error counting cases by crime type");
    }
    res.json(result);
  });
});

// Query To Get CRIME TYPE (ORDER BY) (Query 4)
router.get("/crime-sorted", (req, res) => {
  const sql = `
    SELECT 
      ct.type_name AS crime_type,
      cd.fir_id,
      c.description,
      o.name AS officer_name,
      DATE(c.complaint_date) AS complaint_date
    FROM Case_Details cd
    JOIN Crime_Type ct ON cd.crime_type_id = ct.crime_type_id
    JOIN FIR f ON cd.fir_id = f.fir_id
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Officer o ON cd.assigned_officer = o.officer_id
    ORDER BY ct.type_name ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching sorted data");
    }
    res.json(result);
  });
});

// Query To Get ORDER BY OFFICER (Query 5)
router.get("/officer-sorted", (req, res) => {
  const sql = `
    SELECT 
      o.name AS officer_name,
      cd.fir_id,
      ct.type_name AS crime_type,
      c.description,
      DATE(c.complaint_date) AS complaint_date
    FROM Case_Details cd
    JOIN Officer o ON cd.assigned_officer = o.officer_id
    JOIN FIR f ON cd.fir_id = f.fir_id
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Crime_Type ct ON cd.crime_type_id = ct.crime_type_id
    ORDER BY officer_name ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching officer sorted data");
    }
    res.json(result);
  });
});

// Query To Get CASE STATUS (Query 6)
router.get("/case-status", (req, res) => {
  const sql = `
    SELECT 
      cd.status,
      cd.case_id,
      cd.fir_id,
      ct.type_name AS crime_type,
      c.description,
      o.name AS officer_name
    FROM Case_Details cd
    JOIN Crime_Type ct ON cd.crime_type_id = ct.crime_type_id
    JOIN FIR f ON cd.fir_id = f.fir_id
    JOIN Complaint c ON f.complaint_id = c.complaint_id
    JOIN Officer o ON cd.assigned_officer = o.officer_id
    ORDER BY cd.status ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching case status");
    }
    res.json(result);
  });
});

// Query To Get COUNT CASES BY CRIME TYPE (Query 8)
router.get("/crime-count", (req, res) => {
  const sql = `
    SELECT 
      ct.type_name AS crime_type,
      COUNT(cd.case_id) AS total_cases
    FROM Case_Details cd
    JOIN Crime_Type ct ON cd.crime_type_id = ct.crime_type_id
    GROUP BY ct.type_name
    ORDER BY total_cases DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching crime count");
    }
    res.json(result);
  });
});

// ================== CREATE CASE ==================
router.post("/", (req, res) => {
  const { fir_id, crime_type_id, location_id, assigned_officer, status } = req.body;

  // Validate required fields
  if (!fir_id || !crime_type_id || !location_id || !assigned_officer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("CASE DATA:", req.body); // DEBUG

  const sql = `
    INSERT INTO Case_Details 
    (fir_id, crime_type_id, location_id, assigned_officer, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
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


// ================== GET FIR LIST ==================
router.get("/fir-list", (req, res) => {
  db.query("SELECT * FROM FIR", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// ================== GET CRIME TYPES ==================
router.get("/crime-types", (req, res) => {
  db.query("SELECT * FROM Crime_Type", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// ================== GET LOCATIONS ==================
router.get("/locations", (req, res) => {
  db.query("SELECT * FROM Location", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// ================== GET OFFICERS ==================
router.get("/officers", (req, res) => {
  db.query("SELECT * FROM Officer", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// ==================
module.exports = router;