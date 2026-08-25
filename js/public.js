/**
 * VibrantVows & Spark Events - Public Website Controller
 * Handles customer-facing interactions, hero carousel, dynamic gallery filters, lightbox, and inquiry submission.
 */

window.PublicController = {
  currentCategoryFilter: 'all',
  currentSlideIndex: 0,
  carouselInterval: null,

  init() {
    this.initHeroCarousel();
    this.renderServices();
    this.renderGallery();
    this.bindEvents();
    this.initFaq();

    // Listen to real-time media changes from Admin Media Manager
    window.store.subscribe((event) => {
      if (event === 'media_changed' || event === 'store_reset') {
        this.renderGallery();
      }
    });
  },

  initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-full-bg-slide');
    const dots = document.querySelectorAll('.hero-full-dot');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    const heroWrap = document.getElementById('home');

    if (!slides.length) return;

    let currentIndex = 0;
    let slideTimer = null;

    const goToSlide = (index) => {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };

    const nextSlide = () => {
      const nextIdx = (currentIndex + 1) % slides.length;
      goToSlide(nextIdx);
    };

    const prevSlide = () => {
      const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIdx);
    };

    const startTimer = () => {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 4000);
    };

    const stopTimer = () => {
      if (slideTimer) clearInterval(slideTimer);
    };

    // Attach Click Events
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
        startTimer();
      });
    });

    // Pause auto-sliding on hover
    if (heroWrap) {
      heroWrap.addEventListener('mouseenter', stopTimer);
      heroWrap.addEventListener('mouseleave', startTimer);
    }

    // Start auto slide
    startTimer();
  },

  renderServices() {
    const servicesGrid = document.getElementById('services-grid-container');
    if (!servicesGrid) return;

    const services = [
      {
        id: 'wedding-entry',
        title: 'Wedding Entry Decoration',
        image: './wending decoration.png',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`,
        desc: 'Unforgettable royal baraat and bride walk setups featuring flower arches, vintage luxury cars, mirror pathways, and atmospheric low fog.',
        features: [
          'Custom Floral Baraat Umbrella & Chadar',
          'Vintage Car & Carriage Styling',
          'Aisle Candle Lanterns & Mirror Floor',
          'Synchronized Music & Smoke Entrance'
        ]
      },
      {
        id: 'pyro-shows',
        title: 'Pyro & Cold Spark Shows',
        image: './creack fires.png',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
        desc: 'Spectacular electronic cold spark fountains, dry ice low fog, Dancing on Clouds®, stage blast confetti, and CO2 jets certified 100% fire-safe.',
        features: [
          'Smokeless & Odorless Cold Spark Machines',
          'Heavy Dry Ice Low Fog for Fire License',
          '360° Synchronized Stage Blast',
          'Govt & Venue Safety Certified Equipment'
        ]
      },
      {
        id: 'stage-decor',
        title: 'Stage & Mandap Decoration',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6a3 3 0 0 1 6 0v6"/></svg>`,
        desc: 'Bespoke grand mandaps and reception stages adorned with imported blooms, gold filigree pillars, crystal chandeliers, and dynamic ambient lighting.',
        features: [
          'Fresh Imported Flowers, Orchids & Jasmine',
          'Architectural 3D Pillars & Backdrops',
          'Custom Ceiling Swagging, Thrones & Sofas',
          'Intelligent Accent & Warm LED Illumination'
        ]
      },
      {
        id: 'birthday-party',
        title: 'Birthday Party Decoration',
        image: './Birthday party decoration.png',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s4-1 8-1 8 1 8 1"/><line x1="2" y1="21" x2="22" y2="21"/><line x1="8" y1="7" x2="8" y2="11"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="16" y1="7" x2="16" y2="11"/><circle cx="8" cy="4" r="1"/><circle cx="12" cy="4" r="1"/><circle cx="16" cy="4" r="1"/></svg>`,
        desc: 'Customized luxury birthday themes for milestone celebrations and kids parties with organic balloon garlands, neon signs, and photo booths.',
        features: [
          'Personalized Neon Name Lights & Marquee Letters',
          'Multi-Tier Thematic Backdrops & Installations',
          'Dessert Tables & Cake Area Styling',
          'Themed Photo-Op Booths with Props'
        ]
      },
      {
        id: 'costume-characters',
        title: 'Costume & Mascot Performers',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/></svg>`,
        desc: 'High-energy 9-foot animated Gorilla / King Kong mascot, LED superheroes, and cartoon character entertainers for sensational entrance reveals.',
        features: [
          'Giant Animated King Kong / Gorilla Costume',
          'Interactive Dances & Crowd Hype Routines',
          'Epic Surprise Entry for Birthday Star',
          'Photo Sessions with Guests & Kids'
        ]
      },
      {
        id: 'mehendi-decor',
        title: 'Mehendi & Haldi Decor',
        image: './haldi%20%26%20mehadi.png',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C12 22 4 16 4 10a8 8 0 0 1 16 0c0 6-8 12-8 12Z"/><path d="M12 6v8M8 10l4 4 4-4"/></svg>`,
        desc: 'Bright marigold canopies, colorful Rajasthani props, floral swing jhoolas, colorful diwan lounges, and playful photo-corners.',
        features: [
          'Floral Haldi Swing for Bride & Groom',
          'Traditional Marigold & Brass Utensils',
          'Bohemian Canopy Tents & Floor Cushions',
          'Customized Quirky Signages & Bangle Bar'
        ]
      }
    ];

    servicesGrid.innerHTML = services.map(srv => `
      <div class="service-split-card">
        <div class="service-split-media">
          <img src="${srv.image}" alt="${srv.title}" class="service-split-img" loading="lazy" />
          <div class="service-emblem-badge">
            ${srv.icon}
          </div>
        </div>
        <div class="service-split-content">
          <h3 class="service-split-title">${srv.title}</h3>
          <p class="service-split-desc">${srv.desc}</p>
          <ul class="service-split-features">
            ${srv.features.map(f => `
              <li>
                <span class="gold-check">✔</span>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
          <div class="service-split-actions">
            <button class="btn btn-gold btn-sm select-service-btn" data-service="${srv.title}">
              Enquire
            </button>
            <button class="btn btn-outline-subtle btn-sm filter-gallery-quick-btn" data-cat="${srv.id}">
              Photos &rarr;
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  getGalleryItemIcon(item) {
    const title = (item.title || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();

    if (title.includes('wedding ent') || title.includes('ring')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6.5"/><path d="M9 4.5l3-3 3 3-3 3z"/><path d="M12 1.5v6"/></svg>`;
    }
    if (title.includes('pyro') || title.includes('spark') || cat.includes('pyro')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5" fill="#ffffff"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`;
    }
    if (title.includes('stage') || title.includes('mandap') || cat.includes('stage')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/><line x1="12" y1="3" x2="12" y2="7"/></svg>`;
    }
    if (title.includes('celebrat') || title.includes('wedding')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    }
    if (title.includes('creative') || title.includes('shot') || title.includes('camera')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
    }
    if (title.includes('birth') || title.includes('cake') || cat.includes('birth')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><line x1="2" y1="21" x2="22" y2="21"/><path d="M6 16s3-1 6-1 6 1 6 1"/><line x1="8" y1="7" x2="8" y2="11"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="16" y1="7" x2="16" y2="11"/><circle cx="8" cy="4" r="1" fill="#ffffff"/><circle cx="12" cy="4" r="1" fill="#ffffff"/><circle cx="16" cy="4" r="1" fill="#ffffff"/></svg>`;
    }
    if (title.includes('confetti') || title.includes('effect')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><circle cx="18" cy="6" r="1.5" fill="#ffffff"/><circle cx="6" cy="18" r="1.5" fill="#ffffff"/></svg>`;
    }
    if (title.includes('decor') || title.includes('haldi') || title.includes('mehendi') || cat.includes('mehendi')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C12 22 4 16 4 10a8 8 0 0 1 16 0c0 6-8 12-8 12Z"/><path d="M12 6v8M8 10l4 4 4-4"/><circle cx="12" cy="10" r="2" fill="#ffffff"/></svg>`;
    }
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6.5"/><path d="M9 4.5l3-3 3 3-3 3z"/><path d="M12 1.5v6"/></svg>`;
  },

  renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid-container');
    if (!galleryGrid) return;

    const allMedia = window.store.getMedia();
    const filteredMedia = this.currentCategoryFilter === 'all'
      ? allMedia
      : allMedia.filter(m => m.category === this.currentCategoryFilter);

    if (filteredMedia.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="color: var(--text-muted); font-size: 1.1rem;">No media found in this category. You can upload new photos or videos in the Admin Media Manager!</p>
          <button class="btn btn-gold btn-sm mt-3" onclick="window.location.hash='#admin/media'">Open Admin Media Manager</button>
        </div>
      `;
      return;
    }

    galleryGrid.innerHTML = filteredMedia.map(item => `
      <div class="gallery-luxury-card ${item.spanWide ? 'gallery-card-wide' : ''}" data-id="${item.id}">
        <img src="${item.url}" alt="${item.title}" class="gallery-luxury-img" loading="lazy" />
        ${item.mediaType.includes('video') ? `
          <div class="video-play-indicator">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        ` : ''}
        <div class="gallery-luxury-overlay">
          <div class="gallery-luxury-bottom">
            <div class="gallery-emblem-badge">
              ${this.getGalleryItemIcon(item)}
            </div>
            <div class="gallery-luxury-text">
              <h4 class="gallery-luxury-card-title">${item.title}</h4>
              <p class="gallery-luxury-card-sub">${item.subtitle || item.description || item.categoryName}</p>
            </div>
            <div class="gallery-arrow-circle-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  openLightbox(mediaId) {
    const item = window.store.getMediaById(mediaId);
    if (!item) return;

    const modal = document.getElementById('lightbox-modal');
    const mediaWrap = document.getElementById('lightbox-media-display');
    const titleEl = document.getElementById('lightbox-title');
    const catBadge = document.getElementById('lightbox-category-badge');
    const descEl = document.getElementById('lightbox-description');
    const tagsWrap = document.getElementById('lightbox-tags');
    const bookBtn = document.getElementById('lightbox-book-look-btn');

    if (!modal) return;

    // Render media element (video or image)
    if (item.mediaType === 'video-sim' && item.videoUrl) {
      mediaWrap.innerHTML = `
        <video src="${item.videoUrl}" poster="${item.url}" controls autoplay loop style="width: 100%; height: 100%; object-fit: contain;"></video>
      `;
    } else {
      mediaWrap.innerHTML = `<img src="${item.url}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" />`;
    }

    titleEl.textContent = item.title;
    catBadge.textContent = item.categoryName;
    descEl.textContent = item.description || 'Custom crafted luxury decor styling tailored for unforgettable celebrations.';

    tagsWrap.innerHTML = (item.tags || []).map(t => `<span class="badge badge-purple">${t}</span>`).join('');

    bookBtn.onclick = () => {
      modal.classList.remove('active');
      const eventTypeSelect = document.getElementById('inquiry-event-type');
      if (eventTypeSelect) {
        // Auto select appropriate option
        for (let i = 0; i < eventTypeSelect.options.length; i++) {
          if (eventTypeSelect.options[i].text.toLowerCase().includes(item.categoryName.toLowerCase())) {
            eventTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
      const messageField = document.getElementById('inquiry-message');
      if (messageField) {
        messageField.value = `I am interested in booking the style: "${item.title}". Please provide pricing and package options.`;
      }
      window.location.hash = '#inquire';
      const formEl = document.getElementById('inquiry-form-section');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    };

    modal.classList.add('active');
  },

  closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('active');
      const mediaWrap = document.getElementById('lightbox-media-display');
      if (mediaWrap) mediaWrap.innerHTML = '';
    }
  },

  bindEvents() {
    // Mobile Nav Toggle Interaction
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileNavToggle && navLinks) {
      mobileNavToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        mobileNavToggle.classList.toggle('open', isOpen);
      });

      // Close mobile menu when clicking any nav link
      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          mobileNavToggle.classList.remove('open');
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#site-header')) {
          navLinks.classList.remove('open');
          mobileNavToggle.classList.remove('open');
        }
      });
    }

    // Gallery filter tabs
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (tab) {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategoryFilter = tab.getAttribute('data-filter');
        this.renderGallery();
      }

      // Quick gallery button from service cards
      const quickGalleryBtn = e.target.closest('.filter-gallery-quick-btn');
      if (quickGalleryBtn) {
        const cat = quickGalleryBtn.getAttribute('data-cat');
        const targetTab = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
        if (targetTab) {
          targetTab.click();
        }
        const gallerySec = document.getElementById('gallery');
        if (gallerySec) gallerySec.scrollIntoView({ behavior: 'smooth' });
      }

      // Enquire service button
      const selectServiceBtn = e.target.closest('.select-service-btn');
      if (selectServiceBtn) {
        const srvName = selectServiceBtn.getAttribute('data-service');
        const eventTypeSelect = document.getElementById('inquiry-event-type');
        if (eventTypeSelect) {
          for (let i = 0; i < eventTypeSelect.options.length; i++) {
            if (eventTypeSelect.options[i].text.toLowerCase().includes(srvName.toLowerCase())) {
              eventTypeSelect.selectedIndex = i;
              break;
            }
          }
        }
        const formEl = document.getElementById('inquiry-form-section');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }

      // Open Lightbox on gallery item click
      const galleryItem = e.target.closest('.gallery-luxury-card, .gallery-item');
      if (galleryItem) {
        const id = galleryItem.getAttribute('data-id');
        this.openLightbox(id);
      }

      // Close Lightbox
      if (e.target.closest('#lightbox-close-btn') || (e.target.classList.contains('lightbox-modal') && !e.target.closest('.lightbox-container'))) {
        this.closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
      }
    });

    // Inquiry Form Submit
    const inquiryForm = document.getElementById('public-inquiry-form');
    if (inquiryForm) {
      inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleInquirySubmit(inquiryForm);
      });
    }
  },

  handleInquirySubmit(form) {
    const customerName = form.querySelector('[name="customerName"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const eventType = form.querySelector('[name="eventType"]').value;
    const eventDate = form.querySelector('[name="eventDate"]').value;
    const city = form.querySelector('[name="city"]').value.trim();
    const guestCount = form.querySelector('[name="guestCount"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!customerName || !phone || !eventType || !eventDate) {
      window.app.showToast('Please fill in all mandatory fields (*)', 'error');
      return;
    }

    // Save to Store
    const savedInquiry = window.store.addInquiry({
      customerName,
      phone,
      email: email || 'Not provided',
      eventType,
      eventDate,
      city: city || 'Local',
      guestCount: guestCount || 'Not specified',
      message: message || 'General inquiry'
    });

    // Reset Form
    form.reset();

    // Show Confirmation Modal with Reference ID
    const refEl = document.getElementById('inquiry-success-ref-id');
    if (refEl) refEl.textContent = '#' + savedInquiry.id.toUpperCase();

    const successModal = document.getElementById('inquiry-success-modal');
    if (successModal) successModal.classList.add('active');

    // Also trigger toast
    window.app.showToast(`Inquiry #${savedInquiry.id} submitted successfully! Our team will contact you shortly.`, 'success');
  },

  initFaq() {
    document.querySelectorAll('.faq-question-luxury, .faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item-luxury, .faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item-luxury, .faq-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    });
  }
};
