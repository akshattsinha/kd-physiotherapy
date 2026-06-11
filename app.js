/* -------------------------------------------------------------
   DR. KD PHYSIOTHERAPY CENTER - INTERACTIVE JS LOGIC
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Setup DOM elements references
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const navMenu = document.getElementById('nav-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Floating Controls and Sentinel references
  const topSentinel = document.getElementById('top-sentinel');
  
  /* -------------------------------------------------------------
     1. RESPONSIVE MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------- */
  const toggleMobileMenu = () => {
    navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
  };

  hamburgerBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile drawer on navigation link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      
      // Update active navigation state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* -------------------------------------------------------------
     2. LIGHT / DARK THEME SYSTEM TOGGLE
     ------------------------------------------------------------- */
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.className = `scroller ${savedTheme}-theme`;

  themeToggleBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-theme');
    const newTheme = isDark ? 'light' : 'dark';
    
    body.classList.remove(`${savedTheme}-theme`, isDark ? 'dark-theme' : 'light-theme');
    body.classList.add(`${newTheme}-theme`);
    
    localStorage.setItem('theme', newTheme);
  });

  /* -------------------------------------------------------------
     3. SCROLL POSITION TRACKER (SENTINELS)
     ------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    // Top Sentinel to toggle floating elements and shrink header
    const topObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          body.classList.add('scrolled');
          navbar.classList.add('scrolled');
        } else {
          body.classList.remove('scrolled');
          navbar.classList.remove('scrolled');
        }
      });
    }, { root: null, threshold: 0 });

    topObserver.observe(topSentinel);

    // Scroll Entry & Exit Animation Observer
    const animItems = document.querySelectorAll('.scroll-anim-fade, .scroll-anim-slide-left, .scroll-anim-slide-right');
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('element-visible');
        }
      });
    }, { root: null, threshold: 0.15 });

    animItems.forEach(item => animObserver.observe(item));

    // Stats Viewport Trigger for countup
    const statsSection = document.querySelector('.why-us-stats');
    let countersStarted = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          startStatsCounter();
          countersStarted = true;
        }
      });
    }, { root: null, threshold: 0.3 });

    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  } else {
    // Fallback if IntersectionObserver not supported
    body.classList.add('scrolled');
    navbar.classList.add('scrolled');
    document.querySelectorAll('.scroll-anim-fade, .scroll-anim-slide-left, .scroll-anim-slide-right').forEach(i => {
      i.classList.add('element-visible');
    });
    startStatsCounter();
  }

  /* -------------------------------------------------------------
     4. STATISTICS COUNTER COUNT-UP ANIMATION
     ------------------------------------------------------------- */
  function startStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // ~60fps
      
      let currentVal = 0;
      const updateValue = () => {
        currentVal += increment;
        if (currentVal < target) {
          counter.innerText = Math.ceil(currentVal);
          requestAnimationFrame(updateValue);
        } else {
          counter.innerText = target;
        }
      };
      
      updateValue();
    });
  }

  /* -------------------------------------------------------------
     5. SERVICES CATEGORY FILTERING SYSTEM
     ------------------------------------------------------------- */
  const serviceFilterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active states
      serviceFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCat === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* -------------------------------------------------------------
     6. TREATMENT GALLERY MEDIA FILTERS
     ------------------------------------------------------------- */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-gallery-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-gallery-cat');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* -------------------------------------------------------------
     7. TIMELINE PROGRESS INDICATOR ON SCROLL
     ------------------------------------------------------------- */
  const timelineProgressFill = document.getElementById('timeline-progress-fill');
  const processSection = document.getElementById('process');
  
  if (timelineProgressFill && processSection) {
    window.addEventListener('scroll', () => {
      const sectionRect = processSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate active scroll progress within the timeline section
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      
      const progressStart = windowHeight * 0.7; // Start fill when section is 70% down viewport
      const progressEnd = windowHeight * 0.2;   // Finish fill when section is 20% down viewport
      
      const scrollableDist = sectionHeight + progressStart - progressEnd;
      const currentScroll = progressStart - sectionTop;
      
      let percentage = (currentScroll / scrollableDist) * 100;
      percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0% and 100%
      
      timelineProgressFill.style.height = `${percentage}%`;
    });
  }

  /* -------------------------------------------------------------
     8. CLIENT TESTIMONIALS SLIDER CAROUSEL
     ------------------------------------------------------------- */
  const reviewsSlider = document.getElementById('reviews-slider');
  const reviewSlides = document.querySelectorAll('.review-slide');
  const prevReviewBtn = document.getElementById('prev-review');
  const nextReviewBtn = document.getElementById('next-review');
  const dotsContainer = document.getElementById('slider-dots');
  
  let currentSlide = 0;
  const slideCount = reviewSlides.length;
  
  if (reviewsSlider && slideCount > 0) {
    // Create navigation dots
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.dot');
    
    const goToSlide = (slideIndex) => {
      currentSlide = (slideIndex + slideCount) % slideCount;
      reviewsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update active dot indicators
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };
    
    prevReviewBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoSlide();
    });
    
    nextReviewBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoSlide();
    });
    
    // Auto rotation every 6 seconds
    let autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
    
    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 6000);
    };
  }

  /* -------------------------------------------------------------
     9. APPOINTMENT FORM INTERACTIVE CAPTURING SYSTEM
     ------------------------------------------------------------- */
  const bookingForm = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status-message');

  if (bookingForm) {
    // Set minimum date for booking as today
    const dateInput = document.getElementById('form-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Gather inputs
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const age = document.getElementById('form-age').value.trim();
      const condition = document.getElementById('form-condition').value.trim();
      const date = document.getElementById('form-date').value;
      const time = document.getElementById('form-time').value;
      const submitMode = document.querySelector('input[name="submit_mode"]:checked').value;
      
      if (!name || !phone || !age || !condition || !date || !time) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // 1. Save appointment details to LocalStorage (local database log)
      const bookingData = {
        id: 'bk_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        name,
        phone,
        age,
        condition,
        date,
        time
      };

      const existingBookings = JSON.parse(localStorage.getItem('appointments') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('appointments', JSON.stringify(existingBookings));

      // Reload appointments table in Admin Portal
      loadAppointmentsTable();

      // Update submit button to loading state
      const origBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing...</span> <i data-lucide="loader-2" class="spin-icon"></i>';
      lucide.createIcons();

      setTimeout(() => {
        if (submitMode === 'whatsapp') {
          // 2. WHATSAPP BOOKING INTEGRATION REDIRECT
          const waNumber = '918387915783';
          const waMessage = `*Dr. KD Physiotherapy Center - Appointment Booking Request*\n\n` + 
                            `• *Patient Name:* ${name}\n` +
                            `• *Phone Number:* ${phone}\n` +
                            `• *Age:* ${age} Years\n` +
                            `• *Medical Condition:* ${condition}\n` +
                            `• *Preferred Date:* ${date}\n` +
                            `• *Preferred Time:* ${time}\n\n` +
                            `Please confirm my physiotherapy session request. Thank you!`;
          
          const encodedMessage = encodeURIComponent(waMessage);
          const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
          
          // Show Success, trigger redirect
          submitBtn.innerHTML = '<span>Redirecting to WhatsApp...</span> <i data-lucide="check"></i>';
          lucide.createIcons();
          showStatus('Booking recorded! Redirecting to WhatsApp to send message...', 'success');
          
          setTimeout(() => {
            window.open(waUrl, '_blank');
            bookingForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHTML;
            lucide.createIcons();
          }, 1500);

        } else {
          // 3. EMAILING INTEGRATION (FormSubmit.co API simulation)
          // Posting via AJAX using standard fetch
          const formData = new FormData();
          formData.append('name', name);
          formData.append('phone', phone);
          formData.append('age', age);
          formData.append('condition', condition);
          formData.append('date', date);
          formData.append('time', time);
          formData.append('_subject', 'Dr. KD Physio Appointment request from ' + name);

          fetch('https://formsubmit.co/ajax/8387915783@mail.com', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(response => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Booked Successfully!</span> <i data-lucide="check"></i>';
            lucide.createIcons();
            showStatus('Success! Appointment email sent. Dr. KD\'s clinic team will call you back.', 'success');
            bookingForm.reset();
            
            setTimeout(() => {
              submitBtn.innerHTML = origBtnHTML;
              lucide.createIcons();
            }, 3000);
          })
          .catch(error => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHTML;
            lucide.createIcons();
            
            // Backup offline successful notice (since email backend is a mockup address config)
            showStatus('Appointment recorded in Local Log! (Server mock success)', 'success');
            bookingForm.reset();
          });
        }
      }, 1000);
    });
  }

  function showStatus(msg, type) {
    formStatus.innerText = msg;
    formStatus.className = `form-status ${type}`;
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 6000);
  }

  /* -------------------------------------------------------------
     10. FAQ ACCORDION OPEN / CLOSE ACTIONS
     ------------------------------------------------------------- */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = btn.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all other active items
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        // Set height dynamically for CSS transition height
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* -------------------------------------------------------------
     11. CLINIC ADMIN BOOKING PORTAL (LOCAL STORAGE LOGGER)
     ------------------------------------------------------------- */
  const toggleAdminBtn = document.getElementById('toggle-admin-btn');
  const adminBody = document.getElementById('admin-body');
  const clearBookingsBtn = document.getElementById('clear-bookings-btn');
  const exportBookingsBtn = document.getElementById('export-bookings-btn');

  if (toggleAdminBtn && adminBody) {
    toggleAdminBtn.addEventListener('click', () => {
      const isHidden = adminBody.classList.contains('hidden');
      if (isHidden) {
        adminBody.classList.remove('hidden');
        toggleAdminBtn.parentElement.classList.add('open');
        toggleAdminBtn.innerHTML = '<i data-lucide="unlock"></i> <span>Close Clinic Reception Portal</span> <i data-lucide="chevron-down" class="chevron-rot"></i>';
        loadAppointmentsTable();
      } else {
        adminBody.classList.add('hidden');
        toggleAdminBtn.parentElement.classList.remove('open');
        toggleAdminBtn.innerHTML = '<i data-lucide="lock"></i> <span>Open Clinic Reception Portal</span> <i data-lucide="chevron-up" class="chevron-rot"></i>';
      }
      lucide.createIcons();
    });
  }

  function loadAppointmentsTable() {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    if (appointments.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="no-bookings">No appointments recorded yet. Use the booking form above to add an appointment.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = appointments.map((apt, index) => `
      <tr>
        <td><strong>${apt.timestamp || 'N/A'}</strong></td>
        <td>${apt.name}</td>
        <td><a href="tel:${apt.phone}" class="contact-btn-link">${apt.phone}</a></td>
        <td>${apt.age}</td>
        <td><em>${apt.condition}</em></td>
        <td>${apt.date}</td>
        <td><span class="google-badge">${apt.time}</span></td>
        <td>
          <button class="btn-delete-row" onclick="deleteBooking('${apt.id}')" title="Delete Booking">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    lucide.createIcons();
  }

  // Bind deleteBooking globally so onclick attributes can find it
  window.deleteBooking = (id) => {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments = appointments.filter(apt => apt.id !== id);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadAppointmentsTable();
  };

  // Clear Bookings handler
  if (clearBookingsBtn) {
    clearBookingsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all appointment records from this browser database log?')) {
        localStorage.removeItem('appointments');
        loadAppointmentsTable();
      }
    });
  }

  // Export Bookings handler
  if (exportBookingsBtn) {
    exportBookingsBtn.addEventListener('click', () => {
      const appointments = localStorage.getItem('appointments') || '[]';
      const blob = new Blob([appointments], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dr_kd_appointments_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
});
