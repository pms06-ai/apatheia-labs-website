// Modal content loaded from external JSON
let MODAL_CONTENT = {};

// Modal Controller
const Modal = {
  overlay: null,
  container: null,
  closeBtn: null,
  closeBtnFooter: null,
  _boundEscapeHandler: null,
  _boundDelegateClick: null,
  _boundDelegateKeydown: null,
  _boundBackdropClick: null,

  init() {
    this.overlay = document.getElementById('modal-overlay');
    if (!this.overlay) return;

    this.container = this.overlay.querySelector('.modal-container');
    this.closeBtn = this.overlay.querySelector('.modal-close');
    this.closeBtnFooter = this.overlay.querySelector('.modal-close-btn');

    this.bindEvents();
  },

  bindEvents() {
    const closeHandler = () => this.close();

    // Close button clicks
    this.closeBtn.addEventListener('click', closeHandler);
    this.closeBtnFooter.addEventListener('click', closeHandler);

    // Backdrop click
    this._boundBackdropClick = (e) => {
      if (e.target === this.overlay) this.close();
    };
    this.overlay.addEventListener('click', this._boundBackdropClick);

    // Escape key
    this._boundEscapeHandler = (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.close();
      }
    };
    document.addEventListener('keydown', this._boundEscapeHandler);

    // Card triggers - using event delegation
    this._boundDelegateClick = (e) => {
      const trigger = e.target.closest('[data-modal]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const size = trigger.dataset.modalSize || 'medium';
        this.open(modalId, size);
      }
    };
    document.addEventListener('click', this._boundDelegateClick);

    // Keyboard accessibility for triggers
    this._boundDelegateKeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
          e.preventDefault();
          const modalId = trigger.dataset.modal;
          const size = trigger.dataset.modalSize || 'medium';
          this.open(modalId, size);
        }
      }
    };
    document.addEventListener('keydown', this._boundDelegateKeydown);
  },

  destroy() {
    if (this._boundEscapeHandler) {
      document.removeEventListener('keydown', this._boundEscapeHandler);
    }
    if (this._boundDelegateClick) {
      document.removeEventListener('click', this._boundDelegateClick);
    }
    if (this._boundDelegateKeydown) {
      document.removeEventListener('keydown', this._boundDelegateKeydown);
    }
    if (this.overlay && this._boundBackdropClick) {
      this.overlay.removeEventListener('click', this._boundBackdropClick);
    }
  },

  open(modalId, size) {
    const content = MODAL_CONTENT[modalId];
    if (!content) return;

    // Set size class
    this.container.classList.remove('modal-small', 'modal-medium', 'modal-large');
    this.container.classList.add(`modal-${size}`);

    // Populate content
    this.populateModal(content);

    // Show modal
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus close button
    this.closeBtn.focus();
  },

  close() {
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  },

  populateModal(content) {
    // Set header
    const iconEl = document.getElementById('modal-icon');
    iconEl.innerHTML = content.icon.length > 2 ? content.icon : content.icon;

    document.getElementById('modal-title').textContent = content.title;
    document.getElementById('modal-subtitle').textContent = content.subtitle;

    // Build body content
    const bodyEl = document.getElementById('modal-body');
    bodyEl.innerHTML = '';

    content.sections.forEach(section => {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'modal-section';

      // Section title
      if (section.title) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'modal-section-title';
        titleEl.textContent = section.title;
        sectionEl.appendChild(titleEl);
      }

      // Section content based on type
      if (section.type === 'list' && section.items) {
        const listEl = document.createElement('ul');
        listEl.className = 'modal-list';
        section.items.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = item;
          listEl.appendChild(li);
        });
        sectionEl.appendChild(listEl);
      } else if (section.type === 'example') {
        const exampleEl = document.createElement('div');
        exampleEl.className = 'modal-example';
        exampleEl.innerHTML = `
          <div class="modal-example-label">${section.label}</div>
          <div class="modal-example-content">${section.content}</div>
        `;
        sectionEl.appendChild(exampleEl);
      } else if (section.type === 'grid' && section.items) {
        const gridEl = document.createElement('div');
        gridEl.className = 'modal-grid';
        section.items.forEach(item => {
          const gridItem = document.createElement('div');
          gridItem.className = 'modal-grid-item';
          gridItem.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;
          gridEl.appendChild(gridItem);
        });
        sectionEl.appendChild(gridEl);
      } else if (section.type === 'io') {
        const ioEl = document.createElement('div');
        ioEl.className = 'modal-io';
        ioEl.innerHTML = `
          <div class="modal-io-section">
            <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Inputs</h4>
            <ul class="modal-io-list">
              ${section.inputs.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-io-section">
            <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Outputs</h4>
            <ul class="modal-io-list">
              ${section.outputs.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
        `;
        sectionEl.appendChild(ioEl);
      } else if (section.content) {
        const contentEl = document.createElement('div');
        contentEl.className = 'modal-section-content';
        contentEl.innerHTML = section.content;
        sectionEl.appendChild(contentEl);
      }

      bodyEl.appendChild(sectionEl);
    });
  }
};

// Mobile menu setup
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('header nav');

  if (!mobileMenuBtn || !nav) return;

  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    const isOpen = nav.classList.contains('mobile-open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Menu');
  });

  // Close menu when clicking a nav link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-label', 'Menu');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
      nav.classList.remove('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-label', 'Menu');
    }
  });
}

// Waitlist form setup
function initWaitlistForm() {
  const form = document.querySelector('.waitlist-form');
  if (!form) return;

  const isUnconfigured = form.dataset.status === 'unconfigured' ||
    form.getAttribute('action').includes('YOUR_FORM_ID');

  if (isUnconfigured) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.title = 'Waitlist coming soon';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Remove any existing feedback
    const existingFeedback = form.querySelector('.form-feedback');
    if (existingFeedback) existingFeedback.remove();

    const formAction = form.getAttribute('action');
    if (formAction.includes('YOUR_FORM_ID') || form.dataset.status === 'unconfigured') {
      showFormFeedback(form, 'The waitlist is coming soon. Please check back later.', 'info');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.innerHTML = '<p class="form-success">Thanks for subscribing! I\'ll be in touch.</p>';
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFormFeedback(form, 'Something went wrong. Please try again later.', 'error');
    }
  });
}

// Display styled feedback message on the waitlist form
function showFormFeedback(form, message, type) {
  const existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();

  const feedback = document.createElement('p');
  feedback.className = `form-feedback ${type}`;
  feedback.textContent = message;
  form.appendChild(feedback);
}

// Load modal content and initialize everything
async function loadModalContent() {
  try {
    const response = await fetch('/data/modal-content.json');
    if (response.ok) {
      MODAL_CONTENT = await response.json();
    }
  } catch {
    // Modal content unavailable — modals will silently not open
  }
}

// Single initialization entry point
async function init() {
  await loadModalContent();
  Modal.init();
  initMobileMenu();
  initWaitlistForm();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  Modal.destroy();
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
