#!/usr/bin/env node
/* ==========================================================================
   build.js — génère le site statique complet dans dist/ (Node 18+, sans dépendance)

     node build.js            → mise en ligne (URLs propres /talents/slug/)
     node build.js --local    → dist/ consultable en double-cliquant (liens …/index.html)
     node build.js --strict   → échoue si un avertissement est détecté

   Version anglaise : data/en.js (facultatif) contient les traductions. Le site
   anglais est généré dans dist/en/ (URL /en/…), avec hreflang et sitemap bilingue.

   Sources : data/interviews.js (Talents), data/site.js (réglages), data/insights.js (facultatif)
   ========================================================================== */
'use strict';

/* Fusion profonde : b (traduction) remplace a, champ par champ ; les listes sont fusionnées élément par élément. null = garder l'original. */
function deepMerge(a, b) {
  if (b === undefined || b === null) return a;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((x, i) => i < b.length ? deepMerge(x, b[i]) : x).concat(b.slice(a.length));
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) { const r = Object.assign({}, a); Object.keys(b).forEach(k => { r[k] = deepMerge(a[k], b[k]); }); return r; }
  return b;
}
/* Sitemap bilingue (balises xhtml:link hreflang) */
function sitemapXml(entries) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const alt = entries.some(u => u.alt);
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' + (alt ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '') + '>\n' +
    entries.map(u => `  <url><loc>${esc(u.loc)}</loc>` + (u.alt ? Object.keys(u.alt).map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(u.alt[l])}"/>`).join('') : '') + `<lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n') + '\n</urlset>\n';
}

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

  /* ---------- langue ---------- */
  const LANG = opts.lang === 'en' ? 'en' : 'fr', ENG = LANG === 'en';
  const BILINGUE = ENG || !!opts.bilingue;
  const tr = (fr, en) => ENG ? en : fr;
  if (ENG) {
    const T = opts.en || {}, TI = T.interviews || {};
    SITE = deepMerge(SITE, T.site || {});
    RAW = RAW.map(it => {
      if (!it || !it.slug) return it;
      if (!TI[it.slug] && !it.exemple) warn('Version anglaise : pas de traduction pour « ' + it.slug + ' » (texte français affiché).');
      return deepMerge(it, TI[it.slug] || {});
    });
  }
  // URL d'une page dans une langue : FR = chemin d'origine, EN = /en/ + premier segment traduit
  const SEG = { 'mur-de-mots': 'word-wall', 'a-propos': 'about', 'communaute': 'community', 'outils': 'tools', 'proposer-un-talent': 'suggest-a-talent' };
  const loc = (lg, p) => { p = p || ''; if (lg !== 'en') return p; const m = /^([^/#]*)(.*)$/.exec(p); return 'en/' + (m[1] ? (SEG[m[1]] || m[1]) : '') + m[2]; };

  const BASE = String(SITE.url || '').replace(/\/+$/, '');
  const NAME = SITE.nom || '#eCROmmerce NextGen';
  const BRAND = SITE.nomCourt || 'eCROmmerce NextGen';
  const AUTHOR = (SITE.apropos && SITE.apropos.auteur) || {};
  const LINKS = SITE.liens || {};
  const COMMU = SITE.communaute !== false; // false = tout ce qui concerne la communauté WhatsApp est masqué
  const EMAIL = SITE.email || '';
  const PROPOSER = EMAIL ? '' : (LINKS.proposerTalent || LINKS.linkedin || ''); // lien externe, seulement s'il n'y a pas de page « Proposer un talent »
  const VER = opts.ver ? '?v=' + opts.ver : ''; // version des CSS/JS : force le navigateur à recharger après une mise à jour

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
  const poss = n => n + (/s$/i.test(n) ? "'" : "'s");
  const OQ = tr('« ', '“'), CQ = tr(' »', '”'), PROMO = tr('Promo ', 'Class of ');
  const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const fmtDate = d => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); if (!m) return ''; return ENG ? MONTHS_EN[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1] : (+m[3] === 1 ? '1er' : +m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1]; };
  const mapKeys = o => { const r = {}; Object.keys(o || {}).forEach(k => { r[norm(k)] = o[k]; }); return r; };
  const ALIAS = mapKeys(SITE.alias);
  const canon = n => ALIAS[norm(n)] || String(n == null ? '' : n).trim();
  const LOGOS = {}; Object.keys(SITE.logos || {}).forEach(k => { LOGOS[norm(canon(k))] = SITE.logos[k]; });
  const TOOLCAT = {}; Object.keys(SITE.categoriesOutils || {}).forEach(k => { TOOLCAT[norm(canon(k))] = SITE.categoriesOutils[k]; });
  const REL = ENG ? {
    inspired_by: { tag: 'Inspiration', by: 'Cited as an inspiration by' },
    follows: { tag: 'Followed', by: 'Followed by' },
    recommends: { tag: 'Recommended', by: 'Recommended by' },
    mentor: { tag: 'Mentor', by: 'Mentor of' },
    mentions: { tag: 'Cited', by: 'Cited by' },
    uses: { tag: 'Used', by: 'Used by' }
  } : {
    inspired_by: { tag: 'Inspiration', by: 'Cité comme inspiration par' },
    follows: { tag: 'Suivi', by: 'Suivi par' },
    recommends: { tag: 'Recommandé', by: 'Recommandé par' },
    mentor: { tag: 'Mentor', by: 'Mentor de' },
    mentions: { tag: 'Cité', by: 'Cité par' },
    uses: { tag: 'Utilisé', by: 'Utilisé par' }
  };
  const TYPES = { book: 'Book', podcast: 'Podcast', newsletter: 'Newsletter', video: 'Video', website: 'Website', media: 'Media' };
  const TYPES_FR = ENG ? { book: 'books', podcast: 'podcasts', newsletter: 'newsletters', video: 'videos', website: 'websites', media: 'media' } : { book: 'livres', podcast: 'podcasts', newsletter: 'newsletters', video: 'vidéos', website: 'sites', media: 'médias' };
  const SCHEMA = { book: 'Book', podcast: 'PodcastSeries', newsletter: 'CreativeWork', video: 'VideoObject', website: 'WebSite', media: 'CreativeWork' };
  const liSearch = n => 'https://www.linkedin.com/search/results/all/?keywords=' + encodeURIComponent(n);
  const abs = p => BASE + '/' + (p || '');
  const U = p => abs(loc(LANG, p)); // URL absolue d'une page dans la langue en cours
  const INLANG = tr('fr-FR', 'en-GB');
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
  const synth = t => ENG ? t.name + ' is cited by ' + t.count + ' of the ' + plural(N, 'interviewed talent', 'interviewed talents') + (t.cat ? ' (' + t.cat + ')' : '') + '.' : t.name + ' est cité par ' + t.count + ' des ' + plural(N, 'talent interviewé', 'talents interviewés') + (t.cat ? ' (' + t.cat + ')' : '') + '.';
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
    const mk = p => {
      if (LOCAL && !absolute) { const m = /^([^#]*)(#.*)?$/.exec(p), b = m[1], hsh = m[2] || ''; if (b === '' || /\/$/.test(b)) return R + b + 'index.html' + hsh; }
      return (R + p) || './';
    };
    const L = p => mk(loc(LANG, p || ''));
    L.alt = (lg, p) => mk(loc(lg, p || ''));
    L.a = p => /^https?:\/\//.test(p) ? p : R + p;
    return L;
  }

  /* ---------- fragments ---------- */
  const MASCOT_ALT = tr('Mascotte ' + NAME + ', un petit crocodile rose', NAME + ' mascot, a little pink crocodile');
  const mascot = (L, w, cls) => `<img class="${cls || 'mascot'}" src="${L.a('images/mascotte.png')}" alt="${esc(MASCOT_ALT)}" width="${w}" height="${Math.round(w * 246 / 349)}" loading="lazy" decoding="async">`;
  function portrait(p, L, o) {
    o = o || {};
    let img = '';
    if (p.photo) {
      const v = variants(p.photo);
      const srcset = v.length ? ` srcset="${v.map(x => esc(L.a(x[0])) + ' ' + x[1] + 'w').join(', ')}" sizes="${o.sizes || '(max-width: 640px) 50vw, 320px'}"` : '';
      img = `<img src="${esc(L.a(p.photo))}"${srcset} alt="${tr('Portrait de', 'Portrait of')} ${esc(p.nom)}" width="800" height="1000" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.remove()">`;
    }
    const alt = o.hover && p.photos[0] ? `<img class="alt" src="${esc(L.a(p.photos[0]))}" alt="" width="800" height="1000" loading="lazy" decoding="async" onerror="this.remove()">` : '';
    const q = o.hover && (p.citation || p.accroche) ? `<span class="pq" aria-hidden="true">${OQ}${esc(p.citation || p.accroche)}${CQ}</span>` : '';
    return `<span class="portrait${o.cls ? ' ' + o.cls : ''}"><span class="ini" aria-hidden="true">${esc(initials(p.nom))}</span>${img}${alt}${q}</span>`;
  }
  function avatar(name, photo, size, L) {
    return `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.36)}px">` + (photo
      ? `<span aria-hidden="true">${esc(initials(name))}</span><img src="${esc(L.a(photo))}" alt="${tr('Portrait de', 'Portrait of')} ${esc(name)}" width="${size}" height="${size}" loading="lazy" onerror="this.remove()">`
      : `<span aria-hidden="true">${esc(initials(name))}</span>`) + '</span>';
  }
  function logo(name, size, deco) {
    const d = LOGOS[norm(name)];
    return `<span class="logo" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.3)}px;font-size:${Math.round(size * 0.34)}px">` +
      (d ? `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&amp;sz=128" alt="${deco ? '' : 'Logo ' + esc(name)}" width="${Math.round(size * 0.6)}" height="${Math.round(size * 0.6)}" loading="lazy" onerror="this.parentNode.textContent='${esc(initials(name))}'">` : `<span aria-hidden="true">${esc(initials(name))}</span>`) + '</span>';
  }
  // Drapeaux en SVG (les émojis drapeaux ne s'affichent pas sous Windows)
  const FLAGS = {
    en: '<svg viewBox="0 0 60 30" preserveAspectRatio="none" focusable="false"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2.4"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/></svg>',
    fr: '<svg viewBox="0 0 3 2" preserveAspectRatio="none" focusable="false"><rect width="1" height="2" fill="#002654"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE1126"/></svg>'
  };
  const LI_ICON = '<svg class="li-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>';
  const liBtn = (p, first, where) => p.lienLinkedin ? `<a class="btn-li" href="${esc(p.lienLinkedin)}" target="_blank" rel="noopener" data-cta="linkedin-${where}" data-talent="${esc(p.slug)}" data-umami-event="linkedin-talent" data-umami-event-talent="${esc(p.slug)}" data-umami-event-position="${where}" aria-label="${tr('Se connecter avec ' + esc(first) + ' sur LinkedIn (nouvel onglet)', 'Connect with ' + esc(first) + ' on LinkedIn (opens in a new tab)')}">${LI_ICON}<span>${tr('Se connecter avec', 'Connect with')} ${esc(first)}</span></a>` : '';
  const xps = () => ''; // badges d'expertise masqués (les expertises restent dans « En bref », les filtres et le JSON-LD)
  const co = (name, size, cls) => `<span class="co${cls ? ' ' + cls : ''}">${logo(name, size || 32, true)}<strong>${esc(name)}</strong></span>`;
  const sample = p => p.exemple ? '<span class="tag-sample">' + tr('Profil d\'exemple', 'Sample profile') + '</span>' : '';
  function pcard(p, L, h, filterable) {
    h = h || 'h3';
    return `<a class="pc" href="${L(p.path)}"${filterable ? ` data-item data-exp="${esc(p.expertises.map(norm).join('|'))}" data-search="${esc(searchText(p))}"` : ''}>` +
      portrait(p, L, { hover: true }) +
      `<span class="pc-num">NEXTGEN #${p.num}</span><${h} class="pc-name">${esc(p.nom)}</${h}>` +
      `<span class="pc-role">${esc(p.poste)}</span>${co(p.entreprise, 28, 'pc-co')}` + sample(p) + '</a>';
  }
  const attribution = p => `<strong>${esc(p.nom)}</strong> — ${esc(p.poste)}, ${esc(p.entreprise)}`;

  /* ---------- JSON-LD communs ---------- */
  const ORG = { '@type': 'Organization', '@id': abs('#organization'), name: BRAND, alternateName: NAME, url: abs(''), logo: { '@type': 'ImageObject', url: abs('images/icon-512.png'), width: 512, height: 512 }, image: abs('images/og-image.png') };
  if (has(LINKS.linkedin)) ORG.sameAs = [LINKS.linkedin];
  const ROBIN = { '@type': 'Person', '@id': abs('a-propos/#auteur'), name: AUTHOR.nom || '', url: U('a-propos/') };
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
  const NAV = [['people', 'talents/', 'Talents'], ['inspirations', 'inspirations/', 'Inspirations']].concat(INSIGHTS.length ? [['insights', 'insights/', 'Insights']] : [], [['apropos', 'a-propos/', tr('À propos', 'About')]]);
  const FOOTLINKS = [['talents/', 'Talents'], ['inspirations/', 'Inspirations'], ['mur-de-mots/', tr('Mur des mots', 'Word wall')], ['a-propos/', tr('À propos', 'About')]].concat(COMMU ? [['communaute/', tr('Communauté', 'Community')]] : [], EMAIL ? [['proposer-un-talent/', tr('Proposer un talent', 'Suggest a talent')]] : []);
  const NL = SITE.newsletter || {};
  const nlBlock = () => !has(NL.action) ? '' : `<section class="nl" aria-labelledby="nl-h"><div class="nl-txt"><p class="eyebrow">${esc(NL.surtitre || 'Newsletter')}</p><h2 class="nl-h" id="nl-h">${esc(NL.titre || tr('Ne ratez aucun Talent', 'Never miss a Talent'))}</h2>${NL.texte ? `<p>${esc(NL.texte)}</p>` : ''}</div>` +
    `<form class="nl-form" action="${esc(NL.action)}" method="post" target="_blank"><label class="vh" for="bd-email">${tr('Votre adresse email', 'Your email address')}</label><div class="nl-field"><input type="email" name="email" id="bd-email" placeholder="${tr('votre@email.com', 'you@email.com')}" autocomplete="email" required><button type="submit" class="btn" data-umami-event="newsletter-subscribe">${esc(NL.bouton || tr("Je m'abonne", 'Subscribe'))}</button></div>` +
    (NL.referral ? `<p class="nl-note"><a href="${esc(NL.referral)}" target="_blank" rel="noopener">Powered by Buttondown</a></p>` : '') +
    `<p class="nl-ok" role="status" aria-live="polite" hidden>${esc(NL.merci || tr("C'est noté, merci !", 'Thanks, you are in!'))}</p></form>` +
    // Inscription en arrière-plan : le visiteur reste sur le site et voit le message en français.
    // Sans JavaScript (ou si l'envoi échoue), le formulaire s'envoie normalement dans un nouvel onglet.
    `<script>(function(){var f=document.currentScript.previousElementSibling;f.addEventListener('submit',function(e){if(!window.fetch||!window.FormData)return;e.preventDefault();var b=f.querySelector('button');b.disabled=true;fetch(f.action,{method:'POST',mode:'no-cors',body:new FormData(f)}).then(function(){f.querySelector('.nl-field').hidden=true;var n=f.querySelector('.nl-note');if(n)n.hidden=true;f.querySelector('.nl-ok').hidden=false;},function(){b.disabled=false;f.submit();});});})();</script></section>`;
  const FILES = {}, SITEMAP = [];
  function page(o) {
    const FPATH = loc(LANG, o.path);
    const L = linker(FPATH, o.absolute);
    const main = o.main(L);
    const url = abs(FPATH);
    const ALT = BILINGUE && !o.noindex ? { fr: abs(o.path), en: abs(loc('en', o.path)), 'x-default': abs(o.path) } : null;
    const other = ENG ? 'fr' : 'en';
    const img = o.image ? abs(o.image) : abs('images/og-image.png');
    const crumbs = [[tr('Accueil', 'Home'), '']].concat(o.crumbs || []);
    const graph = (o.ld || []).concat(o.noindex ? [] : [{ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, k) => ({ '@type': 'ListItem', position: k + 1, name: c[0], item: U(c[1]) })) }]);
    const f = SITE.footer || {};
    const html = '<!DOCTYPE html>\n<html lang="' + LANG + '">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      `<title>${esc(o.title)}</title>\n<meta name="description" content="${esc(o.desc)}">\n` +
      (o.noindex ? '<meta name="robots" content="noindex">\n' : `<link rel="canonical" href="${esc(url)}">\n<meta name="robots" content="index, follow, max-image-preview:large">\n`) +
      (ALT ? Object.keys(ALT).map(l => `<link rel="alternate" hreflang="${l}" href="${esc(ALT[l])}">\n`).join('') : '') +
      `<meta property="og:type" content="${o.ogType || 'website'}">\n<meta property="og:site_name" content="${esc(BRAND)}">\n<meta property="og:locale" content="${tr('fr_FR', 'en_GB')}">\n` + (BILINGUE ? `<meta property="og:locale:alternate" content="${tr('en_GB', 'fr_FR')}">\n` : '') +
      `<meta property="og:title" content="${esc(o.title)}">\n<meta property="og:description" content="${esc(o.desc)}">\n<meta property="og:url" content="${esc(url)}">\n` +
      `<meta property="og:image" content="${esc(img)}">\n` + (o.image ? '' : '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n') +
      `<meta property="og:image:alt" content="${esc(o.imageAlt || BRAND)}">\n` +
      (o.published ? `<meta property="article:published_time" content="${o.published}">\n` + (has(AUTHOR.nom) ? `<meta property="article:author" content="${esc(AUTHOR.nom)}">\n` : '') : '') +
      `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(o.title)}">\n<meta name="twitter:description" content="${esc(o.desc)}">\n<meta name="twitter:image" content="${esc(img)}">\n` +
      `<link rel="icon" href="${L.a('favicon.ico')}" sizes="48x48">\n<link rel="icon" type="image/png" sizes="96x96" href="${L.a('images/icon-96.png')}">\n<link rel="icon" type="image/png" sizes="192x192" href="${L.a('images/icon-192.png')}">\n<link rel="apple-touch-icon" sizes="180x180" href="${L.a('images/apple-touch-icon.png')}">\n<meta name="theme-color" content="#FFE3EE">\n` +
      (has(SITE.umami) ? `<script defer src="https://cloud.umami.is/script.js" data-website-id="${esc(SITE.umami)}"${BASE ? ` data-domains="${esc(BASE.replace(/^https?:\/\//, ''))}"` : ''}></script>\n` : '') +
      (o.preload ? `<link rel="preload" as="image" href="${esc(L.a(o.preload))}" fetchpriority="high">\n` : '') +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&amp;family=JetBrains+Mono:wght@400;500;700&amp;family=Nunito:wght@800;900&amp;display=swap" rel="stylesheet">\n' +
      `<link rel="stylesheet" href="${L.a('assets/css/style.css')}${VER}">\n<script>document.documentElement.classList.add('js')</script>\n` +
      (graph.length ? `<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph })}</script>\n` : '') +
      '</head>\n<body>\n<a class="skip" href="#main">' + tr('Aller au contenu', 'Skip to content') + '</a>\n<div class="wrap">\n' +
      `<header class="hdr"><div class="hdr-in"><a class="brand" href="${L('')}"><span class="brand-logo"><img src="${L.a('images/mascotte.png')}" alt="" width="46" height="46"></span><span class="brand-name">${esc(NAME)}</span></a>` +
      `<nav class="nav" aria-label="${tr('Navigation principale', 'Main navigation')}">${NAV.map(n => `<a href="${L(n[1])}"${o.nav === n[0] ? ' class="on" aria-current="page"' : ''}>${esc(n[2])}</a>`).join('')}${COMMU ? `<a class="nav-cta" href="${L('communaute/')}" data-umami-event="cta-communaute" data-umami-event-position="header"${o.nav === 'communaute' ? ' aria-current="page"' : ''}>${tr('Rejoindre la communauté', 'Join the community')}</a>` : EMAIL ? `<a class="nav-cta" href="${L('proposer-un-talent/')}" data-umami-event="cta-proposer" data-umami-event-position="header"${o.nav === 'proposer' ? ' aria-current="page"' : ''}>${tr('Proposer un talent', 'Suggest a talent')}</a>` : ''}${BILINGUE ? `<a class="lang" href="${L.alt(other, o.noindex ? '' : o.path)}" hreflang="${other}" lang="${other}" data-umami-event="switch-lang" data-umami-event-to="${other}" title="${tr('English version', 'Version française')}"><span class="flag" aria-hidden="true">${FLAGS[other]}</span>${other.toUpperCase()}</a>` : ''}</nav></div></header>\n` +
      `<main id="main">\n${main}\n${o.noindex ? '' : nlBlock()}</main>\n` +
      `<footer class="ftr"><div class="ftr-in"><nav class="ftr-nav" aria-label="${tr('Pied de page', 'Footer')}">${FOOTLINKS.map(l => `<a href="${L(l[0])}">${esc(l[1])}</a>`).join('')}</nav><div class="ftr-meta"><span>${esc(f.gauche || '')}</span><span>${esc(f.droite || '')}</span></div></div></footer>\n</div>\n` +
      (o.script ? `<script src="${L.a('assets/js/app.js')}${VER}" defer></script>\n` : '') + '</body>\n</html>\n';
    FILES[o.file ? (ENG ? 'en/' : '') + o.file : FPATH + 'index.html'] = html;
    if (!o.noindex) SITEMAP.push({ loc: url, alt: ALT ? { fr: ALT.fr, en: ALT.en } : undefined, lastmod: o.lastmod || LAST, priority: o.priority || '0.6' });
  }
  const proposeBtn = (L, cls) => EMAIL ? `<a class="btn ${cls}" href="${L('proposer-un-talent/')}" data-umami-event="proposer-talent">${tr('Proposer un talent →', 'Suggest a talent →')}</a>` : PROPOSER ? `<a class="btn ${cls}" href="${esc(PROPOSER)}" target="_blank" rel="noopener" data-umami-event="proposer-talent">${tr('Proposer un talent →', 'Suggest a talent →')}</a>` : '';
  const joinBlock = (L, title) => !COMMU ? `<section class="join" aria-labelledby="join-h"><div class="join-txt"><p class="eyebrow">${tr('Proposer un talent', 'Suggest a talent')}</p><h2 class="join-h" id="join-h">${title || tr('Qui sera la prochaine Next Gen ?', 'Who will be the next Next Gen?')}</h2>` +
    `<p>${tr("Vous connaissez une future pépite du CRO ou de l'e-commerce ? Envoyez son profil LinkedIn : la prochaine Next Gen est peut-être déjà dans votre réseau.", 'Know a rising star in CRO or e-commerce? Send us their LinkedIn profile: the next Next Gen may already be in your network.')}</p>` +
    `<div class="ctas">${proposeBtn(L, 'dark')}</div></div>${mascot(L, 260)}</section>` : `<section class="join" aria-labelledby="join-h"><div class="join-txt"><p class="eyebrow">${tr('Communauté', 'Community')}</p><h2 class="join-h" id="join-h">${title || 'Join the Next Gen'}</h2>` +
    `<p>${tr("Vous connaissez une future pépite du CRO ou de l'e-commerce ? Proposez-la. Vous voulez échanger avec les Talents et les passionnés de CRO ? Rejoignez la communauté.", 'Know a rising star in CRO or e-commerce? Suggest them. Want to connect with the Talents and fellow CRO enthusiasts? Join the community.')}</p>` +
    `<div class="ctas">${proposeBtn(L, 'dark')}<a class="btn white" href="${L('communaute/')}">${tr('Rejoindre la communauté', 'Join the community')}</a></div></div>${mascot(L, 260)}</section>`;

  /* ---------- ACCUEIL ---------- */
  page({
    path: '', nav: 'home', priority: '1.0', preload: FEATURED[0] && FEATURED[0].photo,
    title: BRAND + tr(' — Les talents qui font bouger le CRO & e-commerce', ' — The talents shaping CRO & e-commerce'),
    desc: clamp(SITE.sousTitre + ' ' + plural(N, 'portrait', 'portraits') + tr(' de la Promo ', ' from the Class of ') + (SITE.promoActuelle || '') + tr(', par ', ', by ') + (AUTHOR.nom || '') + '.'),
    ld: [{ '@type': 'WebSite', '@id': abs('#website'), name: BRAND, alternateName: NAME, url: U(''), inLanguage: INLANG, description: SITE.description || '', publisher: { '@id': ORG['@id'] },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: U('talents/') + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
      Object.assign({}, ORG, { founder: ROBIN })],
    main: L => {
      const f = FEATURED[0], side = FEATURED.slice(1, 4);
      let h = `<section class="hero"><div class="hero-txt"><p class="eyebrow pinkd">${PROMO}${esc(SITE.promoActuelle || '')} · ${tr('une série de', 'a series by')} ${esc(AUTHOR.nom || '')}</p>` +
        `<h1 class="display">${esc(SITE.baseline || '').replace(/CRO/, '<span class="pink">CRO</span>')}</h1><p class="hero-sub">${esc(SITE.sousTitre || '')}</p>` +
        `<div class="ctas"><a class="btn" href="${L('talents/')}">${tr('Découvrir les Talents →', 'Discover the Talents →')}</a><a class="link-arrow" href="${L('a-propos/')}">${tr('À propos du projet', 'About the project')}</a></div></div>${mascot(L, 220, 'mascot hero-mascot')}</section>`;
      if (f) {
        h += `<section class="feat" aria-labelledby="feat-h"><h2 class="eyebrow rule" id="feat-h">Featured Talents</h2><div class="feat-grid">` +
          `<a class="feat-photo" href="${L(f.path)}" tabindex="-1" aria-hidden="true">${portrait(f, L, { eager: true, cls: 'xl', sizes: '(max-width: 900px) 100vw, 55vw' })}<span class="num-badge">NEXTGEN #${f.num}</span></a>` +
          `<div class="feat-body"><p class="eyebrow pinkd">NEXTGEN #${f.num} · ${PROMO}${esc(f.promo)}</p><h3 class="feat-name"><a href="${L(f.path)}">${esc(f.nom)}</a></h3>` +
          `<p class="feat-role">${esc(f.poste)}</p>${co(f.entreprise, 40, 'co-lg')}${xps(f.expertises)}` +
          (f.citation ? `<blockquote class="feat-q"><p>${OQ}${esc(f.citation)}${CQ}</p><footer>— ${esc(f.nom)}</footer></blockquote>` : '') + sample(f) +
          `<a class="btn" href="${L(f.path)}">${tr('Découvrir', 'Meet')} ${esc(f.prenom)} →</a></div></div>` +
          (side.length ? `<ul class="side">${side.map(p => `<li><a class="side-i" href="${L(p.path)}">${portrait(p, L, { cls: 'sm' })}<span><span class="pc-num">NEXTGEN #${p.num}</span><strong>${esc(p.nom)}</strong><span>${esc(p.poste)}</span>${co(p.entreprise, 22)}${p.citation ? `<em>${OQ}${esc(p.citation)}${CQ}</em>` : ''}</span></a></li>`).join('')}</ul>` : '') +
          '</section>';
        h += `<section class="meet" aria-labelledby="meet-h"><div class="row-between"><div class="stack"><p class="eyebrow pinkd">${PROMO}${esc(SITE.promoActuelle || '')}</p><h2 class="h2" id="meet-h">Meet the Next Gen</h2></div>` +
          `<a class="link-arrow" href="${L('talents/')}">${tr('Découvrir toute la Promo →', 'See the whole class →')}</a></div><div class="pgrid">${ALL.slice(0, 8).map(p => pcard(p, L, 'h3')).join('')}</div></section>`;
      }
      h += `<section class="manif" aria-labelledby="manif-h"><h2 class="eyebrow rule" id="manif-h">${tr('Le projet', 'The project')}</h2><p class="manif-t">${esc(SITE.projetCourt || '')}</p><a class="link-arrow" href="${L('a-propos/')}">${tr('Découvrir le projet →', 'Discover the project →')}</a></section>`;
      const T = list(SITE.temoignages).filter(r => r && has(r.citation));
      if (T.length >= 3) h += `<section class="voices" aria-labelledby="voices-h"><h2 class="eyebrow rule" id="voices-h">${tr('Ils en parlent', 'What they say')}</h2><div class="voices-grid">${T.slice(0, 5).map(r => `<figure><blockquote><p>${OQ}${esc(r.citation)}${CQ}</p></blockquote><figcaption><strong>${esc(r.nom || '')}</strong>${r.role ? ' — ' + esc(r.role) : ''}</figcaption></figure>`).join('')}</div></section>`;
      h += joinBlock(L);
      return h;
    }
  });

  /* ---------- PEOPLE (directory) ---------- */
  page({
    path: 'talents/', nav: 'people', priority: '0.9', crumbs: [['Talents', 'talents/']], script: true,
    title: tr('Talents CRO & e-commerce — ', 'CRO & e-commerce talents — ') + BRAND,
    desc: clamp(tr('Meet the Next Gen : ', 'Meet the Next Gen: ') + ALL.slice(0, 4).map(p => p.nom + ' (' + p.entreprise + ')').join(', ') + (N > 4 ? '…' : '.') + tr(' Recherchez par nom, entreprise, expertise, outil ou sujet.', ' Search by name, company, expertise, tool or topic.')),
    ld: [{ '@type': 'CollectionPage', name: 'Meet the Next Gen', url: U('talents/'), inLanguage: INLANG, isPartOf: { '@id': abs('#website') },
      mainEntity: { '@type': 'ItemList', numberOfItems: N, itemListElement: ALL.map((p, k) => ({ '@type': 'ListItem', position: k + 1, url: U(p.path), name: p.nom })) } }],
    main: L => `<section class="page-head"><p class="eyebrow pinkd">${plural(N, 'talent', 'talents')} · ${PROMOS.map(x => PROMO + esc(x)).join(' · ')}</p><h1 class="h1">Meet the Next Gen</h1><p class="lead">${tr('Les talents qui font bouger le CRO et le e-commerce.', 'The talents shaping CRO and e-commerce.')}</p></section>` +
      `<div class="searchbar js-only"><label class="search"><span aria-hidden="true">⌕</span><input id="q" type="search" placeholder="${tr('Nom, entreprise, expertise, outil, sujet…', 'Name, company, expertise, tool, topic…')}" aria-label="${tr('Rechercher un talent', 'Search for a talent')}"><button id="clear" class="hidden" type="button">${tr('Effacer ✕', 'Clear ✕')}</button></label>` +
      `<p class="mono small" id="result-label" data-one="talent" data-many="talents" aria-live="polite">${plural(N, 'talent', 'talents')}</p></div>` +
      (XP.length > 1 ? `<div class="filters js-only" role="group" aria-label="${tr('Filtrer par expertise', 'Filter by expertise')}"><button type="button" class="filter on" data-filter="exp" data-value="" aria-pressed="true">${tr('Tous', 'All')}</button>${XP.map(x => `<button type="button" class="filter" data-filter="exp" data-value="${esc(norm(x.name))}" aria-pressed="false">${esc(x.name)} <small>${x.n}</small></button>`).join('')}</div>` : '') +
      `<div data-list>${PROMOS.map(pr => { const ps = ALL.filter(p => p.promo === pr); return `<section class="promo" data-group aria-labelledby="promo-${esc(pr)}"><h2 class="promo-h" id="promo-${esc(pr)}">${PROMO}${esc(pr)} <span>${ps.length}</span></h2><div class="pgrid">${ps.map(p => pcard(p, L, 'h3', true)).join('')}</div></section>`; }).join('')}</div>` +
      tr('<p class="empty hidden" id="empty" data-tpl="Aucun talent ne correspond à ce filtre." data-tpl-q="Aucun talent ne correspond à « {q} »."></p>', '<p class="empty hidden" id="empty" data-tpl="No talent matches this filter." data-tpl-q="No talent matches “{q}”."></p>')
  });

  /* ---------- FICHE PEOPLE ---------- */
  ALL.forEach((p, idx) => {
    const prev = ALL[(idx - 1 + N) % N], next = ALL[(idx + 1) % N], multi = N > 1, sim = similar(p);
    const P = p.prenom, dP = de(P);
    const covered = [];
    const PATH_LBL = tr('son parcours dans le CRO', 'their path into CRO'), XP_LBL = tr('son expérience', 'their experience');
    if ((p.sections.declic || []).length) covered.push(PATH_LBL);
    if (p.outils.length) covered.push(tr('ses outils', 'their tools'));
    if (p.mentors.length) covered.push(tr('ses inspirations', 'their inspirations'));
    if ((p.sections.conseil || []).length) covered.push(tr('ses conseils', 'their advice'));
    if ((p.sections.hottake || []).length) covered.push(tr('sa vision du e-commerce', 'their take on e-commerce'));
    const andJoin = a => a.length > 1 ? a.slice(0, -1).join(', ') + tr(' et ', ' and ') + a[a.length - 1] : (a[0] || XP_LBL);
    const autoIntro = ENG ? `Meet ${p.nom}, ${p.poste} at ${p.entreprise}, who shares ${andJoin(covered)}.` : `Rencontre avec ${p.nom}, ${p.poste} chez ${p.entreprise}, qui partage ${andJoin(covered)}.`;
    const descRest = covered.filter(c => c !== PATH_LBL).join(', ') || XP_LBL;
    const desc = clamp(ENG ? `Discover ${poss(p.nom)} career path, ${p.poste} at ${p.entreprise}: ${descRest}${p.citation ? '. “' + p.citation + '”' : '.'}` : `Découvrez le parcours ${de(p.nom)}, ${p.poste} chez ${p.entreprise} : ${descRest}${p.citation ? '. « ' + p.citation + ' »' : '.'}`);
    const person = personLD(p);
    const art = { '@type': 'Article', '@id': U(p.path) + '#article', headline: clamp(p.nom + ', ' + p.poste + tr(' chez ', ' at ') + p.entreprise, 110), description: desc, inLanguage: INLANG,
      url: U(p.path), mainEntityOfPage: U(p.path), image: p.photo ? abs(p.photo) : abs('images/og-image.png'), author: ROBIN, publisher: { '@id': ORG['@id'] }, about: { '@id': person['@id'] },
      keywords: p.expertises.concat(p.outils.map(o => o.nom), p.sujets).join(', ') };
    if (p.date) { art.datePublished = p.date; art.dateModified = p.maj || p.date; }
    const profile = { '@type': 'ProfilePage', url: U(p.path), inLanguage: INLANG, mainEntity: person, isPartOf: { '@id': abs('#website') } };
    if (p.date) { profile.dateCreated = p.date; profile.dateModified = p.maj || p.date; }
    page({
      path: p.path, nav: 'people', ogType: 'article', published: p.date, lastmod: p.maj || p.date, priority: '0.8', image: p.photo, imageAlt: tr('Portrait de ', 'Portrait of ') + p.nom, preload: p.photo,
      crumbs: [['Talents', 'talents/'], [p.nom, p.path]],
      title: ENG ? `${p.nom}, ${p.poste} at ${p.entreprise} — ${BRAND}` : `${p.nom}, ${p.poste} — ${BRAND}`,
      desc, ld: [profile, art, ORG],
      main: L => {
        const S = p.sections, lines = v => list(v).filter(has);
        let n = 0, h = '';
        const label = t => { n++; return `<p class="eyebrow pinkd">${pad(n)} — ${t}</p>`; };
        const sec = (lbl, title, body, cls) => `<section class="sec${cls ? ' ' + cls : ''}"><div class="sec-l">${label(lbl)}<h2 class="sec-h">${title}</h2></div><div class="sec-b">${body}</div></section>`;
        const q = r => r.question ? `<h3 class="q-sub">${esc(r.question)}</h3>` : '';
        const ttl = (rs, def) => esc((rs.find(r => has(r.titreSection)) || {}).titreSection || def);

        h += `<nav class="crumbs" aria-label="${tr("Fil d'Ariane", 'Breadcrumb')}"><a href="${L('talents/')}">${tr('← Tous les Talents', '← All Talents')}</a>${multi ? `<span><a href="${L(prev.path)}">← ${esc(prev.nom)}</a><a href="${L(next.path)}">${esc(next.nom)} →</a></span>` : ''}</nav>`;
        h += '<article class="fiche">';
        h += `<header class="ph"><div class="ph-txt"><p class="eyebrow pinkd">NEXTGEN #${p.num} · ${PROMO}${esc(p.promo)}</p>` +
          `<h1><span class="ph-name">${esc(p.nom)}</span><span class="vh"> — </span><span class="ph-role">${esc(p.poste)}<span class="vh">${tr(' chez ', ' at ')}</span></span>${co(p.entreprise, 40, 'co-lg')}</h1>` +
          xps(p.expertises) + (p.citation ? `<blockquote class="ph-q"><p>${OQ}${esc(p.citation)}${CQ}</p><footer>— ${esc(p.nom)}</footer></blockquote>` : '') + sample(p) +
          `<p class="ph-meta mono">${tr('Interview par', 'Interview by')} <a href="${L('a-propos/')}">${esc(AUTHOR.nom || '')}</a>${p.dateLabel ? ` · <time datetime="${p.date}">${esc(p.dateLabel)}</time>` : ''}</p>${liBtn(p, P, 'hero')}</div>` +
          `<div class="ph-photo">${portrait(p, L, { eager: true, cls: 'xl', sizes: '(max-width: 900px) 100vw, 45vw' })}</div></header>`;
        h += `<section class="intro" aria-label="Introduction"><p>${esc(p.intro || autoIntro)}</p></section>`;

        // En bref
        const exp = p.careerPath.filter(c => c.type !== 'formation');
        const brief = [[tr('Rôle', 'Role'), esc(p.poste)], [tr('Entreprise', 'Company'), co(p.entreprise, 28)]];
        if (p.secteur) brief.push([tr('Secteur', 'Sector'), esc(p.secteur)]);
        if (p.expertises.length) brief.push([tr('Expertises', 'Expertise'), p.expertises.map(esc).join(' · ')]);
        if (exp.length) brief.push([tr('Parcours', 'Career path'), exp.map(c => esc(c.etape)).join(' → ')]);
        else (S.parcours || []).forEach(r => { if (r.question && lines(r.reponse).length) brief.push([esc(r.question), lines(r.reponse).map(esc).join(' · ')]); });
        if (p.motFin) brief.push(['Conviction', ENG ? `“CRO without ${esc(p.motFin.toLowerCase())} isn't CRO.”` : `« Le CRO sans ${esc(p.motFin.toLowerCase())}, ce n'est pas du CRO. »`]);
        h += `<section class="brief" aria-labelledby="brief-h"><h2 class="eyebrow" id="brief-h">${esc(P)}${tr(', en bref', ' at a glance')}</h2><dl>${brief.map(b => `<div><dt>${b[0]}</dt><dd>${b[1]}</dd></div>`).join('')}</dl></section>`;

        // Parcours / déclic
        const dec = (S.declic || []).filter(r => has(r.reponse));
        if (dec.length) h += sec(tr('Parcours', 'Career'), ttl(dec, tr(`Le déclic : comment ${P} a découvert le CRO`, `The spark: how ${P} discovered CRO`)), dec.map(r => q(r) + `<p>${esc(r.reponse)}</p>`).join(''));
        if (p.careerPath.length) {
          h += `<section class="career" aria-labelledby="career-h"><h2 class="eyebrow" id="career-h">Career Path — ${tr(`le parcours ${esc(dP)} en ${p.careerPath.length} étapes`, `${esc(poss(P))} journey in ${p.careerPath.length} steps`)}</h2><ol>${p.careerPath.map(c => `<li><span class="c-type">${c.type === 'formation' ? tr('Formation', 'Education') : tr('Expérience', 'Experience')}</span><strong>${esc(c.etape)}</strong>${c.detail ? `<span class="c-d">${esc(c.detail)}</span>` : ''}</li>`).join('')}</ol></section>`;
        }
        // Mindset
        (S.mindset || []).filter(r => has(r.titre) || has(r.reponse)).forEach(r => {
          n++;
          h += `<section class="mind"><p class="eyebrow">${pad(n)} — Mindset</p><h2 class="mind-h">${ttl([r], tr(`La phrase qui guide ${P}`, `The phrase that guides ${P}`))}</h2>` +
            (r.titre ? `<blockquote class="mind-q"><p>${OQ}${esc(r.titre)}${CQ}</p>${r.auteur ? `<footer>— ${esc(r.auteur)}</footer>` : ''}</blockquote>` : '') +
            (r.reponse ? `<p class="mind-p">${esc(r.reponse)}</p><p class="mind-a">— ${esc(p.nom)}</p>` : '') + '</section>';
        });
        // Méthode
        if (p.methode) {
          n++;
          h += `<section class="method"><div class="sec-l"><p class="eyebrow pinkd">${pad(n)} — ${tr('Méthode', 'Method')}</p><h2 class="sec-h">${esc(p.methode.titre || tr('La méthode ' + dP, poss(P) + ' method'))}</h2>${p.methode.synthese ? `<p class="note">${tr(`Synthèse rédigée par NextGen à partir de l'interview, et non une méthode formulée telle quelle par ${esc(P)}.`, `Summary written by NextGen from the interview, not a method stated as such by ${esc(P)}.`)}</p>` : ''}</div>` +
            `<ol class="steps">${list(p.methode.etapes).map((e, k) => `<li><span>${pad(k + 1)}</span><h3>${esc(e.titre)}</h3>${e.texte ? `<p>${esc(e.texte)}</p>` : ''}</li>`).join('')}</ol></section>`;
        }
        // Citation XXL
        if (p.citation) h += `<figure class="xxl"><blockquote><p>${OQ}${esc(p.citation)}${CQ}</p></blockquote><figcaption>${attribution(p)}</figcaption></figure>`;
        // Conseil
        const cons = (S.conseil || []).filter(r => has(r.titre) || has(r.reponse));
        if (cons.length) h += sec(tr('Conseil', 'Advice'), ttl(cons, tr(`Le conseil ${dP} aux juniors`, `${poss(P)} advice to juniors`)), cons.map(r => q(r) + (r.titre && norm(r.titre).replace(/[.!]$/, '') !== norm(p.citation).replace(/[.!]$/, '') ? `<p class="big">${esc(r.titre)}</p>` : '') + (r.reponse ? `<p>${esc(r.reponse)}</p>` : '')).join(''));
        // Toolbox
        if (p.outils.length) {
          n++;
          h += `<section class="tb" aria-labelledby="tb-h"><div class="sec-l"><p class="eyebrow pinkd">${pad(n)} — Toolbox</p><h2 class="sec-h" id="tb-h">${tr(`Quels outils ${esc(P)} utilise au quotidien`, `The tools ${esc(P)} uses every day`)}</h2><p class="note">${tr(`${p.outils.length} outils, et l'usage qu'en fait ${esc(P)} selon l'interview.`, `${plural(p.outils.length, 'tool', 'tools')}, and how ${esc(P)} uses ${p.outils.length > 1 ? 'them' : 'it'}, according to the interview.`)} <a href="${L('inspirations/')}#toolbox">${tr('Toute la toolbox de la Promo →', 'The whole class toolbox →')}</a></p></div><div class="tb-list">` +
            p.outils.map(o => { const t = toolOf(o.nom), cat = TOOLCAT[norm(o.nom)]; return `<div class="tb-i">${logo(o.nom, 44)}<div><h3>${t && t.page ? `<a href="${L(t.path)}">${esc(o.nom)}</a>` : esc(o.nom)}</h3>${cat ? `<p class="tb-cat">${esc(cat)}</p>` : ''}${o.usage ? `<p>${esc(o.usage)}</p>` : ''}</div></div>`; }).join('') + '</div></section>';
        }
        // Inspirations
        if (p.mentors.length) {
          h += sec('Inspirations', tr(`Qui inspire ${esc(P)} ?`, `Who inspires ${esc(P)}?`), `<div class="insp">${p.mentors.map(m => {
            const fiche = byName[norm(m.nom)], mo = mentorOf(m.nom);
            return `<div class="insp-i">${avatar(m.nom, m.photo, 56, L)}<div><h3>${fiche ? `<a href="${L(fiche.path)}">${esc(m.nom)}</a>` : `<a href="${L('inspirations/')}#p-${mo.slug}">${esc(m.nom)}</a>`}</h3><p class="rel">${REL[m.relation].tag}</p>` +
              ((m.expertise || m.organisation) ? `<p class="insp-x">${[m.expertise, m.organisation].filter(Boolean).map(esc).join(' · ')}</p>` : '') +
              (m.citation ? `<p>${esc(m.citation)}</p>` : '') + `<a class="mono small" href="${esc(m.lienLinkedin || liSearch(m.nom))}" target="_blank" rel="noopener" data-umami-event="linkedin-mentor" data-umami-event-mentor="${esc(m.nom)}">${tr('LinkedIn de ' + esc(first(m.nom)), esc(first(m.nom)) + ' on LinkedIn')} ↗</a></div></div>`;
          }).join('')}</div>`, 'sec-insp');
        }
        if (p.ressources.length) {
          h += sec('Read · Watch · Listen', tr(`Les contenus cités par ${esc(P)}`, `The content ${esc(P)} mentions`), `<div class="rwl-mini">${p.ressources.map(r => { const ro = resOf(r.titre); return `<div class="rwl-m">${r.image ? `<img class="rwl-thumb" src="${esc(L.a(r.image))}" alt="${tr('Couverture : ', 'Cover: ')}${esc(r.titre)}" width="96" height="125" loading="lazy">` : ''}<span class="rtype">${TYPES[r.type]}</span><h3><a href="${L('inspirations/')}#r-${ro.slug}">${esc(r.titre)}</a></h3>${r.auteur ? `<p class="insp-x">${esc(r.auteur)}</p>` : ''}${r.raison ? `<p>${OQ}${esc(r.raison)}${CQ}</p>` : ''}<p class="rel">${REL[r.relation].tag}</p></div>`; }).join('')}</div>`);
        }
        // Sections libres
        const KNOWN = ['parcours', 'declic', 'mindset', 'conseil', 'hottake'];
        Object.keys(S).filter(k => KNOWN.indexOf(k) < 0).forEach(k => {
          const items = S[k].filter(r => has(r.reponse));
          if (items.length) h += sec(esc(items[0].section || tr('Et aussi', 'And also')), ttl(items, items[0].section || tr('Et aussi', 'And also')), items.map(r => q(r) + lines(r.reponse).map(l => `<p>${esc(l)}</p>`).join('')).join(''));
        });
        // Hot take
        (S.hottake || []).filter(r => has(r.question) && (has(r.oui) || has(r.non))).forEach(r => {
          n++;
          h += `<section class="hot"><div class="hot-q"><p class="eyebrow pinkd">${pad(n)} — Vision · ${tr('#SansFiltre', '#NoFilter')}</p><h2 class="sec-h">${ttl([r], tr(`Le hot take ${dP}`, `${poss(P)} hot take`))}</h2><h3 class="hot-question">${esc(r.question)}</h3></div><div class="hot-a">` +
            (has(r.oui) && r.oui !== '—' ? `<div class="yes"><b>${tr('Oui', 'Yes')}</b>${r.ouiContexte ? `<span class="mono small">${esc(r.ouiContexte)}</span>` : ''}<p>${esc(r.oui)}</p></div>` : '') +
            (has(r.non) ? `<div><b>${tr('Non', 'No')}</b>${r.nonContexte ? `<span class="mono small">${esc(r.nonContexte)}</span>` : ''}<p>${esc(r.non)}</p></div>` : '') + '</div></section>';
        });
        if (p.sujets.length) h += `<section class="radar" aria-labelledby="radar-h"><h2 class="eyebrow" id="radar-h">${tr(`Sur le radar ${esc(dP)}`, `On ${esc(poss(P))} radar`)}</h2><ul>${p.sujets.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>`;
        // À retenir
        if (p.aRetenir) {
          const pts = list(p.aRetenir.points);
          h += `<section class="remember" aria-labelledby="rem-h"><div class="sec-l"><p class="eyebrow pinkd">${tr('À retenir', 'Key takeaways')}</p><h2 class="sec-h" id="rem-h">${tr(`${pts.length} choses à retenir de l'interview ${esc(dP)}`, `${pts.length} takeaways from ${esc(poss(P))} interview`)}</h2>${p.aRetenir.synthese ? `<p class="note">${tr("Synthèse NextGen, fondée sur les réponses de l'interview.", 'NextGen summary, based on the interview answers.')}</p>` : ''}</div>` +
            `<ol>${pts.map((x, k) => `<li><span class="r-n">${pad(k + 1)}</span><h3>${esc(x.titre)}</h3>${x.texte ? `<p>${esc(x.texte)}</p>` : ''}</li>`).join('')}</ol></section>`;
        }
        if (p.motFin) {
          h += `<section class="motfin" aria-labelledby="mf-h"><h2 class="eyebrow" id="mf-h">${tr(`Le mot de la fin ${esc(dP)}`, `${esc(poss(P))} final word`)}</h2><p class="s">${tr('Le CRO sans', 'CRO without')}</p><p class="w" style="--n:${[...String(p.motFin)].length}">${esc(p.motFin)}</p><p class="s">${tr("ce n'est pas du CRO.", "isn't CRO.")}</p>` +
            `<p class="mf-a">— ${esc(p.nom)}</p><a class="link-arrow" href="${L('mur-de-mots/')}">${tr('Voir le mur des mots →', 'See the word wall →')}</a></section>`;
        }
        if (p.lienLinkedin) h += `<section class="li-cta" aria-labelledby="li-h"><div><p class="eyebrow">${tr('Talents &amp; recruteurs', 'Talents &amp; recruiters')}</p><h2 class="h2" id="li-h">${tr(`Envie d'échanger avec ${esc(P)} ?`, `Want to talk with ${esc(P)}?`)}</h2><p>${tr(`Connectez-vous avec ${esc(P)} sur LinkedIn pour poursuivre la conversation, partager une opportunité ou échanger sur le CRO et l'e-commerce.`, `Connect with ${esc(P)} on LinkedIn to keep the conversation going, share an opportunity or talk CRO and e-commerce.`)}</p></div>${liBtn(p, P, 'fin')}</section>`;
        h += '</article>';
        if (sim.length) h += `<section class="related" aria-labelledby="rel-h"><div class="row-between"><h2 class="h2" id="rel-h">Meet more Talents</h2><a class="link-arrow" href="${L('talents/')}">${tr('Découvrir tous les Talents →', 'See all Talents →')}</a></div><div class="pgrid three">${sim.map(x => pcard(x, L, 'h3')).join('')}</div></section>`;
        if (multi) h += `<nav class="pn" aria-label="${tr('Profil précédent et suivant', 'Previous and next profile')}"><a href="${L(prev.path)}" rel="prev"><span>${tr('← Précédent', '← Previous')}</span><span>${esc(prev.nom)}</span></a><a class="r" href="${L(next.path)}" rel="next"><span>${tr('Suivant →', 'Next →')}</span><span>${esc(next.nom)}</span></a></nav>`;
        return h;
      }
    });
  });

  /* ---------- INSPIRATIONS (People to Follow · Toolbox · Read Watch Listen) + pages outil ---------- */
  page({
    path: 'inspirations/', nav: 'inspirations', priority: '0.8', crumbs: [['Inspirations', 'inspirations/']],
    title: tr('Inspirations CRO & e-commerce — Outils, experts et ressources | ', 'CRO & e-commerce inspirations — Tools, experts and resources | ') + BRAND,
    desc: tr('Découvrez les experts, outils, livres, podcasts et newsletters cités par les professionnels du CRO et du e-commerce interviewés sur ', 'Discover the experts, tools, books, podcasts and newsletters cited by the CRO and e-commerce professionals interviewed on ') + BRAND + '.',
    ld: [{ '@type': 'CollectionPage', name: tr('Inspirations de la Next Gen', 'Next Gen Inspirations'), url: U('inspirations/'), inLanguage: INLANG, isPartOf: { '@id': abs('#website') },
      hasPart: [
        MENTORS.length && { '@type': 'ItemList', name: 'People to Follow', numberOfItems: MENTORS.length, itemListElement: MENTORS.map((m, k) => ({ '@type': 'ListItem', position: k + 1, url: U('inspirations/') + '#p-' + m.slug, item: { '@type': 'Person', name: m.nom, jobTitle: m.expertise || undefined, sameAs: m.lien ? [m.lien] : undefined } })) },
        TOOLS.length && { '@type': 'ItemList', name: 'Toolbox', numberOfItems: TOOLS.length, itemListElement: TOOLS.map((t, k) => ({ '@type': 'ListItem', position: k + 1, url: t.page ? U(t.path) : abs('inspirations/') + '#t-' + t.slug, item: { '@type': 'SoftwareApplication', name: t.name, applicationCategory: t.cat || undefined } })) },
        RESS.length && { '@type': 'ItemList', name: 'Read · Watch · Listen', numberOfItems: RESS.length, itemListElement: RESS.map((r, k) => ({ '@type': 'ListItem', position: k + 1, url: U('inspirations/') + '#r-' + r.slug, item: { '@type': SCHEMA[r.type], name: r.titre, author: r.auteur ? { '@type': 'Person', name: r.auteur } : undefined, sameAs: r.lien || undefined } })) }
      ].filter(Boolean) }],
    main: L => {
      const secs = [MENTORS.length && ['people', 'People to Follow', MENTORS.length], TOOLS.length && ['toolbox', 'Toolbox', TOOLS.length], RESS.length && ['rwl', 'Read · Watch · Listen', RESS.length]].filter(Boolean);
      const kinds = [].concat(MENTORS.length ? [tr('personnes à suivre', 'people to follow')] : [], TOOLS.length ? [tr('outils', 'tools')] : [], Object.keys(TYPES).filter(t => RESS.some(r => r.type === t)).map(t => TYPES_FR[t]));
      let h = `<section class="page-head insp-head"><p class="eyebrow pinkd">${tr("Le carnet d'inspirations de la Promo", "The class's inspiration notebook")}</p><h1 class="h1">${tr('Inspirations de la Next Gen', 'Next Gen Inspirations')}</h1>` +
        `<p class="insp-acc">${tr("Ceux qu'ils suivent. Les outils qu'ils utilisent. Les contenus qui nourrissent leur pratique.", 'Who they follow. The tools they use. The content that feeds their practice.')}</p>` +
        `<p class="lead">${ENG ? `Discover the CRO and e-commerce experts, tools and resources cited by the ${plural(N, 'professional', 'professionals')} interviewed on ${esc(BRAND)}${kinds.length ? ': ' + kinds.join(', ') : ''}.` : `Découvrez les experts, outils et ressources CRO et e-commerce cités par les ${plural(N, 'professionnel interviewé', 'professionnels interviewés')} sur ${esc(BRAND)}${kinds.length ? ' : ' + kinds.join(', ') : ''}.`}</p>` +
        (secs.length > 1 ? `<nav class="insp-idx" aria-label="${tr('Sections de la page', 'Page sections')}">${secs.map((s, i) => `<a href="#${s[0]}"><span>${pad(i + 1)}</span>${s[1]}<small>${s[2]}</small></a>`).join('')}</nav>` : '') + '</section>';
      let k = 0;
      if (MENTORS.length) {
        k++;
        h += `<section class="ip" id="people" aria-labelledby="people-h"><div class="ip-head"><p class="eyebrow pinkd">${pad(k)}</p><h2 class="h2" id="people-h">People to Follow</h2><p class="note">${tr('Les personnes citées comme références ou inspirations par les talents NextGen, avec leurs mots.', 'The people NextGen talents cite as references or inspirations, in their own words.')}</p></div><div class="ip-grid">` +
          MENTORS.map(m => `<article class="ip-i${m.by.length > 1 ? ' multi' : ''}" id="p-${m.slug}">${portrait({ nom: m.nom, photo: m.photo, photos: [] }, L, { cls: 'ip-portrait' })}<div class="ip-txt"><h3>${esc(m.nom)}</h3>` +
            ((m.expertise || m.organisation) ? `<p class="insp-x">${[m.expertise, m.organisation].filter(Boolean).map(esc).join(' · ')}</p>` : '') +
            m.by.map(x => `<div class="ip-cite">${x.citation ? `<p>${OQ}${esc(x.citation)}${CQ}</p>` : ''}<a class="link-arrow" href="${L(x.p.path)}">${REL[x.relation].by} ${esc(x.p.nom)} →</a></div>`).join('') +
            `<a class="mono small" href="${esc(m.lien || liSearch(m.nom))}" target="_blank" rel="noopener" data-umami-event="linkedin-mentor" data-umami-event-mentor="${esc(m.nom)}">${tr('LinkedIn de ' + esc(first(m.nom)), esc(first(m.nom)) + ' on LinkedIn')} ↗</a></div></article>`).join('') + '</div></section>';
      }
      if (TOOLS.length) {
        k++;
        h += `<section class="itb" id="toolbox" aria-labelledby="toolbox-h"><div class="ip-head"><p class="eyebrow">${pad(k)}</p><h2 class="h2" id="toolbox-h">Toolbox</h2><p class="note">${tr("Les outils utilisés et cités par les professionnels CRO et e-commerce interviewés sur NextGen, et l'usage qu'ils en décrivent.", 'The tools used and cited by the CRO and e-commerce professionals interviewed on NextGen, and how they describe using them.')}</p></div><ol class="itb-list">` +
          TOOLS.map(t => `<li id="t-${t.slug}"><div class="itb-name">${logo(t.name, 40)}<h3>${t.page ? `<a href="${L(t.path)}">${esc(t.name)}</a>` : esc(t.name)}</h3></div><div class="itb-meta">${t.cat ? `<span class="tb-cat">${esc(t.cat)}</span>` : ''}<span class="mono small">${plural(t.count, 'talent', 'talents')}</span></div>` +
            `<ul class="itb-uses">${t.by.map(x => `<li>${x.usage ? `<p>${esc(x.usage)}</p>` : ''}<a href="${L(x.p.path)}">${tr('Utilisé par', 'Used by')} ${esc(x.p.nom)} →</a></li>`).join('')}</ul></li>`).join('') + '</ol></section>';
      }
      if (RESS.length) {
        k++;
        h += `<section class="rwl" id="rwl" aria-labelledby="rwl-h"><div class="ip-head"><p class="eyebrow pinkd">${pad(k)}</p><h2 class="h2" id="rwl-h">Read · Watch · Listen</h2><p class="note">${tr('Les livres, podcasts, newsletters et contenus cités par les talents NextGen.', 'The books, podcasts, newsletters and content cited by NextGen talents.')}</p></div><div class="rwl-grid">` +
          RESS.map((r, i) => `<article class="rwl-i" id="r-${r.slug}"><div class="cover c${i % 4} t-${r.type}${r.image ? ' has-img' : ''}">${r.image ? `<img src="${esc(L.a(r.image))}" alt="${tr('Couverture : ', 'Cover: ')}${esc(r.titre)}${r.auteur ? ' (' + esc(r.auteur) + ')' : ''}" width="400" height="520" loading="lazy">` : `<span class="cv-type" aria-hidden="true">${TYPES[r.type]}</span><span class="cv-t" aria-hidden="true">${esc(r.titre)}</span>${r.auteur ? `<span class="cv-a" aria-hidden="true">${esc(r.auteur)}</span>` : ''}`}</div>` +
            `<span class="rtype">${TYPES[r.type]}</span><h3>${r.lien ? `<a href="${esc(r.lien)}" target="_blank" rel="noopener">${esc(r.titre)} ↗</a>` : esc(r.titre)}</h3>${r.auteur ? `<p class="insp-x">${esc(r.auteur)}</p>` : ''}` +
            r.by.map(x => `${x.raison ? `<p>${OQ}${esc(x.raison)}${CQ}</p>` : ''}<a class="link-arrow" href="${L(x.p.path)}">${REL[x.relation].by} ${esc(x.p.nom)} →</a>`).join('') + '</article>').join('') + '</div></section>';
      }
      h += `<p class="insp-end">${tr('Chaque nouvelle interview enrichit ce carnet.', 'Every new interview adds to this notebook.')} <a class="link-arrow" href="${L('talents/')}">Meet the Next Gen →</a></p>`;
      return h;
    }
  });
  TOOLS.filter(t => t.page).forEach(t => {
    page({
      path: t.path, nav: 'inspirations', priority: '0.5', lastmod: t.by.map(b => b.p.maj || b.p.date).sort().pop() || LAST, crumbs: [['Inspirations', 'inspirations/'], [t.name, t.path]],
      title: ENG ? `${t.name}: how CRO talents use it — ${BRAND}` : `${t.name} : comment les talents CRO l'utilisent — ${BRAND}`,
      desc: clamp(synth(t) + (ENG ? ' See how ' + t.by.slice(0, 3).map(b => b.p.nom).join(', ') + ' use it day to day.' : ' Découvrez comment ' + t.by.slice(0, 3).map(b => b.p.nom).join(', ') + ' l\'utilisent au quotidien.')),
      ld: [{ '@type': 'CollectionPage', name: t.name, url: U(t.path), inLanguage: INLANG, isPartOf: { '@id': abs('#website') }, about: { '@type': 'SoftwareApplication', name: t.name, applicationCategory: t.cat || undefined },
        mentions: t.by.map(b => ({ '@type': 'Person', name: b.p.nom, url: U(b.p.path) })) }],
      main: L => `<nav class="crumbs" aria-label="${tr("Fil d'Ariane", 'Breadcrumb')}"><a href="${L('inspirations/')}#toolbox">← Toolbox · Inspirations</a></nav>` +
        `<section class="page-head"><div class="row">${logo(t.name, 72)}${t.cat ? `<p class="eyebrow pinkd">${esc(t.cat)}</p>` : ''}</div><h1 class="h1">${esc(t.name)}</h1><p class="lead">${esc(synth(t))}</p></section>` +
        `<section><h2 class="eyebrow rule">${tr('Comment ils utilisent', 'How they use')} ${esc(t.name)}</h2><div class="uses">${t.by.map(b => `<div class="use">${portrait(b.p, L, { cls: 'sm' })}<div><h3><a href="${L(b.p.path)}">${esc(b.p.nom)}</a></h3><p class="pc-role">${esc(b.p.poste)}</p>${co(b.p.entreprise, 24)}${b.usage ? `<blockquote><p>${OQ}${esc(b.usage)}${CQ}</p></blockquote>` : ''}<a class="link-arrow" href="${L(b.p.path)}#tb-h">${tr('Voir la toolbox de ' + esc(b.p.prenom), 'See ' + esc(poss(b.p.prenom)) + ' toolbox')} →</a></div></div>`).join('')}</div></section>`
    });
  });

  /* ---------- MUR DE MOTS ---------- */
  const groups = ALL.filter(p => p.motsCles.length);
  page({
    path: 'mur-de-mots/', nav: 'communaute', crumbs: (COMMU ? [[tr('Communauté', 'Community'), 'communaute/']] : []).concat([[tr('Mur des mots', 'Word wall'), 'mur-de-mots/']]),
    title: tr('« Le CRO sans … ce n\'est pas du CRO » : le mur des mots — ', '“CRO without … isn\'t CRO”: the word wall — ') + BRAND,
    desc: clamp(tr('Le mot sans lequel le CRO n\'existe pas, selon ', 'The word CRO cannot exist without, according to ') + groups.length + tr(' talents : ', ' talents: ') + groups.slice(0, 6).map(p => p.motFin + ' (' + p.nom + ')').join(', ') + '…'),
    main: L => {
      const palette = ['#FFF7FA', '#FF8DB8', 'transparent'], sizes = [1, 0.5, 0.8, 0.4, 0.95, 0.6, 0.7, 0.45];
      return `<section class="page-head"><p class="eyebrow pinkd">${tr('#MotClé', '#KeyWord')} · ${plural(groups.length, 'talent', 'talents')}</p><h1 class="h1">${tr('Le CRO sans <span class="ul">[…]</span>, ce n\'est pas du CRO.', 'CRO without <span class="ul">[…]</span> isn\'t CRO.')}</h1></section>` +
        `<div class="wall">${groups.map((p, k) => {
          const r = sizes[k % sizes.length], c = palette[k % 3];
          return `<a class="wgroup" href="${L(p.path)}"><span class="words">${p.motsCles.map((w, j) => { const rr = j ? r * 0.55 : r; return `<span class="word" style="font-size:min(clamp(${Math.round(32 + 40 * rr)}px,${(4 + 8 * rr).toFixed(1)}vw,${Math.round(64 + 100 * rr)}px),calc((100vw - 110px) / ${([...String(w)].length * 0.72).toFixed(2)}));font-weight:${rr > 0.7 ? 800 : (k % 2 ? 500 : 700)};color:${c};-webkit-text-stroke:${c === 'transparent' ? '1.5px #FFF7FA' : '0'}">${esc(w)}</span>`; }).join('')}</span><span class="by">${esc(p.nom)}</span></a>`;
        }).join('')}</div><p class="mono small" style="margin-top:14px">${tr('Regroupés par talent · cliquez pour découvrir la personne.', 'Grouped by talent · click to meet the person.')}</p>`;
    }
  });

  /* ---------- COMMUNAUTÉ (masquée si SITE.communaute = false) ---------- */
  if (COMMU) page({
    path: 'communaute/', nav: 'communaute', crumbs: [[tr('Communauté', 'Community'), 'communaute/']],
    title: tr('Communauté WhatsApp CRO & e-commerce — ', 'CRO & e-commerce WhatsApp community — ') + BRAND,
    desc: ENG ? 'Join the ' + BRAND + ' community: peer discussions, jobs and internships, CRO news and tools. And suggest the next talent to interview.' : 'Rejoignez la communauté ' + BRAND + ' : échanges entre pairs, jobs et stages, veille et outils CRO. Et proposez le prochain talent à interviewer.',
    main: L => {
      const WA = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg';
      return `<section class="wa"><div class="wa-txt"><p class="wa-tag">${tr('Communauté WhatsApp', 'WhatsApp community')}</p><h1>${ENG ? `Join the <span>${esc(NAME)}</span> community` : `Rejoins la communauté <span>${esc(NAME)}</span>`}</h1><p>${tr('Le groupe où les Talents et les passionnés de CRO se retrouvent pour avancer ensemble.', 'The group where the Talents and CRO enthusiasts meet to grow together.')}</p>` +
        (ENG ? `<ul class="wa-perks"><li><strong>Discussions</strong><span>Tests, methods and lessons learned, shared between peers.</span></li><li><strong>Jobs &amp; internships</strong><span>Openings shared by the community.</span></li><li><strong>News &amp; tools</strong><span>Tips, articles and what's new right now.</span></li></ul>` : `<ul class="wa-perks"><li><strong>Échanges</strong><span>Tests, méthodes, retours d'expérience entre pairs.</span></li><li><strong>Jobs &amp; stages</strong><span>Offres partagées par la communauté.</span></li><li><strong>Veille &amp; outils</strong><span>Les bons plans, articles et nouveautés du moment.</span></li></ul>`) +
        (has(SITE.whatsapp) ? `<a class="wa-btn" href="${esc(SITE.whatsapp)}" target="_blank" rel="noopener" data-umami-event="whatsapp"><img src="${WA}" alt="" width="34" height="34">${tr('Rejoindre le groupe WhatsApp →', 'Join the WhatsApp group →')}</a>` : '') + '</div>' +
        `<div class="wa-art" aria-hidden="true"><span class="wa-bubble">${tr("Miam, on t'attend !", "Yum, we're waiting for you!")}</span><div class="wa-frame"><div class="box"><img src="${L.a('images/mascotte.png')}" alt="" width="349" height="246"></div><img src="${WA}" alt="" width="120" height="120"></div></div></section>` +
        `<section class="sec"><div class="sec-l"><p class="eyebrow pinkd">${tr('Proposer un talent', 'Suggest a talent')}</p><h2 class="sec-h">${tr('Qui sera la prochaine Next Gen ?', 'Who will be the next Next Gen?')}</h2></div><div class="sec-b"><p>${ENG ? `Mention them in a comment on LinkedIn so ${esc(first(AUTHOR.nom))} can reach out. The next Next Gen may already be in your network.` : `Mentionnez-la en commentaire sur LinkedIn pour que ${esc(first(AUTHOR.nom))} aille à sa rencontre. La prochaine Next Gen est peut-être déjà dans votre réseau.`}</p>${PROPOSER ? `<p><a class="btn" href="${esc(PROPOSER)}" target="_blank" rel="noopener" data-umami-event="proposer-talent">${tr('Proposer un talent →', 'Suggest a talent →')}</a></p>` : ''}</div></section>` +
        `<section class="sec"><div class="sec-l"><p class="eyebrow pinkd">${tr('Le mur des mots', 'The word wall')}</p><h2 class="sec-h">${tr("Le CRO sans […], ce n'est pas du CRO.", "CRO without […] isn't CRO.")}</h2></div><div class="sec-b"><p>${tr('Chaque interview se termine par un mot. Réunis, ils dessinent ce que la nouvelle génération met au cœur du métier : ', 'Every interview ends with one word. Together, they sketch what the new generation puts at the heart of the job: ')}${groups.slice(0, 6).map(p => `<a href="${L(p.path)}">${esc(p.motFin.toLowerCase())}</a>`).join(', ')}…</p><p><a class="link-arrow" href="${L('mur-de-mots/')}">${tr('Voir le mur des mots →', 'See the word wall →')}</a></p></div></section>`;
    }
  });

  /* ---------- PROPOSER UN TALENT ---------- */
  if (EMAIL) page({
    path: 'proposer-un-talent/', nav: 'proposer', priority: '0.5', crumbs: [[tr('Proposer un talent', 'Suggest a talent'), 'proposer-un-talent/']],
    title: tr('Proposer un talent CRO ou e-commerce — ', 'Suggest a CRO or e-commerce talent — ') + BRAND,
    desc: tr('Vous connaissez une future pépite du CRO ou de l\'e-commerce ? Envoyez son profil LinkedIn pour qu\'elle soit interviewée sur ', 'Know a rising star in CRO or e-commerce? Send their LinkedIn profile so they can be interviewed on ') + BRAND + '.',
    main: L => {
      const subj = tr('Proposition de talent NextGen', 'NextGen talent suggestion');
      return `<section class="page-head"><p class="eyebrow pinkd">${tr('Proposer un talent', 'Suggest a talent')}</p><h1 class="h1">${tr('Qui sera la prochaine Next Gen ?', 'Who will be the next Next Gen?')}</h1>` +
        `<p class="lead">${ENG ? `Know a rising star in CRO or e-commerce? Send their LinkedIn profile to ${esc(first(AUTHOR.nom))}, who will reach out to them.` : `Vous connaissez une future pépite du CRO ou de l'e-commerce ? Envoyez son profil LinkedIn à ${esc(first(AUTHOR.nom))}, qui ira à sa rencontre.`}</p></section>` +
        `<form class="suggest" action="mailto:${esc(EMAIL)}?subject=${encodeURIComponent(subj)}" method="post" enctype="text/plain" data-to="${esc(EMAIL)}" data-subject="${esc(subj)}">` +
        `<label for="s-li">${tr('Profil LinkedIn du talent', "The talent's LinkedIn profile")} <span class="req">*</span></label><input id="s-li" name="linkedin" type="url" required inputmode="url" placeholder="https://www.linkedin.com/in/…" pattern="https?://([a-zA-Z]+\\.)?linkedin\\.com/.+" title="${tr('Une adresse de profil LinkedIn, par ex. https://www.linkedin.com/in/prenom-nom/', 'A LinkedIn profile URL, e.g. https://www.linkedin.com/in/first-last/')}">` +
        `<label for="s-why">${tr('Pourquoi cette personne ?', 'Why this person?')} <span class="opt">${tr('facultatif', 'optional')}</span></label><textarea id="s-why" name="pourquoi" rows="4"></textarea>` +
        `<label for="s-name">${tr('Votre nom', 'Your name')} <span class="opt">${tr('facultatif', 'optional')}</span></label><input id="s-name" name="nom" type="text" autocomplete="name">` +
        `<button class="btn" type="submit" data-umami-event="proposer-talent-envoi">${tr('Envoyer la proposition →', 'Send the suggestion →')}</button>` +
        `<p class="note">${tr('Le bouton ouvre votre messagerie avec le message prérempli : il ne reste qu\'à l\'envoyer. Vous pouvez aussi écrire directement à', 'The button opens your email app with the message ready: just hit send. You can also write directly to')} <a href="mailto:${esc(EMAIL)}">${esc(EMAIL)}</a>.</p></form>` +
        `<script>(function(){var f=document.currentScript.previousElementSibling;f.addEventListener('submit',function(e){e.preventDefault();var g=function(n){return (f.elements[n].value||'').trim();};` +
        `var b=${JSON.stringify(tr('Profil LinkedIn : ', 'LinkedIn profile: '))}+g('linkedin')+(g('pourquoi')?'\\n\\n'+${JSON.stringify(tr('Pourquoi : ', 'Why: '))}+g('pourquoi'):'')+(g('nom')?'\\n\\n'+${JSON.stringify(tr('Proposé par : ', 'Suggested by: '))}+g('nom'):'');` +
        `location.href='mailto:'+f.getAttribute('data-to')+'?subject='+encodeURIComponent(f.getAttribute('data-subject'))+'&body='+encodeURIComponent(b);});})();</script>`;
    }
  });

  /* ---------- À PROPOS ---------- */
  const A = SITE.apropos || {};
  page({
    path: 'a-propos/', nav: 'apropos', crumbs: [[tr('À propos', 'About'), 'a-propos/']], image: authorPhoto || '', imageAlt: authorPhoto ? tr('Portrait de ', 'Portrait of ') + AUTHOR.nom : '',
    title: tr('À propos : pourquoi ' + BRAND + ' existe — ', 'About: why ' + BRAND + ' exists — ') + BRAND,
    desc: clamp(tr('Pourquoi ' + BRAND + ' existe, pourquoi maintenant, le format des interviews et qui est derrière le projet : ', 'Why ' + BRAND + ' exists, why now, the interview format and who is behind the project: ') + (AUTHOR.nom || '') + (AUTHOR.entreprise ? ' (' + AUTHOR.entreprise + ')' : '') + '.'),
    ld: [Object.assign({}, ROBIN, { description: AUTHOR.bio || '', knowsAbout: list(AUTHOR.tags), address: AUTHOR.lieu ? { '@type': 'PostalAddress', addressLocality: String(AUTHOR.lieu).split(',')[0].trim(), addressCountry: 'FR' } : undefined }),
      { '@type': 'AboutPage', name: tr('À propos', 'About'), url: U('a-propos/'), inLanguage: INLANG, isPartOf: { '@id': abs('#website') }, mainEntity: { '@id': ROBIN['@id'] } }],
    main: L => {
      const au = AUTHOR; let k = 0;
      const s = (lbl, body, cls) => { k++; return `<section class="sec${cls ? ' ' + cls : ''}"><div class="sec-l"><p class="eyebrow pinkd">${pad(k)}</p><h2 class="sec-h">${lbl}</h2></div><div class="sec-b">${body}</div></section>`; };
      let h = `<header class="ab-hero"><h1 class="eyebrow pinkd">${tr('À propos ' + esc(de(BRAND)), 'About ' + esc(BRAND))}</h1>${A.citation ? `<blockquote class="ab-q"><p>${A.citation}</p>${A.citationAuteur ? `<footer>— ${esc(A.citationAuteur)}</footer>` : ''}</blockquote>` : ''}</header>`;
      h += s(tr('Pourquoi NextGen existe', 'Why NextGen exists'), list(A.pourquoi).map((t, i) => `<p${i ? '' : ' class="big"'}>${t}</p>`).join(''));
      h += s(tr('Pourquoi maintenant', 'Why now'), list(A.maintenant).map(t => `<p>${t}</p>`).join('') + (A.maintenantCitation ? `<blockquote class="pull"><p>${esc(A.maintenantCitation)}</p><footer>— ${esc(A.maintenantAuteur || '')}</footer></blockquote>` : ''));
      h += s(tr('Le format', 'The format'), `<p>${tr('Chaque interview explore cinq angles. Simple et sans filtre.', 'Every interview explores five angles. Simple and unfiltered.')}</p><ol class="fmt">${list(A.format).map((f, i) => `<li><span>${pad(i + 1)}</span><h3>${esc(f.titre)}</h3><p>${esc(f.texte)}</p></li>`).join('')}</ol>`);
      h += s(tr('Qui est Next Gen ?', 'Who is Next Gen?'), list(A.quiEst).map(t => `<p>${t}</p>`).join('') + `<p><a class="link-arrow" href="${L('talents/')}">Meet the Next Gen →</a></p>`);
      if (has(au.nom)) {
        h += s(tr('Qui est derrière le projet ?', "Who's behind the project?"), `<div class="author" id="auteur">${avatar(au.nom, authorPhoto, 112, L)}<div class="author-in"><h3 class="nm">${esc(au.nom)}</h3>` +
          (au.titre ? `<p class="author-t">${esc(au.titre)}</p>` : '') + (au.bio ? `<p>${esc(au.bio)}</p>` : '') + (au.lieu ? `<p class="mono small">${esc(au.lieu)}</p>` : '') +
          (list(au.tags).length ? xps(list(au.tags)) : '') +
          (list(au.parcours).length ? `<ul class="timeline">${list(au.parcours).map(x => `<li><strong>${esc(x.titre)}</strong>${x.detail ? `<span>${esc(x.detail)}</span>` : ''}</li>`).join('')}</ul>` : '') +
          (has(LINKS.linkedin) ? `<a class="btn-li" href="${esc(LINKS.linkedin)}" target="_blank" rel="noopener">${tr('Suivre ' + esc(first(au.nom)) + ' sur LinkedIn', 'Follow ' + esc(first(au.nom)) + ' on LinkedIn')} ↗</a>` : '') + '</div></div>');
      }
      h += joinBlock(L, tr('Proposer quelqu\'un', 'Suggest someone'));
      return h;
    }
  });

  /* ---------- INSIGHTS ---------- */
  if (INSIGHTS.length) {
    page({
      path: 'insights/', nav: 'insights', priority: '0.8', crumbs: [['Insights', 'insights/']], title: tr('Insights CRO & e-commerce de la Next Gen — ', 'Next Gen CRO & e-commerce insights — ') + BRAND,
      desc: clamp(tr('Ce que la nouvelle génération du CRO pense, utilise et apprend : ', 'What the new generation of CRO thinks, uses and learns: ') + INSIGHTS.slice(0, 3).map(x => x.titre).join(' · ')),
      main: L => `<section class="page-head"><p class="eyebrow pinkd">${plural(INSIGHTS.length, 'insight', 'insights')}</p><h1 class="h1">Insights</h1><p class="lead">${tr('Des enseignements transversaux, tirés des interviews.', 'Cross-cutting lessons drawn from the interviews.')}</p></section>` +
        `<ul class="ins-list">${INSIGHTS.map(x => `<li><a href="${L(x.path)}"><span class="mono small">${esc(fmtDate(x.date))}</span><h2>${esc(x.titre)}</h2>${x.chapo ? `<p>${esc(x.chapo)}</p>` : ''}</a></li>`).join('')}</ul>`
    });
    INSIGHTS.forEach(x => {
      const ppl = Array.from(new Set([].concat(...x.sections.map(s => s.people))));
      page({
        path: x.path, nav: 'insights', ogType: 'article', published: x.date, lastmod: x.date || LAST, crumbs: [['Insights', 'insights/'], [x.titre, x.path]], title: x.titre + ' — ' + BRAND, desc: clamp(x.chapo || x.titre),
        ld: [{ '@type': 'Article', headline: clamp(x.titre, 110), description: x.chapo, datePublished: x.date || undefined, author: ROBIN, publisher: { '@id': ORG['@id'] }, url: U(x.path), inLanguage: INLANG, mentions: ppl.map(p => ({ '@type': 'Person', name: p.nom, url: U(p.path) })) }, ORG],
        main: L => `<nav class="crumbs" aria-label="${tr("Fil d'Ariane", 'Breadcrumb')}"><a href="${L('insights/')}">← Insights</a></nav><article><header class="page-head"><p class="eyebrow pinkd">Insight${x.date ? ' · <time datetime="' + x.date + '">' + esc(fmtDate(x.date)) + '</time>' : ''}</p><h1 class="h1">${esc(x.titre)}</h1>${x.chapo ? `<p class="lead">${esc(x.chapo)}</p>` : ''}</header>` +
          x.sections.map((s, i) => `<section class="sec"><div class="sec-l"><p class="eyebrow pinkd">${pad(i + 1)}</p><h2 class="sec-h">${esc(s.titre)}</h2></div><div class="sec-b">${s.texte.map(t => `<p>${esc(t)}</p>`).join('')}${s.people.length ? `<p class="mono small">${tr('Avec', 'With')} ${s.people.map(p => `<a href="${L(p.path)}">${esc(p.nom)}</a>`).join(', ')}</p>` : ''}</div></section>`).join('') + '</article>' +
          (ppl.length ? `<section class="related"><h2 class="h2">${tr('Les Talents cités', 'Talents mentioned')}</h2><div class="pgrid three">${ppl.slice(0, 6).map(p => pcard(p, L, 'h3')).join('')}</div></section>` : '')
      });
    });
  }

  /* ---------- 404, redirections, sitemap, robots, llms ---------- */
  page({
    path: '404/', file: '404.html', absolute: true, noindex: true, title: tr('Page introuvable — ', 'Page not found — ') + BRAND, desc: tr('Cette page n\'existe pas.', 'This page does not exist.'),
    main: L => `<section class="page-head center">${mascot(L, 240)}<p class="eyebrow pinkd">${tr('Erreur 404', 'Error 404')}</p><h1 class="h1">${tr('Page introuvable', 'Page not found')}</h1><p class="lead">${tr("Le croco a dû la manger. Revenez à l'accueil ou partez à la rencontre des Talents.", 'The croc must have eaten it. Head back home or go meet the Talents.')}</p><div class="ctas"><a class="btn" href="${L('')}">${tr('Accueil', 'Home')}</a><a class="btn white" href="${L('talents/')}">Meet the Next Gen</a></div></section>`
  });
  const idx = LOCAL ? 'index.html' : '';
  if (!ENG) {
  FILES['interview.html'] = `<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="robots" content="noindex">\n<title>Redirection… — ${esc(BRAND)}</title>\n<script>var id=new URLSearchParams(location.search).get("id");location.replace(id?"talents/"+encodeURIComponent(id)+"/${idx}":"talents/${idx}");</script>\n</head>\n<body>\n<p><a href="talents/${idx}">Voir tous les Talents</a></p>\n</body>\n</html>\n`;
  FILES['_redirects'] = ['/people /talents/ 301', '/people/ /talents/ 301', '/people/* /talents/:splat 301', '/interviews /talents/ 301', '/interviews/ /talents/ 301', '/interviews/* /talents/:splat 301', '/profils/ /talents/ 301', '/profils /talents/ 301', '/mentors/ /inspirations/ 301', '/mentors /inspirations/ 301', '/outils /inspirations/ 301', '/outils/ /inspirations/ 301', '/marques-outils/ /inspirations/ 301', '/marques-outils /inspirations/ 301', '/interviews.html /talents/ 301', '/profils.html /talents/ 301', '/mentors.html /inspirations/ 301', '/marques-outils.html /inspirations/ 301', '/mur-de-mots.html /mur-de-mots/ 301', '/a-propos.html /a-propos/ 301'].concat(COMMU ? [] : ['/communaute/ / 302', '/communaute / 302', '/en/community/ /en/ 302', '/en/community /en/ 302']).join('\n') + '\n';
  FILES['sitemap.xml'] = sitemapXml(SITEMAP); // remplacé par le sitemap bilingue complet dans l'exécution Node
  const BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended', 'CCBot'];
  FILES['robots.txt'] = `# ${BRAND} — tous les robots sont les bienvenus, y compris ceux des IA.\n\nUser-agent: *\nAllow: /\n\n` + BOTS.map(b => `User-agent: ${b}\nAllow: /\n`).join('\n') + `\nSitemap: ${abs('sitemap.xml')}\n`;
  }
  FILES[ENG ? 'en/llms.txt' : 'llms.txt'] = `# ${BRAND}\n\n> ${strip(SITE.description || '')} ${tr('Série créée par', 'Series created by')} ${AUTHOR.nom || ''}${AUTHOR.entreprise ? ' (' + AUTHOR.entreprise + ')' : ''}. ${ENG ? plural(N, 'profile', 'profiles') + ' published, in English (translated from the original French interviews).' : plural(N, 'profil publié', 'profils publiés') + ', en français.'}\n\n` +
    (BILINGUE ? (ENG ? `French original: ${abs('llms.txt')}\n\n` : `English version: ${abs('en/llms.txt')}\n\n`) : '') +
    tr('Chaque profil (« Talent ») documente une personne : rôle, entreprise, expertises, parcours, déclic CRO, mentors, toolbox (outil + usage réel), conseil, hot take et mot de la fin (« Le CRO sans … ce n\'est pas du CRO »). Les citations sont attribuées et les synthèses rédigées par NextGen sont signalées. Toutes les pages sont en HTML statique.\n\n', 'Each profile (“Talent”) documents one person: role, company, expertise, career path, how they got into CRO, mentors, toolbox (tool + actual use), advice, hot take and final word (“CRO without … isn\'t CRO”). Quotes are attributed and summaries written by NextGen are flagged. All pages are static HTML.\n\n') +
    '## Talents\n\n' + ALL.map(p => `- [${p.nom} — ${p.poste}, ${p.entreprise}](${U(p.path)})${p.date ? ' (' + p.date + ')' : ''}${p.expertises.length ? ' · ' + p.expertises.join(', ') : ''}${p.citation ? tr(' : « ', ': “') + p.citation + CQ : ''}${p.exemple ? tr(' [profil d\'exemple]', ' [sample profile]') : ''}`).join('\n') + '\n\n' +
    tr('## Pages principales\n\n', '## Main pages\n\n') + [[tr('Accueil', 'Home'), ''], [tr('Meet the Next Gen (tous les Talents)', 'Meet the Next Gen (all Talents)'), 'talents/'], [tr('Inspirations : experts, outils et ressources cités', 'Inspirations: experts, tools and resources cited'), 'inspirations/'], [tr('Mur des mots', 'Word wall'), 'mur-de-mots/'], [tr('À propos', 'About'), 'a-propos/']].concat(COMMU ? [[tr('Communauté', 'Community'), 'communaute/']] : [], EMAIL ? [[tr('Proposer un talent', 'Suggest a talent'), 'proposer-un-talent/']] : []).concat(INSIGHTS.length ? [['Insights', 'insights/']] : []).map(x => `- [${x[0]}](${U(x[1])})`).join('\n') + '\n\n' +
    (TOOLS.length ? tr('## Outils les plus cités\n\n', '## Most cited tools\n\n') + TOOLS.slice(0, 10).map(t => `- ${t.page ? `[${t.name}](${U(t.path)})` : t.name}${tr(' : ', ': ')}${synth(t)}`).join('\n') + '\n' : '') +
    (MENTORS.length ? tr('\n## People to Follow (cités par les talents)\n\n', '\n## People to Follow (cited by the talents)\n\n') + MENTORS.map(m => `- ${m.nom}${m.expertise ? ' (' + m.expertise + ')' : ''}${tr(' : ', ': ')}${m.by.map(x => REL[x.relation].by.toLowerCase() + ' ' + x.p.nom).join(', ')}`).join('\n') + '\n' : '') +
    (RESS.length ? '\n## Read · Watch · Listen\n\n' + RESS.map(r => `- ${r.titre} [${TYPES[r.type]}]${r.auteur ? ', ' + r.auteur : ''}${tr(' : ', ': ')}${r.by.map(x => REL[x.relation].by.toLowerCase() + ' ' + x.p.nom).join(', ')}`).join('\n') + '\n' : '') +
    (INSIGHTS.length ? '\n## Insights\n\n' + INSIGHTS.map(x => `- [${x.titre}](${U(x.path)})`).join('\n') + '\n' : '');

  return { files: FILES, sitemap: SITEMAP, warnings, count: { mentors: MENTORS.length, ressources: RESS.length, people: N, outils: TOOLS.length, pagesOutils: TOOLS.filter(t => t.page).length, insights: INSIGHTS.length } };
}

if (typeof module !== 'undefined') module.exports = { buildSite, sitemapXml, deepMerge };

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
  const SITE = load('data/site.js', 'SITE'), INTERVIEWS = load('data/interviews.js', 'INTERVIEWS'), EN = load('data/en.js', 'EN', true);
  const ver = require('crypto').createHash('md5').update(['assets/css/style.css', 'assets/js/app.js'].map(f => fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f)) : '').join('')).digest('hex').slice(0, 8);
  const common = { ver, insights: load('data/insights.js', 'INSIGHTS', true), local: args.indexOf('--local') >= 0, exists: p => fs.existsSync(path.join(ROOT, p)) };
  const res = buildSite(SITE, INTERVIEWS, Object.assign({}, common, { lang: 'fr', bilingue: !!EN }));
  if (EN) {
    // Version anglaise : seuls les avertissements propres à la traduction sont affichés (les autres l'ont déjà été en français)
    const en = buildSite(SITE, INTERVIEWS, Object.assign({}, common, { lang: 'en', en: EN, warn: m => { if (/Version anglaise/.test(m)) console.warn(m); } }));
    Object.assign(res.files, en.files);
    res.files['sitemap.xml'] = sitemapXml(res.sitemap.concat(en.sitemap));
    res.warnings = res.warnings.concat(en.warnings.filter(m => /Version anglaise/.test(m)));
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  Object.keys(res.files).forEach(f => { const p = path.join(OUT, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, res.files[f]); });
  ['assets', 'images'].forEach(d => { if (fs.existsSync(path.join(ROOT, d))) fs.cpSync(path.join(ROOT, d), path.join(OUT, d), { recursive: true }); });
  // favicon.ico à la racine : c'est là que Google et les navigateurs le cherchent par défaut
  if (fs.existsSync(path.join(ROOT, 'images', 'favicon.ico'))) fs.copyFileSync(path.join(ROOT, 'images', 'favicon.ico'), path.join(OUT, 'favicon.ico'));
  console.log(`✓ ${Object.keys(res.files).length} fichiers générés dans dist/${EN ? ' (FR + EN)' : ''} · ${res.count.people} Talents, ${res.count.outils} outils (${res.count.pagesOutils} pages), ${res.count.insights} insights` + (res.warnings.length ? ` · ⚠ ${res.warnings.length} avertissement(s) ci-dessus` : ''));
  if (args.indexOf('--strict') >= 0 && res.warnings.length) process.exit(1);
}
