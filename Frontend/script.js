const API = "http://localhost:3000/api";

// ================== HELPER ==================
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN");
}

function clearDisplay() {
  document.getElementById("dataDisplay").innerHTML = "";
}

function clearAllDisplays() {
  document.getElementById("dataDisplay").innerHTML = "";
  document.getElementById("crimeData").innerHTML = "";
  document.getElementById("officerData").innerHTML = "";
  document.getElementById("statusData").innerHTML = "";
  document.getElementById("crimeCountData").innerHTML = "";
  document.getElementById("searchResult").innerHTML = "";
}

function clearAllDisplays() {
  document.getElementById("dataDisplay").innerHTML = "";
  document.getElementById("crimeData").innerHTML = "";
  document.getElementById("officerData").innerHTML = "";
  document.getElementById("statusData").innerHTML = "";
  document.getElementById("crimeCountData").innerHTML = "";
  document.getElementById("searchResult").innerHTML = "";
}

// ================== AUTO LOAD ==================
window.onload = () => {
  loadStats();
  loadComplaints();
  loadStations();
  loadFIRDropdown();
  loadCrimeTypes();
  loadLocations();
  loadOfficers();
};

// ================== STATS ==================
function loadStats() {
  fetch(`${API}/case/stats`)
    .then(res => res.json())
    .then(data => {
      // Update metric cards
      document.getElementById("metaTotalCases").textContent = data.cases || 0;
      document.getElementById("metaOpenCases").textContent = data.open || 0;
      document.getElementById("metaInvestigators").textContent = data.firs || 0;
      document.getElementById("metaAlerts").textContent = data.cases || 0;
      
      // Also update stats display
      document.getElementById("statsData").innerHTML = `
        <p><strong>Total FIRs:</strong> ${data.firs || 0}</p>
        <p><strong>Total Cases:</strong> ${data.cases || 0}</p>
        <p><strong>Open Cases:</strong> ${data.open || 0}</p>
      `;
    })
    .catch(err => {
      console.error("Stats fetch error:", err);
      document.getElementById("statsData").innerHTML = "<p style='color: #f87171;'>Failed to load stats</p>";
    });
}

// ================== ADD COMPLAINT ==================
function addComplaint() {
  const data = {
    complainant_name: document.getElementById("complainant_name").value,
    complaint_date: document.getElementById("complaint_date").value,
    description: document.getElementById("description").value
  };

  if (!data.complainant_name || !data.complaint_date) {
    alert("Fill all fields");
    return;
  }

  fetch(`${API}/fir/complaint`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(d => {
    const display = document.getElementById("complaintIdDisplay");
    display.innerHTML = `<p style="color: #7dd3fc;"><strong>Complaint ID: ${d.complaint_id}</strong></p>`;
    display.style.display = "block";
    document.getElementById("complainant_name").value = "";
    document.getElementById("complaint_date").value = "";
    document.getElementById("description").value = "";
    loadComplaints();
    loadStats();
  })
  .catch(err => {
    console.error("Error adding complaint:", err);
    document.getElementById("complaintIdDisplay").innerHTML = "<p style='color: #f87171;'>Failed to add complaint</p>";
    document.getElementById("complaintIdDisplay").style.display = "block";
  });
}

// ================== LOAD COMPLAINTS ==================
function loadComplaints() {
  fetch(`${API}/fir/complaint`)
    .then(res => res.json())
    .then(data => {
      let options = "<option value=''>-- Select Complaint --</option>";
      data.forEach(c => {
        options += `<option value="${c.complaint_id}">
          ${c.complaint_id} - ${c.complainant_name}
        </option>`;
      });
      document.getElementById("complaint_id").innerHTML = options;
    })
    .catch(err => console.error("Error loading complaints:", err));
}

// ================== LOAD STATIONS ==================
function loadStations() {
  fetch(`${API}/fir/stations`)
    .then(res => res.json())
    .then(data => {
      let options = "<option value=''>-- Select Station --</option>";
      if (data && data.length > 0) {
        data.forEach(s => {
          options += `<option value="${s.station_id}">
            ${s.station_name}
          </option>`;
        });
      }
      document.getElementById("station").innerHTML = options;
    })
    .catch(err => console.error("Error loading stations:", err));
}

// ================== ADD FIR ==================
function addFIR() {
  const data = {
    complaint_id: document.getElementById("complaint_id").value,
    filed_date: document.getElementById("date").value,
    station_id: document.getElementById("station").value
  };

  fetch(`${API}/fir`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(d => {
    const display = document.getElementById("firIdDisplay");
    display.innerHTML = `<p style="color: #7dd3fc;"><strong>FIR ID: ${d.fir_id}</strong></p>`;
    display.style.display = "block";
    document.getElementById("complaint_id").value = "";
    document.getElementById("date").value = "";
    document.getElementById("station").value = "";
    loadStats();
    loadFIRDropdown();
  })
  .catch(err => {
    console.error("Error adding FIR:", err);
    document.getElementById("firIdDisplay").innerHTML = "<p style='color: #f87171;'>Failed to add FIR</p>";
    document.getElementById("firIdDisplay").style.display = "block";
  });
}

// ================== LOAD FIR DROPDOWN ==================
function loadFIRDropdown() {
  fetch(`${API}/case/fir-list`)
    .then(res => res.json())
    .then(data => {
      let options = "<option value=''>-- Select FIR --</option>";
      if (data && data.length > 0) {
        data.forEach(f => {
          options += `<option value="${f.fir_id}">
            FIR ${f.fir_id}
          </option>`;
        });
      }
      document.getElementById("fir_id").innerHTML = options;
    })
    .catch(err => console.error("Error loading FIR dropdown:", err));
}

// ================== LOAD CRIME TYPES ==================
function loadCrimeTypes() {
  fetch(`${API}/case/crime-types`)
    .then(res => res.json())
    .then(data => {
      let options = "<option value=''>-- Select Crime Type --</option>";
      if (data && data.length > 0) {
        data.forEach(c => {
          options += `<option value="${c.crime_type_id}">
            ${c.type_name}
          </option>`;
        });
      }
      document.getElementById("crime_type").innerHTML = options;
    })
    .catch(err => console.error("Error loading crime types:", err));
}

// ================== LOAD LOCATIONS ==================
function loadLocations() {
  fetch(`${API}/case/locations`)
    .then(res => res.json())
    .then(data => {
      let options = "<option value=''>-- Select Location --</option>";
      if (data && data.length > 0) {
        data.forEach(l => {
          options += `<option value="${l.location_id}">
            ${l.area}
          </option>`;
        });
      }
      document.getElementById("location").innerHTML = options;
    })
    .catch(err => console.error("Error loading locations:", err));
}

// ================== LOAD OFFICERS ==================
function loadOfficers() {
  fetch(`${API}/case/officers`)
    .then(res => res.json())
    .then(data => {
      let options = "<option value=''>-- Select Officer --</option>";
      if (data && data.length > 0) {
        data.forEach(o => {
          options += `<option value="${o.officer_id}">
            ${o.name}
          </option>`;
        });
      }
      document.getElementById("officer").innerHTML = options;
    })
    .catch(err => console.error("Error loading officers:", err));
}

// ================== ADD CASE ==================
function addCase() {
  const data = {
    fir_id: document.getElementById("fir_id").value,
    crime_type_id: document.getElementById("crime_type").value,
    location_id: document.getElementById("location").value,
    assigned_officer: document.getElementById("officer").value,
    status: document.getElementById("status").value || "Open"
  };

  fetch(`${API}/case`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(err => Promise.reject(err));
    }
    return res.json();
  })
  .then(d => {
    const display = document.getElementById("caseIdDisplay");
    display.innerHTML = `<p style="color: #7dd3fc;"><strong>Case ID: ${d.case_id}</strong></p>`;
    display.style.display = "block";
    document.getElementById("fir_id").value = "";
    document.getElementById("crime_type").value = "";
    document.getElementById("location").value = "";
    document.getElementById("officer").value = "";
    document.getElementById("status").value = "Open";
    loadStats();
  })
  .catch(err => {
    console.error("Error adding case:", err);
    const errorMsg = err.error || err.message || "Failed to add case";
    document.getElementById("caseIdDisplay").innerHTML = `<p style='color: #f87171;'>${errorMsg}</p>`;
    document.getElementById("caseIdDisplay").style.display = "block";
  });
}

// ================== LOAD FIRs ==================
function loadFIRs() {
  clearAllDisplays();
  fetch(`${API}/fir`)
    .then(res => res.json())
    .then(data => {
      let output = "<h3>FIR List</h3>";
      if (data && data.length > 0) {
        data.forEach(f => {
          output += `
            <p style="padding: 8px; background: #0f1a34; margin: 6px 0; border-radius: 6px;">
              <strong>FIR ${f.fir_id}</strong> | ${f.complainant_name} | ${formatDate(f.filed_date)}
            </p>`;
        });
      } else {
        output += "<p>No FIRs found</p>";
      }
      document.getElementById("dataDisplay").innerHTML = output;
    })
    .catch(err => {
      console.error("Error loading FIRs:", err);
      document.getElementById("dataDisplay").innerHTML = "<p style='color: #f87171;'>Failed to load FIRs</p>";
    });
}

// ================== LOAD CASES ==================
function loadCases() {
  clearAllDisplays();
  fetch(`${API}/case`)
    .then(res => res.json())
    .then(data => {
      let output = "<h3>Case List</h3>";
      if (data && data.length > 0) {
        data.forEach(c => {
          output += `
            <p style="padding: 8px; background: #0f1a34; margin: 6px 0; border-radius: 6px;">
              <strong>Case ${c.case_id}</strong> | ${c.complainant_name} | <span style="color: #7dd3fc;">${c.status}</span>
            </p>`;
        });
      } else {
        output += "<p>No cases found</p>";
      }
      document.getElementById("dataDisplay").innerHTML = output;
    })
    .catch(err => {
      console.error("Error loading cases:", err);
      document.getElementById("dataDisplay").innerHTML = "<p style='color: #f87171;'>Failed to load cases</p>";
    });
}

// ================== LOAD CRIME SORTED ==================
function loadCrimeSorted() {
  clearAllDisplays();
  fetch(`${API}/case/crime-sorted`)
    .then(res => res.json())
    .then(data => {
      let output = "<h3>Cases Ordered by Crime Type</h3>";
      if (data && data.length > 0) {
        data.forEach(item => {
          output += `<p style="padding: 8px; background: #0f1a34; margin: 6px 0; border-radius: 6px;">${item.crime_type} | FIR ${item.fir_id} | ${item.description} | Officer: ${item.officer_name || 'N/A'} | ${formatDate(item.complaint_date)}</p>`;
        });
      } else {
        output += "<p>No data found</p>";
      }
      document.getElementById("crimeData").innerHTML = output;
    })
    .catch(err => {
      console.error("Error loading crime sorted:", err);
      document.getElementById("crimeData").innerHTML = "<p style='color: #f87171;'>Failed to load crime data</p>";
    });
}

// ================== LOAD OFFICER SORTED ==================
function loadOfficerSorted() {
  clearAllDisplays();
  fetch(`${API}/case/officer-sorted`)
    .then(res => res.json())
    .then(data => {
      let output = "<h3>Cases Ordered by Officer</h3>";
      if (data && data.length > 0) {
        data.forEach(item => {
          output += `<p style="padding: 8px; background: #0f1a34; margin: 6px 0; border-radius: 6px;">${item.officer_name || 'Unassigned'} | FIR ${item.fir_id} | ${item.crime_type} | ${item.description} | ${formatDate(item.complaint_date)}</p>`;
        });
      } else {
        output += "<p>No data found</p>";
      }
      document.getElementById("officerData").innerHTML = output;
    })
    .catch(err => {
      console.error("Error loading officer sorted:", err);
      document.getElementById("officerData").innerHTML = "<p style='color: #f87171;'>Failed to load officer data</p>";
    });
}

// ================== ADD SUSPECT ==================
function addSuspect() {
  fetch(`${API}/add-suspect`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      case_id: document.getElementById("suspect_case_id").value,
      name: document.getElementById("suspect_name").value,
      contact: document.getElementById("suspect_contact").value,
      address: document.getElementById("suspect_address").value
    })
  })
  .then(res => res.text())
  .then(msg => {
    const display = document.getElementById("suspectFeedback");
    display.innerHTML = `<p style="color: #86efac;">✓ ${msg}</p>`;
    display.style.display = "block";
    document.getElementById("suspect_case_id").value = "";
    document.getElementById("suspect_name").value = "";
    document.getElementById("suspect_contact").value = "";
    document.getElementById("suspect_address").value = "";
  })
  .catch(err => {
    console.error("Error adding suspect:", err);
    const display = document.getElementById("suspectFeedback");
    display.innerHTML = "<p style='color: #f87171;'>Failed to add suspect</p>";
    display.style.display = "block";
  });
}

// ================== ADD VICTIM ==================
function addVictim() {
  fetch(`${API}/add-victim`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      case_id: document.getElementById("victim_case_id").value,
      name: document.getElementById("victim_name").value,
      contact: document.getElementById("victim_contact").value,
      address: document.getElementById("victim_address").value
    })
  })
  .then(res => res.text())
  .then(msg => {
    const display = document.getElementById("victimFeedback");
    display.innerHTML = `<p style="color: #86efac;">✓ ${msg}</p>`;
    display.style.display = "block";
    document.getElementById("victim_case_id").value = "";
    document.getElementById("victim_name").value = "";
    document.getElementById("victim_contact").value = "";
    document.getElementById("victim_address").value = "";
  })
  .catch(err => {
    console.error("Error adding victim:", err);
    const display = document.getElementById("victimFeedback");
    display.innerHTML = "<p style='color: #f87171;'>Failed to add victim</p>";
    display.style.display = "block";
  });
}

// ================== ADD WITNESS ==================
function addWitness() {
  fetch(`${API}/add-witness`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      case_id: document.getElementById("witness_case_id").value,
      name: document.getElementById("witness_name").value,
      contact: document.getElementById("witness_contact").value,
      address: document.getElementById("witness_address").value
    })
  })
  .then(res => res.text())
  .then(msg => {
    const display = document.getElementById("witnessFeedback");
    display.innerHTML = `<p style="color: #86efac;">✓ ${msg}</p>`;
    display.style.display = "block";
    document.getElementById("witness_case_id").value = "";
    document.getElementById("witness_name").value = "";
    document.getElementById("witness_contact").value = "";
    document.getElementById("witness_address").value = "";
  })
  .catch(err => {
    console.error("Error adding witness:", err);
    const display = document.getElementById("witnessFeedback");
    display.innerHTML = "<p style='color: #f87171;'>Failed to add witness</p>";
    display.style.display = "block";
  });
}

// ================== LOAD CASE STATUS ==================
function loadCaseStatus() {
  clearAllDisplays();
  fetch(`${API}/case?sort=status`)
    .then(res => res.json())
    .then(data => {
      let output = "<h3>Cases by Status</h3>";
      if (data && data.length > 0) {
        data.forEach(item => {
          const statusColor = item.status === 'Open' ? '#7dd3fc' : '#86efac';
          output += `<p style="padding: 8px; background: #0f1a34; margin: 6px 0; border-radius: 6px;">Case ${item.case_id} | <span style="color: ${statusColor};">${item.status}</span> | ${item.complainant_name}</p>`;
        });
      } else {
        output += "<p>No cases found</p>";
      }
      document.getElementById("statusData").innerHTML = output;
    })
    .catch(err => {
      console.error("Error loading case status:", err);
      document.getElementById("statusData").innerHTML = "<p style='color: #f87171;'>Failed to load status data</p>";
    });
}

// ================== LOAD CRIME COUNT ==================
function loadCrimeCount() {
  clearAllDisplays();
  fetch(`${API}/case/crime-count`)
    .then(res => res.json())
    .then(data => {
      let output = "<h3>Cases by Crime Type (Count)</h3>";
      if (data && data.length > 0) {
        data.forEach(item => {
          output += `<p style="padding: 8px; background: #0f1a34; margin: 6px 0; border-radius: 6px;">
            <strong>${item.crime_type}</strong>: <span style="color: #fbbf24;">${item.case_count} case${item.case_count !== 1 ? 's' : ''}</span>
          </p>`;
        });
      } else {
        output += "<p>No crime data found</p>";
      }
      document.getElementById("crimeCountData").innerHTML = output;
    })
    .catch(err => {
      console.error("Error loading crime count:", err);
      document.getElementById("crimeCountData").innerHTML = "<p style='color: #f87171;'>Failed to load crime count</p>";
    });
}

// ================== SEARCH FIR ==================
function searchFIR() {
  clearAllDisplays();
  const firId = document.getElementById("searchFIR").value;
  if (!firId) {
    alert("Please enter a FIR ID");
    return;
  }

  fetch(`${API}/fir`)
    .then(res => res.json())
    .then(data => {
      const fir = data.find(f => f.fir_id == firId);
      if (fir) {
        document.getElementById("searchResult").innerHTML = `
          <h4>Search Result</h4>
          <p style="padding: 10px; background: #0f1a34; border-radius: 6px;">
            <strong>FIR ${fir.fir_id}</strong><br>
            Complainant: ${fir.complainant_name}<br>
            Filed Date: ${formatDate(fir.filed_date)}<br>
            Station: ${fir.station_name}<br>
            Description: ${fir.description}
          </p>
        `;
      } else {
        document.getElementById("searchResult").innerHTML = "<p style='color: #f87171;'>FIR not found</p>";
      }
    })
    .catch(err => {
      console.error("Error searching FIR:", err);
      document.getElementById("searchResult").innerHTML = "<p style='color: #f87171;'>Search failed</p>";
    });
}

// ================== LOAD ALL FIRs ==================
function loadAllFIRs() {
  clearAllDisplays();
  fetch(`${API}/fir`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        document.getElementById("firsTableDisplay").innerHTML = "<p>No FIRs found</p>";
        return;
      }

      let table = `<h3>All FIRs</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Complainant</th>
              <th>Filed Date</th>
              <th>Station</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>`;

      data.forEach(fir => {
        table += `<tr>
          <td>${fir.fir_id}</td>
          <td>${fir.complainant_name}</td>
          <td>${formatDate(fir.filed_date)}</td>
          <td>${fir.station_name}</td>
          <td>${fir.description}</td>
        </tr>`;
      });

      table += `</tbody></table>`;
      document.getElementById("firsTableDisplay").innerHTML = table;
    })
    .catch(err => {
      console.error("Error loading FIRs:", err);
      document.getElementById("firsTableDisplay").innerHTML = "<p style='color: #f87171;'>Failed to load FIRs</p>";
    });
}

// ================== LOAD ALL COMPLAINTS ==================
function loadAllComplaints() {
  clearAllDisplays();
  fetch(`${API}/fir/complaint`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        document.getElementById("complaintsTableDisplay").innerHTML = "<p>No complaints found</p>";
        return;
      }

      let table = `<h3>All Complaints</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background: #1a2f45; border: 1px solid #2f4e7a;">
              <th style="padding: 10px; text-align: left; border: 1px solid #2f4e7a; color: #7dd3fc;">ID</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #2f4e7a; color: #7dd3fc;">Complainant Name</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #2f4e7a; color: #7dd3fc;">Date</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #2f4e7a; color: #7dd3fc;">Description</th>
            </tr>
          </thead>
          <tbody>`;

      data.forEach(complaint => {
        table += `<tr style="border: 1px solid #2f4e7a; background: #0f1a34;">
          <td style="padding: 10px; border: 1px solid #2f4e7a;">${complaint.complaint_id}</td>
          <td style="padding: 10px; border: 1px solid #2f4e7a;">${complaint.complainant_name}</td>
          <td style="padding: 10px; border: 1px solid #2f4e7a;">${formatDate(complaint.complaint_date)}</td>
          <td style="padding: 10px; border: 1px solid #2f4e7a;">${complaint.description || 'N/A'}</td>
        </tr>`;
      });

      table += `</tbody></table>`;
      document.getElementById("complaintsTableDisplay").innerHTML = table;
    })
    .catch(err => {
      console.error("Error loading complaints:", err);
      document.getElementById("complaintsTableDisplay").innerHTML = "<p style='color: #f87171;'>Failed to load complaints</p>";
    });
}