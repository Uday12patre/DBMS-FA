USE Crimedb;
-- ============================================
-- 1. Show all complaints sorted by latest date
-- ============================================
SELECT * 
FROM Complaint
ORDER BY complaint_date DESC;


-- ============================================
-- 2. Show FIRs from a specific police station
-- ============================================
SELECT * 
FROM FIR
WHERE station_id = 1;


-- ============================================
-- 3. Count total number of officers
-- ============================================
SELECT COUNT(*) AS total_officers
FROM Officer;


-- ============================================
-- 4. Show officers with their police station
-- (Using JOIN between Officer and Police_Station)
-- ============================================
SELECT o.name, p.station_name
FROM Officer o
JOIN Police_Station p 
ON o.station_id = p.station_id;


-- ============================================
-- 5. Show cases which are under investigation
-- ============================================
SELECT case_id, status
FROM Case_Details
WHERE status = 'Under Investigation';


-- ============================================
-- 6. Count number of cases by status
-- (Using GROUP BY + COUNT)
-- ============================================
SELECT status, COUNT(*) AS total_cases
FROM Case_Details
GROUP BY status;


-- ============================================
-- 7. Show FIR with complainant name
-- (JOIN between FIR and Complaint)
-- ============================================
SELECT f.fir_id, c.complainant_name
FROM FIR f
JOIN Complaint c 
ON f.complaint_id = c.complaint_id;


-- ============================================
-- 8. Show cases with officer name ordered by case ID
-- ============================================
SELECT cd.case_id, o.name AS officer_name
FROM Case_Details cd
JOIN Officer o 
ON cd.assigned_officer = o.officer_id
ORDER BY cd.case_id;


-- ============================================
-- 9. Show complaints after a specific date
-- ============================================
SELECT * 
FROM Complaint
WHERE complaint_date > '2026-04-05';


-- ============================================
-- 10. Count FIRs in each police station
-- ============================================
SELECT station_id, COUNT(*) AS total_fir
FROM FIR
GROUP BY station_id;