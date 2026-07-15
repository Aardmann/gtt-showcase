// ===== PREVIEW GALLERY =====
const previewData = [
    { title:"Home Screen", desc:"Simple wide map view", src:"../assets/phone-images/homescreen.PNG", alt:"Home Screen" },
    { title:"Route Search & Recents", desc:"Search for routes across Ghana", src:"../assets/phone-images/findroutes.PNG", alt:"Route Search" },
    { title:"Live Navigation", desc:"Real-time tracking with stop alerts", src:"../assets/phone-images/foundroutes.jpeg", alt:"Navigation" },
    { title:"Saved Routes", desc:"Save and quickly access frequent journeys", src:"../assets/phone-images/savedroutes.PNG", alt:"Saved Routes" },
    { title:"Create Personal Routes", desc:"Create & share custom routes", src:"../assets/phone-images/createroute.PNG", alt:"Custom Routes" }
];
let currentPreview = 0;

function openPreview(index) {
    currentPreview = index;
    updatePreview();
    document.getElementById('previewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}
function changePreview(dir) {
    currentPreview = (currentPreview + dir + previewData.length) % previewData.length;
    updatePreview();
}
function updatePreview() {
    const d = previewData[currentPreview];
    document.getElementById('previewContent').innerHTML =
        '<div class="phone-screen aspect-[9/19]"><div class="phone-notch"></div><img src="' + d.src + '" alt="' + d.alt + '" class="w-full h-full object-cover"></div>';
    document.getElementById('previewTitle').textContent = d.title;
    document.getElementById('previewDesc').textContent = d.desc;
}

// ===== THEME =====
function toggleTheme() {
    const html = document.getElementById('html-root');
    const icon = document.getElementById('themeIcon');
    const cur = html.getAttribute('data-theme');
    if (cur === 'dark') {
        html.setAttribute('data-theme','light');
        icon.className = 'fas fa-moon text-slate-500 text-sm sm:text-base';
        localStorage.setItem('gtt-theme','light');
    } else {
        html.setAttribute('data-theme','dark');
        icon.className = 'fas fa-sun text-yellow-400 text-sm sm:text-base';
        localStorage.setItem('gtt-theme','dark');
    }
    updateNavScrollStyle();
}

function updateNavScrollStyle() {
    const theme = document.getElementById('html-root').getAttribute('data-theme');
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        if (theme === 'light') {
            nav.style.background = 'rgba(255,255,255,0.97)';
            nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        } else {
            nav.style.background = 'rgba(2,6,23,0.97)';
            nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
        }
    }
}

// Load saved theme
(function() {
    const saved = localStorage.getItem('gtt-theme') || 'dark';
    document.getElementById('html-root').setAttribute('data-theme', saved);
    const icon = document.getElementById('themeIcon');
    if (saved === 'light') {
        icon.className = 'fas fa-moon text-slate-500 text-sm sm:text-base';
    }
})();

// ===== MODAL MANAGEMENT =====
let selectedBeta = 'beta5';
let selectedPlatform = 'android';

window.addEventListener('load', () => {
    setTimeout(() => {
        if (!sessionStorage.getItem('hasSeenWelcome')) {
            document.getElementById('welcomeModal').classList.add('active');
        }
    }, 1000);
});

function closeWelcomeModal() {
    document.getElementById('welcomeModal').classList.remove('active');
    sessionStorage.setItem('hasSeenWelcome','true');
}

function openDownloadModal(platform) {
    document.getElementById('downloadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    selectPlatform(platform || 'android');
}

function closeDownloadModal() {
    document.getElementById('downloadModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function selectPlatform(platform) {
    selectedPlatform = platform;
    // Tab buttons
    document.querySelectorAll('.platform-tab-btn').forEach(b => {
        b.classList.remove('active-tab','bg-purple-600','text-white');
        b.classList.add('bg-slate-800','text-gray-300');
    });
    const activeTab = document.getElementById('tab-' + platform);
    if (activeTab) {
        activeTab.classList.add('active-tab','bg-purple-600','text-white');
        activeTab.classList.remove('bg-slate-800','text-gray-300');
    }
    // Show/hide sections
    document.getElementById('androidDetails').classList.toggle('hidden', platform !== 'android');
    document.getElementById('iosDetails').classList.toggle('hidden', platform !== 'ios');
    document.getElementById('webDetails').classList.toggle('hidden', platform !== 'web');
    document.getElementById('downloadActions').classList.toggle('hidden', platform !== 'android');

    // Platform card highlight
    document.querySelectorAll('.platform-card').forEach(c => {
        c.classList.remove('border-green-500','border-purple-500','border-gray-400');
    });
    const activeCard = document.querySelector('.platform-card[data-platform="' + platform + '"]');
    if (activeCard) {
        if (platform === 'android') activeCard.classList.add('border-green-500');
        if (platform === 'web') activeCard.classList.add('border-purple-500');
        if (platform === 'ios') activeCard.classList.add('border-gray-400');
    }
}

let fileSize = '92.7';
document.getElementById('fileSize').textContent = 'Size: '+fileSize + ' MB';

function selectBeta(version) {
    if (['beta1','beta2','beta3'].includes(version)) {
        showToast('Unavailable','This beta version is no longer available.');
        return;
    }
    if (version === 'beta4') {
        showToast('Beta 4 - May not have new features.', 'Consider downloading Beta 5 when it becomes available.');
    }
    selectedBeta = version;
    document.querySelectorAll('.beta-version-card').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const names = { beta4:'Beta 4', beta5:'Beta 5' };
    document.getElementById('selectedVersion').textContent = names[version] || version;
}

function startDownload() {
    if (selectedBeta == 'beta5') {
        showToast('Beta 5 unavailable', 'Beta 5 is currently unavailable. Will be available in the 72 hours. Please select a Beta 4.');
        return;
    }
    const urls = {
        beta4: 'https://drive.google.com/file/d/1EWc3IU3zlIrNCTp6qI6oVw02hy-rnvR9/view?usp=drive_link',
        beta5: ''
    };
    const versionNames = { beta4:'Beta 4', beta5:'Beta 5' };

    if (!urls[selectedBeta]) {
        setTimeout(() => showToast('Version Unavailable', 'This version is not available. Please select a different version.'), 8000);
        return;
    }

    const url  = urls[selectedBeta];
    const name = versionNames[selectedBeta];
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GhanaTrotroTransit-' + name.replace(/\s+/g,'-') + '.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Download Started', 'GhanaTrotroTransit ' + name + ' is downloading. Redirecting to routes page...');
    setTimeout(() => window.open('https://gtt.nxnx.tech/routes-you-can-find','_blank'), 5000);
    closeDownloadModal();
}

// ===== NAVBAR =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const theme = document.getElementById('html-root').getAttribute('data-theme');
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = theme === 'light' ? '0 2px 20px rgba(0,0,0,0.08)' : '0 2px 30px rgba(0,0,0,0.4)';
        navbar.style.background = theme === 'light' ? 'rgba(255,255,255,0.97)' : 'rgba(2,6,23,0.97)';
    } else {
        navbar.classList.remove('nav-scrolled');
        navbar.style.background = '';
        navbar.style.boxShadow = '';
        navbar.style.backdropFilter = '';
    }
});

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

// ===== TOAST =====
function showToast(title, message) {
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;
    document.getElementById('notificationToast').classList.add('show');
    setTimeout(hideToast, 5000);
}
function hideToast() {
    document.getElementById('notificationToast').classList.remove('show');
}

// ===== VIDEO =====
const video = document.getElementById('demoVideo');
const playButton = document.getElementById('playButton');

function toggleVideo() {
    if (video.paused) {
        video.play();
        playButton.style.opacity = '0';
    } else {
        video.pause();
        playButton.style.opacity = '1';
    }
}
if (video) {
    video.addEventListener('click', toggleVideo);
    video.addEventListener('ended', () => { playButton.style.opacity = '1'; });
}

// ===== FEEDBACK -> DB (reports table) =====
async function sendFeedbackToDb(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('userMessage').value.trim();

    const submitBtn = document.getElementById('feedbackSubmitBtn');
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    try {
        const { error } = await submitReport({ name, type, message });
        if (error) throw error;

        document.getElementById('feedbackForm').reset();
        showToast('Feedback Sent!', 'Thanks for helping us improve Ghana Trotro Transit.');
    } catch (err) {
        console.error('Error submitting feedback:', err);
        showToast('Something Went Wrong', 'Could not send your feedback. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
    }
}

// ===== SMOOTH SCROLL + CLOSE MENU =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            t.scrollIntoView({ behavior:'smooth', block:'start' });
            document.getElementById('mobileMenu').classList.add('hidden');
        }
    });
});

// ===== KEYBOARD & BACKDROP =====
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeWelcomeModal(); closeDownloadModal(); closePreview(); }
});
document.getElementById('welcomeModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeWelcomeModal(); });
document.getElementById('downloadModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeDownloadModal(); });
document.getElementById('previewModal').addEventListener('click', e => { if (e.target === e.currentTarget) closePreview(); });

// Init tab highlight on page load
document.getElementById('tab-android').classList.add('active-tab','bg-purple-600','text-white');
document.getElementById('tab-android').classList.remove('bg-slate-800','text-gray-300');

function yearUpdate() {
    const yearSpan = document.getElementById('currentYear');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}
yearUpdate();

// ===== MOBILE CAROUSEL SYSTEM =====
class MobileCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.mobile-carousel-track');
        this.cards = container.querySelectorAll('.mobile-carousel-card');
        this.dotsContainer = container.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        this.createDots();
        this.updateDimensions();
        this.bindEvents();
        this.startAutoPlay();
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        this.cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateDimensions() {
        if (this.cards.length === 0) return;
        this.cardWidth = this.cards[0].offsetWidth;
    }

    goTo(index) {
        if (index < 0) index = this.cards.length - 1;
        if (index >= this.cards.length) index = 0;
        this.currentIndex = index;
        this.track.style.transform = 'translateX(-' + (index * this.cardWidth) + 'px)';
        this.updateDots();
        this.resetAutoPlay();
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    bindEvents() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.track.style.transition = 'none';
            this.stopAutoPlay();
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            this.currentX = e.touches[0].clientX;
            const diff = this.currentX - this.startX;
            const offset = -(this.currentIndex * this.cardWidth) + diff;
            this.track.style.transform = 'translateX(' + offset + 'px)';
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            const diff = this.currentX - this.startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.prev();
                else this.next();
            } else {
                this.goTo(this.currentIndex);
            }
            this.startAutoPlay();
        });

        // Mouse events for desktop testing
        this.track.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.track.style.transition = 'none';
            this.stopAutoPlay();
        });

        this.track.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.currentX = e.clientX;
            const diff = this.currentX - this.startX;
            const offset = -(this.currentIndex * this.cardWidth) + diff;
            this.track.style.transform = 'translateX(' + offset + 'px)';
        });

        this.track.addEventListener('mouseup', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            const diff = this.currentX - this.startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.prev();
                else this.next();
            } else {
                this.goTo(this.currentIndex);
            }
            this.startAutoPlay();
        });

        this.track.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                this.goTo(this.currentIndex);
                this.startAutoPlay();
            }
        });

        // Resize
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.goTo(this.currentIndex);
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize all mobile carousels
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.mobile-carousel-container');
    carousels.forEach(container => {
        new MobileCarousel(container);
    });
});