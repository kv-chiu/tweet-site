// ==UserScript==
// @name         FanGallery - X Media Picker
// @namespace    https://github.com/kv-chiu/tweet-site
// @version      1.0
// @description  Pick tweets from X media pages, export as FanGallery data.json format
// @match        https://x.com/*/media
// @match        https://twitter.com/*/media
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const selected = new Set();
  let picking = false;

  // --- UI Panel ---
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '99999',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
  });
  document.body.appendChild(panel);

  const counter = document.createElement('div');
  Object.assign(counter.style, {
    background: '#1d9bf0',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  });
  panel.appendChild(counter);

  function updateCounter() {
    counter.textContent = `${selected.size} selected`;
    counter.style.display = selected.size > 0 ? 'block' : 'none';
  }

  function makeBtn(text) {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, {
      padding: '10px 18px',
      borderRadius: '24px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      transition: 'transform 0.1s',
    });
    btn.addEventListener('mousedown', () => (btn.style.transform = 'scale(0.95)'));
    btn.addEventListener('mouseup', () => (btn.style.transform = ''));
    return btn;
  }

  const btnRow = document.createElement('div');
  Object.assign(btnRow.style, { display: 'flex', gap: '8px' });
  panel.appendChild(btnRow);

  // Copy button
  const copyBtn = makeBtn('Copy JSON');
  Object.assign(copyBtn.style, { background: '#1d9bf0', color: '#fff', display: 'none' });
  copyBtn.addEventListener('click', () => {
    const items = [...selected].map((id) => ({ type: 'tweet', id }));
    const json = JSON.stringify(items, null, 2);
    navigator.clipboard.writeText(json);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy JSON'), 1500);
  });
  btnRow.appendChild(copyBtn);

  // Toggle button
  const toggleBtn = makeBtn('Pick');
  Object.assign(toggleBtn.style, { background: '#fff', color: '#000' });
  toggleBtn.addEventListener('click', () => {
    picking = !picking;
    toggleBtn.textContent = picking ? 'Done' : 'Pick';
    toggleBtn.style.background = picking ? '#1d9bf0' : '#fff';
    toggleBtn.style.color = picking ? '#fff' : '#000';
    copyBtn.style.display = picking || selected.size > 0 ? 'block' : 'none';
    document.body.style.cursor = picking ? 'crosshair' : '';
    // Refresh all overlays visibility
    document.querySelectorAll('.fg-pick-overlay').forEach((el) => {
      el.style.display = picking ? 'flex' : el.dataset.selected === 'true' ? 'flex' : 'none';
    });
  });
  btnRow.appendChild(toggleBtn);

  // --- Style ---
  const style = document.createElement('style');
  style.textContent = `
    .fg-pick-overlay {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .fg-pick-overlay:hover {
      background: rgba(29, 155, 240, 0.15);
    }
    .fg-pick-overlay .fg-check {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.8);
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 16px;
      color: transparent;
      transition: all 0.15s;
    }
    .fg-pick-overlay[data-selected="true"] {
      background: rgba(29, 155, 240, 0.25);
    }
    .fg-pick-overlay[data-selected="true"] .fg-check {
      background: #1d9bf0;
      border-color: #1d9bf0;
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  // --- Block navigation during pick mode (capture phase) ---
  document.addEventListener('click', (e) => {
    if (!picking) return;
    // Only block if clicking inside a media link that has our overlay
    const overlay = e.target.closest('.fg-pick-overlay');
    const link = e.target.closest('a[href*="/status/"]');
    if (overlay || (link && link.querySelector('.fg-pick-overlay'))) {
      e.preventDefault();
    }
  }, true);

  // --- Extract tweet ID from a link ---
  function getTweetId(link) {
    const m = link.href.match(/\/status\/(\d+)/);
    return m ? m[1] : null;
  }

  // --- Attach overlay to a media link ---
  function attachOverlay(link) {
    if (link.querySelector('.fg-pick-overlay')) return;

    // Ensure the link is positioned for absolute overlay
    const pos = getComputedStyle(link).position;
    if (pos === 'static') link.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.className = 'fg-pick-overlay';
    overlay.dataset.selected = 'false';
    overlay.innerHTML = '<div class="fg-check">\u2713</div>';
    overlay.style.display = picking ? 'flex' : 'none';

    overlay.addEventListener('click', (e) => {
      if (!picking) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const id = getTweetId(link);
      if (!id) return;

      if (selected.has(id)) {
        selected.delete(id);
        overlay.dataset.selected = 'false';
      } else {
        selected.add(id);
        overlay.dataset.selected = 'true';
      }
      updateCounter();
      copyBtn.style.display = selected.size > 0 || picking ? 'block' : 'none';
    }, true);

    link.appendChild(overlay);
  }

  // --- Scan for media cells ---
  function scan() {
    // Each media item is an <a> linking to /status/ID/photo/ or /video/
    const links = document.querySelectorAll('a[href*="/status/"][href*="/photo/"], a[href*="/status/"][href*="/video/"]');
    links.forEach((link) => attachOverlay(link));
  }

  // Initial scan + observe for infinite scroll
  const observer = new MutationObserver(() => scan());
  observer.observe(document.body, { childList: true, subtree: true });

  // Periodic scan as fallback
  setInterval(scan, 2000);
  // First scan after page settles
  setTimeout(scan, 1500);
})();
