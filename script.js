// Main JavaScript for Dr. Anna Brameli Website

// Mobile Menu Toggle
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const navLinksContainer = document.getElementById('navLinks');
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
      }
    });
  });
});

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06)';
  }

  lastScroll = currentScroll;
});

// Form Handling
async function handleSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  
  // Disable button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'שולח...';
  
  try {
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Handle file uploads
    const fileInput = document.getElementById('appointmentFiles');
    const files = fileInput ? Array.from(fileInput.files) : [];
    
    // Check if Supabase is configured
    if (window.SUPABASE_URL === 'YOUR_SUPABASE_URL') {
      console.warn('Supabase not configured. Displaying form data in console.');
      console.log('Form Data:', data);
      console.log('Files:', files);
      
      // Show success message
      alert('תודה על פנייתך! במצב Demo, הנתונים מוצגים בקונסול. נחזור אליך בהקדם.');
      form.reset();
      return;
    }
    
    // Initialize Supabase client
    const supabase = window.getSupabaseClient();
    
    // Upload files if any
    let uploadedFiles = [];
    if (files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `appointments/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medical-documents')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error('File upload error:', uploadError);
        } else {
          uploadedFiles.push(filePath);
        }
      }
    }
    
    // Save appointment to database
    const appointmentData = {
      ...data,
      files: uploadedFiles,
      status: 'pending',
      created_at: new Date().toISOString(),
      source: 'website'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('appointments')
      .insert([appointmentData]);
    
    if (insertError) {
      throw insertError;
    }
    
    // Send email notification (if edge function is configured)
    try {
      await fetch(`${window.SUPABASE_URL}/functions/v1/send-appointment-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(appointmentData)
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }
    
    // Show success message
    alert('תודה רבה! קיבלנו את בקשתך לתור. נחזור אליך תוך 24-48 שעות לאישור התור.');
    
    // Reset form
    form.reset();
    
    // Track conversion (if analytics configured)
    if (window.gtag) {
      gtag('event', 'appointment_submission', {
        'event_category': 'engagement',
        'event_label': data.reason || 'general'
      });
    }
    
  } catch (error) {
    console.error('Form submission error:', error);
    alert('אירעה שגיאה בשליחת הטופס. אנא נסה שוב או צור קשר טלפונית.');
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll(
    '.service-card, .condition-item, .why-item, .faq-item, .about-text'
  );
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});

// Form Validation Enhancement
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('appointmentForm');
  
  if (form) {
    // Phone number formatting
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
          if (value.length <= 3) {
            e.target.value = value;
          } else if (value.length <= 6) {
            e.target.value = value.slice(0, 3) + '-' + value.slice(3);
          } else {
            e.target.value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
          }
        }
      });
    }
    
    // Set minimum date for appointment to tomorrow
    const dateInput = form.querySelector('input[name="preferredDate"]');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Calculate age from birth date
    const birthDateInput = form.querySelector('input[name="birthDate"]');
    const ageInput = form.querySelector('input[name="age"]');
    
    if (birthDateInput && ageInput) {
      birthDateInput.addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        const ageYears = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          ageYears--;
        }
        
        const ageMonths = monthDiff < 0 ? 12 + monthDiff : monthDiff;
        
        if (ageYears < 1) {
          ageInput.value = `${ageMonths} חודשים`;
        } else if (ageYears === 1) {
          ageInput.value = 'שנה אחת';
        } else {
          ageInput.value = `${ageYears} שנים`;
        }
      });
    }
  }
});

// File Upload Preview
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('appointmentFiles');
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const files = Array.from(this.files);
      
      if (files.length > 0) {
        // Create or update file list display
        let fileListDiv = document.getElementById('fileList');
        
        if (!fileListDiv) {
          fileListDiv = document.createElement('div');
          fileListDiv.id = 'fileList';
          fileListDiv.style.marginTop = '10px';
          fileListDiv.style.fontSize = '0.9rem';
          fileListDiv.style.color = '#4a4a4a';
          this.parentElement.appendChild(fileListDiv);
        }
        
        const fileNames = files.map(f => `📎 ${f.name}`).join('<br>');
        fileListDiv.innerHTML = `<strong>קבצים נבחרו:</strong><br>${fileNames}`;
      }
    });
  }
});

// Print Page Function (for medical records)
function printPage() {
  window.print();
}

// WhatsApp Integration
function sendWhatsApp(phone, message) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
}

// Google Analytics Event Tracking
function trackEvent(category, action, label) {
  if (window.gtag) {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
}

// Track phone calls
document.addEventListener('DOMContentLoaded', function() {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('engagement', 'phone_call', 'header_phone');
    });
  });
});

// Track navigation clicks
document.addEventListener('DOMContentLoaded', function() {
  const navButtons = document.querySelectorAll('a[href*="waze"], a[href*="google.com/maps"]');
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      const app = this.href.includes('waze') ? 'waze' : 'google_maps';
      trackEvent('engagement', 'navigation_click', app);
    });
  });
});

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
});

// Emergency: Quick actions
function emergencyCall() {
  if (confirm('האם לחייג למוקד החירום 101?')) {
    window.location.href = 'tel:101';
  }
}

// Accessibility: Skip to main content
document.addEventListener('DOMContentLoaded', function() {
  const skipLink = document.createElement('a');
  skipLink.href = '#home';
  skipLink.textContent = 'דלג לתוכן הראשי';
  skipLink.className = 'skip-to-main';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: #0066cc;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 10000;
  `;
  
  skipLink.addEventListener('focus', function() {
    this.style.top = '0';
  });
  
  skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
});

console.log('Dr. Anna Brameli Website - Initialized Successfully');
