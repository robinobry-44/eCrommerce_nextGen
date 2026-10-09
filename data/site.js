/* ==========================================================================
   RÉGLAGES GLOBAUX DU SITE
   Les textes peuvent contenir des balises simples : <strong>, <em>, <br>.
   ========================================================================== */

window.SITE = {
  nom: "#eCROmmerce NextGen",
  nomCourt: "eCROmmerce NextGen", // utilisé dans les <title> et les données structurées
  description: "eCROmmerce NextGen met en lumière la nouvelle génération du CRO et du e-commerce : parcours, méthodes, outils et convictions de jeunes talents.",

  // Accueil
  baseline: "La nouvelle génération du CRO & e-commerce.",
  sousTitre: "Découvrez les parcours, méthodes et convictions des talents qui font bouger le digital commerce.",
  projetCourt: "Des conversations sans filtre sur leur parcours, leurs réussites, leurs échecs, leurs inspirations et leur vision du e-commerce de demain.",
  promoActuelle: "2026",

  // Adresse publique du site (sans / final) : canoniques, sitemap, aperçus LinkedIn, JSON-LD.
  url: "https://ecrommerce-nextgen.fr",

  // Lien d'invitation du groupe WhatsApp
  whatsapp: "https://chat.whatsapp.com/",

  liens: {
    linkedin: "https://www.linkedin.com/in/robinaubry",       // profil de l'auteur
    proposerTalent: "https://www.linkedin.com/in/robinaubry"  // bouton « Proposer un talent »
  },

  // Afficher les profils marqués  exemple: true  (mettre false avant la mise en production)
  afficherExemples: false,

  // Filtres de la page Talents (seules les expertises réellement présentes s'affichent)
  expertises: ["CRO", "E-commerce", "UX", "Product", "Data", "Experimentation"],

  // Une page /outils/[slug]/ n'est créée que si l'outil est cité par au moins N talents
  seuilPageOutil: 2,

  footer: {
    gauche: "#eCROmmerce NextGen — une série de Robin Aubry, CRO · UX · E-commerce @ Air360",
    droite: "#Stay Tuned · prochain portrait à venir…"
  },

  // Page À propos
  apropos: {
    citation: "« Moi, tu ne me parles pas d'<span class=\"pink\">âge</span>. »",
    citationAuteur: "K. Mbappé",
    pourquoi: [
      "<strong>Parce que dans le CRO comme dans l'e-commerce, l'important, ce n'est pas l'âge. C'est ce qu'on a à raconter, à apprendre et à apporter.</strong>",
      "C'est l'état d'esprit de ce format. Avec une ambition simple : mettre en lumière les jeunes pousses du CRO et de l'e-commerce.",
      "Une idée qui a germé depuis longtemps et qui voit enfin le jour grâce à une génération de P'tits CRO(co) prête à se jeter à l'eau pour partager leur expérience, leur vision et leurs partis pris autour de l'e-commerce, du digital, de la data et de l'IA."
    ],
    maintenant: [
      "Ils sont jeunes, en pleine <strong>CRO</strong>issance. Ils arrivent dans un e-commerce en pleine transformation.",
      "À l'heure où l'IA redéfinit nos façons de travailler, nos outils et nos process, ils sont peut-être les mieux placés pour repenser les pratiques et imaginer celles de demain.",
      "Il faudra donc compter avec eux. Et c'est précisément pour cela que j'ai envie de leur donner la parole dès aujourd'hui."
    ],
    maintenantCitation: "« La valeur n'attend point le nombre des années. »",
    maintenantAuteur: "P. Corneille, Le Cid",
    format: [
      { titre: "Leur parcours", texte: "Formation, premières expériences, bifurcations." },
      { titre: "Premiers pas en CRO / e-com", texte: "Ce qui les a fait basculer dans le métier." },
      { titre: "Succès… et échecs", texte: "Les tests gagnants, et ceux qui ont le plus appris." },
      { titre: "Inspirations & toolbox", texte: "Leurs mentors, leurs outils du quotidien." },
      { titre: "L'e-commerce de demain", texte: "Leur vision, leurs partis pris, leur hot take." }
    ],
    // À VALIDER : critères de sélection
    quiEst: [
      "Des talents en début de carrière dans le CRO et l'e-commerce, côté annonceur comme côté agence.",
      "Le critère n'est pas l'âge : c'est ce qu'ils ont à raconter, à apprendre et à apporter.",
      "Ils sont proposés par la communauté, en commentaire sur LinkedIn, puis interviewés sur les cinq angles du format."
    ],
    auteur: {
      nom: "Robin Aubry",
      titre: "CRO · UX · E-commerce @ Air360",
      poste: "EMEA Partnerships Manager",
      entreprise: "Air360",
      bio: "Il aide les marques à optimiser leur expérience digitale et à augmenter leurs conversions. Auteur de #eCROmmerce NextGen.",
      lieu: "Nantes, France",
      photo: "", // ex. "images/robin-aubry.jpg" une fois la photo déposée (sinon : initiales)
      tags: ["CRO", "UX", "E-commerce", "Partenariats"],
      parcours: [
        { titre: "Air360 · UX Analytics for CRO", detail: "EMEA Partnerships Manager" },
        { titre: "Partnershift · Time for the Planet · Elevate · Santéclair", detail: "Expériences passées" },
        { titre: "Rouen Business School", detail: "Master en Management" }
      ]
    }
  },

  // Témoignages : ne s'affichent qu'à partir de 3 vrais témoignages. Jamais de faux social proof.
  // Format : { citation: "…", nom: "Prénom Nom", role: "Poste @ Entreprise" }
  temoignages: [],

  // ALIAS : regroupe les variantes d'un même nom (casse ignorée). Variante → nom officiel.
  alias: {
    "ab tasty": "AB Tasty",
    "abtasty": "AB Tasty",
    "GA4": "Google Analytics",
    "google analytics 4": "Google Analytics",
    "clarity": "Microsoft Clarity",
    "showroomprive": "Showroomprivé",
    "showroomprive.com": "Showroomprivé",
    "showroomprivé.com": "Showroomprivé",
    "content square": "Contentsquare",
    "looker": "Looker Studio",
    "ecommerce": "E-commerce",
    "e-com": "E-commerce",
    "experimentation": "Experimentation",
    "a/b testing": "Experimentation"
  },

  // Catégorie affichée sous chaque outil dans les toolbox (nom officiel → catégorie)
  categoriesOutils: {
    "AB Tasty": "Experimentation",
    "Kameleoon": "Experimentation",
    "Microsoft Clarity": "Experience Analytics",
    "Contentsquare": "Experience Analytics",
    "Hotjar": "Experience Analytics",
    "Piano Analytics": "Web Analytics",
    "Google Analytics": "Web Analytics",
    "Amplitude": "Product Analytics",
    "IBM Cognos": "Business Intelligence",
    "Looker Studio": "Reporting",
    "Figma": "Design",
    "Maze": "User Research",
    "Shopify": "Plateforme e-commerce",
    "Welyft A/B Tests Identifier": "Veille A/B tests",
    "Confluence": "Documentation",
    "Jira": "Gestion de projet",
    "Air360": "Experience Analytics"
  },

  // LOGOS : nom officiel (outil OU entreprise) → nom de domaine (logo récupéré automatiquement). Sinon : initiales.
  logos: {
    "Sport 2000": "sport2000.fr",
    "AB Tasty": "abtasty.com",
    "Microsoft Clarity": "clarity.microsoft.com",
    "Piano Analytics": "piano.io",
    "IBM Cognos": "ibm.com",
    "Welyft A/B Tests Identifier": "welyft.com",
    "Contentsquare": "contentsquare.com",
    "Kameleoon": "kameleoon.com",
    "Google Analytics": "analytics.google.com",
    "Hotjar": "hotjar.com",
    "Looker Studio": "lookerstudio.google.com",
    "Figma": "figma.com",
    "Maze": "maze.co",
    "Shopify": "shopify.com",
    "Amplitude": "amplitude.com",
    "Showroomprivé": "showroomprive.com",
    "Confluence": "atlassian.com",
    "Jira": "atlassian.com",
    "CEWE": "cewe.fr",
    "Croix-Rouge française": "croix-rouge.fr",
    "Orange": "orange.fr",
    "Air360": "air360.io"
  }
};
