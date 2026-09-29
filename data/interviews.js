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
  },
  {
    slug: "caroline-hoang",
    nom: "Caroline Hoang",
    poste: "Chargée de CRO",
    entreprise: "Showroomprivé",
    typeProfil: "annonceur",
    secteur: "E-commerce",
    date: "2026-09-29",
    promo: "2026",
    numero: 2,
    featured: true,
    photo: "images/interviews/caroline-hoang.jpg",
    photos: [],
    lienLinkedin: "",
    expertises: ["CRO", "Experimentation", "Data"],
    citation: "Le CRO, c'est l'art de transformer la curiosité en conviction.",
    accroche: "C'est l'intuition qui génère les meilleures hypothèses, la data te dit si tu avais raison.",
    intro: "Caroline Hoang est chargée de CRO en alternance chez Showroomprivé. Son parcours s'est construit par étapes : le commerce d'abord avec un BTS Commerce International, puis le digital avec un Bachelor Design & Digital Marketing, et enfin la data avec un Master Digital Marketing & Data Analytics à l'EMLV. En deux ans, elle a touché à toutes les étapes du CRO, de l'idéation à l'analyse des résultats en passant par l'implémentation technique des tests A/B. Deux mois après son arrivée, un test de social proof sur l'univers Voyages a fait bondir les transactions par session sur web mobile. Dans cette interview, elle revient sur ce premier succès, sur l'équilibre entre intuition et data, sur la personnalisation émotionnelle et sur sa conviction : le CRO est un investissement stratégique, pas une collection de quick wins.",
    careerPath: [
      { etape: "BTS Commerce International", type: "formation" },
      { etape: "Bachelor Design & Digital Marketing", type: "formation" },
      { etape: "EMLV", type: "formation", detail: "Master Digital Marketing & Data Analytics" },
      { etape: "Showroomprivé", type: "experience", detail: "Chargée de CRO en alternance" }
    ],
    reponses: [
      { section: "parcours", question: "Formation", reponse: ["BTS Commerce International", "Bachelor Design & Digital Marketing", "Master Digital Marketing & Data Analytics · EMLV"] },
      { section: "parcours", question: "Expérience", reponse: ["Chargée de CRO en alternance · Showroomprivé (2 ans)"] },
      { section: "declic", titreSection: "Comment Caroline est arrivée dans le CRO", question: "Quel a été ton parcours ?", reponse: "Mon chemin est assez atypique : j'ai démarré avec un BTS Commerce International, puis j'ai enchaîné avec un Bachelor en Design & Digital Marketing avant d'intégrer l'EMLV pour un Master en Digital Marketing & Data Analytics. À chaque étape, j'ai cherché à aller un peu plus loin : d'abord comprendre le commerce, puis le digital, puis la data." },
      { section: "Sa plus belle réussite", titreSection: "Le test de social proof qui a lancé Caroline", question: "Ta plus belle réussite ?", reponse: "Deux mois après mon arrivée chez Showroomprivé, j'ai travaillé sur un test de social proof sur l'univers Voyages. L'idée : afficher en temps réel le nombre de personnes consultant une offre, « X personnes consultent actuellement cette offre ». Une des variantes a généré une forte hausse des transactions par session sur web mobile. Ce que je retiens surtout, c'est que l'idée n'était pas révolutionnaire : c'est la rigueur de l'hypothèse, du ciblage et de l'analyse qui a tout fait." },
      { section: "Sa plus grande découverte", titreSection: "Pourquoi Caroline mise sur l'intuition autant que sur la data", question: "Ta plus grande découverte ?", reponse: "Beaucoup pensent que le CRO, c'est juste faire parler les chiffres. En réalité, c'est l'intuition qui génère les meilleures hypothèses, et la data te dit si tu avais raison. Les deux sont donc indispensables !" },
      { section: "Son plus gros challenge", titreSection: "Le défi des insights actionnables", question: "Le plus gros challenge du CRO ?", reponse: "Générer des insights vraiment actionnables. On a souvent beaucoup de données, mais passer de la donnée brute à une hypothèse pertinente demande du recul, de l'empathie et une vraie culture produit." },
      { section: "La tendance qui l'enthousiasme", titreSection: "Pourquoi Caroline s'intéresse à la personnalisation émotionnelle", question: "La tendance qui t'enthousiasme le plus ?", reponse: "La personnalisation émotionnelle : l'idée d'adapter l'expérience selon le profil émotionnel de l'utilisateur. On y touche déjà chez Showroomprivé avec l'Emotion AI (EAI). C'est fascinant de voir que deux personnes sur la même page peuvent avoir des besoins psychologiques très différents." },
      { section: "hottake", question: "Le CRO, c'est juste des tests A/B ?", ouiContexte: "sur la méthode", oui: "Le test A/B, c'est le moyen de transport.", nonContexte: "sur le fond", non: "Ce n'est pas la destination : derrière chaque test, il y a une vraie question sur le comportement humain." },
      { section: "Ce qu'elle aimerait changer", titreSection: "Le CRO, un investissement stratégique", question: "Si tu pouvais changer une chose ?", reponse: "Que le CRO soit perçu comme un investissement stratégique et non comme un outil de « quick win ». Pour moi, les meilleurs programmes CRO sont ceux qui s'inscrivent dans la durée et dans une culture de l'apprentissage continu." },
      { section: "Et demain ?", titreSection: "Où Caroline se voit dans 3 à 5 ans", question: "Où te vois-tu dans 3 à 5 ans ?", reponse: "Je me vois CRO Manager ou Growth Manager, avec une vraie expertise en personnalisation et en data. Le luxe m'attire beaucoup, et LVMH en particulier : je pense que le CRO a un rôle énorme à jouer dans un secteur où chaque détail de l'expérience utilisateur compte." }
    ],
    marques: ["Showroomprivé"],
    outils: [
      { nom: "AB Tasty", usage: "Conception et pilotage des tests A/B" },
      { nom: "Confluence", usage: "Documenter et partager la connaissance" },
      { nom: "Jira", usage: "Suivi des tests et des projets" }
    ],
    mentors: [
      { nom: "Laurent Babicz de Salettes", relation: "mentor", expertise: "", organisation: "Showroomprivé", citation: "Mon tuteur en alternance chez Showroomprivé. C'est lui qui m'a introduit au monde du CRO et qui a cru en moi dès le départ !", lienLinkedin: "", photo: "images/inspirations/laurent-babicz-de-salettes.jpg" }
    ],
    sujets: ["Personnalisation", "Emotion AI"],
    aRetenir: {
      synthese: true,
      points: [
        { titre: "La rigueur fait le résultat.", texte: "Une idée simple peut produire un gros impact si l'hypothèse, le ciblage et l'analyse sont solides." },
        { titre: "Intuition et data vont ensemble.", texte: "L'intuition génère les hypothèses, la data les valide ou les infirme." },
        { titre: "Le CRO se pense dans la durée.", texte: "Un programme CRO est un investissement stratégique fondé sur l'apprentissage continu." }
      ]
    },
    motsCles: ["Curiosité"]
  }
];
