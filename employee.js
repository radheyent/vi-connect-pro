// Employee Functions

function loadEmployeeStats() {
    console.log('Loading employee stats...');
    console.log('Current user:', currentUser?.email);
    console.log('Total customers:', allCustomers?.length);
    
    const customers = allCustomers.filter(c => c.assignedTo === currentUser.email);
    console.log('Assigned customers:', customers.length);
    
    const today = new Date().toDateString();
    const todayCalls = customers.filter(c => c.lastCallDate && new Date(c.lastCallDate).toDateString() === today).length;
    const connected = customers.filter(c => c.status === 'Interested' || c.status === 'Complete').length;
    const followup = customers.filter(c => c.status === 'Follow-up').length;
    const important = customers.filter(c => c.important).length;
    
    document.getElementById('todayCallsStat').textContent = todayCalls;
    document.getElementById('connectedStat').textContent = connected;
    document.getElementById('followupStat').textContent = followup;
    document.getElementById('importantStat').textContent = important;
    
    console.log('Stats loaded:', { todayCalls, connected, followup, important });
    
    loadRecentActivity();
}

function loadRecentActivity() {
    const customers = allCustomers.filter(c => 
        c.assignedTo === currentUser.email && c.status === 'Complete' && c.completedDate
    );
    const listEl = document.getElementById('recentActivityList');
    
    if (customers.length === 0) {
        listEl.innerHTML = '<div class="no-data"><div class="no-data-icon">🔭</div><div class="no-data-text">No recent activity</div></div>';
    } else {
        listEl.innerHTML = customers.slice(0, 5).map(c => 
            `<div class="card completed">
                <div class="card-title">🎉 Completed: ${c.name}</div>
                <div class="card-subtitle">${new Date(c.completedDate).toLocaleString()}</div>
            </div>`
        ).join('');
    }
}

function loadEmployeeCustomers() {
    const customers = allCustomers.filter(c => 
        c.assignedTo === currentUser.email && 
        c.status !== 'Complete' && 
        c.status !== 'Follow-up' && 
        c.status !== 'Interested' &&
        c.status !== 'Not Interested'
    );
    document.getElementById('empCustomersCount').textContent = `Total: ${customers.length} Customers`;
    displayEmployeeCustomers(customers);
}

function displayEmployeeCustomers(customers) {
    const listEl = document.getElementById('empCustomersList');
    const searchInput = document.getElementById('searchEmpCustomers');
    
    function renderList(toShow) {
        if (toShow.length === 0) {
            listEl.innerHTML = '<div class="no-data"><div class="no-data-icon">🔍</div><div class="no-data-text">No customers found</div></div>';
            return;
        }
        
        listEl.innerHTML = toShow.map(c => {
            const cardClass = c.status === 'Not Reachable' ? 'card not-reachable' : 'card';
            return `<div class="${cardClass}">
                <div class="card-title">👤 ${c.name} ${c.important ? '⭐' : ''}</div>
                <div class="card-subtitle">📱 ${c.phone}</div>
                <div class="card-info">📡 Current: ${c.currentOperator}</div>
                <div class="card-info">🔗 Matching: ${c.matchingNumber || 'N/A'}</div>
                <div class="card-info" style="color: #e01e37; font-weight: 600;">📊 Status: ${c.status}</div>
                <div class="card-buttons">
                    <button class="card-btn call" onclick="makeCall('${c.phone}')">📞 CALL NOW</button>
                    <button class="card-btn change" onclick="openCustomerDetails('${c.id}')">📝 DETAILS</button>
                </div>
            </div>`;
        }).join('');
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

function loadFollowupCustomers() {
    const customers = allCustomers.filter(c => 
        c.assignedTo === currentUser.email && c.status === 'Follow-up'
    );
    const listEl = document.getElementById('empFollowupList');
    
    if (customers.length === 0) {
        listEl.innerHTML = '<div class="no-data"><div class="no-data-icon">☎️</div><div class="no-data-text">No follow-up leads</div></div>';
    } else {
        listEl.innerHTML = customers.map(c => 
            `<div class="card">
                <div class="card-title">👤 ${c.name}</div>
                <div class="card-subtitle">📱 ${c.phone}</div>
                <div class="card-info">📡 ${c.currentOperator}</div>
                <div class="card-info">📊 ${c.status}</div>
                ${c.notes ? `<div class="card-info">📝 ${c.notes}</div>` : ''}
                <div class="card-buttons">
                    <button class="card-btn call" onclick="makeCall('${c.phone}')">📞 CALL</button>
                    <button class="card-btn change" onclick="openCustomerDetails('${c.id}')">📝 UPDATE</button>
                </div>
            </div>`
        ).join('');
    }
}

function loadPendingSaleCustomers() {
    const customers = allCustomers.filter(c => 
        c.assignedTo === currentUser.email && c.status === 'Interested'
    );
    const listEl = document.getElementById('empPendingSaleList');
    
    if (customers.length === 0) {
        listEl.innerHTML = '<div class="no-data"><div class="no-data-icon">💰</div><div class="no-data-text">No pending sale leads</div></div>';
    } else {
        listEl.innerHTML = customers.map(c => 
            `<div class="card">
                <div class="card-title">👤 ${c.name}</div>
                <div class="card-subtitle">📱 ${c.phone}</div>
                <div class="card-info">📡 ${c.currentOperator}</div>
                <div class="card-info">🔗 Matching: ${c.matchingNumber || 'N/A'}</div>
                ${c.notes ? `<div class="card-info">📝 ${c.notes}</div>` : ''}
                <div class="card-buttons">
                    <button class="card-btn call" onclick="makeCall('${c.phone}')">📞 CALL</button>
                    <button class="card-btn share" onclick="openWhatsAppShare('${c.id}')">📤 SHARE</button>
                </div>
            </div>`
        ).join('');
    }
}

function loadEmployeeReport() {
    const customers = allCustomers.filter(c => c.assignedTo === currentUser.email);
    const totalCalls = customers.length;
    const connected = customers.filter(c => c.status === 'Interested' || c.status === 'Complete').length;
    const interested = customers.filter(c => c.status === 'Interested').length;
    const completed = customers.filter(c => c.status === 'Complete').length;
    const successRate = totalCalls > 0 ? ((completed / totalCalls) * 100).toFixed(1) : '0';
    
    document.getElementById('reportTotalCalls').textContent = totalCalls;
    document.getElementById('reportConnected').textContent = connected;
    document.getElementById('reportInterested').textContent = interested;
    document.getElementById('reportCompleted').textContent = completed;
    document.getElementById('reportSuccessRate').textContent = successRate + '%';
}

function loadCompletedLeads() {
    const leads = allCustomers.filter(c => 
        c.assignedTo === currentUser.email && c.status === 'Complete'
    );
    const listEl = document.getElementById('completedLeadsList');
    
    if (leads.length === 0) {
        listEl.innerHTML = '<div class="no-data"><div class="no-data-icon">🎯</div><div class="no-data-text">No completed leads yet</div></div>';
    } else {
        listEl.innerHTML = leads.map(c => 
            `<div class="card completed">
                <div class="card-title">✅ ${c.name}</div>
                <div class="card-subtitle">📱 ${c.phone}</div>
                <div class="card-info">📡 ${c.currentOperator}</div>
                ${c.notes ? `<div class="card-info">📝 ${c.notes}</div>` : ''}
                ${c.completedDate ? `<div class="card-subtitle">Completed: ${new Date(c.completedDate).toLocaleString()}</div>` : ''}
            </div>`
        ).join('');
    }
}

function openCustomerDetails(customerId) {
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
            <div class="customer-detail-row"><strong>📊 Status:</strong> ${customer.status}</div>
            ${customer.notes ? `<div class="customer-detail-row"><strong>📝 Notes:</strong> ${customer.notes}</div>` : ''}
        </div>
        
        <button class="modal-btn primary" onclick="makeCall('${customer.phone}')" style="width: 100%; margin-bottom: 16px;">
            📞 CALL NOW
        </button>
        
        <div class="modal-form" style="margin-top: 16px;">
            <div class="modal-form-group">
                <label>Update Status</label>
                <select id="updateStatus_${customerId}">
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
                <label>Add Notes (Optional)</label>
                <textarea id="updateNotes_${customerId}" placeholder="Add any notes...">${customer.notes || ''}</textarea>
            </div>
            <div class="modal-form-group">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="updateImportant_${customerId}" ${customer.important ? 'checked' : ''}>
                    <span>⭐ Mark as Important</span>
                </label>
            </div>
        </div>
    `;
    
    showModal('👤', customer.name, '', [
        { text: '❌ Close', class: 'secondary', action: closeModal },
        { text: '💾 Update', class: 'primary', action: () => updateCustomerStatus(customerId) }
    ]);
    document.getElementById('modalBody').innerHTML = bodyHTML;
}

async function updateCustomerStatus(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newStatus = document.getElementById(`updateStatus_${customerId}`)?.value;
    const newNotes = document.getElementById(`updateNotes_${customerId}`)?.value || '';
    const isImportant = document.getElementById(`updateImportant_${customerId}`)?.checked;
    
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
            customer.assignedTo,
            customer.addedBy,
            now,
            newNotes,
            isImportant ? 'TRUE' : 'FALSE',
            customer.createdDate,
            completedDate
        ]);
        
        customer.status = newStatus;
        customer.notes = newNotes;
        customer.important = isImportant;
        customer.lastCallDate = now;
        if (newStatus === 'Complete') {
            customer.completedDate = now;
        }
        
        closeModal();
        
        if (newStatus === 'Complete') {
            showCelebration();
        }
        
        showModal('✅', 'Success', 'Customer updated successfully!', [
            { text: 'OK', class: 'primary', action: () => { closeModal(); goBack(); } }
        ]);
        
    } catch (error) {
        console.error('Update error:', error);
        showModal('❌', 'Error', 'Failed to update customer: ' + error.message);
    }
}

function openWhatsAppShare(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    const bodyHTML = `
        <div class="modal-form">
            <div class="modal-form-group">
                <label>Total Numbers</label>
                <select id="totalNumbers_${customerId}">
                    <option value="1">1 Sale</option>
                    <option value="2">2 Sale</option>
                    <option value="3">3 Sale</option>
                    <option value="4">4 Sale</option>
                    <option value="5">5 Sale</option>
                </select>
            </div>
            <div class="modal-form-group">
                <label>Charges</label>
                <select id="charges_${customerId}">
                    <option value="Zero">Zero</option>
                    <option value="250/-">250/-</option>
                    <option value="500/-">500/-</option>
                </select>
            </div>
            <div class="modal-form-group">
                <label>Notes (Complete Address)</label>
                <textarea id="shareNotes_${customerId}" placeholder="Enter complete address and other details...">${customer.notes || ''}</textarea>
            </div>
            <div class="modal-form-group">
                <label>Pickup Time (Optional)</label>
                <input type="text" id="pickupTime_${customerId}" placeholder="e.g., 2:00 PM">
            </div>
        </div>
    `;
    
    showModal('📤', 'Share on WhatsApp', 'Fill details to share', [
        { text: '❌ Cancel', class: 'secondary', action: closeModal },
        { text: '📤 Share', class: 'primary', action: () => shareOnWhatsApp(customerId) }
    ]);
    document.getElementById('modalBody').innerHTML = bodyHTML;
}

function shareOnWhatsApp(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    const totalNumbers = document.getElementById(`totalNumbers_${customerId}`)?.value || '1';
    const charges = document.getElementById(`charges_${customerId}`)?.value || 'Zero';
    const notes = document.getElementById(`shareNotes_${customerId}`)?.value || '';
    const pickupTime = document.getElementById(`pickupTime_${customerId}`)?.value || 'Not specified';
    
    const message = `*Please close My sale*

📱 Customer Name: ${customer.name}
📞 Customer No: ${customer.phone}
🔢 Total Numbers: ${totalNumbers}
💰 Any Charge: ${charges}
📝 Note: ${notes}
⏰ Pickup Time: ${pickupTime}
👤 Employee: ${currentUser.email}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeModal();
}

document.getElementById('addCustomerBtn')?.addEventListener('click', function() {
    const bodyHTML = `
        <div class="modal-form">
            <div class="modal-form-group">
                <label>Customer Name *</label>
                <input type="text" id="newCustomerName" placeholder="Enter name" required>
            </div>
            <div class="modal-form-group">
                <label>Phone Number *</label>
                <input type="tel" id="newCustomerPhone" placeholder="Enter phone" required>
            </div>
            <div class="modal-form-group">
                <label>Matching Number</label>
                <input type="text" id="newCustomerMatching" placeholder="Matching number (optional)">
            </div>
            <div class="modal-form-group">
                <label>Current Operator *</label>
                <select id="newCustomerOperator">
                    <option value="Jio">Jio</option>
                    <option value="Airtel">Airtel</option>
                    <option value="Vi">Vi</option>
                    <option value="BSNL">BSNL</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            ${currentUser.role === 'admin' ? `
            <div class="modal-form-group">
                <label>Assign To</label>
                <select id="newCustomerAssign">
                    <option value="">Unassigned</option>
                    ${allUsers.filter(u => u.role === 'employee').map(u => 
                        `<option value="${u.email}">${u.name}</option>`
                    ).join('')}
                </select>
            </div>
            ` : ''}
            <div class="modal-form-group">
                <label>Notes</label>
                <textarea id="newCustomerNotes" placeholder="Any additional notes..."></textarea>
            </div>
        </div>
    `;
    
    showModal('➕', 'Add New Customer', '', [
        { text: '❌ Cancel', class: 'secondary', action: closeModal },
        { text: '➕ Add', class: 'primary', action: addNewCustomer }
    ]);
    document.getElementById('modalBody').innerHTML = bodyHTML;
});

async function addNewCustomer() {
    const name = document.getElementById('newCustomerName')?.value.trim();
    const phone = document.getElementById('newCustomerPhone')?.value.trim();
    const matching = document.getElementById('newCustomerMatching')?.value.trim() || '';
    const operator = document.getElementById('newCustomerOperator')?.value;
    const assignTo = document.getElementById('newCustomerAssign')?.value || '';
    const notes = document.getElementById('newCustomerNotes')?.value.trim() || '';
    
    if (!name || !phone) {
        showModal('❌', 'Error', 'Name and Phone are required');
        return;
    }
    
    showModal('⏳', 'Adding Customer...', 'Please wait...');
    
    try {
        const now = new Date().toISOString();
        const newId = 'CUST_' + Date.now();
        const assignedEmail = currentUser.role === 'admin' ? assignTo : currentUser.email;
        
        const newRow = [
            newId,
            name,
            phone,
            matching,
            operator,
            'Not Connected',
            assignedEmail,
            currentUser.email,
            now,
            notes,
            'FALSE',
            now,
            ''
        ];
        
        await SheetsAPI.appendRow('vi_customers', newRow);
        
        allCustomers.push({
            id: newId,
            name: name,
            phone: phone,
            matchingNumber: matching,
            currentOperator: operator,
            status: 'Not Connected',
            assignedTo: assignedEmail,
            addedBy: currentUser.email,
            lastCallDate: now,
            notes: notes,
            important: false,
            createdDate: now,
            completedDate: ''
        });
        
        closeModal();
        showModal('✅', 'Success', 'Customer added successfully!', [
            { text: 'OK', class: 'primary', action: () => { closeModal(); goBack(); } }
        ]);
        
    } catch (error) {
        console.error('Add customer error:', error);
        showModal('❌', 'Error', 'Failed to add customer: ' + error.message);
    }
}
