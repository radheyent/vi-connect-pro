// Admin Functions

function loadAdminStats() {
    const employees = allUsers.filter(u => u.role === 'employee').length;
    const activeCustomers = allCustomers.filter(c => c.status !== 'Complete').length;
    const completed = allCustomers.filter(c => c.status === 'Complete').length;
    const pending = allCustomers.filter(c => !c.assignedTo).length;
    
    document.getElementById('totalEmpStat').textContent = employees;
    document.getElementById('activeCustomersStat').textContent = activeCustomers;
    document.getElementById('completedLeadsStat').textContent = completed;
    document.getElementById('pendingAssignmentsStat').textContent = pending;
    
    const recentActivity = allCustomers
        .filter(c => c.status === 'Complete' && c.completedDate)
        .slice(0, 5)
        .map(c => `Lead ${c.name} completed by ${c.assignedTo || 'Unknown'}`);
    
    const activityEl = document.getElementById('adminRecentActivity');
    if (recentActivity.length === 0) {
        activityEl.innerHTML = '<div class="no-data"><div class="no-data-icon">🔭</div><div class="no-data-text">No recent activity</div></div>';
    } else {
        activityEl.innerHTML = recentActivity.map(act => 
            `<div class="card"><div class="card-info">• ${act}</div></div>`
        ).join('');
    }
}

function loadAdminCustomers() {
    document.getElementById('adminCustomersCount').textContent = `Total: ${allCustomers.length} Customers`;
    displayAdminCustomers(allCustomers);
}

function displayAdminCustomers(customers) {
    const listEl = document.getElementById('adminCustomersList');
    const searchInput = document.getElementById('searchAdminCustomers');
    
    function renderList(toShow) {
        if (toShow.length === 0) {
            listEl.innerHTML = '<div class="no-data"><div class="no-data-icon">🔍</div><div class="no-data-text">No customers found</div></div>';
            return;
        }
        
        listEl.innerHTML = toShow.map(c => 
            `<div class="card">
                <div class="card-title">👤 ${c.name}</div>
                <div class="card-subtitle">📱 ${c.phone}</div>
                <div class="card-info">📍 Matching: ${c.matchingNumber || 'N/A'}</div>
                <div class="card-info">📡 Current: ${c.currentOperator}</div>
                <div class="card-info">👤 Assigned: ${c.assignedTo || '❌ Unassigned'}</div>
                <div class="card-info" style="color: #e01e37; font-weight: 600;">📊 Status: ${c.status}</div>
                <div class="card-buttons">
                    <button class="card-btn call" onclick="makeCall('${c.phone}')">📞 CALL</button>
                    <button class="card-btn change" onclick="openAdminCustomerDetails('${c.id}')">📝 MANAGE</button>
                </div>
            </div>`
        ).join('');
    }
    
    renderList(customers);
    
    searchInput.oninput = function() {
        const query = this.value.toLowerCase();
        const filtered = customers.filter(c => 
            c.name.toLowerCase().includes(query) || c.phone.includes(query)
        );
        renderList(filtered);
    };
}

function loadAdminReports() {
    const employeeStats = {};
    
    allCustomers.forEach(c => {
        const emp = c.assignedTo || 'Unassigned';
        if (!employeeStats[emp]) {
            employeeStats[emp] = { total: 0, completed: 0, interested: 0, followup: 0 };
        }
        employeeStats[emp].total++;
        if (c.status === 'Complete') employeeStats[emp].completed++;
        if (c.status === 'Interested') employeeStats[emp].interested++;
        if (c.status === 'Follow-up') employeeStats[emp].followup++;
    });
    
    const listEl = document.getElementById('employeePerformanceList');
    const html = Object.keys(employeeStats).map(emp => {
        const stats = employeeStats[emp];
        const successRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';
        return `
            <div class="card">
                <div class="card-title">👤 ${emp}</div>
                <div class="card-info" style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;">
                    <strong>📞 Total Leads:</strong> ${stats.total}
                </div>
                <div class="card-info" style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;">
                    <strong>✅ Completed:</strong> ${stats.completed}
                </div>
                <div class="card-info" style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;">
                    <strong>💰 Interested:</strong> ${stats.interested}
                </div>
                <div class="card-info" style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;">
                    <strong>📞 Follow-up:</strong> ${stats.followup}
                </div>
                <div class="card-info" style="padding: 8px 0;">
                    <strong>📈 Success Rate:</strong> ${successRate}%
                </div>
            </div>
        `;
    }).join('');
    
    listEl.innerHTML = html || '<div class="no-data"><div class="no-data-icon">🔭</div><div class="no-data-text">No data available</div></div>';
}

function openAdminCustomerDetails(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) {
        showModal('❌', 'Error', 'Customer not found');
        return;
    }
    
    const bodyHTML = `
        <div class="customer-detail-section">
            <div class="customer-detail-row"><strong>📱 Phone:</strong> ${customer.phone}</div>
            <div class="customer-detail-row"><strong>📡 Current Operator:</strong> ${customer.currentOperator}</div>
            <div class="customer-detail-row"><strong>🔗 Matching Number:</strong> ${customer.matchingNumber || 'N/A'}</div>
            <div class="customer-detail-row"><strong>👤 Added By:</strong> ${customer.addedBy}</div>
            <div class="customer-detail-row"><strong>📊 Status:</strong> ${customer.status}</div>
            ${customer.notes ? `<div class="customer-detail-row"><strong>📝 Notes:</strong> ${customer.notes}</div>` : ''}
        </div>
        
        <button class="modal-btn primary" onclick="makeCall('${customer.phone}')" style="width: 100%; margin-bottom: 16px;">
            📞 CALL NOW
        </button>
        
        <div class="modal-form" style="margin-top: 16px;">
            <div class="modal-form-group">
                <label>Assign To</label>
                <select id="adminAssign_${customerId}">
                    <option value="">Unassigned</option>
                    ${allUsers.filter(u => u.role === 'employee').map(u => 
                        `<option value="${u.email}" ${customer.assignedTo === u.email ? 'selected' : ''}>${u.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="modal-form-group">
                <label>Update Status</label>
                <select id="adminStatus_${customerId}">
                    <option value="${customer.status}" selected>${customer.status}</option>
                    <option value="Not Connected">Not Connected</option>
                    <option value="Not Reachable">Not Reachable</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>
            <div class="modal-form-group">
                <label>Notes</label>
                <textarea id="adminNotes_${customerId}" placeholder="Add any notes...">${customer.notes || ''}</textarea>
            </div>
        </div>
    `;
    
    showModal('👤', customer.name, '', [
        { text: '❌ Close', class: 'secondary', action: closeModal },
        { text: '💾 Update', class: 'primary', action: () => updateAdminCustomer(customerId) }
    ]);
    document.getElementById('modalBody').innerHTML = bodyHTML;
}

async function updateAdminCustomer(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newAssign = document.getElementById(`adminAssign_${customerId}`)?.value || '';
    const newStatus = document.getElementById(`adminStatus_${customerId}`)?.value;
    const newNotes = document.getElementById(`adminNotes_${customerId}`)?.value || '';
    
    if (!newStatus) {
        showModal('❌', 'Error', 'Please select a status');
        return;
    }
    
    showModal('⏳', 'Updating...', 'Please wait...');
    
    try {
        const customerData = await SheetsAPI.getSheetData('vi_customers');
        let rowIndex = -1;
        
        for (let i = 1; i < customerData.length; i++) {
            if (customerData[i][0] === customerId) {
                rowIndex = i + 1;
                break;
            }
        }
        
        if (rowIndex === -1) {
            throw new Error('Customer not found in sheet');
        }
        
        const now = new Date().toISOString();
        const completedDate = newStatus === 'Complete' ? now : (customer.completedDate || '');
        
        await SheetsAPI.updateRow('vi_customers', rowIndex, [
            customer.id,
            customer.name,
            customer.phone,
            customer.matchingNumber,
            customer.currentOperator,
            newStatus,
            newAssign,
            customer.addedBy,
            now,
            newNotes,
            customer.important ? 'TRUE' : 'FALSE',
            customer.createdDate,
            completedDate
        ]);
        
        customer.status = newStatus;
        customer.assignedTo = newAssign;
        customer.notes = newNotes;
        customer.lastCallDate = now;
        if (newStatus === 'Complete') {
            customer.completedDate = now;
        }
        
        closeModal();
        showModal('✅', 'Success', 'Customer updated successfully!', [
            { text: 'OK', class: 'primary', action: () => { closeModal(); goBack(); } }
        ]);
        
    } catch (error) {
        console.error('Update error:', error);
        showModal('❌', 'Error', 'Failed to update customer: ' + error.message);
    }
}

document.getElementById('addEmployeeBtn')?.addEventListener('click', function() {
    const bodyHTML = `
        <div class="modal-form">
            <div class="modal-form-group">
                <label>Email *</label>
                <input type="email" id="newEmpEmail" placeholder="employee@example.com" required>
            </div>
            <div class="modal-form-group">
                <label>Password *</label>
                <input type="password" id="newEmpPassword" placeholder="Enter password" required>
            </div>
            <div class="modal-form-group">
                <label>Name *</label>
                <input type="text" id="newEmpName" placeholder="Full Name" required>
            </div>
            <div class="modal-form-group">
                <label>Role *</label>
                <select id="newEmpRole">
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </div>
    `;
    
    showModal('➕', 'Add New Employee', '', [
        { text: '❌ Cancel', class: 'secondary', action: closeModal },
        { text: '➕ Add', class: 'primary', action: addNewEmployee }
    ]);
    document.getElementById('modalBody').innerHTML = bodyHTML;
});

async function addNewEmployee() {
    const email = document.getElementById('newEmpEmail')?.value.trim();
    const password = document.getElementById('newEmpPassword')?.value;
    const name = document.getElementById('newEmpName')?.value.trim();
    const role = document.getElementById('newEmpRole')?.value;
    
    if (!email || !password || !name) {
        showModal('❌', 'Error', 'All fields are required');
        return;
    }
    
    showModal('⏳', 'Adding Employee...', 'Please wait...');
    
    try {
        const newRow = [email, password, name, role, 'TRUE'];
        
        await SheetsAPI.appendRow('employees', newRow);
        
        allUsers.push({
            email: email,
            name: name,
            role: role,
            isActive: true
        });
        
        closeModal();
        showModal('✅', 'Success', 'Employee added successfully!', [
            { text: 'OK', class: 'primary', action: () => { closeModal(); goBack(); } }
        ]);
        
    } catch (error) {
        console.error('Add employee error:', error);
        showModal('❌', 'Error', 'Failed to add employee: ' + error.message);
    }
}

document.getElementById('backupBtn')?.addEventListener('click', function() {
    showModal('💾', 'Backup Data', 'Your data is automatically stored in Google Sheets. You can download it anytime from:\n\nFile → Download → Excel/CSV', [
        { text: 'OK', class: 'primary', action: closeModal }
    ]);
});