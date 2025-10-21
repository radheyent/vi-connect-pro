// Authentication Module with Remember Me
let currentUser = null;
let allCustomers = [];
let allUsers = [];
let isLoading = false;

// Save login to localStorage
function saveLogin(email, password) {
    localStorage.setItem('vi_remember_email', email);
    localStorage.setItem('vi_remember_password', password);
}

// Clear saved login
function clearLogin() {
    localStorage.removeItem('vi_remember_email');
    localStorage.removeItem('vi_remember_password');
}

// Check if remember me is enabled
function checkAutoLogin() {
    const savedEmail = localStorage.getItem('vi_remember_email');
    const savedPassword = localStorage.getItem('vi_remember_password');
    
    if (savedEmail && savedPassword) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
        
        // Auto login
        setTimeout(() => {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }, 500);
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const employeeData = await SheetsAPI.getSheetData('employees');
        const customerData = await SheetsAPI.getSheetData('vi_customers');
        
        let user = null;
        for (let i = 1; i < employeeData.length; i++) {
            if (employeeData[i][0] === email && 
                employeeData[i][1] === password && 
                employeeData[i][4] === 'TRUE') {
                user = {
                    email: employeeData[i][0],
                    password: employeeData[i][1],
                    name: employeeData[i][2],
                    role: employeeData[i][3],
                    isActive: true
                };
                break;
            }
        }
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }
        
        const users = [];
        for (let i = 1; i < employeeData.length; i++) {
            if (employeeData[i][4] === 'TRUE') {
                users.push({
                    email: employeeData[i][0],
                    name: employeeData[i][2],
                    role: employeeData[i][3],
                    isActive: true
                });
            }
        }
        
        const customers = [];
        for (let i = 1; i < customerData.length; i++) {
            customers.push({
                id: customerData[i][0],
                name: customerData[i][1],
                phone: customerData[i][2],
                matchingNumber: customerData[i][3],
                currentOperator: customerData[i][4],
                status: customerData[i][5],
                assignedTo: customerData[i][6],
                addedBy: customerData[i][7],
                lastCallDate: customerData[i][8],
                notes: customerData[i][9],
                important: customerData[i][10] === 'TRUE',
                createdDate: customerData[i][11],
                completedDate: customerData[i][12]
            });
        }
        
        return {
            success: true,
            user: user,
            users: users,
            customers: customers
        };
        
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.toString() };
    }
}

// Handle login form
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (isLoading) return;
    isLoading = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    showModal('⏳', 'Logging In', 'Please wait...');

    try {
        const result = await loginUser(email, password);
        
        if (result.success) {
            currentUser = result.user;
            allCustomers = result.customers || [];
            allUsers = result.users || [];
            
            // Save login if remember me is checked
            if (rememberMe) {
                saveLogin(email, password);
            } else {
                clearLogin();
            }
            
            closeModal();
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainApp').classList.add('active');
            setGreetingDate();
            
            if (currentUser.role === 'admin') {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('adminDashboard').classList.add('active');
                document.getElementById('adminName').textContent = currentUser.name;
                loadAdminStats();
            } else {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('empDashboard').classList.add('active');
                document.getElementById('empName').textContent = currentUser.name;
                loadEmployeeStats();
            }
        } else {
            showModal('❌', 'Login Failed', result.message || 'Invalid email or password');
        }
    } catch (error) {
        showModal('❌', 'Error', 'Login failed. Please check your connection and try again.');
        console.error('Login error:', error);
    }
    
    isLoading = false;
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        clearLogin();
        currentUser = null;
        allCustomers = [];
        allUsers = [];
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('loginForm').reset();
        document.getElementById('backBtn').classList.remove('show');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
});