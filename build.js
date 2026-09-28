#!/usr/bin/env node
/* ==========================================================================
   build.js — génère le site statique complet dans dist/ (Node 18+, sans dépendance)

     node build.js            → mise en ligne (URLs propres /talents/slug/)
     node build.js --local    → dist/ consultable en double-cliquant (liens …/index.html)
     node build.js --strict   → échoue si un avertissement est détecté

   Sources : data/interviews.js (Talents), data/site.js (réglages), data/insights.js (facultatif)
   ========================================================================== */
'use strict';

function buildSite(SITE, RAW, opts) {
  opts = opts || {};
  SITE = SITE || {};
  RAW = Array.isArray(RAW) ? RAW : [];
  const INSIGHTS_RAW = Array.isArray(opts.insights) ? opts.insights : [];
  const LOCAL = !!opts.local;
  const exists = opts.exists || (() => true);
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const warnings = [];
  const warn = m => { warnings.push(m); (opts.warn || console.warn)('[NextGen] ' + m); };

  const BASE = String(SITE.url || '').replace(/\/+$/, '');
  const NAME = SITE.nom || '#eCROmmerce NextGen';
  const BRAND = SITE.nomCourt || 'eCROmmerce NextGen';
  const AUTHOR = (SITE.apropos && SITE.apropos.auteur) || {};
  const LINKS = SITE.liens || {};
  const PROPOSER = LINKS.proposerTalent || LINKS.linkedin || '';

  /* ---------- utilitaires ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const has = v => Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '';
  const list = v => Array.isArray(v) ? v : (has(v) ? [v] : []);
  const slugify = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
  const initials = n => String(n || '?').split(/\s+/).filter(Boolean).map(s => s[0]).join('').slice(0, 2).toUpperCase();
  const plural = (n, one, many) => n + ' ' + (n > 1 ? many : one);
  const strip = s => String(s || '').replace(/<[^>]+>/g, '');
  const clamp = (s, n) => { s = strip(s).replace(/\s+/g, ' ').trim(); n = n || 158; return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'; };
  const json = o => JSON.stringify(o).replace(/</g, '\\u003c');
  const pad = n => String(n).padStart(2, '0');
  const first = n => String(n || '').split(/\s+/)[0];
  const de = n => (/^[aeiouyhàâäéèêëîïôöûüœ]/i.test(n) ? "d'" : 'de ') + n;
  const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const fmtDate = d => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? (+m[3] === 1 ? '1er' : +m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : ''; };
  const mapKeys = o => { const r = {}; Object.keys(o || {}).forEach(k => { r[norm(k)] = o[k]; }); return r; };
  const ALIAS = mapKeys(SITE.alias);
  const canon = n => ALIAS[norm(n)] || String(n == null ? '' : n).trim();
  const LOGOS = {}; Object.keys(SITE.logos || {}).forEach(k => { LOGOS[norm(canon(k))] = SITE.logos[k]; });
  const TOOLCAT = {}; Object.keys(SITE.categoriesOutils || {}).forEach(k => { TOOLCAT[norm(canon(k))] = SITE.categoriesOutils[k]; });
  const REL = {
    inspired_by: { tag: 'Inspiration', by: 'Cité comme inspiration par' },
    follows: { tag: 'Suivi', by: 'Suivi par' },
    recommends: { tag: 'Recommandé', by: 'Recommandé par' },
    mentor: { tag: 'Mentor', by: 'Mentor de' },
    mentions: { tag: 'Cité', by: 'Cité par' },
    uses: { tag: 'Utilisé', by: 'Utilisé par' }
  };
  const TYPES = { book: 'Book', podcast: 'Podcast', newsletter: 'Newsletter', video: 'Video', website: 'Website', media: 'Media' };
  const TYPES_FR = { book: 'livres', podcast: 'podcasts', newsletter: 'newsletters', video: 'vidéos', website: 'sites', media: 'médias' };
  const SCHEMA = { book: 'Book', podcast: 'PodcastSeries', newsletter: 'CreativeWork', video: 'VideoObject', website: 'WebSite', media: 'CreativeWork' };
  const liSearch = n => 'https://www.linkedin.com/search/results/all/?keywords=' + encodeURIComponent(n);
  const abs = p => BASE + '/' + (p || '');
  const checkImg = (p, who) => { if (!has(p)) return ''; if (/^https?:\/\//.test(p)) return p; if (!exists(p)) { warn('Image introuvable pour ' + who + ' : « ' + p + ' » (initiales affichées).'); return ''; } return p; };
  const variants = p => { if (!p || /^https?:/.test(p)) return []; const m = /^(.*)\.(\w+)$/.exec(p); if (!m) return []; return [480, 960, 1600].map(w => [m[1] + '-' + w + '.' + m[2], w]).filter(v => exists(v[0])); };

  /* ---------- Talents : validation + normalisation ---------- */
  const REQUIRED = ['slug', 'nom', 'poste', 'entreprise', 'date'];
  const seen = {}, ALL = [];
  RAW.forEach((it, idx) => {
    const where = 'Profil n°' + (idx + 1) + (it && it.slug ? ' « ' + it.slug + ' »' : '');
    if (!it || typeof it !== 'object') { warn(where + ' : ce n\'est pas un objet { }, ignoré.'); return; }
    const miss = REQUIRED.filter(k => !has(it[k]));
    if (miss.length) warn(where + ' : champ(s) obligatoire(s) manquant(s) → ' + miss.join(', '));
    if (!has(it.slug)) { warn(where + ' ignoré : sans slug, impossible de créer sa page.'); return; }
    const slug = String(it.slug).trim();
    if (seen[slug]) { warn('Slug en double « ' + slug + ' » (profils n°' + seen[slug] + ' et n°' + (idx + 1) + '). Le second est ignoré : changez son slug.'); return; }
    seen[slug] = idx + 1;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) warn(where + ' : le slug doit être en minuscules, sans accent ni espace (ex. prenom-nom).');
    if (has(it.date) && !/^\d{4}-\d{2}-\d{2}$/.test(it.date)) warn(where + ' : date « ' + it.date + ' » invalide, format attendu AAAA-MM-JJ.');
    if (has(it.typeProfil) && ['annonceur', 'agence'].indexOf(norm(it.typeProfil)) < 0) warn(where + ' : typeProfil doit valoir "annonceur" ou "agence".');
    if (!has(it.citation)) warn(where + ' : pas de citation principale (hero, Featured Talents et citation XXL resteront vides).');
    if (SITE.afficherExemples === false && it.exemple) return;
    const date = /^\d{4}-\d{2}-\d{2}$/.test(it.date || '') ? it.date : '';
    const mots = list(it.motsCles).map(w => String(w).trim()).filter(Boolean);
    const p = {
      slug, nom: it.nom || slug, poste: it.poste || '', entreprise: it.entreprise || '', secteur: it.secteur || '',
      typeProfil: norm(it.typeProfil), date, maj: /^\d{4}-\d{2}-\d{2}$/.test(it.dateMiseAJour || '') ? it.dateMiseAJour : '',
      promo: String(it.promo || (date ? date.slice(0, 4) : SITE.promoActuelle || '')),
      numeroFixe: +it.numero || 0, featured: !!it.featured, exemple: !!it.exemple,
      photo: checkImg(it.photo, it.nom || slug), photos: list(it.photos).map(x => checkImg(x, it.nom || slug)).filter(Boolean),
      lienLinkedin: it.lienLinkedin || '',
      expertises: list(it.expertises).filter(has).map(canon),
      citation: String(it.citation || '').trim().replace(/^[«"“]\s*|\s*[»"”]$/g, ''),
      accroche: it.accroche || '', intro: it.intro || '',
      careerPath: list(it.careerPath).map(c => typeof c === 'string' ? { etape: c } : c).filter(c => c && has(c.etape)),
      reponses: list(it.reponses).filter(r => r && typeof r === 'object'),
      marques: list(it.marques).filter(has).map(canon),
      outils: list(it.outils).map(o => typeof o === 'string' ? { nom: o } : o).filter(o => o && has(o.nom)).map(o => ({ nom: canon(o.nom), usage: o.usage || '' })),
      mentors: list(it.mentors).map(m => typeof m === 'string' ? { nom: m } : m).filter(m => m && has(m.nom))
        .map(m => ({ nom: canon(m.nom), expertise: m.expertise || '', citation: m.citation || '', organisation: has(m.organisation) ? canon(m.organisation) : '', lienLinkedin: m.lienLinkedin || '', photo: checkImg(m.photo, m.nom), relation: REL[norm(m.relation)] ? norm(m.relation) : 'inspired_by' })),
      ressources: list(it.ressources).filter(r => r && has(r.titre)).map(r => ({ titre: String(r.titre).trim(), type: TYPES[norm(r.type)] ? norm(r.type) : 'website', auteur: r.auteur || '', lien: r.lien || '', image: checkImg(r.image, r.titre), raison: r.raison || '', relation: REL[norm(r.relation)] ? norm(r.relation) : 'mentions' })),
      sujets: list(it.sujets).filter(has),
      methode: it.methode && list(it.methode.etapes).length ? it.methode : null,
      aRetenir: it.aRetenir && list(it.aRetenir.points).length ? it.aRetenir : null,
      motsCles: mots, motFin: mots[0] || ''
    };
    list(it.mentors).forEach((m, j) => { if (!m || !has(m.nom || m)) warn(where + ' : le mentor n°' + (j + 1) + ' n\'a pas de nom.'); });
    list(it.mentors).concat(list(it.ressources)).forEach(x => { if (x && has(x.relation) && !REL[norm(x.relation)]) warn(where + ' : relation « ' + x.relation + ' » inconnue (' + Object.keys(REL).join(', ') + ').'); });
    list(it.ressources).forEach(x => { if (x && has(x.type) && !TYPES[norm(x.type)]) warn(where + ' : type de ressource « ' + x.type + ' » inconnu (' + Object.keys(TYPES).join(', ') + ').'); });
    ALL.push(p);
  });
  ALL.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const N = ALL.length;
  const CHRONO = ALL.slice().reverse();
  const usedNums = {};
  ALL.forEach(p => { if (p.numeroFixe) { if (usedNums[p.numeroFixe]) warn('Numéro NEXTGEN #' + p.numeroFixe + ' utilisé deux fois (' + usedNums[p.numeroFixe] + ', ' + p.slug + ').'); usedNums[p.numeroFixe] = p.slug; } });
  let nextNum = 1;
  CHRONO.forEach(p => { if (!p.numeroFixe) { while (usedNums[nextNum]) nextNum++; p.numeroFixe = nextNum; usedNums[nextNum] = p.slug; } });
  const LAST = (ALL[0] && (ALL[0].maj || ALL[0].date)) || today;
  const bySlug = {}, byName = {};
  ALL.forEach(p => {
    p.num = pad(p.numeroFixe);
    p.dateLabel = fmtDate(p.date);
    p.path = 'talents/' + p.slug + '/';
    p.prenom = first(p.nom);
    p.sections = {};
    p.reponses.forEach(r => { const k = norm(r.section || 'autre'); (p.sections[k] = p.sections[k] || []).push(r); });
    bySlug[p.slug] = p; byName[norm(p.nom)] = p;
  });
  const FEATURED = ALL.filter(p => p.featured).concat(ALL.filter(p => !p.featured));

  /* ---------- agrégats ---------- */
  const TOOLS = (() => {
    const m = {}, slugs = {};
    ALL.forEach(p => p.outils.forEach(o => {
      const k = norm(o.nom);
      if (!m[k]) { let s = slugify(o.nom), s2 = s, c = 2; while (slugs[s2]) s2 = s + '-' + (c++); slugs[s2] = 1; m[k] = { name: o.nom, slug: s2, cat: TOOLCAT[k] || '', by: [] }; }
      if (!m[k].by.some(b => b.p === p)) m[k].by.push({ p, usage: o.usage });
    }));
    return Object.keys(m).map(k => { const t = m[k]; t.count = t.by.length; return t; }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'));
  })();
  const SEUIL = +SITE.seuilPageOutil || 2;
  TOOLS.forEach(t => { t.page = t.count >= SEUIL; t.path = 'outils/' + t.slug + '/'; });
  const uniqSlug = (store, name) => { let s = slugify(name), s2 = s, c = 2; while (store[s2]) s2 = s + '-' + (c++); store[s2] = 1; return s2; };
  const MENTORS = (() => {
    const m = {}, sl = {};
    ALL.forEach(p => p.mentors.forEach(x => {
      const k = norm(x.nom);
      if (!m[k]) m[k] = { nom: x.nom, slug: uniqSlug(sl, x.nom), expertise: '', organisation: '', lien: '', photo: '', by: [] };
      const o = m[k]; o.expertise = o.expertise || x.expertise; o.organisation = o.organisation || x.organisation; o.lien = o.lien || x.lienLinkedin; o.photo = o.photo || x.photo;
      o.by.push({ p, citation: x.citation, relation: x.relation });
    }));
    return Object.keys(m).map(k => m[k]).sort((a, b) => b.by.length - a.by.length || a.nom.localeCompare(b.nom, 'fr'));
  })();
  const mentorOf = n => MENTORS.find(x => norm(x.nom) === norm(n));
  const RESS = (() => {
    const m = {}, sl = {};
    ALL.forEach(p => p.ressources.forEach(x => {
      const k = norm(x.titre);
      if (!m[k]) m[k] = { titre: x.titre, slug: uniqSlug(sl, x.titre), type: x.type, auteur: '', lien: '', image: '', by: [] };
      const o = m[k]; o.auteur = o.auteur || x.auteur; o.lien = o.lien || x.lien; o.image = o.image || x.image;
      o.by.push({ p, raison: x.raison, relation: x.relation });
    }));
    return Object.keys(m).map(k => m[k]).sort((a, b) => b.by.length - a.by.length || a.titre.localeCompare(b.titre, 'fr'));
  })();
  const resOf = t => RESS.find(x => norm(x.titre) === norm(t));
  const toolOf = n => TOOLS.find(t => norm(t.name) === norm(canon(n)));
  const synth = t => t.name + ' est cité par ' + t.count + ' des ' + plural(N, 'talent interviewé', 'talents interviewés') + (t.cat ? ' (' + t.cat + ')' : '') + '.';
  const XP = (() => {
    const counts = {};
    ALL.forEach(p => p.expertises.forEach(x => { counts[norm(x)] = counts[norm(x)] || { name: x, n: 0 }; counts[norm(x)].n++; }));
    const order = list(SITE.expertises).map(canon);
    const known = order.filter(x => counts[norm(x)]).map(x => counts[norm(x)]);
    const extra = Object.keys(counts).filter(k => !order.some(o => norm(o) === k)).map(k => counts[k]);
    return known.concat(extra);
  })();
  const PROMOS = Array.from(new Set(ALL.map(p => p.promo))).sort().reverse();
  const searchText = p => {
    let parts = [p.nom, p.poste, p.entreprise, p.secteur, p.citation, p.accroche, p.intro].concat(p.expertises, p.marques, p.motsCles, p.sujets, p.outils.map(o => o.nom + ' ' + (TOOLCAT[norm(o.nom)] || '')), p.mentors.map(m => m.nom + ' ' + m.organisation));
    p.reponses.forEach(r => Object.keys(r).forEach(k => { if (k !== 'section') parts = parts.concat(list(r[k])); }));
    return norm(parts.join(' ')).replace(/\s+/g, ' ');
  };
  const similar = p => {
    const set = a => { const o = {}; a.forEach(x => { o[norm(x)] = 1; }); return o; };
    const X = set(p.expertises), T = set(p.outils.map(o => o.nom)), M = set(p.mentors.map(m => m.nom)), B = set(p.marques.concat(p.entreprise)), S = set(p.sujets);
    return ALL.filter(x => x !== p).map(x => {
      let s = 0;
      x.expertises.forEach(e => { if (X[norm(e)]) s += 2; });
      x.outils.forEach(o => { if (T[norm(o.nom)]) s += 2; });
      x.mentors.forEach(m => { if (M[norm(m.nom)]) s += 1.5; });
      x.marques.concat(x.entreprise).forEach(b => { if (B[norm(b)]) s += 1; });
      x.sujets.forEach(t => { if (S[norm(t)]) s += 1; });
      if (x.secteur && norm(x.secteur) === norm(p.secteur)) s += 1;
      return { x, s };
    }).sort((a, b) => b.s - a.s || (b.x.date || '').localeCompare(a.x.date || '')).slice(0, 3).map(o => o.x);
  };

  /* ---------- Insights (facultatif) ---------- */
  const INSIGHTS = INSIGHTS_RAW.filter(x => x && has(x.slug) && has(x.titre)).map(x => ({
    slug: String(x.slug).trim(), titre: x.titre, date: x.date || '', chapo: x.chapo || '', path: 'insights/' + String(x.slug).trim() + '/',
    sections: list(x.sections).map(s => ({ titre: s.titre || '', texte: list(s.texte), people: list(s.people).map(sl => { if (!bySlug[sl]) warn('Insight « ' + x.slug + ' » : Talents inconnu « ' + sl + ' ».'); return bySlug[sl]; }).filter(Boolean) }))
  })).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  /* ---------- liens relatifs ---------- */
  function linker(path, absolute) {
    const depth = path ? path.split('/').filter(Boolean).length : 0;
    const R = absolute ? '/' : '../'.repeat(depth);
    const L = p => {
      p = p || '';
      if (LOCAL && !absolute) { const m = /^([^#]*)(#.*)?$/.exec(p), b = m[1], hsh = m[2] || ''; if (b === '' || /\/$/.test(b)) return R + b + 'index.html' + hsh; }
      return (R + p) || './';
    };
    L.a = p => /^https?:\/\//.test(p) ? p : R + p;
    return L;
  }

  /* ---------- fragments ---------- */
  const MASCOT_ALT = 'Mascotte ' + NAME + ', un petit crocodile rose';
  const mascot = (L, w, cls) => `<img class="${cls || 'mascot'}" src="${L.a('images/mascotte.png')}" alt="${esc(MASCOT_ALT)}" width="${w}" height="${Math.round(w * 246 / 349)}" loading="lazy" decoding="async">`;
  function portrait(p, L, o) {
    o = o || {};
    let img = '';
    if (p.photo) {
      const v = variants(p.photo);
      const srcset = v.length ? ` srcset="${v.map(x => esc(L.a(x[0])) + ' ' + x[1] + 'w').join(', ')}" sizes="${o.sizes || '(max-width: 640px) 50vw, 320px'}"` : '';
      img = `<img src="${esc(L.a(p.photo))}"${srcset} alt="Portrait de ${esc(p.nom)}" width="800" height="1000" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.remove()">`;
    }
    const alt = o.hover && p.photos[0] ? `<img class="alt" src="${esc(L.a(p.photos[0]))}" alt="" width="800" height="1000" loading="lazy" decoding="async" onerror="this.remove()">` : '';
    const q = o.hover && (p.citation || p.accroche) ? `<span class="pq" aria-hidden="true">« ${esc(p.citation || p.accroche)} »</span>` : '';
    return `<span class="portrait${o.cls ? ' ' + o.cls : ''}"><span class="ini" aria-hidden="true">${esc(initials(p.nom))}</span>${img}${alt}${q}</span>`;
  }
  function avatar(name, photo, size, L) {
    return `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.36)}px">` + (photo
      ? `<span aria-hidden="true">${esc(initials(name))}</span><img src="${esc(L.a(photo))}" alt="Portrait de ${esc(name)}" width="${size}" height="${size}" loading="lazy" onerror="this.remove()">`
      : `<span aria-hidden="true">${esc(initials(name))}</span>`) + '</span>';
  }
  function logo(name, size, deco) {
    const d = LOGOS[norm(name)];
    return `<span class="logo" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.3)}px;font-size:${Math.round(size * 0.34)}px">` +
      (d ? `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&amp;sz=128" alt="${deco ? '' : 'Logo ' + esc(name)}" width="${Math.round(size * 0.6)}" height="${Math.round(size * 0.6)}" loading="lazy" onerror="this.parentNode.textContent='${esc(initials(name))}'">` : `<span aria-hidden="true">${esc(initials(name))}</span>`) + '</span>';
  }
  const xps = () => ''; // badges d'expertise masqués (les expertises restent dans « En bref », les filtres et le JSON-LD)
  const co = (name, size, cls) => `<span class="co${cls ? ' ' + cls : ''}">${logo(name, size || 32, true)}<strong>${esc(name)}</strong></span>`;
  const sample = p => p.exemple ? '<span class="tag-sample">Profil d\'exemple</span>' : '';
  function pcard(p, L, h, filterable) {
    h = h || 'h3';
    return `<a class="pc" href="${L(p.path)}"${filterable ? ` data-item data-exp="${esc(p.expertises.map(norm).join('|'))}" data-search="${esc(searchText(p))}"` : ''}>` +
      portrait(p, L, { hover: true }) +
      `<span class="pc-num">NEXTGEN #${p.num}</span><${h} class="pc-name">${esc(p.nom)}</${h}>` +
      `<span class="pc-role">${esc(p.poste)}</span>${co(p.entreprise, 28, 'pc-co')}` + sample(p) + '</a>';
  }
  const attribution = p => `<strong>${esc(p.nom)}</strong> — ${esc(p.poste)}, ${esc(p.entreprise)}`;

  /* ---------- JSON-LD communs ---------- */
  const ORG = { '@type': 'Organization', '@id': abs('#organization'), name: BRAND, alternateName: NAME, url: abs(''), logo: abs('images/favicon.png'), image: abs('images/og-image.png') };
  if (has(LINKS.linkedin)) ORG.sameAs = [LINKS.linkedin];
  const ROBIN = { '@type': 'Person', '@id': abs('a-propos/#auteur'), name: AUTHOR.nom || '', url: abs('a-propos/') };
  if (AUTHOR.poste) ROBIN.jobTitle = AUTHOR.poste;
  if (AUTHOR.entreprise) ROBIN.worksFor = { '@type': 'Organization', name: AUTHOR.entreprise };
  if (has(LINKS.linkedin)) ROBIN.sameAs = [LINKS.linkedin];
  const authorPhoto = checkImg(AUTHOR.photo, AUTHOR.nom || 'l\'auteur');
  if (authorPhoto) ROBIN.image = abs(authorPhoto);
  const personLD = p => {
    const o = { '@type': 'Person', '@id': abs(p.path) + '#personne', name: p.nom, url: abs(p.path), jobTitle: p.poste, worksFor: { '@type': 'Organization', name: p.entreprise } };
    if (p.photo) o.image = abs(p.photo);
    if (p.lienLinkedin) o.sameAs = [p.lienLinkedin];
    if (p.expertises.length) o.knowsAbout = p.expertises;
    return o;
  };

  /* ---------- gabarit ---------- */
  const NAV = [['people', 'talents/', 'Talents'], ['inspirations', 'inspirations/', 'Inspirations']].concat(INSIGHTS.length ? [['insights', 'insights/', 'Insights']] : [], [['apropos', 'a-propos/', 'À propos']]);
  const FOOTLINKS = [['talents/', 'Talents'], ['inspirations/', 'Inspirations'], ['mur-de-mots/', 'Mur des mots'], ['a-propos/', 'À propos'], ['communaute/', 'Communauté']];
  const FILES = {}, SITEMAP = [];
  function page(o) {
    const L = linker(o.path, o.absolute);
    const main = o.main(L);
    const url = abs(o.path);
    const img = o.image ? abs(o.image) : abs('images/og-image.png');
    const crumbs = [['Accueil', '']].concat(o.crumbs || []);
    const graph = (o.ld || []).concat(o.noindex ? [] : [{ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, k) => ({ '@type': 'ListItem', position: k + 1, name: c[0], item: abs(c[1]) })) }]);
    const f = SITE.footer || {};
    const html = '<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      `<title>${esc(o.title)}</title>\n<meta name="description" content="${esc(o.desc)}">\n` +
      (o.noindex ? '<meta name="robots" content="noindex">\n' : `<link rel="canonical" href="${esc(url)}">\n<meta name="robots" content="index, follow, max-image-preview:large">\n`) +
      `<meta property="og:type" content="${o.ogType || 'website'}">\n<meta property="og:site_name" content="${esc(BRAND)}">\n<meta property="og:locale" content="fr_FR">\n` +
      `<meta property="og:title" content="${esc(o.title)}">\n<meta property="og:description" content="${esc(o.desc)}">\n<meta property="og:url" content="${esc(url)}">\n` +
      `<meta property="og:image" content="${esc(img)}">\n` + (o.image ? '' : '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n') +
      `<meta property="og:image:alt" content="${esc(o.imageAlt || BRAND)}">\n` +
      (o.published ? `<meta property="article:published_time" content="${o.published}">\n` + (has(AUTHOR.nom) ? `<meta property="article:author" content="${esc(AUTHOR.nom)}">\n` : '') : '') +
      `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(o.title)}">\n<meta name="twitter:description" content="${esc(o.desc)}">\n<meta name="twitter:image" content="${esc(img)}">\n` +
      `<link rel="icon" type="image/png" href="${L.a('images/favicon.png')}">\n<link rel="apple-touch-icon" href="${L.a('images/apple-touch-icon.png')}">\n` +
      (o.preload ? `<link rel="preload" as="image" href="${esc(L.a(o.preload))}" fetchpriority="high">\n` : '') +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&amp;family=JetBrains+Mono:wght@400;500;700&amp;family=Nunito:wght@800;900&amp;display=swap" rel="stylesheet">\n' +
      `<link rel="stylesheet" href="${L.a('assets/css/style.css')}">\n<script>document.documentElement.classList.add('js')</script>\n` +
      (graph.length ? `<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph })}</script>\n` : '') +
      '</head>\n<body>\n<a class="skip" href="#main">Aller au contenu</a>\n<div class="wrap">\n' +
      `<header class="hdr"><div class="hdr-in"><a class="brand" href="${L('')}"><span class="brand-logo"><img src="${L.a('images/mascotte.png')}" alt="" width="46" height="46"></span><span class="brand-name">${esc(NAME)}</span></a>` +
      `<nav class="nav" aria-label="Navigation principale">${NAV.map(n => `<a href="${L(n[1])}"${o.nav === n[0] ? ' class="on" aria-current="page"' : ''}>${esc(n[2])}</a>`).join('')}<a class="nav-cta" href="${L('communaute/')}"${o.nav === 'communaute' ? ' aria-current="page"' : ''}>Rejoindre la communauté</a></nav></div></header>\n` +
      `<main id="main">\n${main}\n</main>\n` +
      `<footer class="ftr"><div class="ftr-in"><nav class="ftr-nav" aria-label="Pied de page">${FOOTLINKS.map(l => `<a href="${L(l[0])}">${esc(l[1])}</a>`).join('')}</nav><div class="ftr-meta"><span>${esc(f.gauche || '')}</span><span>${esc(f.droite || '')}</span></div></div></footer>\n</div>\n` +
      (o.script ? `<script src="${L.a('assets/js/app.js')}" defer></script>\n` : '') + '</body>\n</html>\n';
    FILES[o.file || (o.path + 'index.html')] = html;
    if (!o.noindex) SITEMAP.push({ loc: url, lastmod: o.lastmod || LAST, priority: o.priority || '0.6' });
  }
  const joinBlock = (L, title) => `<section class="join" aria-labelledby="join-h"><div class="join-txt"><p class="eyebrow">Communauté</p><h2 class="join-h" id="join-h">${title || 'Join the Next Gen'}</h2>` +
    `<p>Vous connaissez une future pépite du CRO ou de l'e-commerce ? Proposez-la. Vous voulez échanger avec les Talents et les passionnés de CRO ? Rejoignez la communauté.</p>` +
    `<div class="ctas">${PROPOSER ? `<a class="btn dark" href="${esc(PROPOSER)}" target="_blank" rel="noopener">Proposer un talent →</a>` : ''}<a class="btn white" href="${L('communaute/')}">Rejoindre la communauté</a></div></div>${mascot(L, 260)}</section>`;

  /* ---------- ACCUEIL ---------- */
  page({
    path: '', nav: 'home', priority: '1.0', preload: FEATURED[0] && FEATURED[0].photo,
    title: BRAND + ' — Les talents qui font bouger le CRO & e-commerce',
    desc: clamp(SITE.sousTitre + ' ' + plural(N, 'portrait', 'portraits') + ' de la Promo ' + (SITE.promoActuelle || '') + ', par ' + (AUTHOR.nom || '') + '.'),
    ld: [{ '@type': 'WebSite', '@id': abs('#website'), name: BRAND, alternateName: NAME, url: abs(''), inLanguage: 'fr-FR', description: SITE.description || '', publisher: { '@id': ORG['@id'] },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: abs('talents/') + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
      Object.assign({}, ORG, { founder: ROBIN })],
    main: L => {
      const f = FEATURED[0], side = FEATURED.slice(1, 4);
      let h = `<section class="hero"><div class="hero-txt"><p class="eyebrow pinkd">Promo ${esc(SITE.promoActuelle || '')} · une série de ${esc(AUTHOR.nom || '')}</p>` +
        `<h1 class="display">${esc(SITE.baseline || '').replace(/CRO/, '<span class="pink">CRO</span>')}</h1><p class="hero-sub">${esc(SITE.sousTitre || '')}</p>` +
        `<div class="ctas"><a class="btn" href="${L('talents/')}">Découvrir les Talents →</a><a class="link-arrow" href="${L('a-propos/')}">À propos du projet</a></div></div>${mascot(L, 220, 'mascot hero-mascot')}</section>`;
      if (f) {
        h += `<section class="feat" aria-labelledby="feat-h"><h2 class="eyebrow rule" id="feat-h">Featured Talents</h2><div class="feat-grid">` +
          `<a class="feat-photo" href="${L(f.path)}" tabindex="-1" aria-hidden="true">${portrait(f, L, { eager: true, cls: 'xl', sizes: '(max-width: 900px) 100vw, 55vw' })}<span class="num-badge">NEXTGEN #${f.num}</span></a>` +
          `<div class="feat-body"><p class="eyebrow pinkd">NEXTGEN #${f.num} · Promo ${esc(f.promo)}</p><h3 class="feat-name"><a href="${L(f.path)}">${esc(f.nom)}</a></h3>` +
          `<p class="feat-role">${esc(f.poste)}</p>${co(f.entreprise, 40, 'co-lg')}${xps(f.expertises)}` +
          (f.citation ? `<blockquote class="feat-q"><p>« ${esc(f.citation)} »</p><footer>— ${esc(f.nom)}</footer></blockquote>` : '') + sample(f) +
          `<a class="btn" href="${L(f.path)}">Découvrir ${esc(f.prenom)} →</a></div></div>` +
          (side.length ? `<ul class="side">${side.map(p => `<li><a class="side-i" href="${L(p.path)}">${portrait(p, L, { cls: 'sm' })}<span><span class="pc-num">NEXTGEN #${p.num}</span><strong>${esc(p.nom)}</strong><span>${esc(p.poste)}</span>${co(p.entreprise, 22)}${p.citation ? `<em>« ${esc(p.citation)} »</em>` : ''}</span></a></li>`).join('')}</ul>` : '') +
          '</section>';
        h += `<section class="meet" aria-labelledby="meet-h"><div class="row-between"><div class="stack"><p class="eyebrow pinkd">Promo ${esc(SITE.promoActuelle || '')}</p><h2 class="h2" id="meet-h">Meet the Next Gen</h2></div>` +
          `<a class="link-arrow" href="${L('talents/')}">Découvrir toute la Promo →</a></div><div class="pgrid">${ALL.slice(0, 8).map(p => pcard(p, L, 'h3')).join('')}</div></section>`;
      }
      h += `<section class="manif" aria-labelledby="manif-h"><h2 class="eyebrow rule" id="manif-h">Le projet</h2><p class="manif-t">${esc(SITE.projetCourt || '')}</p><a class="link-arrow" href="${L('a-propos/')}">Découvrir le projet →</a></section>`;
      const T = list(SITE.temoignages).filter(r => r && has(r.citation));
      if (T.length >= 3) h += `<section class="voices" aria-labelledby="voices-h"><h2 class="eyebrow rule" id="voices-h">Ils en parlent</h2><div class="voices-grid">${T.slice(0, 5).map(r => `<figure><blockquote><p>« ${esc(r.citation)} »</p></blockquote><figcaption><strong>${esc(r.nom || '')}</strong>${r.role ? ' — ' + esc(r.role) : ''}</figcaption></figure>`).join('')}</div></section>`;
      h += joinBlock(L);
      return h;
    }
  });

  /* ---------- PEOPLE (directory) ---------- */
  page({
    path: 'talents/', nav: 'people', priority: '0.9', crumbs: [['Talents', 'talents/']], script: true,
    title: 'Talents CRO & e-commerce — ' + BRAND,
    desc: clamp('Meet the Next Gen : ' + ALL.slice(0, 4).map(p => p.nom + ' (' + p.entreprise + ')').join(', ') + (N > 4 ? '…' : '.') + ' Recherchez par nom, entreprise, expertise, outil ou sujet.'),
    ld: [{ '@type': 'CollectionPage', name: 'Meet the Next Gen', url: abs('talents/'), inLanguage: 'fr-FR', isPartOf: { '@id': abs('#website') },
      mainEntity: { '@type': 'ItemList', numberOfItems: N, itemListElement: ALL.map((p, k) => ({ '@type': 'ListItem', position: k + 1, url: abs(p.path), name: p.nom })) } }],
    main: L => `<section class="page-head"><p class="eyebrow pinkd">${plural(N, 'talent', 'talents')} · ${PROMOS.map(x => 'Promo ' + esc(x)).join(' · ')}</p><h1 class="h1">Meet the Next Gen</h1><p class="lead">Les talents qui font bouger le CRO et le e-commerce.</p></section>` +
      `<div class="searchbar js-only"><label class="search"><span aria-hidden="true">⌕</span><input id="q" type="search" placeholder="Nom, entreprise, expertise, outil, sujet…" aria-label="Rechercher un talent"><button id="clear" class="hidden" type="button">Effacer ✕</button></label>` +
      `<p class="mono small" id="result-label" data-one="talent" data-many="talents" aria-live="polite">${plural(N, 'talent', 'talents')}</p></div>` +
      (XP.length > 1 ? `<div class="filters js-only" role="group" aria-label="Filtrer par expertise"><button type="button" class="filter on" data-filter="exp" data-value="" aria-pressed="true">Tous</button>${XP.map(x => `<button type="button" class="filter" data-filter="exp" data-value="${esc(norm(x.name))}" aria-pressed="false">${esc(x.name)} <small>${x.n}</small></button>`).join('')}</div>` : '') +
      `<div data-list>${PROMOS.map(pr => { const ps = ALL.filter(p => p.promo === pr); return `<section class="promo" data-group aria-labelledby="promo-${esc(pr)}"><h2 class="promo-h" id="promo-${esc(pr)}">Promo ${esc(pr)} <span>${ps.length}</span></h2><div class="pgrid">${ps.map(p => pcard(p, L, 'h3', true)).join('')}</div></section>`; }).join('')}</div>` +
      '<p class="empty hidden" id="empty" data-tpl="Aucun talent ne correspond à ce filtre." data-tpl-q="Aucun talent ne correspond à « {q} »."></p>'
  });

  /* ---------- FICHE PEOPLE ---------- */
  ALL.forEach((p, idx) => {
    const prev = ALL[(idx - 1 + N) % N], next = ALL[(idx + 1) % N], multi = N > 1, sim = similar(p);
    const P = p.prenom, dP = de(P);
    const covered = [];
    if ((p.sections.declic || []).length) covered.push('son parcours dans le CRO');
    if (p.outils.length) covered.push('ses outils');
    if (p.mentors.length) covered.push('ses inspirations');
    if ((p.sections.conseil || []).length) covered.push('ses conseils');
    if ((p.sections.hottake || []).length) covered.push('sa vision du e-commerce');
    const autoIntro = `Rencontre avec ${p.nom}, ${p.poste} chez ${p.entreprise}, qui partage ${covered.length > 1 ? covered.slice(0, -1).join(', ') + ' et ' + covered[covered.length - 1] : (covered[0] || 'son expérience')}.`;
    const desc = clamp(`Découvrez le parcours ${de(p.nom)}, ${p.poste} chez ${p.entreprise} : ${covered.filter(c => c !== 'son parcours dans le CRO').join(', ') || 'son expérience'}${p.citation ? '. « ' + p.citation + ' »' : '.'}`);
    const person = personLD(p);
    const art = { '@type': 'Article', '@id': abs(p.path) + '#article', headline: clamp(p.nom + ', ' + p.poste + ' chez ' + p.entreprise, 110), description: desc, inLanguage: 'fr-FR',
      url: abs(p.path), mainEntityOfPage: abs(p.path), image: p.photo ? abs(p.photo) : abs('images/og-image.png'), author: ROBIN, publisher: { '@id': ORG['@id'] }, about: { '@id': person['@id'] },
      keywords: p.expertises.concat(p.outils.map(o => o.nom), p.sujets).join(', ') };
    if (p.date) { art.datePublished = p.date; art.dateModified = p.maj || p.date; }
    const profile = { '@type': 'ProfilePage', url: abs(p.path), inLanguage: 'fr-FR', mainEntity: person, isPartOf: { '@id': abs('#website') } };
    if (p.date) { profile.dateCreated = p.date; profile.dateModified = p.maj || p.date; }
    page({
      path: p.path, nav: 'people', ogType: 'article', published: p.date, lastmod: p.maj || p.date, priority: '0.8', image: p.photo, imageAlt: 'Portrait de ' + p.nom, preload: p.photo,
      crumbs: [['Talents', 'talents/'], [p.nom, p.path]],
      title: `${p.nom}, ${p.poste} — ${BRAND}`,
      desc, ld: [profile, art, ORG],
      main: L => {
        const S = p.sections, lines = v => list(v).filter(has);
        let n = 0, h = '';
        const label = t => { n++; return `<p class="eyebrow pinkd">${pad(n)} — ${t}</p>`; };
        const sec = (lbl, title, body, cls) => `<section class="sec${cls ? ' ' + cls : ''}"><div class="sec-l">${label(lbl)}<h2 class="sec-h">${title}</h2></div><div class="sec-b">${body}</div></section>`;
        const q = r => r.question ? `<h3 class="q-sub">${esc(r.question)}</h3>` : '';
        const ttl = (rs, def) => esc((rs.find(r => has(r.titreSection)) || {}).titreSection || def);

        h += `<nav class="crumbs" aria-label="Fil d'Ariane"><a href="${L('talents/')}">← Tous les Talents</a>${multi ? `<span><a href="${L(prev.path)}">← ${esc(prev.nom)}</a><a href="${L(next.path)}">${esc(next.nom)} →</a></span>` : ''}</nav>`;
        h += '<article class="fiche">';
        h += `<header class="ph"><div class="ph-txt"><p class="eyebrow pinkd">NEXTGEN #${p.num} · Promo ${esc(p.promo)}</p>` +
          `<h1><span class="ph-name">${esc(p.nom)}</span><span class="vh"> — </span><span class="ph-role">${esc(p.poste)}<span class="vh"> chez </span></span>${co(p.entreprise, 40, 'co-lg')}</h1>` +
          xps(p.expertises) + (p.citation ? `<blockquote class="ph-q"><p>« ${esc(p.citation)} »</p><footer>— ${esc(p.nom)}</footer></blockquote>` : '') + sample(p) +
          `<p class="ph-meta mono">Interview par <a href="${L('a-propos/')}">${esc(AUTHOR.nom || '')}</a>${p.dateLabel ? ` · <time datetime="${p.date}">${esc(p.dateLabel)}</time>` : ''}${p.lienLinkedin ? ` · <a href="${esc(p.lienLinkedin)}" target="_blank" rel="noopener">LinkedIn de ${esc(P)} ↗</a>` : ''}</p></div>` +
          `<div class="ph-photo">${portrait(p, L, { eager: true, cls: 'xl', sizes: '(max-width: 900px) 100vw, 45vw' })}</div></header>`;
        h += `<section class="intro" aria-label="Introduction"><p>${esc(p.intro || autoIntro)}</p></section>`;

        // En bref
        const exp = p.careerPath.filter(c => c.type !== 'formation');
        const brief = [['Rôle', esc(p.poste)], ['Entreprise', co(p.entreprise, 28)]];
        if (p.secteur) brief.push(['Secteur', esc(p.secteur)]);
        if (p.expertises.length) brief.push(['Expertises', p.expertises.map(esc).join(' · ')]);
        if (exp.length) brief.push(['Parcours', exp.map(c => esc(c.etape)).join(' → ')]);
        else (S.parcours || []).forEach(r => { if (r.question && lines(r.reponse).length) brief.push([esc(r.question), lines(r.reponse).map(esc).join(' · ')]); });
        if (p.motFin) brief.push(['Conviction', `« Le CRO sans ${esc(p.motFin.toLowerCase())}, ce n'est pas du CRO. »`]);
        h += `<section class="brief" aria-labelledby="brief-h"><h2 class="eyebrow" id="brief-h">${esc(P)}, en bref</h2><dl>${brief.map(b => `<div><dt>${b[0]}</dt><dd>${b[1]}</dd></div>`).join('')}</dl></section>`;

        // Parcours / déclic
        const dec = (S.declic || []).filter(r => has(r.reponse));
        if (dec.length) h += sec('Parcours', ttl(dec, `Le déclic : comment ${P} a découvert le CRO`), dec.map(r => q(r) + `<p>${esc(r.reponse)}</p>`).join(''));
        if (p.careerPath.length) {
          h += `<section class="career" aria-labelledby="career-h"><h2 class="eyebrow" id="career-h">Career Path — le parcours ${esc(dP)} en ${p.careerPath.length} étapes</h2><ol>${p.careerPath.map(c => `<li><span class="c-type">${c.type === 'formation' ? 'Formation' : 'Expérience'}</span><strong>${esc(c.etape)}</strong>${c.detail ? `<span class="c-d">${esc(c.detail)}</span>` : ''}</li>`).join('')}</ol></section>`;
        }
        // Mindset
        (S.mindset || []).filter(r => has(r.titre) || has(r.reponse)).forEach(r => {
          n++;
          h += `<section class="mind"><p class="eyebrow">${pad(n)} — Mindset</p><h2 class="mind-h">${ttl([r], `La phrase qui guide ${P}`)}</h2>` +
            (r.titre ? `<blockquote class="mind-q"><p>« ${esc(r.titre)} »</p>${r.auteur ? `<footer>— ${esc(r.auteur)}</footer>` : ''}</blockquote>` : '') +
            (r.reponse ? `<p class="mind-p">${esc(r.reponse)}</p><p class="mind-a">— ${esc(p.nom)}</p>` : '') + '</section>';
        });
        // Méthode
        if (p.methode) {
          n++;
          h += `<section class="method"><div class="sec-l"><p class="eyebrow pinkd">${pad(n)} — Méthode</p><h2 class="sec-h">${esc(p.methode.titre || 'La méthode ' + dP)}</h2>${p.methode.synthese ? `<p class="note">Synthèse rédigée par NextGen à partir de l'interview, et non une méthode formulée telle quelle par ${esc(P)}.</p>` : ''}</div>` +
            `<ol class="steps">${list(p.methode.etapes).map((e, k) => `<li><span>${pad(k + 1)}</span><h3>${esc(e.titre)}</h3>${e.texte ? `<p>${esc(e.texte)}</p>` : ''}</li>`).join('')}</ol></section>`;
        }
        // Citation XXL
        if (p.citation) h += `<figure class="xxl"><blockquote><p>« ${esc(p.citation)} »</p></blockquote><figcaption>${attribution(p)}</figcaption></figure>`;
        // Conseil
        const cons = (S.conseil || []).filter(r => has(r.titre) || has(r.reponse));
        if (cons.length) h += sec('Conseil', ttl(cons, `Le conseil ${dP} aux juniors`), cons.map(r => q(r) + (r.titre && norm(r.titre).replace(/[.!]$/, '') !== norm(p.citation).replace(/[.!]$/, '') ? `<p class="big">${esc(r.titre)}</p>` : '') + (r.reponse ? `<p>${esc(r.reponse)}</p>` : '')).join(''));
        // Toolbox
        if (p.outils.length) {
          n++;
          h += `<section class="tb" aria-labelledby="tb-h"><div class="sec-l"><p class="eyebrow pinkd">${pad(n)} — Toolbox</p><h2 class="sec-h" id="tb-h">Quels outils ${esc(P)} utilise au quotidien</h2><p class="note">${p.outils.length} outils, et l'usage qu'en fait ${esc(P)} selon l'interview. <a href="${L('inspirations/')}#toolbox">Toute la toolbox de la Promo →</a></p></div><div class="tb-list">` +
            p.outils.map(o => { const t = toolOf(o.nom), cat = TOOLCAT[norm(o.nom)]; return `<div class="tb-i">${logo(o.nom, 44)}<div><h3>${t && t.page ? `<a href="${L(t.path)}">${esc(o.nom)}</a>` : esc(o.nom)}</h3>${cat ? `<p class="tb-cat">${esc(cat)}</p>` : ''}${o.usage ? `<p>${esc(o.usage)}</p>` : ''}</div></div>`; }).join('') + '</div></section>';
        }
        // Inspirations
        if (p.mentors.length) {
          h += sec('Inspirations', `Qui inspire ${esc(P)} ?`, `<div class="insp">${p.mentors.map(m => {
            const fiche = byName[norm(m.nom)], mo = mentorOf(m.nom);
            return `<div class="insp-i">${avatar(m.nom, m.photo, 56, L)}<div><h3>${fiche ? `<a href="${L(fiche.path)}">${esc(m.nom)}</a>` : `<a href="${L('inspirations/')}#p-${mo.slug}">${esc(m.nom)}</a>`}</h3><p class="rel">${REL[m.relation].tag}</p>` +
              ((m.expertise || m.organisation) ? `<p class="insp-x">${[m.expertise, m.organisation].filter(Boolean).map(esc).join(' · ')}</p>` : '') +
              (m.citation ? `<p>${esc(m.citation)}</p>` : '') + `<a class="mono small" href="${esc(m.lienLinkedin || liSearch(m.nom))}" target="_blank" rel="noopener">LinkedIn de ${esc(first(m.nom))} ↗</a></div></div>`;
          }).join('')}</div>`, 'sec-insp');
        }
        if (p.ressources.length) {
          h += sec('Read · Watch · Listen', `Les contenus cités par ${esc(P)}`, `<div class="rwl-mini">${p.ressources.map(r => { const ro = resOf(r.titre); return `<div class="rwl-m"><span class="rtype">${TYPES[r.type]}</span><h3><a href="${L('inspirations/')}#r-${ro.slug}">${esc(r.titre)}</a></h3>${r.auteur ? `<p class="insp-x">${esc(r.auteur)}</p>` : ''}${r.raison ? `<p>« ${esc(r.raison)} »</p>` : ''}<p class="rel">${REL[r.relation].tag}</p></div>`; }).join('')}</div>`);
        }
        // Sections libres
        const KNOWN = ['parcours', 'declic', 'mindset', 'conseil', 'hottake'];
        Object.keys(S).filter(k => KNOWN.indexOf(k) < 0).forEach(k => {
          const items = S[k].filter(r => has(r.reponse));
          if (items.length) h += sec(esc(items[0].section || 'Et aussi'), ttl(items, items[0].section || 'Et aussi'), items.map(r => q(r) + lines(r.reponse).map(l => `<p>${esc(l)}</p>`).join('')).join(''));
        });
        // Hot take
        (S.hottake || []).filter(r => has(r.question) && (has(r.oui) || has(r.non))).forEach(r => {
          n++;
          h += `<section class="hot"><div class="hot-q"><p class="eyebrow pinkd">${pad(n)} — Vision · #SansFiltre</p><h2 class="sec-h">${ttl([r], `Le hot take ${dP}`)}</h2><h3 class="hot-question">${esc(r.question)}</h3></div><div class="hot-a">` +
            (has(r.oui) && r.oui !== '—' ? `<div class="yes"><b>Oui</b>${r.ouiContexte ? `<span class="mono small">${esc(r.ouiContexte)}</span>` : ''}<p>${esc(r.oui)}</p></div>` : '') +
            (has(r.non) ? `<div><b>Non</b>${r.nonContexte ? `<span class="mono small">${esc(r.nonContexte)}</span>` : ''}<p>${esc(r.non)}</p></div>` : '') + '</div></section>';
        });
        if (p.sujets.length) h += `<section class="radar" aria-labelledby="radar-h"><h2 class="eyebrow" id="radar-h">Sur le radar ${esc(dP)}</h2><ul>${p.sujets.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>`;
        // À retenir
        if (p.aRetenir) {
          const pts = list(p.aRetenir.points);
          h += `<section class="remember" aria-labelledby="rem-h"><div class="sec-l"><p class="eyebrow pinkd">À retenir</p><h2 class="sec-h" id="rem-h">${pts.length} choses à retenir de l'interview ${esc(dP)}</h2>${p.aRetenir.synthese ? '<p class="note">Synthèse NextGen, fondée sur les réponses de l\'interview.</p>' : ''}</div>` +
            `<ol>${pts.map((x, k) => `<li><span class="r-n">${pad(k + 1)}</span><h3>${esc(x.titre)}</h3>${x.texte ? `<p>${esc(x.texte)}</p>` : ''}</li>`).join('')}</ol></section>`;
        }
        if (p.motFin) {
          h += `<section class="motfin" aria-labelledby="mf-h"><h2 class="eyebrow" id="mf-h">Le mot de la fin ${esc(dP)}</h2><p class="s">Le CRO sans</p><p class="w">${esc(p.motFin)}</p><p class="s">ce n'est pas du CRO.</p>` +
            `<p class="mf-a">— ${esc(p.nom)}</p><a class="link-arrow" href="${L('mur-de-mots/')}">Voir le mur des mots →</a></section>`;
        }
        h += '</article>';
        if (sim.length) h += `<section class="related" aria-labelledby="rel-h"><div class="row-between"><h2 class="h2" id="rel-h">Meet more Talents</h2><a class="link-arrow" href="${L('talents/')}">Découvrir tous les Talents →</a></div><div class="pgrid three">${sim.map(x => pcard(x, L, 'h3')).join('')}</div></section>`;
        if (multi) h += `<nav class="pn" aria-label="Profil précédent et suivant"><a href="${L(prev.path)}" rel="prev"><span>← Précédent</span><span>${esc(prev.nom)}</span></a><a class="r" href="${L(next.path)}" rel="next"><span>Suivant →</span><span>${esc(next.nom)}</span></a></nav>`;
        return h;
      }
    });
  });

  /* ---------- INSPIRATIONS (People to Follow · Toolbox · Read Watch Listen) + pages outil ---------- */
  page({
    path: 'inspirations/', nav: 'inspirations', priority: '0.8', crumbs: [['Inspirations', 'inspirations/']],
    title: 'Inspirations CRO & e-commerce — Outils, experts et ressources | ' + BRAND,
    desc: 'Découvrez les experts, outils, livres, podcasts et newsletters cités par les professionnels du CRO et du e-commerce interviewés sur ' + BRAND + '.',
    ld: [{ '@type': 'CollectionPage', name: 'Inspirations de la Next Gen', url: abs('inspirations/'), inLanguage: 'fr-FR', isPartOf: { '@id': abs('#website') },
      hasPart: [
        MENTORS.length && { '@type': 'ItemList', name: 'People to Follow', numberOfItems: MENTORS.length, itemListElement: MENTORS.map((m, k) => ({ '@type': 'ListItem', position: k + 1, url: abs('inspirations/') + '#p-' + m.slug, item: { '@type': 'Person', name: m.nom, jobTitle: m.expertise || undefined, sameAs: m.lien ? [m.lien] : undefined } })) },
        TOOLS.length && { '@type': 'ItemList', name: 'Toolbox', numberOfItems: TOOLS.length, itemListElement: TOOLS.map((t, k) => ({ '@type': 'ListItem', position: k + 1, url: t.page ? abs(t.path) : abs('inspirations/') + '#t-' + t.slug, item: { '@type': 'SoftwareApplication', name: t.name, applicationCategory: t.cat || undefined } })) },
        RESS.length && { '@type': 'ItemList', name: 'Read · Watch · Listen', numberOfItems: RESS.length, itemListElement: RESS.map((r, k) => ({ '@type': 'ListItem', position: k + 1, url: abs('inspirations/') + '#r-' + r.slug, item: { '@type': SCHEMA[r.type], name: r.titre, author: r.auteur ? { '@type': 'Person', name: r.auteur } : undefined, sameAs: r.lien || undefined } })) }
      ].filter(Boolean) }],
    main: L => {
      const secs = [MENTORS.length && ['people', 'People to Follow', MENTORS.length], TOOLS.length && ['toolbox', 'Toolbox', TOOLS.length], RESS.length && ['rwl', 'Read · Watch · Listen', RESS.length]].filter(Boolean);
      const kinds = [].concat(MENTORS.length ? ['personnes à suivre'] : [], TOOLS.length ? ['outils'] : [], Object.keys(TYPES).filter(t => RESS.some(r => r.type === t)).map(t => TYPES_FR[t]));
      let h = `<section class="page-head insp-head"><p class="eyebrow pinkd">Le carnet d'inspirations de la Promo</p><h1 class="h1">Inspirations de la Next Gen</h1>` +
        `<p class="insp-acc">Ceux qu'ils suivent. Les outils qu'ils utilisent. Les contenus qui nourrissent leur pratique.</p>` +
        `<p class="lead">Découvrez les experts, outils et ressources CRO et e-commerce cités par les ${plural(N, 'professionnel interviewé', 'professionnels interviewés')} sur ${esc(BRAND)}${kinds.length ? ' : ' + kinds.join(', ') : ''}.</p>` +
        (secs.length > 1 ? `<nav class="insp-idx" aria-label="Sections de la page">${secs.map((s, i) => `<a href="#${s[0]}"><span>${pad(i + 1)}</span>${s[1]}<small>${s[2]}</small></a>`).join('')}</nav>` : '') + '</section>';
      let k = 0;
      if (MENTORS.length) {
        k++;
        h += `<section class="ip" id="people" aria-labelledby="people-h"><div class="ip-head"><p class="eyebrow pinkd">${pad(k)}</p><h2 class="h2" id="people-h">People to Follow</h2><p class="note">Les personnes citées comme références ou inspirations par les talents NextGen, avec leurs mots.</p></div><div class="ip-grid">` +
          MENTORS.map(m => `<article class="ip-i${m.by.length > 1 ? ' multi' : ''}" id="p-${m.slug}">${portrait({ nom: m.nom, photo: m.photo, photos: [] }, L, { cls: 'ip-portrait' })}<div class="ip-txt"><h3>${esc(m.nom)}</h3>` +
            ((m.expertise || m.organisation) ? `<p class="insp-x">${[m.expertise, m.organisation].filter(Boolean).map(esc).join(' · ')}</p>` : '') +
            m.by.map(x => `<div class="ip-cite">${x.citation ? `<p>« ${esc(x.citation)} »</p>` : ''}<a class="link-arrow" href="${L(x.p.path)}">${REL[x.relation].by} ${esc(x.p.nom)} →</a></div>`).join('') +
            `<a class="mono small" href="${esc(m.lien || liSearch(m.nom))}" target="_blank" rel="noopener">LinkedIn de ${esc(first(m.nom))} ↗</a></div></article>`).join('') + '</div></section>';
      }
      if (TOOLS.length) {
        k++;
        h += `<section class="itb" id="toolbox" aria-labelledby="toolbox-h"><div class="ip-head"><p class="eyebrow">${pad(k)}</p><h2 class="h2" id="toolbox-h">Toolbox</h2><p class="note">Les outils utilisés et cités par les professionnels CRO et e-commerce interviewés sur NextGen, et l'usage qu'ils en décrivent.</p></div><ol class="itb-list">` +
          TOOLS.map(t => `<li id="t-${t.slug}"><div class="itb-name">${logo(t.name, 40)}<h3>${t.page ? `<a href="${L(t.path)}">${esc(t.name)}</a>` : esc(t.name)}</h3></div><div class="itb-meta">${t.cat ? `<span class="tb-cat">${esc(t.cat)}</span>` : ''}<span class="mono small">${plural(t.count, 'talent', 'talents')}</span></div>` +
            `<ul class="itb-uses">${t.by.map(x => `<li>${x.usage ? `<p>${esc(x.usage)}</p>` : ''}<a href="${L(x.p.path)}">Utilisé par ${esc(x.p.nom)} →</a></li>`).join('')}</ul></li>`).join('') + '</ol></section>';
      }
      if (RESS.length) {
        k++;
        h += `<section class="rwl" id="rwl" aria-labelledby="rwl-h"><div class="ip-head"><p class="eyebrow pinkd">${pad(k)}</p><h2 class="h2" id="rwl-h">Read · Watch · Listen</h2><p class="note">Les livres, podcasts, newsletters et contenus cités par les talents NextGen.</p></div><div class="rwl-grid">` +
          RESS.map((r, i) => `<article class="rwl-i" id="r-${r.slug}"><div class="cover c${i % 4} t-${r.type}">${r.image ? `<img src="${esc(L.a(r.image))}" alt="Visuel : ${esc(r.titre)}" width="400" height="600" loading="lazy">` : `<span class="cv-type" aria-hidden="true">${TYPES[r.type]}</span><span class="cv-t" aria-hidden="true">${esc(r.titre)}</span>${r.auteur ? `<span class="cv-a" aria-hidden="true">${esc(r.auteur)}</span>` : ''}`}</div>` +
            `<span class="rtype">${TYPES[r.type]}</span><h3>${r.lien ? `<a href="${esc(r.lien)}" target="_blank" rel="noopener">${esc(r.titre)} ↗</a>` : esc(r.titre)}</h3>${r.auteur ? `<p class="insp-x">${esc(r.auteur)}</p>` : ''}` +
            r.by.map(x => `${x.raison ? `<p>« ${esc(x.raison)} »</p>` : ''}<a class="link-arrow" href="${L(x.p.path)}">${REL[x.relation].by} ${esc(x.p.nom)} →</a>`).join('') + '</article>').join('') + '</div></section>';
      }
      h += `<p class="insp-end">Chaque nouvelle interview enrichit ce carnet. <a class="link-arrow" href="${L('talents/')}">Meet the Next Gen →</a></p>`;
      return h;
    }
  });
  TOOLS.filter(t => t.page).forEach(t => {
    page({
      path: t.path, nav: 'inspirations', priority: '0.5', lastmod: t.by.map(b => b.p.maj || b.p.date).sort().pop() || LAST, crumbs: [['Inspirations', 'inspirations/'], [t.name, t.path]],
      title: `${t.name} : comment les talents CRO l'utilisent — ${BRAND}`,
      desc: clamp(synth(t) + ' Découvrez comment ' + t.by.slice(0, 3).map(b => b.p.nom).join(', ') + ' l\'utilisent au quotidien.'),
      ld: [{ '@type': 'CollectionPage', name: t.name, url: abs(t.path), inLanguage: 'fr-FR', isPartOf: { '@id': abs('#website') }, about: { '@type': 'SoftwareApplication', name: t.name, applicationCategory: t.cat || undefined },
        mentions: t.by.map(b => ({ '@type': 'Person', name: b.p.nom, url: abs(b.p.path) })) }],
      main: L => `<nav class="crumbs" aria-label="Fil d'Ariane"><a href="${L('inspirations/')}#toolbox">← Toolbox · Inspirations</a></nav>` +
        `<section class="page-head"><div class="row">${logo(t.name, 72)}${t.cat ? `<p class="eyebrow pinkd">${esc(t.cat)}</p>` : ''}</div><h1 class="h1">${esc(t.name)}</h1><p class="lead">${esc(synth(t))}</p></section>` +
        `<section><h2 class="eyebrow rule">Comment ils utilisent ${esc(t.name)}</h2><div class="uses">${t.by.map(b => `<div class="use">${portrait(b.p, L, { cls: 'sm' })}<div><h3><a href="${L(b.p.path)}">${esc(b.p.nom)}</a></h3><p class="pc-role">${esc(b.p.poste)}</p>${co(b.p.entreprise, 24)}${b.usage ? `<blockquote><p>« ${esc(b.usage)} »</p></blockquote>` : ''}<a class="link-arrow" href="${L(b.p.path)}#tb-h">Voir la toolbox de ${esc(b.p.prenom)} →</a></div></div>`).join('')}</div></section>`
    });
  });

  /* ---------- MUR DE MOTS ---------- */
  const groups = ALL.filter(p => p.motsCles.length);
  page({
    path: 'mur-de-mots/', nav: 'communaute', crumbs: [['Communauté', 'communaute/'], ['Mur des mots', 'mur-de-mots/']],
    title: '« Le CRO sans … ce n\'est pas du CRO » : le mur des mots — ' + BRAND,
    desc: clamp('Le mot sans lequel le CRO n\'existe pas, selon ' + groups.length + ' talents : ' + groups.slice(0, 6).map(p => p.motFin + ' (' + p.nom + ')').join(', ') + '…'),
    main: L => {
      const palette = ['#FFF7FA', '#FF8DB8', 'transparent'], sizes = [1, 0.5, 0.8, 0.4, 0.95, 0.6, 0.7, 0.45];
      return `<section class="page-head"><p class="eyebrow pinkd">#MotClé · ${plural(groups.length, 'talent', 'talents')}</p><h1 class="h1">Le CRO sans <span class="ul">[…]</span>, ce n'est pas du CRO.</h1></section>` +
        `<div class="wall">${groups.map((p, k) => {
          const r = sizes[k % sizes.length], c = palette[k % 3];
          return `<a class="wgroup" href="${L(p.path)}"><span class="words">${p.motsCles.map((w, j) => { const rr = j ? r * 0.55 : r; return `<span class="word" style="font-size:clamp(${Math.round(32 + 40 * rr)}px,${(4 + 8 * rr).toFixed(1)}vw,${Math.round(64 + 100 * rr)}px);font-weight:${rr > 0.7 ? 800 : (k % 2 ? 500 : 700)};color:${c};-webkit-text-stroke:${c === 'transparent' ? '1.5px #FFF7FA' : '0'}">${esc(w)}</span>`; }).join('')}</span><span class="by">${esc(p.nom)}</span></a>`;
        }).join('')}</div><p class="mono small" style="margin-top:14px">Regroupés par talent · cliquez pour découvrir la personne.</p>`;
    }
  });

  /* ---------- COMMUNAUTÉ ---------- */
  page({
    path: 'communaute/', nav: 'communaute', crumbs: [['Communauté', 'communaute/']],
    title: 'Communauté WhatsApp CRO & e-commerce — ' + BRAND,
    desc: 'Rejoignez la communauté ' + BRAND + ' : échanges entre pairs, jobs et stages, veille et outils CRO. Et proposez le prochain talent à interviewer.',
    main: L => {
      const WA = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg';
      return `<section class="wa"><div class="wa-txt"><p class="wa-tag">Communauté WhatsApp</p><h1>Rejoins la communauté <span>${esc(NAME)}</span></h1><p>Le groupe où les Talents et les passionnés de CRO se retrouvent pour avancer ensemble.</p>` +
        `<ul class="wa-perks"><li><strong>Échanges</strong><span>Tests, méthodes, retours d'expérience entre pairs.</span></li><li><strong>Jobs &amp; stages</strong><span>Offres partagées par la communauté.</span></li><li><strong>Veille &amp; outils</strong><span>Les bons plans, articles et nouveautés du moment.</span></li></ul>` +
        (has(SITE.whatsapp) ? `<a class="wa-btn" href="${esc(SITE.whatsapp)}" target="_blank" rel="noopener"><img src="${WA}" alt="" width="34" height="34">Rejoindre le groupe WhatsApp →</a>` : '') + '</div>' +
        `<div class="wa-art" aria-hidden="true"><span class="wa-bubble">Miam, on t'attend !</span><div class="wa-frame"><div class="box"><img src="${L.a('images/mascotte.png')}" alt="" width="349" height="246"></div><img src="${WA}" alt="" width="120" height="120"></div></div></section>` +
        `<section class="sec"><div class="sec-l"><p class="eyebrow pinkd">Proposer un talent</p><h2 class="sec-h">Qui sera la prochaine Next Gen ?</h2></div><div class="sec-b"><p>Mentionnez-la en commentaire sur LinkedIn pour que ${esc(first(AUTHOR.nom))} aille à sa rencontre. La prochaine Next Gen est peut-être déjà dans votre réseau.</p>${PROPOSER ? `<p><a class="btn" href="${esc(PROPOSER)}" target="_blank" rel="noopener">Proposer un talent →</a></p>` : ''}</div></section>` +
        `<section class="sec"><div class="sec-l"><p class="eyebrow pinkd">Le mur des mots</p><h2 class="sec-h">Le CRO sans […], ce n'est pas du CRO.</h2></div><div class="sec-b"><p>Chaque interview se termine par un mot. Réunis, ils dessinent ce que la nouvelle génération met au cœur du métier : ${groups.slice(0, 6).map(p => `<a href="${L(p.path)}">${esc(p.motFin.toLowerCase())}</a>`).join(', ')}…</p><p><a class="link-arrow" href="${L('mur-de-mots/')}">Voir le mur des mots →</a></p></div></section>`;
    }
  });

  /* ---------- À PROPOS ---------- */
  const A = SITE.apropos || {};
  page({
    path: 'a-propos/', nav: 'apropos', crumbs: [['À propos', 'a-propos/']], image: authorPhoto || '', imageAlt: authorPhoto ? 'Portrait de ' + AUTHOR.nom : '',
    title: 'À propos : pourquoi ' + BRAND + ' existe — ' + BRAND,
    desc: clamp('Pourquoi ' + BRAND + ' existe, pourquoi maintenant, le format des interviews et qui est derrière le projet : ' + (AUTHOR.nom || '') + (AUTHOR.entreprise ? ' (' + AUTHOR.entreprise + ')' : '') + '.'),
    ld: [Object.assign({}, ROBIN, { description: AUTHOR.bio || '', knowsAbout: list(AUTHOR.tags), address: AUTHOR.lieu ? { '@type': 'PostalAddress', addressLocality: String(AUTHOR.lieu).split(',')[0].trim(), addressCountry: 'FR' } : undefined }),
      { '@type': 'AboutPage', name: 'À propos', url: abs('a-propos/'), inLanguage: 'fr-FR', isPartOf: { '@id': abs('#website') }, mainEntity: { '@id': ROBIN['@id'] } }],
    main: L => {
      const au = AUTHOR; let k = 0;
      const s = (lbl, body, cls) => { k++; return `<section class="sec${cls ? ' ' + cls : ''}"><div class="sec-l"><p class="eyebrow pinkd">${pad(k)}</p><h2 class="sec-h">${lbl}</h2></div><div class="sec-b">${body}</div></section>`; };
      let h = `<header class="ab-hero"><h1 class="eyebrow pinkd">À propos ${esc(de(BRAND))}</h1>${A.citation ? `<blockquote class="ab-q"><p>${A.citation}</p>${A.citationAuteur ? `<footer>— ${esc(A.citationAuteur)}</footer>` : ''}</blockquote>` : ''}</header>`;
      h += s('Pourquoi NextGen existe', list(A.pourquoi).map((t, i) => `<p${i ? '' : ' class="big"'}>${t}</p>`).join(''));
      h += s('Pourquoi maintenant', list(A.maintenant).map(t => `<p>${t}</p>`).join('') + (A.maintenantCitation ? `<blockquote class="pull"><p>${esc(A.maintenantCitation)}</p><footer>— ${esc(A.maintenantAuteur || '')}</footer></blockquote>` : ''));
      h += s('Le format', `<p>Chaque interview explore cinq angles. Simple et sans filtre.</p><ol class="fmt">${list(A.format).map((f, i) => `<li><span>${pad(i + 1)}</span><h3>${esc(f.titre)}</h3><p>${esc(f.texte)}</p></li>`).join('')}</ol>`);
      h += s('Qui est Next Gen ?', list(A.quiEst).map(t => `<p>${t}</p>`).join('') + `<p><a class="link-arrow" href="${L('talents/')}">Meet the Next Gen →</a></p>`);
      if (has(au.nom)) {
        h += s('Qui est derrière le projet ?', `<div class="author" id="auteur">${avatar(au.nom, authorPhoto, 112, L)}<div class="author-in"><h3 class="nm">${esc(au.nom)}</h3>` +
          (au.titre ? `<p class="author-t">${esc(au.titre)}</p>` : '') + (au.bio ? `<p>${esc(au.bio)}</p>` : '') + (au.lieu ? `<p class="mono small">${esc(au.lieu)}</p>` : '') +
          (list(au.tags).length ? xps(list(au.tags)) : '') +
          (list(au.parcours).length ? `<ul class="timeline">${list(au.parcours).map(x => `<li><strong>${esc(x.titre)}</strong>${x.detail ? `<span>${esc(x.detail)}</span>` : ''}</li>`).join('')}</ul>` : '') +
          (has(LINKS.linkedin) ? `<a class="btn-li" href="${esc(LINKS.linkedin)}" target="_blank" rel="noopener">Suivre ${esc(first(au.nom))} sur LinkedIn ↗</a>` : '') + '</div></div>');
      }
      h += joinBlock(L, 'Proposer quelqu\'un');
      return h;
    }
  });

  /* ---------- INSIGHTS ---------- */
  if (INSIGHTS.length) {
    page({
      path: 'insights/', nav: 'insights', priority: '0.8', crumbs: [['Insights', 'insights/']], title: 'Insights CRO & e-commerce de la Next Gen — ' + BRAND,
      desc: clamp('Ce que la nouvelle génération du CRO pense, utilise et apprend : ' + INSIGHTS.slice(0, 3).map(x => x.titre).join(' · ')),
      main: L => `<section class="page-head"><p class="eyebrow pinkd">${plural(INSIGHTS.length, 'insight', 'insights')}</p><h1 class="h1">Insights</h1><p class="lead">Des enseignements transversaux, tirés des interviews.</p></section>` +
        `<ul class="ins-list">${INSIGHTS.map(x => `<li><a href="${L(x.path)}"><span class="mono small">${esc(fmtDate(x.date))}</span><h2>${esc(x.titre)}</h2>${x.chapo ? `<p>${esc(x.chapo)}</p>` : ''}</a></li>`).join('')}</ul>`
    });
    INSIGHTS.forEach(x => {
      const ppl = Array.from(new Set([].concat(...x.sections.map(s => s.people))));
      page({
        path: x.path, nav: 'insights', ogType: 'article', published: x.date, lastmod: x.date || LAST, crumbs: [['Insights', 'insights/'], [x.titre, x.path]], title: x.titre + ' — ' + BRAND, desc: clamp(x.chapo || x.titre),
        ld: [{ '@type': 'Article', headline: clamp(x.titre, 110), description: x.chapo, datePublished: x.date || undefined, author: ROBIN, publisher: { '@id': ORG['@id'] }, url: abs(x.path), inLanguage: 'fr-FR', mentions: ppl.map(p => ({ '@type': 'Person', name: p.nom, url: abs(p.path) })) }, ORG],
        main: L => `<nav class="crumbs" aria-label="Fil d'Ariane"><a href="${L('insights/')}">← Insights</a></nav><article><header class="page-head"><p class="eyebrow pinkd">Insight${x.date ? ' · <time datetime="' + x.date + '">' + esc(fmtDate(x.date)) + '</time>' : ''}</p><h1 class="h1">${esc(x.titre)}</h1>${x.chapo ? `<p class="lead">${esc(x.chapo)}</p>` : ''}</header>` +
          x.sections.map((s, i) => `<section class="sec"><div class="sec-l"><p class="eyebrow pinkd">${pad(i + 1)}</p><h2 class="sec-h">${esc(s.titre)}</h2></div><div class="sec-b">${s.texte.map(t => `<p>${esc(t)}</p>`).join('')}${s.people.length ? `<p class="mono small">Avec ${s.people.map(p => `<a href="${L(p.path)}">${esc(p.nom)}</a>`).join(', ')}</p>` : ''}</div></section>`).join('') + '</article>' +
          (ppl.length ? `<section class="related"><h2 class="h2">Les Talents cités</h2><div class="pgrid three">${ppl.slice(0, 6).map(p => pcard(p, L, 'h3')).join('')}</div></section>` : '')
      });
    });
  }

  /* ---------- 404, redirections, sitemap, robots, llms ---------- */
  page({
    path: '404/', file: '404.html', absolute: true, noindex: true, title: 'Page introuvable — ' + BRAND, desc: 'Cette page n\'existe pas.',
    main: L => `<section class="page-head center">${mascot(L, 240)}<p class="eyebrow pinkd">Erreur 404</p><h1 class="h1">Page introuvable</h1><p class="lead">Le croco a dû la manger. Revenez à l'accueil ou partez à la rencontre des Talents.</p><div class="ctas"><a class="btn" href="${L('')}">Accueil</a><a class="btn white" href="${L('talents/')}">Meet the Next Gen</a></div></section>`
  });
  const idx = LOCAL ? 'index.html' : '';
  FILES['interview.html'] = `<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="robots" content="noindex">\n<title>Redirection… — ${esc(BRAND)}</title>\n<script>var id=new URLSearchParams(location.search).get("id");location.replace(id?"talents/"+encodeURIComponent(id)+"/${idx}":"talents/${idx}");</script>\n</head>\n<body>\n<p><a href="talents/${idx}">Voir tous les Talents</a></p>\n</body>\n</html>\n`;
  FILES['_redirects'] = ['/people /talents/ 301', '/people/ /talents/ 301', '/people/* /talents/:splat 301', '/interviews /talents/ 301', '/interviews/ /talents/ 301', '/interviews/* /talents/:splat 301', '/profils/ /talents/ 301', '/profils /talents/ 301', '/mentors/ /inspirations/ 301', '/mentors /inspirations/ 301', '/outils /inspirations/ 301', '/outils/ /inspirations/ 301', '/marques-outils/ /inspirations/ 301', '/marques-outils /inspirations/ 301', '/interviews.html /talents/ 301', '/profils.html /talents/ 301', '/mentors.html /inspirations/ 301', '/marques-outils.html /inspirations/ 301', '/mur-de-mots.html /mur-de-mots/ 301', '/a-propos.html /a-propos/ 301'].join('\n') + '\n';
  FILES['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    SITEMAP.map(u => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n') + '\n</urlset>\n';
  const BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended', 'CCBot'];
  FILES['robots.txt'] = `# ${BRAND} — tous les robots sont les bienvenus, y compris ceux des IA.\n\nUser-agent: *\nAllow: /\n\n` + BOTS.map(b => `User-agent: ${b}\nAllow: /\n`).join('\n') + `\nSitemap: ${abs('sitemap.xml')}\n`;
  FILES['llms.txt'] = `# ${BRAND}\n\n> ${strip(SITE.description || '')} Série créée par ${AUTHOR.nom || ''}${AUTHOR.entreprise ? ' (' + AUTHOR.entreprise + ')' : ''}. ${plural(N, 'profil publié', 'profils publiés')}, en français.\n\n` +
    'Chaque profil (« Talent ») documente une personne : rôle, entreprise, expertises, parcours, déclic CRO, mentors, toolbox (outil + usage réel), conseil, hot take et mot de la fin (« Le CRO sans … ce n\'est pas du CRO »). Les citations sont attribuées et les synthèses rédigées par NextGen sont signalées. Toutes les pages sont en HTML statique.\n\n' +
    '## Talents\n\n' + ALL.map(p => `- [${p.nom} — ${p.poste}, ${p.entreprise}](${abs(p.path)})${p.date ? ' (' + p.date + ')' : ''}${p.expertises.length ? ' · ' + p.expertises.join(', ') : ''}${p.citation ? ' : « ' + p.citation + ' »' : ''}${p.exemple ? ' [profil d\'exemple]' : ''}`).join('\n') + '\n\n' +
    '## Pages principales\n\n' + [['Accueil', ''], ['Meet the Next Gen (tous les Talents)', 'talents/'], ['Inspirations : experts, outils et ressources cités', 'inspirations/'], ['Mur des mots', 'mur-de-mots/'], ['À propos', 'a-propos/'], ['Communauté', 'communaute/']].concat(INSIGHTS.length ? [['Insights', 'insights/']] : []).map(x => `- [${x[0]}](${abs(x[1])})`).join('\n') + '\n\n' +
    (TOOLS.length ? '## Outils les plus cités\n\n' + TOOLS.slice(0, 10).map(t => `- ${t.page ? `[${t.name}](${abs(t.path)})` : t.name} : ${synth(t)}`).join('\n') + '\n' : '') +
    (MENTORS.length ? '\n## People to Follow (cités par les talents)\n\n' + MENTORS.map(m => `- ${m.nom}${m.expertise ? ' (' + m.expertise + ')' : ''} : ${m.by.map(x => REL[x.relation].by.toLowerCase() + ' ' + x.p.nom).join(', ')}`).join('\n') + '\n' : '') +
    (RESS.length ? '\n## Read · Watch · Listen\n\n' + RESS.map(r => `- ${r.titre} [${TYPES[r.type]}]${r.auteur ? ', ' + r.auteur : ''} : ${r.by.map(x => REL[x.relation].by.toLowerCase() + ' ' + x.p.nom).join(', ')}`).join('\n') + '\n' : '') +
    (INSIGHTS.length ? '\n## Insights\n\n' + INSIGHTS.map(x => `- [${x.titre}](${abs(x.path)})`).join('\n') + '\n' : '');

  return { files: FILES, warnings, count: { mentors: MENTORS.length, ressources: RESS.length, people: N, outils: TOOLS.length, pagesOutils: TOOLS.filter(t => t.page).length, insights: INSIGHTS.length } };
}

if (typeof module !== 'undefined') module.exports = { buildSite };

/* ---------- exécution Node ---------- */
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs'), path = require('path'), vm = require('vm');
  const ROOT = __dirname, OUT = path.join(ROOT, 'dist');
  const args = process.argv.slice(2);
  const load = (file, key, optional) => {
    const p = path.join(ROOT, file);
    if (optional && !fs.existsSync(p)) return undefined;
    const ctx = { window: {} }; vm.createContext(ctx);
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: file }); }
    catch (e) { console.error('✗ Erreur dans ' + file + ' : ' + e.message + '\n  (virgule ou guillemet manquant ?)'); process.exit(1); }
    return ctx.window[key];
  };
  const res = buildSite(load('data/site.js', 'SITE'), load('data/interviews.js', 'INTERVIEWS'), {
    insights: load('data/insights.js', 'INSIGHTS', true),
    local: args.indexOf('--local') >= 0,
    exists: p => fs.existsSync(path.join(ROOT, p))
  });
  fs.rmSync(OUT, { recursive: true, force: true });
  Object.keys(res.files).forEach(f => { const p = path.join(OUT, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, res.files[f]); });
  ['assets', 'images'].forEach(d => { if (fs.existsSync(path.join(ROOT, d))) fs.cpSync(path.join(ROOT, d), path.join(OUT, d), { recursive: true }); });
  console.log(`✓ ${Object.keys(res.files).length} fichiers générés dans dist/ · ${res.count.people} Talents, ${res.count.outils} outils (${res.count.pagesOutils} pages), ${res.count.insights} insights` + (res.warnings.length ? ` · ⚠ ${res.warnings.length} avertissement(s) ci-dessus` : ''));
  if (args.indexOf('--strict') >= 0 && res.warnings.length) process.exit(1);
}
