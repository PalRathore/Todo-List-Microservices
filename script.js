const API = "http://localhost:8081/assignment-service/assignments";

let data = [];
let pieChart, barChart;

document.addEventListener("DOMContentLoaded", loadData);

/* ============ LOAD ============ */
async function loadData() {
  try {
    const res = await fetch(API);
    data = await res.json();
  } catch (e) {
    // Fallback to empty data if backend not running
    data = [];
  }
  render();
}

function render() {
  renderStats();
  renderTable();
  renderCharts();
  reminders();
}

/* ============ STATS ============ */
function renderStats() {
  const total   = data.length;
  const today   = new Date().toISOString().split("T")[0];
  let pending   = 0;
  let overdue   = 0;

  data.forEach(a => {
    if (a.status === "Completed") return;
    if (a.dueDate < today) overdue++;
    else pending++;
  });

  // Animate numbers counting up
  animateCount("statTotal",   total);
  animateCount("statPending", pending);
  animateCount("statOverdue", overdue);

  // Animate stat bar widths
  setTimeout(() => {
    if (total > 0) {
      document.querySelector(".total-fill").style.width   = "100%";
      document.querySelector(".pending-fill").style.width = `${Math.round((pending / total) * 100)}%`;
      document.querySelector(".overdue-fill").style.width = `${Math.round((overdue / total) * 100)}%`;
    }
  }, 100);
}

function animateCount(id, target) {
  const el  = document.getElementById(id);
  const start = parseInt(el.innerText) || 0;
  const diff  = target - start;
  const steps = 30;
  let current = 0;

  const timer = setInterval(() => {
    current++;
    el.innerText = Math.round(start + (diff * current) / steps);
    if (current >= steps) {
      el.innerText = target;
      clearInterval(timer);
    }
  }, 20);
}

/* ============ TABLE ============ */
function renderTable() {
  const body  = document.getElementById("tblBody");
  const empty = document.getElementById("emptyState");
  const today = new Date().toISOString().split("T")[0];
  body.innerHTML = "";

  if (data.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  data.forEach((a, idx) => {
    let status = a.status;
    if (a.status !== "Completed" && a.dueDate < today) status = "Overdue";
    const cls = status.toLowerCase();
    const isCompleted = status === "Completed";

    const row = document.createElement("div");
    row.className = `tbl-row ${isCompleted ? "completed-row" : ""}`;
    row.style.animationDelay = `${idx * 0.06}s`;

    row.innerHTML = `
      <span>${a.title}</span>
      <span>${a.description}</span>
      <span>${formatDate(a.dueDate)}</span>
      <span><span class="badge ${cls}">${status}</span></span>
      <span class="action-span">
        <button class="btn-done" onclick="complete(${a.id})" ${isCompleted ? "disabled style='opacity:0.4;cursor:not-allowed'" : ""}>✓ Done</button>
        <button class="btn-del"  onclick="del(${a.id})">✕ Del</button>
      </span>
    `;

    body.appendChild(row);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ============ ADD ============ */
async function addAssignment() {
  const titleVal = document.getElementById("title").value.trim();
  const descVal  = document.getElementById("description").value.trim();
  const dateVal  = document.getElementById("dueDate").value;

  if (!titleVal || !dateVal) {
    showPopup("⚠️ Please enter a title and due date.", "warning");
    return;
  }

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleVal, description: descVal, dueDate: dateVal })
    });
  } catch (e) {
    // Offline mode: add locally
    data.push({
      id: Date.now(),
      title: titleVal,
      description: descVal,
      dueDate: dateVal,
      status: "Pending"
    });
    clearForm();
    render();
    showPopup(`✅ "${titleVal}" added!`, "success");
    return;
  }

  clearForm();
  showPopup(`✅ "${titleVal}" added!`, "success");
  loadData();
}

function clearForm() {
  document.getElementById("title").value       = "";
  document.getElementById("description").value = "";
  document.getElementById("dueDate").value     = "";
}

/* ============ COMPLETE ============ */
async function complete(id) {
  try {
    await fetch(`${API}/${id}/complete`, { method: "PUT" });
    loadData();
  } catch (e) {
    // Offline fallback
    const a = data.find(x => x.id === id);
    if (a) a.status = "Completed";
    render();
  }
}

/* ============ DELETE ============ */
async function del(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadData();
  } catch (e) {
    // Offline fallback
    data = data.filter(x => x.id !== id);
    render();
  }
}

/* ============ CHARTS ============ */
function renderCharts() {
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  let completed = 0, pending = 0, overdue = 0;
  const dateMap = {};
  const today   = new Date().toISOString().split("T")[0];

  data.forEach(a => {
    if (a.status === "Completed") completed++;
    else if (a.dueDate < today) overdue++;
    else pending++;

    const label = formatDate(a.dueDate);
    dateMap[label] = (dateMap[label] || 0) + 1;
  });

  // PIE CHART
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [{
        data: [completed, pending, overdue],
        backgroundColor: ["#959D90", "#BBA58F", "#523D35"],
        borderColor: "#E8D9CD",
        borderWidth: 3,
        hoverOffset: 10
      }]
    },
    options: {
      cutout: "62%",
      animation: {
        animateRotate: true,
        duration: 1200,
        easing: "easeInOutQuart"
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#3A2B24",
          titleFont: { family: "'Libre Baskerville', serif", size: 13 },
          bodyFont:  { family: "'Libre Baskerville', serif", size: 12 },
          padding: 10,
          cornerRadius: 8
        }
      }
    }
  });

  // Custom pie legend
  const legend = document.getElementById("pieLegend");
  legend.innerHTML = [
    { label: "Completed", color: "#959D90" },
    { label: "Pending",   color: "#BBA58F" },
    { label: "Overdue",   color: "#523D35" }
  ].map(l => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${l.color}"></span>
      <span>${l.label}</span>
    </div>
  `).join("");

  // BAR CHART
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: Object.keys(dateMap),
      datasets: [{
        label: "Assignments",
        data: Object.values(dateMap),
        backgroundColor: ["#523D35", "#BBA58F", "#959D90", "#7A6A5A", "#3A2B24"],
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: "#3A2B24"
      }]
    },
    options: {
      animation: {
        duration: 1000,
        easing: "easeOutBounce",
        delay: (ctx) => ctx.dataIndex * 120
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#3A2B24",
          titleFont: { family: "'Libre Baskerville', serif", size: 13 },
          bodyFont:  { family: "'Libre Baskerville', serif", size: 12 },
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          ticks: {
            font: { family: "'Libre Baskerville', serif", size: 11, style: "italic" },
            color: "#7A6A5A",
            maxRotation: 35
          },
          grid: { display: false }
        },
        y: {
          ticks: {
            font: { family: "'Libre Baskerville', serif", size: 11 },
            color: "#7A6A5A",
            stepSize: 1
          },
          grid: { color: "rgba(187,165,143,0.25)" },
          beginAtZero: true
        }
      }
    }
  });
}

/* ============ REMINDERS ============ */
// Queue so multiple reminders show one after another without overlapping
const _reminderQueue = [];
let   _reminderShown = new Set();
let   _popupBusy     = false;

function reminders() {
  const today = new Date().toISOString().split("T")[0];
  let count   = 0;

  // Clear shown set each cycle so re-renders (after add/done/delete) re-trigger
  _reminderShown.clear();

  data.forEach(a => {
    if (a.dueDate === today && a.status !== "Completed") {
      count++;
      if (!_reminderShown.has(a.id)) {
        _reminderShown.add(a.id);
        _reminderQueue.push({ msg: `🔔 "${a.title}" is due today!`, type: "reminder" });
      }
    }
  });

  document.getElementById("remCount").innerText = count;

  if (!_popupBusy) drainReminderQueue();
}

function drainReminderQueue() {
  if (_reminderQueue.length === 0) { _popupBusy = false; return; }
  _popupBusy = true;
  const { msg, type } = _reminderQueue.shift();
  showPopup(msg, type, () => setTimeout(drainReminderQueue, 350));
}

/* ============ POPUP ============ */
function showPopup(msg, type, onDone) {
  const popup = document.getElementById("popup");
  const colors = { reminder: "#8A5E3C", success: "#6B7B67", warning: "#523D35" };
  const resolved = type || (msg.startsWith("✅") ? "success" : msg.startsWith("🔔") ? "reminder" : "warning");

  popup.innerHTML = msg;
  popup.style.background = colors[resolved] || colors.warning;
  popup.style.display = "block";
  popup.style.animation = "none";
  void popup.offsetWidth; // reflow to restart animation
  popup.style.animation = "popIn 0.35s cubic-bezier(.4,0,.2,1)";

  clearTimeout(popup._timer);
  popup._timer = setTimeout(() => {
    popup.style.display = "none";
    if (typeof onDone === "function") onDone();
  }, 3000);
}

/* ============ SIDEBAR NAV ============ */
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
  event.currentTarget.classList.add("active");
}