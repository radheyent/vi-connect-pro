console.log('Vi Connect Pro - Starting...');

window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded');
    setGreetingDate();
    
    // Check auto-login after 1 second
    setTimeout(function() {
        checkAutoLogin();
    }, 1000);
});

// Refresh greeting every minute
setInterval(setGreetingDate, 60000);

console.log('App initialized');
