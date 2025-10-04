/**
 * Keyboard Shortcuts System
 * Enhances navigation and accessibility with keyboard commands
 */

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.helpVisible = false;
    this.init();
  }

  init() {
    // Register default shortcuts
    this.register(['Meta+k', 'Control+k'], () => this.toggleSearch(), 'Open search');
    this.register(['Escape'], () => this.closeModals(), 'Close modals');
    this.register(['t'], () => this.scrollToTop(), 'Back to top');
    this.register(['?', 'Shift+/'], () => this.toggleHelp(), 'Show keyboard shortcuts');

    // Listen for keydown events
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Create help modal
    this.createHelpModal();
  }

  /**
   * Register a keyboard shortcut
   * @param {string|array} keys - Key combination(s) (e.g., 'Meta+k' or ['Control+k', 'Meta+k'])
   * @param {function} callback - Function to call when shortcut is triggered
   * @param {string} description - Description for help modal
   */
  register(keys, callback, description = '') {
    const keyArray = Array.isArray(keys) ? keys : [keys];

    keyArray.forEach(key => {
      this.shortcuts.set(key.toLowerCase(), {
        callback,
        description,
        keys: keyArray
      });
    });
  }

  /**
   * Handle keydown events
   */
  handleKeydown(e) {
    // Don't trigger shortcuts when typing in inputs
    if (this.isTyping(e.target)) {
      // Exception: ESC and Meta/Control+K work everywhere
      if (e.key !== 'Escape' && !(e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        return;
      }
    }

    const key = this.getKeyString(e);
    const shortcut = this.shortcuts.get(key.toLowerCase());

    if (shortcut) {
      e.preventDefault();
      shortcut.callback(e);
    }
  }

  /**
   * Get normalized key string from event
   */
  getKeyString(e) {
    const parts = [];

    if (e.metaKey) parts.push('Meta');
    if (e.ctrlKey) parts.push('Control');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey && e.key !== 'Shift') parts.push('Shift');

    // Add the main key
    if (e.key && !['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
      parts.push(e.key);
    }

    return parts.join('+');
  }

  /**
   * Check if user is typing in an input/textarea
   */
  isTyping(element) {
    const tagName = element.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      element.isContentEditable
    );
  }

  /**
   * Toggle search modal
   */
  toggleSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    if (searchTrigger) {
      searchTrigger.click();

      // Focus search input after a brief delay
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.offsetParent !== null) {
          searchInput.focus();
        }
      }, 100);

      if (window.Toast) {
        window.Toast.info('Search opened', 2000);
      }
    }
  }

  /**
   * Close all modals (search, help, etc.)
   */
  closeModals() {
    // Close search
    const searchCancel = document.getElementById('search-cancel');
    if (searchCancel && searchCancel.offsetParent !== null) {
      searchCancel.click();
      return;
    }

    // Close help modal
    if (this.helpVisible) {
      this.toggleHelp();
      return;
    }
  }

  /**
   * Scroll to top smoothly
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (window.Toast) {
      window.Toast.success('Scrolled to top', 2000);
    }
  }

  /**
   * Toggle keyboard shortcuts help modal
   */
  toggleHelp() {
    const modal = document.getElementById('keyboard-shortcuts-help');
    if (!modal) return;

    if (this.helpVisible) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      this.helpVisible = false;
    } else {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      this.helpVisible = true;

      // Focus first close button
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  /**
   * Create help modal HTML
   */
  createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'keyboard-shortcuts-help';
    modal.className = 'keyboard-help-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    modal.setAttribute('aria-hidden', 'true');

    // Get unique shortcuts (remove duplicates)
    const uniqueShortcuts = new Map();
    this.shortcuts.forEach((value, key) => {
      if (value.description && !uniqueShortcuts.has(value.description)) {
        uniqueShortcuts.set(value.description, value.keys[0]);
      }
    });

    let shortcutsList = '';
    uniqueShortcuts.forEach((keys, description) => {
      const displayKey = this.formatKeyForDisplay(keys);
      shortcutsList += `
        <div class="shortcut-item">
          <kbd class="shortcut-key">${displayKey}</kbd>
          <span class="shortcut-desc">${description}</span>
        </div>
      `;
    });

    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
          <button class="modal-close" aria-label="Close help">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${shortcutsList}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button handler
    modal.querySelector('.modal-close').addEventListener('click', () => this.toggleHelp());
    modal.querySelector('.modal-overlay').addEventListener('click', () => this.toggleHelp());
  }

  /**
   * Format key combination for display
   */
  formatKeyForDisplay(keys) {
    return keys
      .replace('Meta', '⌘')
      .replace('Control', 'Ctrl')
      .replace('Alt', '⌥')
      .replace('Shift', '⇧')
      .replace('+', ' + ');
  }
}

// Initialize global instance
document.addEventListener('DOMContentLoaded', () => {
  window.KeyboardShortcuts = new KeyboardShortcuts();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeyboardShortcuts;
}
