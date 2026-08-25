/**
 * Shri Shyam Events & Spark Productions - Admin Dashboard Controller
 * Handles Multi-User Authentication, KPI Overview, Inquiries CRM, Media CMS & Calendar Bookings.
 */

window.AdminController = {
  activeTab: 'overview', // 'overview', 'inquiries', 'media', 'calendar', 'team'
  inquiryFilterStatus: 'all',
  inquirySearchQuery: '',
  calendarCurrentDate: new Date(2026, 8, 1), // September 2026

  init() {
    this.bindAuthEvents();
    this.bindNavigation();
    this.bindCrudEvents();

    // Listen to real-time store updates across tabs
    window.store.subscribe((event) => {
      if (this.isAuthenticated()) {
        this.updateBadgeCounts();
        if (this.activeTab === 'overview') this.renderOverview();
        if (this.activeTab === 'inquiries') this.renderInquiries();
        if (this.activeTab === 'media') this.renderMediaManager();
        if (this.activeTab === 'calendar') this.renderCalendar();
      }
    });
  },

  isAuthenticated() {
    return !!window.store.getCurrentUser();
  },

  render() {
    const authContainer = document.getElementById('admin-auth-view');
    const dashboardContainer = document.getElementById('admin-dashboard-view');

    if (!this.isAuthenticated()) {
      if (authContainer) authContainer.style.display = 'flex';
      if (dashboardContainer) dashboardContainer.style.display = 'none';
      return;
    }

    if (authContainer) authContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'flex';

    this.renderUserInfo();
    this.updateBadgeCounts();
    this.applyRolePermissions();
    this.switchTab(this.activeTab);
  },

  applyRolePermissions() {
    const user = window.store.getCurrentUser();
    if (!user) return;

    const accessLevel = user.accessLevel || (user.isSuperAdmin ? 'Super Admin' : 'Operations Manager');
    const isSuper = window.store.isSuperAdmin();

    // Determine allowed tabs based on role
    let allowedTabs = ['overview', 'inquiries'];
    if (isSuper) {
      allowedTabs = ['overview', 'inquiries', 'media', 'calendar', 'team'];
    } else if (accessLevel === 'Operations Manager') {
      allowedTabs = ['overview', 'inquiries', 'calendar'];
    } else if (accessLevel === 'Decor Specialist') {
      allowedTabs = ['overview', 'inquiries', 'media'];
    } else if (accessLevel === 'Event Coordinator') {
      allowedTabs = ['overview', 'inquiries', 'calendar'];
    }

    // Toggle sidebar navigation items visibility
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      const tab = item.getAttribute('data-tab');
      if (allowedTabs.includes(tab)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // Auto switch if currently active tab is restricted for this role
    if (!allowedTabs.includes(this.activeTab)) {
      this.activeTab = allowedTabs[0];
    }
  },

  renderUserInfo() {
    const user = window.store.getCurrentUser();
    if (!user) return;

    const avatarEl = document.getElementById('admin-current-avatar');
    const nameEl = document.getElementById('admin-current-name');
    const roleEl = document.getElementById('admin-current-role');
    const topbarRole = document.getElementById('admin-topbar-role-badge');

    if (avatarEl) avatarEl.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = `${user.isSuperAdmin ? '👑' : '🛡️'} ${user.role}`;
    if (topbarRole) {
      topbarRole.textContent = user.isSuperAdmin ? '👑 Super Admin' : (user.accessLevel ? `🛡️ ${user.accessLevel}` : '🛡️ Executive Partner');
    }
  },

  updateBadgeCounts() {
    const inquiries = window.store.getInquiries();
    const newCount = inquiries.filter(i => i.status === 'New').length;
    const badgeEl = document.getElementById('admin-new-inquiries-badge');
    if (badgeEl) {
      badgeEl.textContent = newCount;
      badgeEl.style.display = newCount > 0 ? 'inline-block' : 'none';
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update nav classes
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tab') === tabName);
    });

    // Hide all tab panels
    document.querySelectorAll('.admin-tab-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // Show active panel
    const activePanel = document.getElementById(`admin-panel-${tabName}`);
    if (activePanel) {
      activePanel.style.display = 'block';
    }

    // Update Topbar Title
    const titleMap = {
      overview: 'Executive Dashboard Overview',
      inquiries: 'Customer Inquiries & Leads CRM',
      media: 'Portfolio Media Manager (Live CMS)',
      calendar: 'Event Bookings & Schedule Calendar',
      team: 'Business Partners & Team Access'
    };
    const topTitle = document.getElementById('admin-topbar-page-title');
    if (topTitle) topTitle.textContent = titleMap[tabName] || 'Admin Dashboard';

    // Render Tab Content
    if (tabName === 'overview') this.renderOverview();
    if (tabName === 'inquiries') this.renderInquiries();
    if (tabName === 'media') this.renderMediaManager();
    if (tabName === 'calendar') this.renderCalendar();
    if (tabName === 'team') this.renderTeam();
  },

  // -------------------------------------------------------------
  // 1. OVERVIEW DASHBOARD
  // -------------------------------------------------------------
  renderOverview() {
    const inquiries = window.store.getInquiries();
    const media = window.store.getMedia();
    const bookings = window.store.getBookings();

    const newInquiries = inquiries.filter(i => i.status === 'New').length;

    const totalInquiriesEl = document.getElementById('kpi-total-inquiries');
    const newLeadsEl = document.getElementById('kpi-new-leads');
    const totalMediaEl = document.getElementById('kpi-total-media');
    const upcomingEventsEl = document.getElementById('kpi-upcoming-events');

    if (totalInquiriesEl) totalInquiriesEl.textContent = inquiries.length;
    if (newLeadsEl) newLeadsEl.textContent = newInquiries;
    if (totalMediaEl) totalMediaEl.textContent = media.length;
    if (upcomingEventsEl) upcomingEventsEl.textContent = bookings.length;

    // Render Recent Inquiries Table
    const recentTableBody = document.getElementById('recent-inquiries-table-body');
    if (recentTableBody) {
      const recent = inquiries.slice(0, 5);
      if (recent.length === 0) {
        recentTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No inquiries received yet.</td></tr>`;
      } else {
        recentTableBody.innerHTML = recent.map(inq => {
          const initials = (inq.customerName || 'EV').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
          const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Hello ${inq.customerName}, this is regarding your event inquiry with Shri Shyam Events.`)}`;

          return `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #fdfbf7 0%, #faecd4 100%); border: 1.5px solid #d4af37; color: #8c6016; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.82rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(212,175,55,0.15);">${initials}</div>
                  <div style="min-width: 0;">
                    <div style="font-weight: 800; color: #1e2638; font-size: 0.95rem; line-height: 1.2; white-space: nowrap;">${inq.customerName}</div>
                    <div class="phone-subline" style="font-size: 0.78rem; color: #64748b; margin-top: 2px; white-space: nowrap;">${inq.phone}</div>
                  </div>
                </div>
              </td>
              <td>
                <span style="font-size: 0.82rem; font-weight: 700; color: #8c6016; background: rgba(212,175,55,0.08); padding: 4px 10px; border-radius: 6px; display: inline-block; line-height: 1.25; border: 1px solid rgba(212,175,55,0.2);">
                  ${inq.eventType}
                </span>
              </td>
              <td>
                <span style="font-size: 0.84rem; font-weight: 800; color: #1e2638; white-space: nowrap; display: inline-flex; align-items: center; gap: 5px;">
                  📅 ${inq.eventDate}
                </span>
              </td>
              <td>
                <span class="badge-status-${(inq.status || 'new').toLowerCase()}">${inq.status || 'New'}</span>
              </td>
              <td>
                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                  <button class="btn-table-manage" style="padding: 5px 12px; font-size: 0.76rem;" onclick="AdminController.openInquiryDetail('${inq.id}')">
                    Manage Details &rarr;
                  </button>
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="width: 28px; height: 28px; border-radius: 50%; background: #25d366; color: #ffffff; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 0.8rem; box-shadow: 0 2px 6px rgba(37,211,102,0.35); flex-shrink: 0;" title="Chat on WhatsApp">
                    💬
                  </a>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Upcoming Schedule in Overview
    const upcomingScheduleEl = document.getElementById('overview-upcoming-schedule');
    if (upcomingScheduleEl) {
      if (bookings.length === 0) {
        upcomingScheduleEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.2rem; font-size: 0.85rem;">No upcoming bookings. Click "+ Add Booking" to schedule one.</div>`;
      } else {
        upcomingScheduleEl.innerHTML = bookings.slice(0, 3).map(bk => `
          <div class="booking-list-item">
            <div style="min-width: 0; flex-grow: 1; padding-right: 10px;">
              <div style="font-weight: 800; font-size: 0.9rem; color: #1e2638; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${bk.clientName}</div>
              <div style="font-size: 0.76rem; color: #8c6016; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${bk.service} &bull; <span style="color: #64748b;">${bk.venue}</span>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <div class="booking-date-pill">📅 ${bk.date}</div>
              <div class="booking-amount">${bk.amount}</div>
            </div>
          </div>
        `).join('');
      }
    }
  },

  // -------------------------------------------------------------
  // 2. INQUIRIES CRM
  // -------------------------------------------------------------
  renderInquiries() {
    const container = document.getElementById('all-inquiries-container') || document.getElementById('all-inquiries-table-body');
    if (!container) return;

    let inquiries = window.store.getInquiries();

    // Filter by status
    if (this.inquiryFilterStatus !== 'all') {
      inquiries = inquiries.filter(i => i.status.toLowerCase() === this.inquiryFilterStatus.toLowerCase());
    }

    // Filter by search query
    if (this.inquirySearchQuery.trim()) {
      const q = this.inquirySearchQuery.toLowerCase().trim();
      inquiries = inquiries.filter(i => 
        (i.customerName && i.customerName.toLowerCase().includes(q)) ||
        (i.phone && i.phone.toLowerCase().includes(q)) ||
        (i.city && i.city.toLowerCase().includes(q)) ||
        (i.eventType && i.eventType.toLowerCase().includes(q))
      );
    }

    if (inquiries.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; background: #ffffff; border-radius: 18px; border: 1.5px dashed rgba(212,175,55,0.3); color: #64748b;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">📭</div>
          <div style="font-weight: 800; font-size: 1.1rem; color: #1e2638;">No Inquiries Found</div>
          <p style="font-size: 0.85rem; margin-top: 4px; color: #64748b;">No inquiries match the current filter or search criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="inquiries-cards-grid">
        ${inquiries.map(inq => {
          const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
          const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Hello ${inq.customerName}, this is regarding your event inquiry with Shri Shyam Events & Spark Productions for ${inq.eventType} on ${inq.eventDate}.`)}`;
          const initials = (inq.customerName || 'EV').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          const currentStatus = inq.status || 'New';

          return `
            <div class="inquiry-card" data-id="${inq.id}">
              <div class="inquiry-card-header">
                <div class="inquiry-id-badge">#${inq.id}</div>
                
                <!-- Custom Luxury Status Dropdown -->
                <div class="custom-status-pill-wrap">
                  <button type="button" class="custom-status-badge status-${currentStatus}" onclick="AdminController.toggleStatusMenu(event, '${inq.id}')">
                    <span class="status-dot"></span>
                    <span class="status-text">${this.getStatusLabel(currentStatus)}</span>
                    <svg class="status-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <div class="custom-status-menu" id="status-menu-${inq.id}">
                    <div class="status-menu-item item-new ${currentStatus === 'New' ? 'selected' : ''}" onclick="AdminController.setStatus('${inq.id}', 'New')">
                      <span class="status-dot"></span>
                      <span>New Lead</span>
                      ${currentStatus === 'New' ? '<span class="status-check">✓</span>' : ''}
                    </div>
                    <div class="status-menu-item item-contacted ${currentStatus === 'Contacted' ? 'selected' : ''}" onclick="AdminController.setStatus('${inq.id}', 'Contacted')">
                      <span class="status-dot"></span>
                      <span>Contacted</span>
                      ${currentStatus === 'Contacted' ? '<span class="status-check">✓</span>' : ''}
                    </div>
                    <div class="status-menu-item item-booked ${currentStatus === 'Booked' ? 'selected' : ''}" onclick="AdminController.setStatus('${inq.id}', 'Booked')">
                      <span class="status-dot"></span>
                      <span>Confirmed Booked</span>
                      ${currentStatus === 'Booked' ? '<span class="status-check">✓</span>' : ''}
                    </div>
                    <div class="status-menu-item item-closed ${currentStatus === 'Closed' ? 'selected' : ''}" onclick="AdminController.setStatus('${inq.id}', 'Closed')">
                      <span class="status-dot"></span>
                      <span>Closed / Done</span>
                      ${currentStatus === 'Closed' ? '<span class="status-check">✓</span>' : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div class="inquiry-card-body">
                <div class="inquiry-customer-row">
                  <div class="inquiry-avatar">${initials}</div>
                  <div class="inquiry-customer-meta">
                    <div class="inquiry-name">${inq.customerName}</div>
                    <div class="inquiry-email">${inq.email}</div>
                  </div>
                </div>

                <div class="inquiry-contact-strip">
                  <div class="inquiry-phone">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8c6016" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>${inq.phone}</span>
                  </div>
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-inquiry-whatsapp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#22c55e"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div class="inquiry-service-box">
                  <div class="inquiry-service-title">${inq.eventType}</div>
                  <div class="inquiry-service-pills">
                    <span class="inq-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8c6016" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <strong>${inq.city}</strong>
                    </span>
                    <span class="inq-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      ${inq.guestCount} Guests
                    </span>
                    <span class="inq-pill inq-date-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8c6016" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      ${inq.eventDate}
                    </span>
                  </div>
                </div>
              </div>

              <div class="inquiry-card-footer">
                <button class="btn btn-secondary btn-sm" style="flex: 1; font-weight: 700; justify-content: center; font-size: 0.8rem; padding: 7px 12px;" onclick="AdminController.openInquiryDetail('${inq.id}')">
                  Manage Details &rarr;
                </button>
                <button class="btn btn-secondary btn-sm" style="color: #ef4444; padding: 7px 10px;" onclick="AdminController.deleteInquiry('${inq.id}')" title="Delete Inquiry">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  getStatusLabel(status) {
    switch (status) {
      case 'New': return 'New Lead';
      case 'Contacted': return 'Contacted';
      case 'Booked': return 'Confirmed Booked';
      case 'Closed': return 'Closed / Done';
      default: return status || 'New Lead';
    }
  },

  toggleStatusMenu(event, inqId) {
    event.stopPropagation();
    const currentMenu = document.getElementById(`status-menu-${inqId}`);
    const isAlreadyOpen = currentMenu && currentMenu.classList.contains('show');

    // Close all open menus first
    document.querySelectorAll('.custom-status-menu').forEach(m => m.classList.remove('show'));

    if (!isAlreadyOpen && currentMenu) {
      currentMenu.classList.add('show');
    }
  },

  setStatus(inqId, newStatus) {
    window.store.updateInquiryStatus(inqId, newStatus);
    this.showToast(`Status updated to "${this.getStatusLabel(newStatus)}"`, 'success');
    this.renderInquiries();
    this.updateBadgeCounts();
  },

  openInquiryDetail(inqId) {
    const inq = window.store.getInquiries().find(i => i.id === inqId);
    if (!inq) return;

    const modal = document.getElementById('inquiry-detail-modal');
    if (!modal) return;

    document.getElementById('modal-inq-id').textContent = '#' + inq.id;
    document.getElementById('modal-inq-name').textContent = inq.customerName;
    document.getElementById('modal-inq-phone').textContent = inq.phone;
    document.getElementById('modal-inq-email').textContent = inq.email;
    document.getElementById('modal-inq-event-type').textContent = inq.eventType;
    document.getElementById('modal-inq-date').textContent = inq.eventDate;
    document.getElementById('modal-inq-city').textContent = inq.city;
    document.getElementById('modal-inq-guests').textContent = inq.guestCount;
    document.getElementById('modal-inq-message').textContent = inq.message;
    document.getElementById('modal-inq-status-select').value = inq.status || 'New';
    document.getElementById('modal-inq-notes').value = inq.notes || '';

    // WhatsApp Action Button
    const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
    const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Hello ${inq.customerName}, this is regarding your event inquiry with Shri Shyam Events & Spark Productions.`)}`;
    const waBtn = document.getElementById('modal-inq-whatsapp-btn');
    if (waBtn) waBtn.href = waLink;

    // Save Notes Button handler
    const saveNotesBtn = document.getElementById('modal-inq-save-notes-btn');
    saveNotesBtn.onclick = () => {
      const status = document.getElementById('modal-inq-status-select').value;
      const notes = document.getElementById('modal-inq-notes').value.trim();
      window.store.updateInquiryStatus(inq.id, status, notes);
      modal.classList.remove('active');
      this.showToast(`Inquiry #${inq.id} updated successfully!`, 'success');
      this.renderInquiries();
      this.renderOverview();
    };

    modal.classList.add('active');
  },

  deleteInquiry(inqId) {
    if (confirm(`Are you sure you want to delete inquiry #${inqId}?`)) {
      window.store.deleteInquiry(inqId);
      this.showToast(`Inquiry #${inqId} deleted`, 'info');
      this.renderInquiries();
      this.renderOverview();
    }
  },

  // -------------------------------------------------------------
  // 3. MEDIA MANAGER (CMS)
  // -------------------------------------------------------------
  renderMediaManager() {
    const grid = document.getElementById('admin-media-grid');
    if (!grid) return;

    const media = window.store.getMedia();

    if (media.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">No media in database. Click "Upload New Photo / Video" above!</div>`;
      return;
    }

    grid.innerHTML = media.map(item => `
      <div class="media-card-admin">
        <div class="media-card-img-wrap">
          <img src="${item.url}" alt="${item.title}" loading="lazy" />
          <div class="media-card-top-badges">
            <span class="media-cat-badge">${item.categoryName || 'Gallery'}</span>
            ${item.featured ? '<span class="media-featured-badge">★ Featured</span>' : ''}
          </div>
        </div>
        <div class="media-card-admin-body">
          <div class="media-card-title">${item.title}</div>
          <div class="media-card-meta">${item.description ? item.description.slice(0, 85) + '...' : 'No description'}</div>
          ${item.tags && item.tags.length ? `
            <div class="media-card-tags-wrap">
              ${item.tags.map(t => `<span class="media-tag-pill">${t}</span>`).join('')}
            </div>
          ` : ''}
          <div class="media-card-admin-actions">
            <span class="media-card-date">${item.createdAt || ''}</span>
            <div class="media-action-buttons">
              <button class="btn btn-secondary btn-sm btn-media-edit" onclick="AdminController.openEditMediaModal('${item.id}')">Edit</button>
              <button class="btn btn-secondary btn-sm btn-media-del" onclick="AdminController.deleteMedia('${item.id}')">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  openAddMediaModal() {
    const modal = document.getElementById('media-upload-modal');
    if (!modal) return;
    const form = document.getElementById('media-upload-form');
    if (form) form.reset();
    document.getElementById('media-modal-title').textContent = 'Upload / Add New Event Media';
    document.getElementById('media-editing-id').value = '';
    modal.classList.add('active');
  },

  openEditMediaModal(mediaId) {
    const item = window.store.getMediaById(mediaId);
    if (!item) return;

    const modal = document.getElementById('media-upload-modal');
    if (!modal) return;

    document.getElementById('media-modal-title').textContent = 'Edit Media Details';
    document.getElementById('media-editing-id').value = item.id;
    document.getElementById('media-input-title').value = item.title;
    document.getElementById('media-input-category').value = item.category;
    document.getElementById('media-input-url').value = item.url;
    document.getElementById('media-input-type').value = item.mediaType || 'image';
    document.getElementById('media-input-video-url').value = item.videoUrl || '';
    document.getElementById('media-input-desc').value = item.description || '';
    document.getElementById('media-input-tags').value = (item.tags || []).join(', ');
    document.getElementById('media-input-featured').checked = !!item.featured;

    modal.classList.add('active');
  },

  handleMediaFormSubmit(form) {
    const editingId = document.getElementById('media-editing-id').value;
    const title = document.getElementById('media-input-title').value.trim();
    const category = document.getElementById('media-input-category').value;
    const url = document.getElementById('media-input-url').value.trim();
    const mediaType = document.getElementById('media-input-type').value;
    const videoUrl = document.getElementById('media-input-video-url').value.trim();
    const desc = document.getElementById('media-input-desc').value.trim();
    const tagsStr = document.getElementById('media-input-tags').value.trim();
    const featured = document.getElementById('media-input-featured').checked;

    const catNameMap = {
      'wedding-entry': 'Wedding Entry',
      'pyro-shows': 'Pyro & Fire Effects',
      'stage-decor': 'Stage Decoration',
      'birthday-party': 'Birthday Parties',
      'costume-characters': 'Costume Characters',
      'mehendi-decor': 'Mehendi Decor'
    };

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (!title || !category || !url) {
      this.showToast('Please fill in title, category, and image URL', 'error');
      return;
    }

    const payload = {
      title,
      category,
      categoryName: catNameMap[category] || 'Special Events',
      url,
      mediaType,
      videoUrl,
      description: desc,
      tags,
      featured
    };

    if (editingId) {
      window.store.updateMedia(editingId, payload);
      this.showToast('Media item updated successfully!', 'success');
    } else {
      window.store.addMedia(payload);
      this.showToast('New media added to public gallery!', 'success');
    }

    document.getElementById('media-upload-modal').classList.remove('active');
    this.renderMediaManager();
  },

  deleteMedia(mediaId) {
    if (confirm('Are you sure you want to remove this media from the gallery?')) {
      window.store.deleteMedia(mediaId);
      this.showToast('Media removed from portfolio', 'info');
      this.renderMediaManager();
    }
  },

  // -------------------------------------------------------------
  // 4. CALENDAR & BOOKINGS
  // -------------------------------------------------------------
  renderCalendar() {
    const calendarGrid = document.getElementById('admin-calendar-cells');
    const monthTitle = document.getElementById('calendar-month-display');
    if (!calendarGrid) return;

    const year = this.calendarCurrentDate.getFullYear();
    const month = this.calendarCurrentDate.getMonth();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (monthTitle) monthTitle.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month & total days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const bookings = window.store.getBookings();

    let cellsHtml = '';

    // Empty cells for previous month padding
    for (let i = 0; i < firstDayIndex; i++) {
      cellsHtml += `<div class="calendar-cell empty-cell"></div>`;
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayBookings = bookings.filter(b => b.date === dateStr);
      const hasEvent = dayBookings.length > 0;
      const todayObj = new Date();
      const isToday = (day === todayObj.getDate() && month === todayObj.getMonth() && year === todayObj.getFullYear());

      cellsHtml += `
        <div class="calendar-cell ${hasEvent ? 'has-event' : ''} ${isToday ? 'today' : ''}" onclick="AdminController.openAddBookingModal('${dateStr}')" title="Click to schedule booking on ${dateStr}">
          <div class="calendar-date-header">
            <div class="calendar-date-disc">${day}</div>
            ${hasEvent ? `<span class="calendar-event-count">✨ ${dayBookings.length} ${dayBookings.length === 1 ? 'Event' : 'Events'}</span>` : ''}
          </div>
          <div class="calendar-events-container">
            ${dayBookings.map(b => {
              const sLower = (b.service || '').toLowerCase();
              let catClass = 'wedding';
              let icon = '💍';
              if (sLower.includes('pyro') || sLower.includes('fire') || sLower.includes('spark')) { catClass = 'pyro'; icon = '🎆'; }
              else if (sLower.includes('costume') || sLower.includes('mascot') || sLower.includes('birthday')) { catClass = 'birthday'; icon = '🎭'; }
              else if (sLower.includes('entry') || sLower.includes('stage') || sLower.includes('decor')) { catClass = 'decor'; icon = '✨'; }
              return `
                <div class="calendar-event-pill ${catClass}" title="${b.clientName} - ${b.service} (${b.amount})">
                  <span class="pill-icon">${icon}</span>
                  <span class="pill-title">${b.clientName.split(' ')[0]}: ${(b.service || '').split(' ')[0]}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    calendarGrid.innerHTML = cellsHtml;

    // Render Bookings List
    const bookingsListEl = document.getElementById('admin-bookings-list');
    if (bookingsListEl) {
      if (bookings.length === 0) {
        bookingsListEl.innerHTML = `
          <div style="text-align: center; color: #64748b; padding: 3rem 1.5rem; background: #faf8f5; border-radius: 14px; border: 1.5px dashed rgba(212,175,55,0.3);">
            <div style="font-size: 2rem; margin-bottom: 6px;">📅</div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #1e2638;">No Confirmed Events</div>
            <p style="font-size: 0.76rem; margin-top: 2px;">Click "+ Add Booking" above to schedule an event.</p>
          </div>
        `;
      } else {
        const totalRevenue = bookings.reduce((sum, b) => {
          const num = parseInt((b.amount || '0').replace(/[^0-9]/g, '')) || 0;
          return sum + num;
        }, 0);

        bookingsListEl.innerHTML = `
          <div class="bookings-luxury-list-wrap">
            <div class="bookings-summary-chip">
              <span style="display: inline-flex; align-items: center; gap: 5px;">
                <span style="color: #059669; font-weight: 900;">●</span>
                <span style="font-weight: 700; color: #1e2638;">${bookings.length} Booked Events</span>
              </span>
              <span class="bookings-total-amount">₹${totalRevenue.toLocaleString('en-IN')}</span>
            </div>

            ${bookings.map(bk => {
              const initials = (bk.clientName || 'EV').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
              return `
                <div class="booking-luxury-card">
                  <div class="booking-card-main">
                    <div class="booking-avatar-disc">${initials}</div>
                    <div class="booking-info-meta">
                      <div class="booking-client-title" title="${bk.clientName}">${bk.clientName}</div>
                      <div class="booking-service-badge">✨ ${bk.service}</div>
                      <div class="booking-venue-text">📍 ${bk.venue || 'Venue TBD'}</div>
                    </div>
                  </div>

                  <div class="booking-card-bottom-strip">
                    <div class="booking-date-capsule">
                      <span>🗓️</span>
                      <span>${bk.date}</span>
                    </div>
                    
                    <div class="booking-amount-badge">${bk.amount}</div>

                    <button type="button" class="btn-booking-del" onclick="AdminController.deleteBooking('${bk.id}')" title="Delete Booking">
                      🗑️
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    }
  },

  deleteBooking(id) {
    if (confirm('Are you sure you want to remove this booking from the calendar?')) {
      window.store.deleteBooking(id);
      this.showToast('Booking removed successfully', 'info');
      this.renderCalendar();
      this.renderOverview();
    }
  },

  openAddBookingModal(prefilledDate) {
    const modal = document.getElementById('add-booking-modal');
    if (modal) {
      const form = document.getElementById('booking-add-form');
      if (form) form.reset();
      if (typeof prefilledDate === 'string' && prefilledDate) {
        document.getElementById('booking-input-date').value = prefilledDate;
      }
      modal.classList.add('active');
    }
  },

  handleAddBookingSubmit(form) {
    const clientName = document.getElementById('booking-input-client').value.trim();
    const service = document.getElementById('booking-input-service').value.trim();
    const date = document.getElementById('booking-input-date').value;
    const venue = document.getElementById('booking-input-venue').value.trim();
    const amount = document.getElementById('booking-input-amount').value.trim();

    if (!clientName || !service || !date) {
      this.showToast('Please enter client, service, and date', 'error');
      return;
    }

    window.store.addBooking({
      clientName,
      service,
      date,
      venue: venue || 'Venue TBA',
      amount: amount || 'TBD'
    });

    this.showToast('New event booking added to calendar!', 'success');
    document.getElementById('add-booking-modal').classList.remove('active');
    this.renderCalendar();
    this.renderOverview();
  },

  // -------------------------------------------------------------
  // 5. TEAM & ADMINS (SUPER ADMIN CRUD CONTROLS)
  // -------------------------------------------------------------
  renderTeam() {
    const teamGrid = document.getElementById('admin-team-grid');
    if (!teamGrid) return;

    const admins = window.store.getAdmins();
    const currentAdmin = window.store.getCurrentUser();
    const isSuperAdmin = window.store.isSuperAdmin();

    const toolbar = document.getElementById('team-action-toolbar');
    if (toolbar) {
      toolbar.innerHTML = isSuperAdmin ? `
        <button class="btn btn-gold" onclick="AdminController.openAddTeamModal()" style="display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(212,175,55,0.35);">
          <span>➕</span> Add New Team Member
        </button>
      ` : `
        <span class="badge badge-purple" style="font-size: 0.75rem; padding: 6px 12px;">🛡️ Multi-User Team Console</span>
      `;
    }

    teamGrid.className = 'team-cards-grid';
    teamGrid.innerHTML = admins.map(adm => {
      const isActive = adm.id === currentAdmin?.id;
      const isAdmSuperAdmin = adm.isSuperAdmin || adm.id === 'adm-1' || adm.accessLevel === 'Super Admin' || adm.email === 'mauryashivamkumar841@gmail.com';
      const isOps = adm.accessLevel === 'Operations Manager' || adm.email === 'mauryashivamkumar1264@gmail.com';
      const isDecor = adm.accessLevel === 'Decor Specialist' || adm.email === 'yogeshsaini7172@gmail.com';

      const roleBadgeClass = isAdmSuperAdmin ? 'role-super-admin' : (isOps ? 'role-ops' : 'role-decor');
      const roleLabel = isAdmSuperAdmin ? '👑 Super Admin' : (isOps ? '⚙️ Operations Manager' : '🎨 Decor Specialist');

      const permissions = isAdmSuperAdmin
        ? ['Overview', 'Inquiries CRM', 'Media Manager', 'Bookings Calendar', 'Team Portal']
        : (isOps ? ['Overview', 'Inquiries CRM', 'Bookings Calendar'] : ['Overview', 'Inquiries CRM', 'Media Manager']);

      return `
        <div class="team-card ${isActive ? 'active-session-card' : ''}">
          <div class="team-card-header">
            <span class="team-role-pill ${roleBadgeClass}">${roleLabel}</span>
            ${isActive 
              ? '<span class="team-active-indicator">🟢 Active Session</span>' 
              : '<span class="team-offline-indicator">⚪ Registered</span>'
            }
          </div>

          <div class="team-profile-section">
            <div class="team-avatar-frame">
              <div class="team-avatar-inner">${adm.avatar || 'AD'}</div>
            </div>
            <div class="team-info-block">
              <h4 class="team-member-name">${adm.name}</h4>
              <div class="team-member-role">${adm.role}</div>
            </div>
          </div>

          <div class="team-meta-box">
            <div class="team-meta-row">
              <span class="team-meta-icon">✉️</span>
              <span class="team-meta-val" title="${adm.email}">${adm.email}</span>
            </div>
            ${adm.phone ? `
              <div class="team-meta-row">
                <span class="team-meta-icon">📞</span>
                <span class="team-meta-val">${adm.phone}</span>
              </div>
            ` : ''}
          </div>

          <div class="team-access-section">
            <div class="team-access-title">Permitted Modules:</div>
            <div class="team-access-chips">
              ${permissions.map(p => `<span class="access-chip">✓ ${p}</span>`).join('')}
            </div>
          </div>

          <div class="team-card-footer">
            ${isActive ? `
              <div class="team-current-user-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Current Active Session
              </div>
            ` : (isSuperAdmin && adm.id !== 'adm-1' && !isAdmSuperAdmin ? `
              <button class="btn-delete-team-card" onclick="AdminController.handleDeleteTeamMember('${adm.id}', '${adm.name.replace(/'/g, "\\'")}')">
                <span>🗑️</span> Remove Partner Account
              </button>
            ` : `
              <div class="team-protected-tag">🔒 Core System Administrator</div>
            `)}
          </div>
        </div>
      `;
    }).join('');
  },

  openAddTeamModal() {
    const modal = document.getElementById('add-team-member-modal');
    if (modal) modal.classList.add('active');
  },

  handleAddTeamMemberSubmit(form) {
    const name = document.getElementById('new-team-name').value.trim();
    const role = document.getElementById('new-team-role').value.trim();
    const email = document.getElementById('new-team-email').value.trim();
    const phone = document.getElementById('new-team-phone').value.trim();
    const accessLevel = document.getElementById('new-team-access').value;
    const password = document.getElementById('new-team-password').value.trim() || 'admin';

    if (!name || !email) {
      this.showToast('Please enter name and email.', 'error');
      return;
    }

    window.store.addAdmin({
      name,
      role,
      email,
      phone,
      accessLevel,
      isSuperAdmin: accessLevel === 'Super Admin',
      password
    });

    this.showToast(`Team member "${name}" created successfully!`, 'success');
    document.getElementById('add-team-member-modal').classList.remove('active');
    form.reset();
    this.renderTeam();
  },

  handleDeleteTeamMember(adminId, adminName) {
    if (confirm(`Are you sure you want to delete "${adminName}" from the admin portal?`)) {
      const res = window.store.deleteAdmin(adminId);
      if (res.success) {
        this.showToast(res.message, 'success');
        this.renderTeam();
      } else {
        this.showToast(res.message, 'error');
      }
    }
  },

  openProfileModal() {
    const user = window.store.getCurrentUser();
    if (!user) return;

    const modal = document.getElementById('admin-profile-modal');
    if (!modal) return;

    const avatarEl = document.getElementById('profile-modal-avatar');
    const nameEl = document.getElementById('profile-modal-title-name');
    const roleEl = document.getElementById('profile-modal-title-role');

    if (avatarEl) avatarEl.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = `👑 ${user.role}`;

    const inputName = document.getElementById('profile-input-name');
    const inputRole = document.getElementById('profile-input-role');
    const inputEmail = document.getElementById('profile-input-email');
    const inputPhone = document.getElementById('profile-input-phone');
    const inputPassword = document.getElementById('profile-input-password');

    if (inputName) inputName.value = user.name || '';
    if (inputRole) inputRole.value = user.role || '';
    if (inputEmail) inputEmail.value = user.email || '';
    if (inputPhone) inputPhone.value = user.phone || '';
    if (inputPassword) inputPassword.value = '';

    modal.classList.add('active');
  },

  handleProfileEditSubmit(form) {
    const name = document.getElementById('profile-input-name').value.trim();
    const role = document.getElementById('profile-input-role').value.trim();
    const email = document.getElementById('profile-input-email').value.trim();
    const phone = document.getElementById('profile-input-phone').value.trim();
    const password = document.getElementById('profile-input-password').value.trim();

    if (!name || !role || !email) {
      this.showToast('Please fill all required fields.', 'warning');
      return;
    }

    const updatePayload = { name, role, email, phone };
    if (password) {
      updatePayload.password = password;
    }

    const updatedUser = window.store.updateCurrentAdmin(updatePayload);
    if (updatedUser) {
      this.showToast('Profile updated successfully!', 'success');
      document.getElementById('admin-profile-modal').classList.remove('active');
      this.renderUserInfo();
      this.renderTeam();
    }
  },

  // -------------------------------------------------------------
  // EVENT BINDINGS
  // -------------------------------------------------------------
  bindAuthEvents() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailOrPhone = document.getElementById('admin-login-email').value;
        const password = document.getElementById('admin-login-password').value;

        const res = window.store.login(emailOrPhone, password);
        if (res.success) {
          this.showToast(`Welcome back, ${res.user.name}!`, 'success');
          this.render();
        } else {
          this.showToast(res.message, 'error');
        }
      });
    }

    // Password Visibility Toggle
    const passToggleBtn = document.getElementById('toggle-password-visibility');
    if (passToggleBtn) {
      passToggleBtn.addEventListener('click', () => {
        const passInput = document.getElementById('admin-login-password');
        const showIcon = passToggleBtn.querySelector('.eye-icon-show');
        const hideIcon = passToggleBtn.querySelector('.eye-icon-hide');
        if (passInput) {
          const isPass = passInput.type === 'password';
          passInput.type = isPass ? 'text' : 'password';
          if (showIcon) showIcon.style.display = isPass ? 'none' : 'block';
          if (hideIcon) hideIcon.style.display = isPass ? 'block' : 'none';
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.store.logout();
        this.showToast('Logged out of Admin Dashboard', 'info');
        this.render();
      });
    }
  },

  bindNavigation() {
    const sidebar = document.querySelector('.admin-sidebar');
    const backdrop = document.getElementById('admin-sidebar-backdrop');
    const mobileToggle = document.getElementById('admin-mobile-toggle');
    const mobileClose = document.getElementById('admin-sidebar-close-btn');

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (backdrop) backdrop.classList.toggle('active');
      });
    }

    if (mobileClose && sidebar) {
      mobileClose.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
      });
    }

    if (backdrop && sidebar) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    }

    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        window.location.hash = `#${tab}`;
        this.switchTab(tab);

        // Auto-close sidebar on mobile after tab select
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
      });
    });

    // Inquiries status filter pills
    document.querySelectorAll('.inquiry-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.inquiry-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.inquiryFilterStatus = pill.getAttribute('data-status');
        this.renderInquiries();
      });
    });

    // Inquiries search
    const searchInput = document.getElementById('inquiries-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.inquirySearchQuery = e.target.value;
        this.renderInquiries();
      });
    }

    // Calendar month navigation
    const prevMonthBtn = document.getElementById('calendar-prev-month');
    const nextMonthBtn = document.getElementById('calendar-next-month');
    const todayBtn = document.getElementById('calendar-today-btn');

    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.calendarCurrentDate = new Date();
        this.renderCalendar();
      });
    }

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        this.calendarCurrentDate.setMonth(this.calendarCurrentDate.getMonth() - 1);
        this.renderCalendar();
      });
    }
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        this.calendarCurrentDate.setMonth(this.calendarCurrentDate.getMonth() + 1);
        this.renderCalendar();
      });
    }

    // Dismiss floating custom status menus on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-status-pill-wrap')) {
        document.querySelectorAll('.custom-status-menu').forEach(m => m.classList.remove('show'));
      }
    });
  },

  bindCrudEvents() {
    // Media Upload Form
    const mediaForm = document.getElementById('media-upload-form');
    if (mediaForm) {
      mediaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleMediaFormSubmit(mediaForm);
      });
    }

    // Sample Preset Media Buttons inside Upload Modal
    document.querySelectorAll('.preset-media-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('media-input-url').value = btn.getAttribute('data-url');
        document.getElementById('media-input-title').value = btn.getAttribute('data-title');
        document.getElementById('media-input-category').value = btn.getAttribute('data-cat');
        document.getElementById('media-input-tags').value = btn.getAttribute('data-tags');
      });
    });

    // Sample Preset Booking Buttons inside Add Booking Modal
    document.querySelectorAll('.preset-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('booking-input-client').value = btn.getAttribute('data-client');
        document.getElementById('booking-input-service').value = btn.getAttribute('data-service');
        document.getElementById('booking-input-amount').value = btn.getAttribute('data-amount');
        document.getElementById('booking-input-venue').value = btn.getAttribute('data-venue');
      });
    });

    // Booking Add Form
    const bookingForm = document.getElementById('booking-add-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddBookingSubmit(bookingForm);
      });
    }

    // Profile Edit Form
    const profileForm = document.getElementById('admin-profile-edit-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileEditSubmit(profileForm);
      });
    }

    // Add Team Member Form
    const addTeamForm = document.getElementById('add-team-member-form');
    if (addTeamForm) {
      addTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddTeamMemberSubmit(addTeamForm);
      });
    }

    // Close Modals on backdrop click or close button
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn')) {
          modal.classList.remove('active');
        }
      });
    });

    // ESC key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
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
