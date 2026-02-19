const API_URL = "https://mini-crm-9ntd.onrender.com/api/leads";
const form = document.getElementById("leadForm");
const table = document.getElementById("leadTable");
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// Load leads when page opens
window.onload = fetchLeads;

// Fetch all leads
async function fetchLeads() {
    const res = await fetch(API_URL, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

    const leads = await res.json();

// Update stats
document.getElementById("totalLeads").innerText = leads.length;

const newCount = leads.filter(l => l.status === "new").length;
const contactedCount = leads.filter(l => l.status === "contacted").length;
const convertedCount = leads.filter(l => l.status === "converted").length;

document.getElementById("newLeads").innerText = newCount;
document.getElementById("contactedLeads").innerText = contactedCount;
document.getElementById("convertedLeads").innerText = convertedCount;



    table.innerHTML = "";

    leads.forEach(lead => {
        const row = `
            <tr>
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.phone || ""}</td>
                <td>${lead.source || ""}</td>
                <td>
                    <select onchange="updateStatus('${lead._id}', this.value)">
                        <option value="new" ${lead.status === "new" ? "selected" : ""}>New</option>
                        <option value="contacted" ${lead.status === "contacted" ? "selected" : ""}>Contacted</option>
                        <option value="converted" ${lead.status === "converted" ? "selected" : ""}>Converted</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteLead('${lead._id}')">Delete</button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newLead = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        source: document.getElementById("source").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newLead)
    });

    form.reset();
    fetchLeads();
});


// Delete lead
async function deleteLead(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
});

    fetchLeads();
}
// Update status
async function updateStatus(id, newStatus) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
    });

    fetchLeads();
}
