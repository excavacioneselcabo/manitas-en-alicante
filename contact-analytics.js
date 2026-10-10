(function () {
  'use strict';
  var id = 'G-SFXV8P2ZVH';
  var key = 'manitas-analytics-consent-v1';
  var consent = null;
  var started = false;
  try { consent = localStorage.getItem(key); } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function start() {
    if (consent !== 'granted') return;
    window['ga-disable-' + id] = false;
    if (started) { gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}); return; }
    started = true;
    gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('js', new Date());
    gtag('config', id, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, cookie_expires:63072000});
    gtag('event', 'page_view', {page_location:location.origin + location.pathname, page_title:document.title, page_referrer:document.referrer ? document.referrer.split('?')[0].split('#')[0] : ''});
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(tag);
  }
  function track(name, placement) {
    if (consent !== 'granted') return;
    start();
    gtag('event', name, {contact_placement:placement, page_location:location.origin + location.pathname, transport_type:'beacon'});
  }
  function init() {
    var style = document.createElement('style');
    style.textContent = '#manitas-consent{position:fixed;bottom:16px;left:16px;right:16px;max-width:620px;padding:20px;background:#f2efe8;color:#20262d;border:1px solid #20262d;box-shadow:0 6px 30px #0003;z-index:10000;font:14px/1.5 Arial,sans-serif}#manitas-consent p{margin:0 0 12px;color:#20262d}#manitas-consent a{color:inherit;text-decoration:underline}#manitas-consent .choices{display:flex;gap:10px;flex-wrap:wrap}#manitas-consent button{padding:12px 16px;background:#20262d;color:white;border:0;border-radius:4px;font:700 14px Arial,sans-serif;cursor:pointer}#manitas-cookie-settings{position:fixed;bottom:8px;left:8px;z-index:9998;padding:7px 10px;background:#f2efe8;color:#20262d;border:1px solid #aaa;font:12px Arial,sans-serif;cursor:pointer}';
    document.head.appendChild(style);
    var panel = document.createElement('aside');
    panel.id = 'manitas-consent';
    panel.setAttribute('aria-label', 'Preferencias de cookies');
    panel.innerHTML = '<p><strong>Cookies y medición de contactos</strong><br>Con tu permiso, usamos Google Analytics para medir visitas y clics en llamada, WhatsApp y envíos del formulario. No enviamos el contenido del formulario. Puedes aceptar o rechazar las cookies analíticas. <a href="/cookies.html">Política de cookies</a> · <a href="/privacidad.html">Privacidad</a></p><div class="choices"><button type="button" data-choice="granted">Aceptar analíticas</button><button type="button" data-choice="denied">Rechazar analíticas</button></div>';
    panel.hidden = consent === 'granted' || consent === 'denied';
    document.body.appendChild(panel);
    panel.addEventListener('click', function (event) {
      var choice = event.target.closest('button[data-choice]');
      if (!choice) return;
      consent = choice.getAttribute('data-choice');
      try { localStorage.setItem(key, consent); } catch (_) {}
      panel.hidden = true;
      if (consent === 'granted') start();
      else {
        window['ga-disable-' + id] = true;
        if (started) gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
        document.cookie.split(';').forEach(function (part) {
          var name = part.split('=')[0].trim();
          if (!/^_ga(?:_|$)/.test(name)) return;
          ['',location.hostname,'.' + location.hostname,'.manitasenalicante.es'].forEach(function (domain) {
            document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
          });
        });
      }
    });
    var settings = document.createElement('button');
    settings.id = 'manitas-cookie-settings';
    settings.type = 'button';
    settings.textContent = 'Configurar cookies';
    settings.addEventListener('click', function () { panel.hidden = false; });
    document.body.appendChild(settings);
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      var name = /^tel:/.test(href) ? 'contact_phone_click' : /^https:\/\/(?:wa\.me|api\.whatsapp\.com)\//.test(href) ? 'contact_whatsapp_click' : null;
      if (!name) return;
      var section = link.closest('header,footer,section');
      var placement = link.getAttribute('data-testid') || (section && (section.id || section.tagName.toLowerCase())) || 'page';
      track(name, placement);
    });
    document.addEventListener('submit', function (event) { if (event.target.matches('.contact-form') && event.target.checkValidity()) track('contact_form_submit','contact_form'); });
    start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();