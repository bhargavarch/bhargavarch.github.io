/**
 * Enhanced Smooth Scrolling
 * Improves the back-to-top and anchor link behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enhance all anchor links for smooth scrolling
  const enhanceAnchorLinks = () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      if (link.dataset.smoothScrollEnhanced) return;

      link.dataset.smoothScrollEnhanced = 'true';

      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#top') return; // Let default handle these

        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          e.preventDefault();

          // Smooth scroll to target
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }

          // Focus target for accessibility
          target.focus({ preventScroll: true });
        }
      });
    });
  };

  // Initial enhancement
  enhanceAnchorLinks();

  // Watch for dynamically added links
  const observer = new MutationObserver(() => {
    enhanceAnchorLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Enhance back-to-top button (if it exists)
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Optional: show toast
      if (window.Toast) {
        window.Toast.success('Back to top', 2000);
      }
    });
  }

  // Add scroll progress indicator on back-to-top button
  const updateScrollProgress = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    // Find back-to-top button
    const btn = document.querySelector('#back-to-top, [class*="back"]');
    if (btn) {
      btn.style.setProperty('--scroll-progress', `${scrolled}%`);
    }
  };

  // Throttle scroll event
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  });
});
