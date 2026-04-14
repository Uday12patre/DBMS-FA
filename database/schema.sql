-- ========================
-- RESET DATABASE
-- ========================
DROP DATABASE IF EXISTS CrimeDB;
CREATE DATABASE CrimeDB;
USE CrimeDB;

-- ========================
-- CORE TABLES
-- ========================

CREATE TABLE Police_Station (
    station_id INT PRIMARY KEY AUTO_INCREMENT,
    station_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10)
);

CREATE TABLE Officer (
    officer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    `rank` VARCHAR(50),
    station_id INT,
    FOREIGN KEY (station_id) REFERENCES Police_Station(station_id) ON DELETE SET NULL
);

CREATE TABLE Complaint (
    complaint_id INT PRIMARY KEY AUTO_INCREMENT,
    complainant_name VARCHAR(100) NOT NULL,
    complaint_date DATE NOT NULL,
    description TEXT
);

CREATE TABLE FIR (
    fir_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL UNIQUE,
    filed_date DATE NOT NULL,
    station_id INT NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES Complaint(complaint_id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES Police_Station(station_id)
);

CREATE TABLE Crime_Type (
    crime_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Location (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    area VARCHAR(100),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10)
);

CREATE TABLE Case_Details (
    case_id INT PRIMARY KEY AUTO_INCREMENT,
    fir_id INT NOT NULL UNIQUE,
    crime_type_id INT,
    location_id INT,
    assigned_officer INT,
    status VARCHAR(50) DEFAULT 'Open',
    CHECK (status IN ('Open','Under Investigation','Closed')),
    FOREIGN KEY (fir_id) REFERENCES FIR(fir_id) ON DELETE CASCADE,
    FOREIGN KEY (crime_type_id) REFERENCES Crime_Type(crime_type_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id),
    FOREIGN KEY (assigned_officer) REFERENCES Officer(officer_id)
);

-- ========================
-- PERSON TABLES
-- ========================

CREATE TABLE Suspect (
    suspect_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    address TEXT
);

CREATE TABLE Victim (
    victim_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    address TEXT
);

CREATE TABLE Witness (
    witness_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    address TEXT
);

-- ========================
-- RELATION TABLES
-- ========================

CREATE TABLE Case_Suspect (
    case_id INT,
    suspect_id INT,
    PRIMARY KEY (case_id, suspect_id),
    FOREIGN KEY (case_id) REFERENCES Case_Details(case_id) ON DELETE CASCADE,
    FOREIGN KEY (suspect_id) REFERENCES Suspect(suspect_id) ON DELETE CASCADE
);

CREATE TABLE Case_Victim (
    case_id INT,
    victim_id INT,
    PRIMARY KEY (case_id, victim_id),
    FOREIGN KEY (case_id) REFERENCES Case_Details(case_id) ON DELETE CASCADE,
    FOREIGN KEY (victim_id) REFERENCES Victim(victim_id) ON DELETE CASCADE
);

CREATE TABLE Case_Witness (
    case_id INT,
    witness_id INT,
    PRIMARY KEY (case_id, witness_id),
    FOREIGN KEY (case_id) REFERENCES Case_Details(case_id) ON DELETE CASCADE,
    FOREIGN KEY (witness_id) REFERENCES Witness(witness_id) ON DELETE CASCADE
);

-- ========================
-- INSERT DATA
-- ========================

-- Police Stations (13 total)
INSERT INTO Police_Station (station_name, city, state, pincode) VALUES
('Shivajinagar Police Station','Pune','Maharashtra','411005'),
('Kothrud Police Station','Pune','Maharashtra','411038'),
('Hadapsar Police Station','Pune','Maharashtra','411028'),
('Viman Nagar Police Station','Pune','Maharashtra','411014'),
('Baner Police Station','Pune','Maharashtra','411045'),
('Wakad Police Station','Pune','Maharashtra','411057'),
('Pimpri Police Station','Pune','Maharashtra','411018'),
('Chinchwad Police Station','Pune','Maharashtra','411033'),
('Aundh Police Station','Pune','Maharashtra','411007'),
('Yerwada Police Station','Pune','Maharashtra','411006'),
('Koregaon Park Police Station','Pune','Maharashtra','411001'),
('Sinhagad Road Police Station','Pune','Maharashtra','411051'),
('Swargate Police Station','Pune','Maharashtra','411042');

-- Officers (13 total)
INSERT INTO Officer (name, `rank`, station_id) VALUES
('Ajay Deshmukh','Inspector',1),
('Snehal Kulkarni','Sub-Inspector',2),
('Rohit Pawar','Inspector',3),
('Priya Patil','Inspector',4),
('Vikram Shinde','Sub-Inspector',5),
('Anita Jadhav','Inspector',6),
('Sanjay More','Inspector',7),
('Kiran Gaikwad','Sub-Inspector',8),
('Meena Kale','Inspector',9),
('Rajesh Pawar','Sub-Inspector',10),
('Nitin Shinde','Inspector',11),
('Pallavi Patil','Inspector',12),
('Omkar Jagtap','Sub-Inspector',13);

-- Crime Types (13 total)
INSERT INTO Crime_Type (type_name) VALUES
('Theft'),('Murder'),('Cyber Crime'),
('Robbery'),('Kidnapping'),('Assault'),
('Fraud'),('Burglary'),('Domestic Violence'),
('Extortion'),('Arson'),('Vandalism'),
('Drug Trafficking');

-- Locations (13 total)
INSERT INTO Location (area, city, state, pincode) VALUES
('Shivajinagar','Pune','Maharashtra','411005'),
('Kothrud','Pune','Maharashtra','411038'),
('Hadapsar','Pune','Maharashtra','411028'),
('Viman Nagar','Pune','Maharashtra','411014'),
('Baner','Pune','Maharashtra','411045'),
('Wakad','Pune','Maharashtra','411057'),
('Pimpri','Pune','Maharashtra','411018'),
('Chinchwad','Pune','Maharashtra','411033'),
('Aundh','Pune','Maharashtra','411007'),
('Yerwada','Pune','Maharashtra','411006'),
('Koregaon Park','Pune','Maharashtra','411001'),
('Sinhagad Road','Pune','Maharashtra','411051'),
('Swargate','Pune','Maharashtra','411042');

-- Complaints (12 total)
INSERT INTO Complaint (complainant_name, complaint_date, description) VALUES
('Aditya Joshi','2026-04-01','Bike theft'),
('Neha Kulkarni','2026-04-02','Online fraud'),
('Rahul Patil','2026-04-03','Mobile theft'),
('Sneha Joshi','2026-04-04','Chain snatching'),
('Amit Shah','2026-04-05','Kidnapping'),
('Pooja Mehta','2026-04-06','Assault'),
('Ravi Kumar','2026-04-07','Drug dealing'),
('Kunal Desai','2026-04-08','House burglary'),
('Anjali Sharma','2026-04-09','Domestic violence'),
('Manish Singh','2026-04-10','Fraud case'),
('Ritika Kapoor','2026-04-11','Extortion'),
('Arjun Verma','2026-04-12','Arson');

-- FIR (12 total)
INSERT INTO FIR (complaint_id, filed_date, station_id) VALUES
(1,'2026-04-01',1),(2,'2026-04-02',2),
(3,'2026-04-03',3),(4,'2026-04-04',4),
(5,'2026-04-05',5),(6,'2026-04-06',6),
(7,'2026-04-07',7),(8,'2026-04-08',8),
(9,'2026-04-09',9),(10,'2026-04-10',10),
(11,'2026-04-11',11),(12,'2026-04-12',12);

-- Cases (12 total)
INSERT INTO Case_Details (fir_id, crime_type_id, location_id, assigned_officer, status) VALUES
(1,1,1,1,'Open'),
(2,3,2,2,'Under Investigation'),
(3,4,3,3,'Open'),
(4,5,4,4,'Closed'),
(5,6,5,5,'Under Investigation'),
(6,7,6,6,'Open'),
(7,8,7,7,'Closed'),
(8,9,8,8,'Open'),
(9,10,9,9,'Under Investigation'),
(10,11,10,10,'Closed'),
(11,12,11,11,'Open'),
(12,13,12,12,'Under Investigation');

-- Suspects (10)
INSERT INTO Suspect (name, contact, address) VALUES
('Ramesh Gupta','9876543210','Pune'),
('Suresh Yadav','9123456780','Mumbai'),
('Imran Khan','9988776655','Pune'),
('Karan Verma','9090909090','Nashik'),
('Vijay Singh','8888888888','Pune'),
('Arif Shaikh','7777777777','Mumbai'),
('Deepak Patil','6666666666','Pune'),
('Rohit Sharma','9999999999','Delhi'),
('Sameer Khan','8888777766','Pune'),
('Ajit Pawar','7777666655','Satara');

-- Victims (10)
INSERT INTO Victim (name, contact, address) VALUES
('Akash Singh','9000000001','Pune'),
('Neelam Patil','9000000002','Pune'),
('Farhan Ali','9000000003','Mumbai'),
('Kavita Sharma','9000000004','Pune'),
('Ritu Verma','9000000005','Nashik'),
('Anil Kumar','9000000006','Pune'),
('Sunita Devi','9000000007','Mumbai'),
('Raj Malhotra','9000000008','Delhi'),
('Pooja Singh','9000000009','Pune'),
('Nikhil Jain','9000000010','Pune');

-- Witnesses (10)
INSERT INTO Witness (name, contact, address) VALUES
('Sunil More','8000000001','Pune'),
('Deepak Jain','8000000002','Pune'),
('Ritu Agarwal','8000000003','Mumbai'),
('Aman Gupta','8000000004','Delhi'),
('Kiran Patil','8000000005','Pune'),
('Sanjana Shah','8000000006','Mumbai'),
('Rakesh Singh','8000000007','Pune'),
('Priyanka Chopra','8000000008','Mumbai'),
('Mohit Verma','8000000009','Pune'),
('Alok Mehta','8000000010','Nashik');

-- Relations
INSERT INTO Case_Suspect VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10);

INSERT INTO Case_Victim VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10);

INSERT INTO Case_Witness VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10);