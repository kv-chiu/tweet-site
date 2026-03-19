// ==UserScript==
// @name         FanGallery - Instagram Media Picker
// @namespace    https://github.com/kv-chiu/tweet-site
// @version      2.0
// @description  Pick posts from Instagram profile pages, export as FanGallery data.json format
// @match        https://www.instagram.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Only run in top-level window, not in iframes
  if (window !== window.top) return;

  const selected = new Map(); // shortcode -> <a> element

  let picking = false;

  // --- Style: use ::after on the <a> tag itself, no overlay div needed ---
  const style = document.createElement('style');
  style.textContent = `
    a.fg-selected::after,
    a.fg-picking::after {
      content: '\\2713';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      z-index: 999999;
      pointer-events: none;
      box-sizing: border-box;
    }
    a.fg-picking::after {
      border: 2px solid rgba(255,255,255,0.7);
      background: rgba(0,0,0,0.25);
      color: transparent;
    }
    a.fg-selected::after {
      border: 2px solid #e1306c;
      background: #e1306c;
      color: #fff;
    }
    a.fg-selected {
      box-shadow: inset 0 0 0 3px #e1306c;
    }
  `;
  document.head.appendChild(style);

  // --- UI Panel ---
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });
  document.body.appendChild(panel);

  const counter = document.createElement('div');
  Object.assign(counter.style, {
    background: '#e1306c',
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
    counter.textContent = selected.size + ' selected';
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
      fontFamily: 'inherit',
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
  Object.assign(copyBtn.style, { background: '#e1306c', color: '#fff', display: 'none' });
  copyBtn.addEventListener('click', () => {
    const items = [...selected.keys()].map((id) => ({ type: 'instagram', id }));
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
    toggleBtn.style.background = picking ? '#e1306c' : '#fff';
    toggleBtn.style.color = picking ? '#fff' : '#000';
    copyBtn.style.display = picking || selected.size > 0 ? 'block' : 'none';

    // Toggle fg-picking class on all post links
    getPostLinks().forEach((link) => {
      link.classList.toggle('fg-picking', picking && !link.classList.contains('fg-selected'));
    });
  });
  btnRow.appendChild(toggleBtn);

  // --- Helpers ---
  function getShortcode(link) {
    const m = link.href.match(/\/(p|reels?)\/([\w-]+)/);
    return m ? m[2] : null;
  }

  function getPostLinks() {
    return document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"], a[href*="/reels/"]');
  }

  // --- Click handler at document level (capture phase) ---
  document.addEventListener('click', (e) => {
    if (!picking) return;

    // Don't intercept our own UI
    if (panel.contains(e.target)) return;

    const link = e.target.closest('a[href*="/p/"], a[href*="/reel/"], a[href*="/reels/"]');
    if (!link) return;

    // Only handle links that look like grid items (have an image)
    if (link.offsetHeight < 50) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    // Ensure position relative for ::after
    link.style.position = 'relative';

    const id = getShortcode(link);
    if (!id) return;

    if (selected.has(id)) {
      selected.delete(id);
      link.classList.remove('fg-selected');
      link.classList.add('fg-picking');
    } else {
      selected.set(id, link);
      link.classList.add('fg-selected');
      link.classList.remove('fg-picking');
    }
    updateCounter();
    copyBtn.style.display = selected.size > 0 || picking ? 'block' : 'none';
  }, true);

  // --- Mark new links as pickable when they appear (infinite scroll) ---
  function markLinks() {
    if (!picking) return;
    getPostLinks().forEach((link) => {
      if (!link.classList.contains('fg-selected') && !link.classList.contains('fg-picking')) {
        link.style.position = 'relative';
        link.classList.add('fg-picking');
      }
    });
  }

  const observer = new MutationObserver(() => markLinks());
  observer.observe(document.body, { childList: true, subtree: true });
})();
