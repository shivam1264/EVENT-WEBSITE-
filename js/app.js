/**
 * Shri Shyam Events & Spark Productions - Public App Coordinator
 * Manages URL Hash Routing, Customer-facing Interactions, Toasts & Subsystems.
 */

window.app = {
  init() {
    // Redirect if admin hash is accessed on public page
    const hash = window.location.hash || '';
    if (hash.startsWith('#admin')) {
      const adminSub = hash.replace('#admin', '').replace(/^\//, '');
      window.location.href = `admin.html${adminSub ? '#' + adminSub : ''}`;
      return;
    }

    // Initialize Public Customer-Facing Subsystem
    if (window.PublicController) {
      window.PublicController.init();
    }

    // Setup global listeners
    this.bindGlobalEvents();
    this.handleRoute();

    window.addEventListener('hashchange', () => this.handleRoute());
  },

  handleRoute() {
    const hash = window.location.hash || '#home';

    if (hash.startsWith('#admin')) {
      const adminSub = hash.replace('#admin', '').replace(/^\//, '');
      window.location.href = `admin.html${adminSub ? '#' + adminSub : ''}`;
      return;
    }

    // Update Nav Link Active state
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkHref = link.getAttribute('href');
      link.classList.toggle('active', linkHref === hash);
    });

    // Smooth scroll to section if valid id
    const targetId = hash.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  },

  bindGlobalEvents() {
    // Scroll state on navbar
    window.addEventListener('scroll', () => {
      const header = document.getElementById('site-header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        const isShown = navLinks.style.display === 'flex';
        navLinks.style.display = isShown ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
        navLinks.style.backdropFilter = 'blur(16px)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid var(--border-card)';
        navLinks.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
      });
    }

    // Close any modal on backdrop click or close button
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn')) {
          modal.classList.remove('active');
        }
      });
    });

    // Automatic Hero Background Slider (Cross-fade between Mandap & Crack Fires)
    this.initHeroBgSlider();
  },

  initHeroBgSlider() {
    const sliders = document.querySelectorAll('.hero-bg-slider');
    sliders.forEach(slider => {
      const slides = slider.querySelectorAll('.hero-bg-slide');
      if (!slides || slides.length <= 1) return;
      let current = 0;
      setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 5000);
    });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="flex-shrink: 0; display: flex; align-items: center;">${iconSvg}</div>
      <div style="font-size: 0.9rem; font-weight: 500; line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
