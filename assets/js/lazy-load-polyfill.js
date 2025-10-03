/**
 * Lazy Loading Polyfill & Enhancements
 * Provides fallback for browsers without native lazy loading support
 * and adds advanced features like blur-up placeholders
 */

(function() {
  'use strict';

  // Check if browser supports native lazy loading
  const supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;

  if (!supportsNativeLazyLoading) {
    // Polyfill for older browsers using Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Load the image
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }

            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }

            // Remove observer once loaded
            img.onload = () => {
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            };

            img.onerror = () => {
              img.style.display = 'none';
              imageObserver.unobserve(img);
            };
          }
        });
      }, {
        // Start loading 50px before image enters viewport
        rootMargin: '50px'
      });

      // Observe all lazy images
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // For polyfill, move src to data-src
        if (img.getAttribute('src') && !img.dataset.src) {
          img.dataset.src = img.src;
          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
        imageObserver.observe(img);
      });
    } else {
      // Fallback for very old browsers - load all images immediately
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }

  /**
   * Advanced: Add blur-up effect for images with data-placeholder
   * This creates a smooth loading experience
   */
  const addBlurUpEffect = () => {
    document.querySelectorAll('img[data-placeholder]').forEach(img => {
      const placeholder = img.dataset.placeholder;

      // Set low-res placeholder
      const tempImg = new Image();
      tempImg.src = placeholder;
      tempImg.onload = () => {
        img.style.backgroundImage = `url(${placeholder})`;
        img.style.backgroundSize = 'cover';
        img.style.filter = 'blur(10px)';
      };

      // Remove blur when main image loads
      const mainImg = new Image();
      mainImg.src = img.dataset.src || img.src;
      mainImg.onload = () => {
        img.src = mainImg.src;
        img.style.filter = 'none';
        img.style.backgroundImage = 'none';
      };
    });
  };

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addBlurUpEffect);
  } else {
    addBlurUpEffect();
  }

  /**
   * Performance: Preload critical images on hover (desktop only)
   * This provides instant loading for linked images
   */
  if (window.matchMedia('(hover: hover)').matches) {
    const preloadedImages = new Set();

    document.querySelectorAll('a[href*="/images/"]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (!preloadedImages.has(href)) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = href;
          document.head.appendChild(preloadLink);
          preloadedImages.add(href);
        }
      }, { once: true });
    });
  }

  /**
   * Accessibility: Add missing alt text warnings in development
   */
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.querySelectorAll('img:not([alt])').forEach(img => {
      console.warn('Image missing alt text:', img.src);
      img.setAttribute('role', 'presentation'); // Mark as decorative
    });
  }

})();
