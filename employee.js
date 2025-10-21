// UI Helper Functions

function setGreetingDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const empDate = document.getElementById('greetingDate');
    const adminDate = document.getElementById('greetingDateAdmin');
    if (empDate) empDate.textContent = dateStr;
    if (adminDate) adminDate.textContent = dateStr;
}

function showCelebration() {
    const cel = document.getElementById('celebration');
    cel.classList.add('show');
    setTimeout(() => cel.classList.remove('show'), 1000);
}

function showModal(icon, title, message, buttons = [{ text: 'OK', class: 'primary', action: closeModal }]) {
    document.getElementById('modalIcon').textContent = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modalBody').innerHTML = '';
    
    const btnContainer = document.getElementById('modalButtons');
    btnContainer.innerHTML = buttons.map((btn, idx) => 
        `<button class="modal-btn ${btn.class}" data-action="${idx}">${btn.text}</button>`
    ).join('');
    
    btnContainer.querySelectorAll('button').forEach((btn, idx) => {
        btn.onclick = buttons[idx].action;
    });
    
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modalBody').innerHTML = '';
}

function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('backBtn').classList.add('show');

    if (pageId === 'empCustomers') loadEmployeeCustomers();
    if (pageId === 'empFollowup') loadFollowupCustomers();
    if (pageId === 'empPendingSale') loadPendingSaleCustomers();
    if (pageId === 'empReports') loadEmployeeReport();
    if (pageId === 'empCompleted') loadCompletedLeads();
    if (pageId === 'adminAllCustomers') loadAdminCustomers();
    if (pageId === 'adminReports') loadAdminReports();
}

function goBack() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const homePage = currentUser.role === 'admin' ? 'adminDashboard' : 'empDashboard';
    document.getElementById(homePage).classList.add('active');
    document.getElementById('backBtn').classList.remove('show');
    
    if (currentUser.role === 'employee') {
        loadEmployeeStats();
    } else {
        loadAdminStats();
    }
}

function makeCall(phone) {
    window.location.href = `tel:${phone}`;
}

// Navigation event listeners
document.getElementById('backBtn').addEventListener('click', goBack);

document.querySelectorAll('.action-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', function() {
        goToPage(this.getAttribute('data-page'));
    });
});