// Main App Initialization
console.log('Vi Connect Pro - Initializing...');

window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    setGreetingDate();
    checkAutoLogin();
});

setInterval(setGreetingDate, 60000);
console.log('App.js loaded successfully');
```
