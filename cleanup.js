// Cleanup helper script - removes admin-related elements from public site

(function() {
  'use strict';
  
  // Remove admin login links from public view (optional)
  // Uncomment if you want to hide admin links completely
  /*
  document.addEventListener('DOMContentLoaded', function() {
    const adminLinks = document.querySelectorAll('a[href*="admin.html"]');
    adminLinks.forEach(link => {
      link.style.display = 'none';
    });
  });
  */
  
  // Console welcome message
  console.log('%c🏥 ד״ר אנה ברמלי - מומחית לאלרגיה ואימונולוגיה ילדים', 
    'color: #0066cc; font-size: 16px; font-weight: bold;');
  console.log('%cמרכז רפואי שניידר לילדים | Schneider Children\'s Medical Center',
    'color: #4a4a4a; font-size: 12px;');
  
})();
