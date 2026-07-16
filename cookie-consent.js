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
      border-top: 3px solid #0F8B8D;
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
      color: #4FD1D9;
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
      background: #0F8B8D;
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
      We use cookies to keep this site running smoothly and to understand how visitors use it.
      We do not sell your personal information.
    </p>
    <div id="pp-cookie-actions">
      <button id="pp-necessary-only" type="button">Necessary Only</button>
      <button id="pp-accept-all" type="button">Accept All</button>
    </div>
  `;
  document.body.appendChild(banner);

  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
    banner.remove();
    // If "all" was accepted and you later add analytics, load it here, e.g.:
    // if (value === "all") { loadAnalyticsScript(); }
  }

  document.getElementById("pp-accept-all").addEventListener("click", () => setConsent("all"));
  document.getElementById("pp-necessary-only").addEventListener("click", () => setConsent("necessary"));
})();
