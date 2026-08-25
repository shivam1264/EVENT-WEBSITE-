/**
 * VibrantVows & Spark Events - Reactive Data Store
 * Manages all persistent state: Media CMS, Inquiries CRM, Bookings Calendar & Admin Auth.
 */

const STORAGE_KEYS = {
  MEDIA: 'vv_media_items_v2',
  INQUIRIES: 'vv_inquiries_v1',
  BOOKINGS: 'vv_bookings_v1',
  ADMINS: 'vv_admins_v1',
  AUTH: 'vv_auth_session_v1'
};

// Initial Seed Data matching Visual Showcase Reference
const INITIAL_MEDIA = [
  {
    id: 'med-1',
    title: 'Wedding Entries',
    subtitle: 'Magical moments as love stories begin',
    category: 'wedding-entry',
    categoryName: 'Wedding Entries',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="6" r="2.5"/><path d="M10 3.5l2 2 2-2"/></svg>`,
    description: 'Breathtaking royal wedding stage featuring cascading floral canopy, carved golden pillars, and grand couple entry styling.',
    tags: ['Baraat', 'Wedding Mandap', 'Royal Stage'],
    featured: true,
    createdAt: '2026-08-10'
  },
  {
    id: 'med-2',
    title: 'Pyro & SFX Shows',
    subtitle: 'Spectacular effects that light up the night',
    category: 'pyro-shows',
    categoryName: 'Pyro & SFX Shows',
    mediaType: 'image',
    url: './creack fires.png',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`,
    description: 'Indoor-certified smokeless cold pyro fountains for the grand couple entry and stage blast moment.',
    tags: ['Cold Pyro', 'Stage Blast', 'Indoor Safe'],
    featured: true,
    createdAt: '2026-08-12'
  },
  {
    id: 'med-3',
    title: 'Stage & Mandaps',
    subtitle: 'Grand setups for unforgettable vows',
    category: 'stage-decor',
    categoryName: 'Stage & Mandaps',
    mediaType: 'image',
    url: './wending decoration.png',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6a3 3 0 0 1 6 0v6"/></svg>`,
    description: 'Bespoke grand mandaps and reception stages adorned with imported blooms, gold filigree pillars, and dynamic ambient lighting.',
    tags: ['Royal Mandap', 'Stage Decor', 'Floral Canopy'],
    featured: true,
    createdAt: '2026-08-13'
  },
  {
    id: 'med-4',
    title: 'Wedding Celebrations',
    subtitle: 'Candid smiles, happy tears & endless joy',
    category: 'wedding-entry',
    categoryName: 'Wedding Celebrations',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    description: 'Candid moments of pure joy, grand celebration walks, and memories crafted to cherish forever.',
    tags: ['Celebrations', 'Baraat', 'Candid'],
    featured: true,
    createdAt: '2026-08-14'
  },
  {
    id: 'med-5',
    title: 'Creative Shots',
    subtitle: 'Turning moments into timeless art',
    category: 'costume-characters',
    categoryName: 'Creative Shots',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    description: 'Cinematic perspectives capturing the essence of each celebration with artistic depth.',
    tags: ['Creative', 'Cinematic', 'Artistic'],
    featured: true,
    createdAt: '2026-08-15'
  },
  {
    id: 'med-6',
    title: 'Birthday Themes',
    subtitle: 'Unique themes for special celebrations',
    category: 'birthday-party',
    categoryName: 'Birthday Themes',
    mediaType: 'image',
    url: './Birthday party decoration.png',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><line x1="2" y1="21" x2="22" y2="21"/><circle cx="12" cy="4" r="1.5"/><line x1="12" y1="6" x2="12" y2="11"/></svg>`,
    description: 'Customized luxury birthday themes with organic balloon garlands, neon signage, and photo booths.',
    tags: ['Birthday Party', 'Theme Decor', 'Kids Events'],
    featured: true,
    createdAt: '2026-08-16'
  },
  {
    id: 'med-7',
    title: 'Confetti & Special Effects',
    subtitle: 'Adding magic to every celebration',
    category: 'pyro-shows',
    categoryName: 'Special Effects',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    description: 'High-power CO2 jets, metallic confetti blasts, and atmospheric special effects for crowd hype.',
    tags: ['Confetti', 'SFX', 'Stage Blast'],
    featured: true,
    spanWide: true,
    createdAt: '2026-08-17'
  },
  {
    id: 'med-8',
    title: 'Elegant Decor',
    subtitle: 'Beautiful details that define perfection',
    category: 'mehendi-decor',
    categoryName: 'Elegant Decor',
    mediaType: 'image',
    url: './haldi%20%26%20mehadi.png',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C12 22 4 16 4 10a8 8 0 0 1 16 0c0 6-8 12-8 12Z"/><path d="M12 6v8M8 10l4 4 4-4"/></svg>`,
    description: 'Immaculate floral arrangements, table centerpieces, and delicate aesthetic accents.',
    tags: ['Floral Decor', 'Aisle Design', 'Luxury Details'],
    featured: true,
    spanWide: true,
    createdAt: '2026-08-18'
  }
];

const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    customerName: 'Aarav & Simran Sharma',
    phone: '+91 98201 44521',
    email: 'aarav.sharma@example.com',
    eventType: 'Wedding Entry & Stage Decor',
    eventDate: '2026-11-18',
    city: 'Mumbai',
    guestCount: '450',
    message: 'Looking for a royal floral mandap stage decor and an 8-point cold pyro spark entry for the groom baraat.',
    status: 'New',
    createdAt: '2026-08-22 14:30',
    notes: 'Bride specifically requested white and blush pink roses.'
  },
  {
    id: 'inq-102',
    customerName: 'Vikram Malhotra',
    phone: '+91 98110 88231',
    email: 'vikram.m@example.com',
    eventType: 'Pyro & Fire Effects Shows',
    eventDate: '2026-10-05',
    city: 'Pune',
    guestCount: '300',
    message: 'Need indoor-safe cold spark fountains and heavy dry ice fog for couple entrance and sangeet night.',
    status: 'Contacted',
    createdAt: '2026-08-21 11:15',
    notes: 'Called Vikram on 22nd Aug. Sent portfolio video links via WhatsApp. Awaiting venue permission.'
  },
  {
    id: 'inq-103',
    customerName: 'Pooja Deshmukh',
    phone: '+91 97654 32109',
    email: 'pooja.d@example.com',
    eventType: 'Costume Characters & Birthday',
    eventDate: '2026-09-12',
    city: 'Thane',
    guestCount: '80',
    message: 'Son is turning 6, loves superhero & King Kong theme. Want gorilla mascot entry + superhero balloon backdrop.',
    status: 'Booked',
    createdAt: '2026-08-20 09:40',
    notes: 'Advance received ₹15,000. Gorilla mascot performer booked for 6:30 PM slot.'
  },
  {
    id: 'inq-104',
    customerName: 'Neha & Kabir Singhania',
    phone: '+91 99887 76655',
    email: 'singhania.events@example.com',
    eventType: 'Mehendi Function Decor',
    eventDate: '2026-12-02',
    city: 'Goa',
    guestCount: '200',
    message: 'Destination wedding in Goa. Need colorful bohemian pool-side Mehendi setup with floral jhula.',
    status: 'New',
    createdAt: '2026-08-23 08:15',
    notes: ''
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'bk-1',
    clientName: 'Pooja Deshmukh (Advik 6th Birthday)',
    service: 'Costume Mascot + Neon Balloon Decor',
    date: '2026-09-12',
    venue: 'Emerald Club, Thane',
    amount: '₹38,000',
    status: 'Confirmed'
  },
  {
    id: 'bk-2',
    clientName: 'Kapoor & Mehta Sangeet',
    service: 'Pyro Cold Sparks & Dry Ice Fog',
    date: '2026-09-26',
    venue: 'Taj Lands End, Bandra',
    amount: '₹65,000',
    status: 'Confirmed'
  },
  {
    id: 'bk-3',
    clientName: 'Rohan & Ananya Wedding',
    service: 'Royal Floral Stage & Baraat Entry',
    date: '2026-10-15',
    venue: 'JW Marriott, Juhu',
    amount: '₹1,85,000',
    status: 'Confirmed'
  }
];

const INITIAL_ADMINS = [
  {
    id: 'adm-1',
    name: 'Shivam Maurya',
    role: 'Founder & Head of Production',
    email: 'mauryashivamkumar841@gmail.com',
    password: 'admin',
    avatar: 'SM',
    isSuperAdmin: true,
    accessLevel: 'Super Admin'
  },
  {
    id: 'adm-2',
    name: 'Shivam Kumar',
    role: 'Operations Partner & Pyro Lead',
    email: 'mauryashivamkumar1264@gmail.com',
    password: 'admin',
    avatar: 'SK',
    isSuperAdmin: false,
    accessLevel: 'Operations Manager'
  },
  {
    id: 'adm-3',
    name: 'Yogesh Saini',
    role: 'Decor & Event Styling Partner',
    email: 'yogeshsaini7172@gmail.com',
    password: 'admin',
    avatar: 'YS',
    isSuperAdmin: false,
    accessLevel: 'Decor Specialist'
  }
];

class DataStore {
  constructor() {
    this.subscribers = [];
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    const storedAdmins = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!storedAdmins || storedAdmins.includes('owner@vibrantvows.com')) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      const authUser = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (authUser && authUser.includes('owner@vibrantvows.com')) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(INITIAL_ADMINS[0]));
      }
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(event, payload) {
    this.subscribers.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error('Store subscriber error:', err);
      }
    });
  }

  // --- MEDIA CRUD ---
  getMedia() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDIA)) || [];
    } catch {
      return INITIAL_MEDIA;
    }
  }

  getMediaById(id) {
    return this.getMedia().find(item => item.id === id);
  }

  addMedia(item) {
    const media = this.getMedia();
    const newItem = {
      id: 'med-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      ...item
    };
    media.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
    this.notify('media_changed', { action: 'add', item: newItem });
    return newItem;
  }

  updateMedia(id, updates) {
    const media = this.getMedia();
    const index = media.findIndex(m => m.id === id);
    if (index !== -1) {
      media[index] = { ...media[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
      this.notify('media_changed', { action: 'update', item: media[index] });
      return media[index];
    }
    return null;
  }

  deleteMedia(id) {
    let media = this.getMedia();
    media = media.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
    this.notify('media_changed', { action: 'delete', id });
  }

  // --- INQUIRIES CRUD ---
  getInquiries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES)) || [];
    } catch {
      return INITIAL_INQUIRIES;
    }
  }

  addInquiry(inquiryData) {
    const inquiries = this.getInquiries();
    const dateObj = new Date();
    const timeFormatted = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')} ${String(dateObj.getHours()).padStart(2,'0')}:${String(dateObj.getMinutes()).padStart(2,'0')}`;
    
    const newInquiry = {
      id: 'inq-' + Math.floor(100 + Math.random() * 900),
      status: 'New',
      createdAt: timeFormatted,
      notes: '',
      ...inquiryData
    };

    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.notify('inquiries_changed', { action: 'add', inquiry: newInquiry });
    return newInquiry;
  }

  updateInquiryStatus(id, newStatus, notes) {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex(inq => inq.id === id);
    if (index !== -1) {
      inquiries[index].status = newStatus;
      if (notes !== undefined) {
        inquiries[index].notes = notes;
      }
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      this.notify('inquiries_changed', { action: 'status_update', inquiry: inquiries[index] });

      // Automatically sync with Calendar Bookings when marked "Booked"
      if (newStatus === 'Booked') {
        const inq = inquiries[index];
        const bookings = this.getBookings();
        const existingBk = bookings.find(b => (b.inquiryId === inq.id) || (b.clientName === inq.customerName && b.date === inq.eventDate));
        if (!existingBk) {
          this.addBooking({
            inquiryId: inq.id,
            clientName: inq.customerName,
            service: inq.eventType,
            date: inq.eventDate,
            venue: inq.city ? `${inq.city} (${inq.guestCount || 'Guests'} PAX)` : 'Venue TBA',
            amount: inq.budget || '₹1,20,000',
            status: 'Confirmed'
          });
        }
      }

      return inquiries[index];
    }
    return null;
  }

  deleteInquiry(id) {
    let inquiries = this.getInquiries();
    inquiries = inquiries.filter(inq => inq.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.notify('inquiries_changed', { action: 'delete', id });
  }

  // --- BOOKINGS CRUD ---
  getBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  addBooking(booking) {
    const bookings = this.getBookings();
    const newBk = {
      id: 'bk-' + Date.now(),
      status: 'Confirmed',
      ...booking
    };
    bookings.push(newBk);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify('bookings_changed', { action: 'add', booking: newBk });
    return newBk;
  }

  deleteBooking(id) {
    let bookings = this.getBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify('bookings_changed', { action: 'delete', id });
  }

  // --- ADMIN AUTH & PARTNERS ---
  getAdmins() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS)) || INITIAL_ADMINS;
    } catch {
      return INITIAL_ADMINS;
    }
  }

  addAdmin(admin) {
    const admins = this.getAdmins();
    const initials = admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';
    const newAdmin = {
      id: 'adm-' + Date.now(),
      avatar: initials,
      isSuperAdmin: !!admin.isSuperAdmin,
      accessLevel: admin.accessLevel || 'Operations Manager',
      password: admin.password || 'admin',
      ...admin
    };
    admins.push(newAdmin);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    this.notify('admin_created', { admin: newAdmin });
    return newAdmin;
  }

  deleteAdmin(adminId) {
    let admins = this.getAdmins();
    const currentUser = this.getCurrentUser();
    if (adminId === currentUser?.id) {
      return { success: false, message: 'You cannot delete your own currently active account.' };
    }
    const adminToDelete = admins.find(a => a.id === adminId);
    if (!adminToDelete) {
      return { success: false, message: 'Team member not found.' };
    }
    if (adminToDelete.isSuperAdmin || adminToDelete.id === 'adm-1') {
      return { success: false, message: 'Founder / Super Admin account cannot be deleted.' };
    }
    admins = admins.filter(a => a.id !== adminId);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    this.notify('admin_deleted', { adminId });
    return { success: true, message: `Team member "${adminToDelete.name}" deleted successfully.` };
  }

  isSuperAdmin() {
    const current = this.getCurrentUser();
    return current && (current.id === 'adm-1' || current.isSuperAdmin || current.email === 'mauryashivamkumar841@gmail.com');
  }

  login(emailOrPhone, password) {
    const admins = this.getAdmins();
    const user = admins.find(a => 
      (a.email.toLowerCase() === emailOrPhone.toLowerCase().trim() || (a.phone && a.phone === emailOrPhone.trim())) && 
      (a.password === password)
    );
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
      this.notify('auth_changed', { loggedIn: true, user });
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials. Please enter your registered email/phone and password.' };
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH));
    } catch {
      return null;
    }
  }

  updateCurrentAdmin(updatedData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const admins = this.getAdmins();
    const index = admins.findIndex(a => a.id === currentUser.id);

    const initials = (updatedData.name || currentUser.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

    const mergedUser = {
      ...currentUser,
      ...updatedData,
      avatar: initials
    };

    if (index !== -1) {
      admins[index] = mergedUser;
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    }

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(mergedUser));
    this.notify('auth_changed', { loggedIn: true, user: mergedUser });
    return mergedUser;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    this.notify('auth_changed', { loggedIn: false });
  }

  // Reset all to demo defaults
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
    this.notify('store_reset', {});
  }
}

// Global singleton instance
window.store = new DataStore();
