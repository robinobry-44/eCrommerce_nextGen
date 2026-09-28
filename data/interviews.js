/* ==========================================================================
   TALENTS — le seul fichier à modifier pour ajouter un profil.
   Un objet = une personne (et son interview). Tout le site se met à jour
   automatiquement : accueil, Talents à la une, page Talents, recherche, filtres,
   fiche, Talents similaires, toolbox de la Promo, mur des mots, sitemap, llms.txt.

   ► POUR AJOUTER UN PROFIL
     1. Copiez le MODÈLE ci-dessous (de { à },) et collez-le dans la liste.
     2. Remplissez les champs. "" ou [] = champ vide : rien ne s'affiche.
     3. Déposez le portrait dans images/interviews/[slug].webp (ou .jpg).
     4. Lancez  node build.js  (ou poussez sur GitHub).

   ► RÈGLE ÉDITORIALE : ne rien inventer. Chaque citation, outil, usage,
     méthode ou opinion doit venir de l'interview. Les synthèses rédigées
     par NextGen sont marquées  synthese: true  et signalées comme telles.

   ► MODÈLE (à copier)

  {
    slug: "prenom-nom",              // OBLIGATOIRE · unique, minuscules, tirets. URL : /talents/prenom-nom/
    nom: "Prénom Nom",               // OBLIGATOIRE
    poste: "CRO Analyst",            // OBLIGATOIRE
    entreprise: "Entreprise",        // OBLIGATOIRE
    typeProfil: "annonceur",         // "annonceur" ou "agence"
    secteur: "Retail sport",         // facultatif
    date: "2026-10-15",              // OBLIGATOIRE · date de publication AAAA-MM-JJ
    dateMiseAJour: "",               // facultatif · si l'interview est corrigée
    promo: "2026",                   // facultatif · sinon : année de publication
    numero: 0,                       // facultatif · NEXTGEN #XX. Sinon : ordre chronologique
    featured: false,                 // true = mis en avant en tête de l'accueil
    photo: "images/interviews/prenom-nom.webp", // portrait principal (4:5 conseillé). Sinon : initiales
    photos: [],                      // portraits secondaires (le 1er apparaît au survol des cards)
    lienLinkedin: "https://www.linkedin.com/in/...",
    exemple: false,                  // true = badge « Profil d'exemple »

    expertises: ["CRO", "Data"],     // 1 à 4. Servent aux filtres (voir SITE.expertises)
    citation: "La phrase la plus forte, mot pour mot.", // citation principale (hero, Featured, citation XXL)
    accroche: "Autre phrase réelle de l'interview.",    // facultatif · description / survol
    intro: "100 à 150 mots : qui est la personne, son parcours, ce qui la distingue, ce qu'on va découvrir.",

    careerPath: [                    // facultatif · timeline visuelle
      { etape: "École", type: "formation" },
      { etape: "Entreprise A", type: "experience" },
      { etape: "Entreprise actuelle", type: "experience", detail: "Poste" }
    ],

    // Réponses, regroupées par section. Sections reconnues :
    //   "parcours" → question = intitulé court, reponse = texte ou ["…", "…"]
    //   "declic"   → reponse = texte
    //   "mindset"  → titre = la phrase fétiche, auteur = qui l'a dite, reponse = explication
    //   "conseil"  → titre = le conseil en une phrase, reponse = développement
    //   "hottake"  → question, oui / ouiContexte, non / nonContexte
    // Tout autre nom de section s'affiche comme un bloc question / réponse.
    // titreSection (facultatif) = titre H2 explicite, ex. "Comment Léa est arrivée dans le CRO".
    reponses: [
      { section: "declic", titreSection: "", question: "Comment es-tu arrivé(e) au CRO ?", reponse: "…" }
    ],

    marques: ["Entreprise A"],       // entreprises citées (l'entreprise actuelle est comptée d'office)
    outils: [{ nom: "AB Tasty", usage: "Ce que la personne en fait, selon l'interview" }], // → Inspirations « Toolbox » (relation : utilise)
    // Personnes citées → page Inspirations « People to Follow ».
    // relation : "inspired_by" (défaut) · "follows" · "recommends" · "mentor" · "mentions"
    // Respectez la nuance de l'interview : ne mettez "mentor" que si la personne le dit.
    mentors: [{ nom: "Prénom Nom", relation: "inspired_by", expertise: "CRO · Experimentation", organisation: "", citation: "Pourquoi cette personne l'inspire.", lienLinkedin: "", photo: "" }],
    // Contenus cités → page Inspirations « Read · Watch · Listen ».
    // type : "book" · "podcast" · "newsletter" · "video" · "website" · "media"
    // relation : "recommends" · "follows" · "mentions" (défaut). Ne jamais écrire "recommends" si la personne cite simplement.
    ressources: [{ titre: "Titre", type: "book", auteur: "", lien: "", image: "", raison: "Ce qu'en dit la personne.", relation: "mentions" }],
    sujets: ["IA"],                  // « Sur son radar » : sujets réellement abordés
    methode: null,                   // { titre: "…", synthese: true, etapes: [{ titre: "…", texte: "…" }] }
    aRetenir: null,                  // { synthese: true, points: [{ titre: "…", texte: "…" }] }
    motsCles: ["Data"]               // « Le CRO sans … ». Le 1er = le mot de la fin
  },

   ========================================================================== */

window.INTERVIEWS = [
  {
    slug: "antoine-vera",
    nom: "Antoine Vera",
    poste: "E-Commerce & CRO Project Manager",
    entreprise: "Sport 2000",
    typeProfil: "annonceur",
    secteur: "Retail sport",
    date: "2026-09-18",
    promo: "2026",
    numero: 1,
    featured: true,
    photo: "images/interviews/antoine-vera.jpg",
    photos: [],
    lienLinkedin: "",
    expertises: ["CRO", "E-commerce", "Experimentation", "Data"],
    citation: "Le CRO est un métier de couture plus qu'un métier d'outil.",
    accroche: "Un simple test A/B ou la suppression d'une friction peut générer plus d'impact qu'une campagne marketing.",
    intro: "Antoine Vera est E-Commerce & CRO Project Manager chez Sport 2000. Passé par STAPS puis KEDGE, il a construit son parcours dans le retail sportif, de GO Sport à Fitness Park, Intersport puis Sport 2000. C'est en voyant à quel point le parcours client digital influençait la performance, en ligne comme en magasin, qu'il s'est orienté vers le CRO. Pour lui, le métier est transversal : il faut savoir dialoguer avec les développeurs, les analystes et les équipes contenu, et l'outil ne fait pas la méthode. Dans cette interview, il revient sur son déclic, les outils qu'il utilise pour tester et analyser, les voix qui l'inspirent, et sa position sur l'IA et le GEO.",
    careerPath: [
      { etape: "STAPS", type: "formation" },
      { etape: "KEDGE", type: "formation" },
      { etape: "GO Sport", type: "experience" },
      { etape: "Fitness Park", type: "experience" },
      { etape: "Intersport", type: "experience" },
      { etape: "Sport 2000", type: "experience", detail: "E-Commerce & CRO Project Manager" }
    ],
    reponses: [
      { section: "parcours", question: "Formation", reponse: ["STAPS", "KEDGE"] },
      { section: "parcours", question: "Expériences", reponse: ["GO Sport", "Fitness Park", "Intersport", "E-Commerce & CRO Project Manager · Sport 2000"] },
      { section: "declic", titreSection: "Comment Antoine est arrivé dans le CRO", question: "Comment es-tu arrivé au CRO ?", reponse: "En voyant à quel point le parcours client digital influençait directement la performance en magasin comme en ligne, j'ai compris que le vrai levier de croissance ne se jouait plus uniquement sur le produit ou le prix, mais sur l'expérience et l'optimisation continue du tunnel de conversion. La prise de conscience qu'un simple test A/B ou la suppression d'une friction pouvait générer plus d'impact qu'une campagne marketing m'a naturellement orienté vers le CRO et l'e-commerce." },
      { section: "mindset", question: "Ta phrase fétiche ?", titre: "Un grand pouvoir implique de grandes responsabilités", auteur: "Ben Parker", reponse: "Quand on a accès à la donnée et au pouvoir de modifier l'expérience de milliers d'utilisateurs, on a la responsabilité de le faire avec rigueur." },
      { section: "conseil", titreSection: "Pourquoi Antoine considère le CRO comme un métier de couture", question: "Ton conseil à un junior ?", titre: "Le CRO est un métier de couture plus qu'un métier d'outil.", reponse: "Ne pas se focaliser uniquement sur la maîtrise d'un outil et ne pas avoir peur des sujets techniques annexes car le CRO touche à tout, et plus on est capable de dialoguer avec les devs, les analystes et les équipes contenu, plus on devient utile." },
      { section: "hottake", titreSection: "Comment Antoine voit l'impact de l'IA sur le e-commerce", question: "Franchement, on n'en fait pas trop avec l'IA ?", ouiContexte: "sur la communication autour de l'IA", oui: "Clairement, il y a un effet de mode où chaque livrable doit désormais porter l'étiquette « AI » pour paraître légitime.", nonContexte: "sur l'usage concret", non: "Des sujets comme le GEO ne sont pas du buzz, ce sont des changements structurels dans la façon dont les utilisateurs découvrent et choisissent un produit." }
    ],
    marques: ["Sport 2000", "GO Sport", "Fitness Park", "Intersport"],
    outils: [
      { nom: "AB Tasty", usage: "Conception, déploiement et pilotage des tests A/B" },
      { nom: "Welyft A/B Tests Identifier", usage: "Veille et inspiration : repérage des tests chez d'autres sites" },
      { nom: "Microsoft Clarity", usage: "Heatmaps et session replays pour valider les frictions" },
      { nom: "Piano Analytics", usage: "Analyses data business plus poussées" },
      { nom: "IBM Cognos", usage: "Analyses data business plus poussées" }
    ],
    mentors: [
      { nom: "Sébastien Tortu", expertise: "CRO · Experimentation", organisation: "Boost Conversion", citation: "Une référence pour la méthodologie CRO et l'A/B testing en France, avec des contenus très orientés pratique et cas concrets." },
      { nom: "Florent Kiecken", expertise: "E-commerce · Growth", organisation: "La Cargaison", citation: "Pour une vision plus large du e-commerce et de la croissance, complémentaire à l'approche pure CRO." }
    ],
    sujets: ["IA", "GEO"],
    aRetenir: {
      synthese: true,
      points: [
        { titre: "Le CRO est transversal.", texte: "Data, UX, tech et business doivent travailler ensemble." },
        { titre: "Une intuition n'est pas une preuve.", texte: "La mesure permet de confronter les convictions aux comportements réels." },
        { titre: "Les outils ne font pas la méthode.", texte: "Ils servent une démarche d'observation, d'expérimentation et d'apprentissage." }
      ]
    },
    motsCles: ["Data"]
  }
];
