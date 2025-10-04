/**
 * Enhanced Copy-to-Clipboard with Toast Notifications
 * Enhances the existing Chirpy theme copy functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for toast system to be ready
  const initEnhancement = () => {
    if (!window.Toast) {
      setTimeout(initEnhancement, 100);
      return;
    }

    // Find all copy buttons (Chirpy theme uses .copy-code-button or similar)
    const observeCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('pre');

      codeBlocks.forEach(block => {
        // Look for copy button (may be added dynamically by Chirpy)
        const copyButton = block.querySelector('[data-clipboard-target], .copy-code-button, button[aria-label*="copy" i]');

        if (copyButton && !copyButton.dataset.enhanced) {
          copyButton.dataset.enhanced = 'true';

          // Add click event listener
          copyButton.addEventListener('click', function(e) {
            // Let the original copy happen first
            setTimeout(() => {
              window.Toast.success('Code copied to clipboard!', 2500);
            }, 100);
          });
        }
      });
    };

    // Initial scan
    observeCopyButtons();

    // Watch for dynamically added code blocks
    const observer = new MutationObserver(() => {
      observeCopyButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also add general clipboard functionality
    document.addEventListener('copy', (e) => {
      // Only show toast if it's a manual copy (Ctrl+C) with selection
      const selection = window.getSelection().toString();
      if (selection && selection.length > 10) {
        // Delay to avoid conflicts with code block copy
        setTimeout(() => {
          if (!document.activeElement.closest('pre')) {
            window.Toast.info('Text copied', 2000);
          }
        }, 150);
      }
    });
  };

  initEnhancement();
});
