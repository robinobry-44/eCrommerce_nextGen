/* #eCROmmerce NextGen — amélioration progressive.
   Tout le contenu est déjà dans le HTML (généré par build.js).
   Ce script ajoute uniquement la recherche et les filtres. */
(function () {
  'use strict';
  var list = document.querySelector('[data-list]');
  if (!list) return;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var norm = function (s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
  var items = $$('[data-item]'), groups = $$('[data-group]');
  var input = document.getElementById('q'), clear = document.getElementById('clear');
  var label = document.getElementById('result-label'), empty = document.getElementById('empty');
  var params = new URLSearchParams(location.search);
  var state = {};
  $$('[data-filter]').forEach(function (b) { var k = b.getAttribute('data-filter'); state[k] = params.get(k) || ''; });
  if (input) input.value = params.get('q') || '';

  function render() {
    var q = input ? norm(input.value) : '', toks = q ? q.split(/\s+/) : [], n = 0;
    items.forEach(function (el) {
      var ok = Object.keys(state).every(function (k) { return !state[k] || (el.getAttribute('data-' + k) || '').split('|').indexOf(state[k]) >= 0; }) &&
        toks.every(function (t) { return (el.getAttribute('data-search') || '').indexOf(t) >= 0; });
      el.hidden = !ok; if (ok) n++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('[data-item]:not([hidden])'); });
    $$('[data-filter]').forEach(function (b) { var on = (state[b.getAttribute('data-filter')] || '') === b.getAttribute('data-value'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    if (label) label.textContent = n + ' ' + (n > 1 ? label.getAttribute('data-many') : label.getAttribute('data-one'));
    if (clear) clear.classList.toggle('hidden', !input.value);
    if (empty) {
      empty.classList.toggle('hidden', n > 0);
      empty.textContent = input && input.value && empty.getAttribute('data-tpl-q') ? empty.getAttribute('data-tpl-q').replace('{q}', input.value) : empty.getAttribute('data-tpl');
    }
    var u = new URLSearchParams();
    if (input && input.value) u.set('q', input.value);
    Object.keys(state).forEach(function (k) { if (state[k]) u.set(k, state[k]); });
    try { history.replaceState(null, '', location.pathname + (String(u) ? '?' + u : '') + location.hash); } catch (e) { /* file:// */ }
  }

  if (input) input.addEventListener('input', render);
  if (clear) clear.addEventListener('click', function () { input.value = ''; render(); input.focus(); });
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-filter]');
    if (f) { state[f.getAttribute('data-filter')] = f.getAttribute('data-value'); render(); }
  });
  render();
})();
