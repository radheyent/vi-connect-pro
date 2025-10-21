// Main App Initialization

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', function() {
    console.log('Vi Connect Pro - Initializing...');
    setGreetingDate();
    
    // Check for auto-login
    checkAutoLogin();
});

// Refresh greeting every minute
setInterval(setGreetingDate, 60000);
```

---

## 🚀 Step-by-Step Setup Guide

### **Step 1: Create Project Folder**
```
1. Apne computer pe ek folder banao: "vi-connect-pro"
2. Is folder mein 8 files create karo (upar diye gaye code se)
```

### **Step 2: Files Create Karo**

**Sabhi files ko is tarah save karo:**
```
vi-connect-pro/
├── index.html
├── styles.css
├── config.js
├── api.js
├── auth.js
├── ui.js
├── employee.js
├── admin.js
└── app.js