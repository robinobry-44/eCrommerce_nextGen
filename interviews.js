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
    lienLinkedin: "https://www.linkedin.com/in/antoine-v-6950341a4/",
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
      { nom: "Sébastien Tortu", expertise: "CRO · Experimentation", organisation: "Boost Conversion", citation: "Une référence pour la méthodologie CRO et l'A/B testing en France, avec des contenus très orientés pratique et cas concrets.", lienLinkedin: "https://www.linkedin.com/in/sebastientortu/", photo: "images/inspirations/sebastien-tortu.jpg" },
      { nom: "Florent Kiecken", expertise: "E-commerce · Growth", organisation: "La Cargaison", citation: "Pour une vision plus large du e-commerce et de la croissance, complémentaire à l'approche pure CRO.", lienLinkedin: "https://www.linkedin.com/in/florent-kiecken/", photo: "images/inspirations/florent-kiecken.jpg" }
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
    lienLinkedin: "https://www.linkedin.com/in/caroline-hoang7/",
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
      { nom: "Laurent Babicz de Salettes", relation: "mentor", expertise: "", organisation: "Showroomprivé", citation: "Mon tuteur en alternance chez Showroomprivé. C'est lui qui m'a introduit au monde du CRO et qui a cru en moi dès le départ !", lienLinkedin: "https://www.linkedin.com/in/laurentbabiczdesalettes/", photo: "images/inspirations/laurent-babicz-de-salettes.jpg" }
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
  },
  {
    slug: "salome-klein",
    nom: "Salomé Klein",
    poste: "CRO & Web Analyst",
    entreprise: "CEWE",
    typeProfil: "annonceur",
    secteur: "E-commerce",
    date: "2026-10-04",
    promo: "2026",
    numero: 3,
    featured: true,
    photo: "images/interviews/salome-klein.jpg",
    photos: [],
    lienLinkedin: "https://www.linkedin.com/in/salomeklein/",
    expertises: ["CRO", "Experimentation", "Data", "UX"],
    citation: "Moins de certitudes, plus d'expérimentations.",
    accroche: "La data te donne la piste, mais l'empathie humaine donne la solution.",
    intro: "Salomé Klein est CRO & Web Analyst chez CEWE. Passée par l'EM Strasbourg puis BSB Lyon, elle découvre l'UX/UI en école, puis a son déclic chez Orange en pilotant la refonte du projet Datorama et la création de dashboards. À la Croix-Rouge française, elle structure la méthode CRO et forme les équipes pour inscrire le réflexe data dans la culture interne. Chez CEWE, elle apprend qu'enchaîner les tests ne sert à rien sans cadrage strict : aucun test ne part plus sans croiser data quantitative et qualitative, poser une vraie hypothèse et passer par une grille de priorisation. Dans cette interview, elle parle de priorisation, de KPIs, de la culture du HiPPO, de l'IA comme copilote et de sa conviction : le CRO est un sport d'équipe.",
    careerPath: [
      { etape: "EM Strasbourg", type: "formation", detail: "Bachelor Affaires Internationales" },
      { etape: "BSB Lyon", type: "formation", detail: "Master Digital Project Management" },
      { etape: "Orange", type: "experience", detail: "Stage" },
      { etape: "Croix-Rouge française", type: "experience", detail: "Digital Analyst & CRO" },
      { etape: "CEWE", type: "experience", detail: "CRO & Web Analyst" }
    ],
    reponses: [
      { section: "parcours", question: "Formation", reponse: ["Bachelor Affaires Internationales · EM Strasbourg", "Master Digital Project Management · BSB Lyon"] },
      { section: "parcours", question: "Expériences", reponse: ["Stage · Orange", "Digital Analyst & CRO · Croix-Rouge française", "CRO & Web Analyst · CEWE"] },
      { section: "declic", titreSection: "Comment Salomé est arrivée dans le CRO", question: "Quel a été ton déclic ?", reponse: "J'ai un parcours assez classique en école de commerce, avec des formations assez généralistes où on touche un peu à tout, mais c'est là-bas que j'ai découvert l'UX/UI et la notion de parcours utilisateur. Le vrai déclic s'est fait pendant mon stage chez Orange, grâce à une maître de stage formidable qui m'a directement propulsée sur de gros sujets. On m'a confié la refonte et le déploiement du projet Datorama : du cadrage des besoins métiers jusqu'à l'intégration des flux de données multi-leviers (Meta, Search…) et la création de dashboards. C'est en voyant l'impact direct de ces analyses sur la performance et le parcours des utilisateurs que j'ai eu le déclic." },
      { section: "La leçon apprise sur le tas", titreSection: "Pourquoi Salomé code ses propres tests A/B", question: "Quelle compétence as-tu apprise sur le tas ?", reponse: "L'intégration technique (JS / CSS). En sortant d'école, je pensais me concentrer sur l'analyse et la stratégie. Mais savoir coder mes propres tests A/B et paramétrer le tracking est vite devenu mon plus grand levier d'autonomie et de rapidité." },
      { section: "Sa plus belle réussite", titreSection: "Évangéliser le CRO à la Croix-Rouge française", question: "Ta plus belle réussite ?", reponse: "Sans hésiter, l'évangélisation du CRO à la Croix-Rouge française. La démarche existait, mais mon passage a permis de structurer une méthode. On a grandi ensemble : je me suis formée et j'ai formé les équipes pour inscrire le réflexe data dans la culture interne. C'est devenu une norme d'analyser les chiffres et d'isoler les points de friction, grâce à une manager et une équipe incroyables. Dans un autre style, participer à la migration de Croix-Rouge Compétence vers le site principal m'a appris à piloter en transversal et à faire le pont entre le produit, le marketing, les équipes métiers et les agences." },
      { section: "L'erreur qui lui a le plus appris", titreSection: "Pourquoi le volume de tests ne suffit pas", question: "L'erreur qui t'a le plus appris ?", reponse: "Au début de mon expérience chez CEWE, emportée par l'envie de bien faire, j'ai voulu enchaîner un maximum de tests A/B très vite. Problème : beaucoup sont sortis « neutres », sans rien nous apprendre sur nos utilisateurs. J'ai compris que faire du volume ne servait à rien sans un cadrage strict. Aujourd'hui, aucun test ne part sans croiser plusieurs sources de données, poser une vraie hypothèse et passer par une grille de priorisation." },
      { section: "Sa plus grande surprise", titreSection: "Pourquoi nos certitudes sont souvent fausses", question: "Ta plus grande surprise depuis que tu fais du CRO ?", reponse: "Constater à quel point nos certitudes sont souvent fausses. On arrive tous avec des a priori sur ce qui va marcher, mais la donnée vient systématiquement nous prendre à contre-pied. C'est ce qui fait la beauté du métier : ce ne sont ni nos intuitions ni les avis des différentes parties prenantes qui gagnent, ce sont toujours les utilisateurs." },
      { section: "Sa définition du CRO", titreSection: "Le CRO, un outil pour connaître ses utilisateurs", question: "Quelle est ta définition du CRO ?", reponse: "Le CRO est avant tout un outil fantastique pour mieux connaître nos utilisateurs. La performance business reste l'objectif, mais la vraie valeur réside dans la connaissance client. Un test négatif n'est jamais un échec : c'est une donnée précieuse qui affine notre compréhension et évite de mauvaises décisions à grande échelle. C'est le croisement parfait entre la sensibilité UX et la rigueur de la data." },
      { section: "Son plus gros challenge", titreSection: "Le défi de la priorisation", question: "Le plus gros challenge du CRO ?", reponse: "Clairement la priorisation. Des idées, on en a des dizaines, mais isoler la bonne opportunité parmi tout le bruit ambiant, c'est ce qui transforme une feuille de route subie en stratégie rentable. Pour éviter les choix à l'affect, je m'appuie sur une méthode type ICE et un protocole simple : croiser systématiquement data quantitative et qualitative avant de valider une hypothèse." },
      { section: "Sa stack", titreSection: "Pourquoi l'UX Analytics est indispensable selon Salomé", question: "Quels outils utilises-tu au quotidien ?", reponse: "Ma stack est ultra complète, et l'IA est devenue un outil fantastique pour accélérer la recherche UX et l'idéation. Mais l'indispensable reste une solution d'UX Analytics : la data quanti dit ce qui se passe, mais le qualitatif et les session replays donnent le pourquoi. C'est le seul moyen d'isoler les vraies frictions et de sortir des hypothèses qui font mouche." },
      { section: "Ses inspirations", titreSection: "Qui inspire Salomé", question: "Qui t'inspire ?", reponse: "Je pense à l'ensemble des personnes que j'ai pu croiser tout au long de mon parcours : mes managers, mes collègues et les équipes en agence. Et je dois avouer qu'il y a un vrai fit avec les experts d'Air360 ! Pour progresser, le mot d'ordre c'est la curiosité, surtout dans le digital où tout évolue ultra vite : lire des livres ou des livres blancs, participer à des webinars et à des journées dédiées au CRO ou au digital, faire une veille active sur LinkedIn en suivant les experts du secteur." },
      { section: "mindset", question: "Ta philosophie au quotidien ?", titre: "Sans donnée, vous n'êtes qu'une personne de plus avec une opinion.", auteur: "W. Edwards Deming", reponse: "Ça rappelle de garder de l'humilité face aux certitudes et de toujours laisser le dernier mot à l'utilisateur." },
      { section: "Ses KPIs", titreSection: "Les KPIs que Salomé regarde (et ceux qu'elle évite)", question: "Ton KPI préféré, le plus négligé, le plus mal utilisé ?", reponse: "Mon préféré, c'est le RPV : ça mesure la vraie création de valeur, pas juste une vente isolée. La métrique trop souvent négligée, c'est le taux d'engagement UX (interactions réelles, scroll qualifié), qui révèle les frictions très tôt. Et le plus mal utilisé reste le taux de conversion global : il ne veut rien dire sans segmentation par source ou intention." },
      { section: "Le mythe à déconstruire", titreSection: "Pourquoi un bon taux de conversion ne fait pas tout", question: "Le mythe à déconstruire ?", reponse: "Croire qu'un bon taux de conversion fait tout. Optimiser une étape pour faire grimper un chiffre à court terme, c'est facile, mais si ça détruit la valeur client, l'expérience globale ou génère des retours, c'est perdant." },
      { section: "La tendance qui l'enthousiasme", titreSection: "L'IA générative au service de la recherche UX", question: "La tendance qui t'enthousiasme le plus ?", reponse: "L'arrivée de l'IA générative appliquée à la recherche UX et à la personnalisation. Pouvoir modéliser des comportements ou analyser de la donnée qualitative à grande échelle sans perdre en finesse, c'est un vrai booster pour nous concentrer sur la stratégie." },
      { section: "L'e-commerce dans 3 ans", titreSection: "Vers un e-commerce hyper-personnalisé et prédictif", question: "Comment vois-tu l'e-commerce dans 3 ans ?", reponse: "Je vois un e-commerce encore plus hyper-personnalisé et prédictif. On sortira enfin du parcours linéaire classique : l'expérience s'adaptera en temps réel au contexte, à l'intention et au comportement d'achat précis de chaque utilisateur." },
      { section: "Ce qu'elle changerait", titreSection: "La qualité des hypothèses avant le volume de tests", question: "Si tu pouvais changer une chose dans l'industrie ?", reponse: "Arrêter la course au volume de tests pour privilégier la qualité des hypothèses. Moins de « test pour tester », plus de valeur réelle apportée aux utilisateurs." },
      { section: "conseil", titreSection: "Le conseil de Salomé pour se lancer", question: "Ton conseil à quelqu'un qui veut se lancer ?", titre: "Ne reste pas enfermé dans tes chiffres.", reponse: "Va parler aux équipes support, écoute des appels clients, regarde des session replays. La data te donne la piste, mais l'empathie humaine donne la solution." },
      { section: "Sa secret sauce", titreSection: "Croiser quanti et quali, systématiquement", question: "Ta secret sauce au quotidien ?", reponse: "Le croisement systématique data quanti + qualitatif avant de valider la moindre hypothèse. Je ne lance jamais un test basé uniquement sur du ressenti ou une seule métrique. Et mon hack le plus efficace pour progresser vite : analyser les échecs des autres et les siens. Décortiquer les A/B tests qui ont échoué ou donné un résultat contre-intuitif apprend dix fois plus sur le comportement humain que n'importe quelle success story sur LinkedIn." },
      { section: "Sa hot take", titreSection: "Un test négatif, c'est un échec ?", question: "Ta hot take ?", reponse: "Tout le monde croit qu'un test négatif est un échec, alors que c'est parfois la meilleure donnée de l'année. Mieux vaut invalider une mauvaise idée en A/B test en deux semaines que d'impacter le chiffre d'affaires pendant six mois après un déploiement aveugle." },
      { section: "Si elle appuyait sur reset", titreSection: "En finir avec la culture du HiPPO", question: "Si tu pouvais appuyer sur « reset » ?", reponse: "Je supprimerais la culture du « HiPPO » (la décision prise au feeling du plus haut salaire de la table). Je forcerais chaque décision produit à s'appuyer sur une hypothèse testée et documentée." },
      { section: "Ce que personne n'ose dire", titreSection: "Faire du CRO pour dire qu'on en fait", question: "Ce que personne n'ose dire ?", reponse: "Beaucoup d'entreprises font du CRO pour dire qu'elles en font, sans jamais donner aux équipes les moyens ou l'autonomie d'appliquer les résultats. On accumule les tests, mais les vrais changements bloquent en recette." },
      { section: "Waouh ou aïe ?", titreSection: "Le risque d'uniformisation du e-commerce", question: "Face au futur du digital : waouh ou aïe ?", reponse: "« Waouh » pour la vitesse d'innovation, mais « aïe » face au risque d'uniformisation : si tout le monde utilise les mêmes outils et les mêmes recettes, tous les sites e-commerce vont finir par se ressembler." },
      { section: "hottake", question: "L'IA, on en fait trop ?", ouiContexte: "sur la hype", oui: "Trop de hype sur l'automatisation magique qui remplacerait la réflexion.", nonContexte: "sur l'usage concret", non: "Pas assez d'usage pragmatique pour faire sauter les tâches répétitives et libérer du temps d'analyse UX. L'IA reste un copilote, pas le pilote." },
      { section: "Et demain ?", titreSection: "Où Salomé se voit dans 3 à 5 ans", question: "Où te vois-tu dans 3 à 5 ans ?", reponse: "Je me vois en cabinet de conseil ou en agence pour accompagner des clients variés et diffuser cette culture data CRO à plus grande échelle. J'aimerais relever des défis plus poussés sur la personnalisation et l'intégration de l'IA pour automatiser la recherche UX. Pour passer au niveau d'après, j'aimerais développer mes compétences en Product Management et en stratégie d'expérimentation globale : structurer des programmes CRO complexes à l'échelle d'une organisation, piloter des équipes transversales et lier encore plus directement nos tests aux enjeux financiers et business. Côté entreprise, une structure avec une forte culture produit et data (ou, soyons honnêtes, un éditeur d'outils d'UX Analytics ambitieux comme Air360 ! 😉)." },
      { section: "Libre antenne", titreSection: "Le CRO, un sport d'équipe", question: "Un dernier mot ?", reponse: "Le CRO est un sport d'équipe. On peut avoir la meilleure stack technique et la donnée la plus propre du monde : si on n'embarque pas les designers, les développeurs et les équipes produit dans la démarche, les insights restent au placard. La vraie victoire en CRO, ce n'est pas juste de réussir un A/B test, c'est d'amener toute une entreprise à se poser les bonnes questions, à tester ses hypothèses et à placer l'expérience utilisateur au cœur de chaque décision business." }
    ],
    marques: ["CEWE", "Croix-Rouge française", "Orange"],
    outils: [{ nom: "Air360", usage: "UX Analytics : le qualitatif et les session replays donnent le pourquoi des frictions" }],
    mentors: [],
    ressources: [{ titre: "Don't Make Me Think", type: "book", auteur: "Steve Krug", lien: "", image: "", raison: "Je conseille de lire « Don't Make Me Think » de Steve Krug ou des livres blancs.", relation: "recommends" }],
    sujets: ["IA", "Personnalisation", "Recherche UX", "Priorisation"],
    methode: { titre: "Le protocole de Salomé avant chaque test", synthese: true, etapes: [{ titre: "Croiser les sources", texte: "Data quantitative et qualitative (session replays, appels clients, équipes support) avant toute hypothèse." }, { titre: "Poser une vraie hypothèse", texte: "Jamais de test basé uniquement sur du ressenti ou une seule métrique." }, { titre: "Prioriser", texte: "Passer chaque idée dans une grille de priorisation type ICE pour éviter les choix à l'affect." }, { titre: "Apprendre de chaque résultat", texte: "Un test négatif n'est jamais un échec : c'est une donnée qui évite une mauvaise décision à grande échelle." }] },
    aRetenir: { synthese: true, points: [{ titre: "La qualité avant le volume.", texte: "Moins de tests pour tester, plus d'hypothèses solides et priorisées." }, { titre: "Le quanti dit quoi, le quali dit pourquoi.", texte: "Croiser les deux est le seul moyen d'isoler les vraies frictions." }, { titre: "Le CRO est un sport d'équipe.", texte: "Sans designers, développeurs et équipes produit embarqués, les insights restent au placard." }] },
    motsCles: ["Apprentissage"]
  }
];
