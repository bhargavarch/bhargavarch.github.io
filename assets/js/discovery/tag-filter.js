/**
 * Tag Filtering System
 * Real-time search and filter for tags page
 */

class TagFilter {
  constructor() {
    this.tagsContainer = document.getElementById('tags');
    this.tags = [];
    this.searchInput = null;

    if (this.tagsContainer && window.location.pathname.includes('/tags')) {
      this.init();
    }
  }

  init() {
    this.createSearchBox();
    this.collectTags();
    this.setupEventListeners();
  }

  createSearchBox() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'tag-filter-search mb-4';
    searchContainer.innerHTML = `
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          id="tag-search-input"
          class="tag-search-input"
          placeholder="Search tags..."
          autocomplete="off"
          aria-label="Search tags"
        >
        <button class="clear-search" aria-label="Clear search" style="display:none;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="tag-count-info">
        <span id="visible-count">0</span> / <span id="total-count">0</span> tags
      </div>
    `;

    // Insert before tags container
    this.tagsContainer.parentNode.insertBefore(searchContainer, this.tagsContainer);

    this.searchInput = document.getElementById('tag-search-input');
    this.clearBtn = searchContainer.querySelector('.clear-search');
  }

  collectTags() {
    this.tags = Array.from(this.tagsContainer.querySelectorAll('.tag')).map(tag => {
      return {
        element: tag.parentElement,
        name: tag.textContent.trim().toLowerCase(),
        count: parseInt(tag.querySelector('.text-muted').textContent.trim())
      };
    });

    this.updateCount();
  }

  setupEventListeners() {
    let debounceTimer;

    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);

      const query = e.target.value.toLowerCase().trim();

      // Show/hide clear button
      this.clearBtn.style.display = query ? 'block' : 'none';

      debounceTimer = setTimeout(() => {
        this.filterTags(query);
      }, 150);
    });

    // Clear button
    this.clearBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearBtn.style.display = 'none';
      this.filterTags('');
      this.searchInput.focus();
    });

    // Keyboard shortcut: Ctrl+F or Cmd+F when on tags page
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && window.location.pathname.includes('/tags')) {
        e.preventDefault();
        this.searchInput.focus();
      }
    });
  }

  filterTags(query) {
    let visibleCount = 0;

    this.tags.forEach(tag => {
      if (query === '' || tag.name.includes(query)) {
        tag.element.style.display = '';
        visibleCount++;
      } else {
        tag.element.style.display = 'none';
      }
    });

    this.updateCount(visibleCount);

    // Show message if no results
    this.showNoResults(visibleCount === 0 && query !== '');
  }

  updateCount(visibleCount = null) {
    const visibleEl = document.getElementById('visible-count');
    const totalEl = document.getElementById('total-count');

    if (visibleCount === null) {
      visibleCount = this.tags.length;
    }

    if (visibleEl) visibleEl.textContent = visibleCount;
    if (totalEl) totalEl.textContent = this.tags.length;
  }

  showNoResults(show) {
    let noResultsEl = document.getElementById('no-tags-results');

    if (show) {
      if (!noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'no-tags-results';
        noResultsEl.className = 'no-results-message';
        noResultsEl.innerHTML = `
          <i class="fas fa-search fa-2x mb-3"></i>
          <p>No tags found matching your search.</p>
        `;
        this.tagsContainer.appendChild(noResultsEl);
      }
    } else {
      if (noResultsEl) {
        noResultsEl.remove();
      }
    }
  }
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.TagFilter = new TagFilter();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TagFilter;
}
