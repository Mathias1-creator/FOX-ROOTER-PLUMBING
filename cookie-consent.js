/**
 * Prodigy Plumbing — Cookie Consent Banner
 * Drop this script tag near the end of <body> on every page:
 *   <script src="cookie-consent.js"></script>
 *
 * No backend, no dependencies. Stores the visitor's choice in the
 * browser itself (localStorage) so the banner only shows once.
 */
(function () {
  const STORAGE_KEY = "prodigyPlumbingCookieConsent";

  // If a choice was already made, don't show the banner again.
  if (localStorage.getItem(STORAGE_KEY)) return;

  const style = document.createElement("style");
  style.textContent = `
    #pp-cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #0D0D0D;
      color: #FFFFFF;
      padding: 20px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-family: 'Inter', -apple-system, sans-serif;
      border-top: 3px solid #3e8f98;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
    }
    #pp-cookie-banner p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      max-width: 640px;
      color: #EAF6F6;
    }
    #pp-cookie-banner a {
      color: #6fc8d2;
      text-decoration: underline;
    }
    #pp-cookie-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }
    #pp-cookie-actions button {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: opacity 0.15s ease;
    }
    #pp-cookie-actions button:hover { opacity: 0.85; }
    #pp-accept-all {
      background: #3e8f98;
      color: #FFFFFF;
    }
    #pp-necessary-only {
      background: transparent;
      color: #FFFFFF;
      border-color: #4A4A4A;
    }
    @media (max-width: 640px) {
      #pp-cookie-banner { flex-direction: column; align-items: flex-start; }
      #pp-cookie-actions { width: 100%; }
      #pp-cookie-actions button { flex: 1; }
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement("div");
  banner.id = "pp-cookie-banner";
  banner.innerHTML = `
    <p>
      We keep cookies to a minimum. Your choice below controls whether the Google map on our
      contact page loads automatically. If we ever add analytics, it will also run only if
      you allow it. We do not sell your personal information.
    </p>
    <div id="pp-cookie-actions">
      <button id="pp-necessary-only" type="button">Necessary Only</button>
      <button id="pp-accept-all" type="button">Accept All</button>
    </div>
  `;
  document.body.appendChild(banner);

  // Sit above the sticky mobile call/text bar instead of covering it.
  // The bar is display:none on desktop, so its measured height is 0 there
  // and the banner stays flush with the bottom of the viewport.
  const ctaBar = document.querySelector(".mobile-cta-bar");
  function placeAboveCtaBar() {
    banner.style.bottom = ctaBar ? ctaBar.getBoundingClientRect().height + "px" : "0px";
  }
  placeAboveCtaBar();
  window.addEventListener("resize", placeAboveCtaBar);

  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
    window.removeEventListener("resize", placeAboveCtaBar);
    banner.remove();
    // "Accept All" loads the consent-gated Google Maps embed right away
    // if we're on the contact page (see main.js).
    if (value === "all" && typeof window.ppLoadMap === "function") window.ppLoadMap();
    // If you later add analytics, load it here the same way, e.g.:
    // if (value === "all") { loadAnalyticsScript(); }
  }

  document.getElementById("pp-accept-all").addEventListener("click", () => setConsent("all"));
  document.getElementById("pp-necessary-only").addEventListener("click", () => setConsent("necessary"));
})();
