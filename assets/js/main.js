/* VisitePro — site vitrine. Aucun cookie, aucun traceur. */
(function () {
  'use strict';

  /* ------------------------------------------------------------
   * Envoi du formulaire de démo.
   * FORM_ENDPOINT vide  -> le formulaire ouvre la messagerie du
   *                        visiteur (mailto) avec la demande pré-remplie.
   * FORM_ENDPOINT rempli -> envoi en POST JSON vers cette adresse, puis
   *                        redirection vers /merci.html.
   * Si vous renseignez un endpoint, ajoutez aussi son origine dans la
   * directive connect-src de la balise Content-Security-Policy
   * (index.html).
   * ------------------------------------------------------------ */
  var FORM_ENDPOINT = '';

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var form = document.getElementById('demo-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var contact = form.getAttribute('data-contact') || '';

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.className = 'form-status' + (isError ? ' error' : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var data = {
      nom: form.nom.value.trim(),
      email: form.email.value.trim(),
      societe: form.societe.value.trim(),
      chantiers: form.chantiers.value,
      message: form.message.value.trim(),
      consentement: form.consentement.checked,
      site_web: form.site_web.value // piège à robots : doit rester vide
    };
    if (data.site_web) return; // robot : on ignore silencieusement

    if (FORM_ENDPOINT) {
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      setStatus('Envoi en cours…');
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        window.location.href = '/merci.html';
      }).catch(function () {
        btn.disabled = false;
        setStatus("L'envoi n'a pas abouti. Vous pouvez nous écrire directement à l'adresse indiquée ci-dessous.", true);
      });
      return;
    }

    // Secours sans serveur : ouverture de la messagerie
    if (!contact || contact.indexOf('@') === -1) {
      setStatus("L'adresse de contact n'est pas encore configurée sur ce site.", true);
      return;
    }
    var body =
      'Nom : ' + data.nom + '\n' +
      'Email : ' + data.email + '\n' +
      'Société : ' + data.societe + '\n' +
      'Nombre de chantiers (approx.) : ' + data.chantiers + '\n\n' +
      data.message + '\n\n' +
      "J'accepte que mes données soient utilisées pour répondre à ma demande de démo.";
    window.location.href = 'mailto:' + contact +
      '?subject=' + encodeURIComponent('Demande de démo VisitePro – ' + data.societe) +
      '&body=' + encodeURIComponent(body);
    setStatus('Votre messagerie va s’ouvrir avec votre demande pré-remplie. Il vous suffit de l’envoyer.');
  });
})();
