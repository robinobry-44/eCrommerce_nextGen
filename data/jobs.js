/* ==========================================================================
   PREMIER JOB — sélection d'offres juniors (stage, alternance, premier poste).
   Page : /premier-job/ (et /en/first-job/).

   ► RÈGLES
     - Sélection à la main : 10 à 15 offres vraiment CRO / analytics / UX / e-commerce.
     - On ne recopie pas l'annonce : titre, entreprise, lieu + une phrase « pourquoi on l'a retenue ».
       La candidature se fait sur l'annonce d'origine (lien).
     - expire (AAAA-MM-JJ) : passé cette date, l'offre disparaît toute seule au build suivant.
       Par défaut, compter ~6 semaines après la date où l'offre a été vue.
     - metier : "cro" · "analytics" · "ux" · "ecommerce"
     - contrat : "stage" · "alternance" · "cdi" (premier poste) · "cdd"
     - outils : noms des outils cités dans l'annonce (liés aux pages Outils du site s'ils existent)
     - majLe : date de la dernière mise à jour de la sélection (affichée sur la page)

   ► MODÈLE
    { titre: "Stage CRO", entreprise: "Marque", metier: "cro", contrat: "stage", ville: "Paris",
      lien: "https://…", vuLe: "2026-10-16", expire: "2026-11-30", outils: ["AB Tasty"],
      pourquoi: "Une phrase.", pourquoiEn: "One sentence." },
   ========================================================================== */

window.JOBS = {
  majLe: "2026-11-02",
  offres: [
    {
      titre: "CRO Analyst Junior",
      entreprise: "Tediber", domaine: "tediber.com", metier: "cro", contrat: "cdi", ville: "Paris (75)",
      lien: "https://www.welcometothejungle.com/fr/companies/tediber/jobs/cro-analyst-junior_paris", vuLe: "2026-10-19", expire: "2026-11-30",
      pourquoi: "Un vrai poste de CRO Analyst junior, intitulé compris, chez une marque née en ligne (literie en direct) : on y apprend le CRO là où il pèse directement sur le chiffre d'affaires.",
      pourquoiEn: "A genuine junior CRO Analyst role, title included, at a digitally native brand (direct-to-consumer bedding): you learn CRO where it directly drives revenue."
    },
    {
      titre: "Stage : Spécialiste CRO, CX & intelligence digitale",
      entreprise: "Stellantis", domaine: "stellantis.com", metier: "cro", contrat: "stage", ville: "Poissy (78)",
      lien: "https://fr.indeed.com/viewjob?jk=63b0db83b8df825b", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le CRO est dans l'intitulé, ce qui reste rare pour un stage, et chez un grand compte du digital automobile.",
      pourquoiEn: "CRO is right there in the job title, which is still rare for an internship, at a major player in automotive digital."
    },
    {
      titre: "Stage Conversion Rate Optimization Specialist",
      entreprise: "Kering", domaine: "kering.com", metier: "cro", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.glassdoor.fr/job-listing/kering-stage-conversion-rate-optimization-specialist-kering-JV_IC2881970_KO0,52_KE53,59.htm?jl=1010285961810", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Google Analytics 4", "AB Tasty", "Quantum Metric", "Tableau"],
      pourquoi: "Un stage 100 % CRO dans l'équipe e-commerce d'un groupe de luxe : repérer les frictions des parcours, lancer et analyser des A/B tests pour plusieurs maisons.",
      pourquoiEn: "A 100% CRO internship in the e-commerce team of a luxury group: spotting journey frictions, running and analysing A/B tests for several fashion houses."
    },
    {
      titre: "Assistant·e Web Analytics – Stage (janvier 2027)",
      entreprise: "Vente-unique.com", domaine: "vente-unique.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.glassdoor.fr/job-listing/assistant-e-web-analytics-stage-hf-vente-unique-com-JV_IC2881970_KO0,34_KE35,51.htm?jl=1010305466396", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Google Analytics 4", "Google Tag Manager", "BigQuery", "Power BI"],
      pourquoi: "Chez un pure player du meuble en ligne, on mesure l'effet des évolutions UX, on fiabilise le tracking et on analyse les parcours : le socle data d'un futur CRO.",
      pourquoiEn: "At an online furniture pure player, you measure the impact of UX changes, make tracking reliable and analyse user journeys: the data foundation of a future CRO."
    },
    {
      titre: "Consultant Web Analytics – Stage de 6 mois ou alternance (janvier 2027)",
      entreprise: "Converteo", domaine: "converteo.com", metier: "analytics", contrat: "alternance", ville: "Paris (75)",
      lien: "https://jobs.converteo.com/jobs/7613255-consultant-web-analytics-h-f-stage-de-6-mois-ou-alternance-janvier-2027", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Google Tag Manager", "Tealium", "Piano Analytics", "Amplitude", "BigQuery", "Looker Studio"],
      pourquoi: "Ouvert en alternance comme en stage : du plan de taggage à la recette des données, on y apprend le tracking web et app de bout en bout, sur plusieurs clients.",
      pourquoiEn: "Open as a work-study contract or an internship: from tagging plan to data QA, you learn web and app tracking end to end, across several clients."
    },
    {
      titre: "Consultant(e) E-commerce – Stage de fin d'études",
      entreprise: "Converteo", domaine: "converteo.com", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=1eaa56e999a44311", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Un cabinet data & e-commerce : plusieurs clients, plusieurs sites, de quoi voir beaucoup de cas en peu de temps.",
      pourquoiEn: "A data & e-commerce consultancy: several clients, several websites, a way to see a lot of cases in a short time."
    },
    {
      titre: "Stage Product design / UX design",
      entreprise: "Bouygues Telecom", domaine: "bouyguestelecom.fr", metier: "ux", contrat: "stage", ville: "Meudon (92)",
      lien: "https://fr.indeed.com/viewjob?jk=5a0f5ea646bc6457", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Pour celles et ceux qui viennent du design : comprendre l'utilisateur avant de tester, c'est le cœur d'un bon CRO.",
      pourquoiEn: "For those coming from design: understanding the user before testing is the heart of good CRO."
    },
    {
      titre: "Stage Bac+5 – Sciences cognitives / Ergonomie",
      entreprise: "Renault Group", domaine: "renaultgroup.com", metier: "ux", contrat: "stage", ville: "Guyancourt (78)",
      lien: "https://fr.indeed.com/viewjob?jk=a00979e7db856836", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Les sciences cognitives appliquées aux interfaces : la psychologie derrière chaque friction, chaque clic, chaque hésitation.",
      pourquoiEn: "Cognitive science applied to interfaces: the psychology behind every friction, every click, every hesitation."
    },
    {
      titre: "Stagiaire UI/UX Designer",
      entreprise: "Printemps", domaine: "printemps.com", metier: "ux", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.glassdoor.fr/job-listing/stagiaire-ui-ux-designer-hf-printemps-JV_IC2881970_KO0,27_KE28,37.htm?jl=1010279190611", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Figma"],
      pourquoi: "De l'UX appliquée à quatre sites e-commerce d'un grand magasin : analyse de parcours, maquettes, prototypes et accessibilité, au plus près de la conversion.",
      pourquoiEn: "UX applied to four e-commerce sites of a department store: journey analysis, mock-ups, prototypes and accessibility, right next to conversion."
    },
    {
      titre: "Intern E-business Performance Analyst (janvier 2027)",
      entreprise: "Balenciaga", domaine: "balenciaga.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=319ae68aa8549f2a", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Google Analytics", "Contentsquare", "Tableau", "Power BI", "Looker Studio"],
      pourquoi: "Suivi des KPI e-commerce, tableaux de bord sur le parcours client et analyses ponctuelles pour plusieurs équipes : un poste d'analyse de la performance en ligne, dans le luxe.",
      pourquoiEn: "E-commerce KPI tracking, customer-journey dashboards and ad hoc analyses for several teams: an online performance analysis role, in luxury."
    },
    {
      titre: "Stage Data Analytics eCommerce",
      entreprise: "Kering", domaine: "kering.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.wizbii.com/company/kering/job/kering-stage-data-analytics-ecommerce", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["SQL", "Python"],
      pourquoi: "Croiser ventes et tracking web, analyser les parcours pour repérer les frictions et mesurer l'impact des évolutions des sites : un stage directement relié à la conversion.",
      pourquoiEn: "Combining sales and web tracking data, analysing journeys to spot frictions and measuring the impact of site changes: an internship directly tied to conversion."
    },
    {
      titre: "Stage Business Analyste Web",
      entreprise: "Nespresso", domaine: "nespresso.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.engagement-jeunes.com/fr/detail-offre/39694549/stage-nestle-operational-services-worldwide-sa-business-analyste-web-f-h.html", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Google Analytics 4", "Adobe Analytics", "Contentsquare", "Looker Studio", "Power BI"],
      pourquoi: "Performance du site et de l'app, études sur les parcours clients et évolution du tracking : le quotidien d'un web analyst, de la mesure à l'analyse.",
      pourquoiEn: "Site and app performance, customer-journey studies and tracking evolution: the day-to-day of a web analyst, from measurement to analysis."
    },
    {
      titre: "Assistant(e) E-Commerce – Stage (janvier 2027)",
      entreprise: "Oh My Cream", domaine: "ohmycream.com", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.welcometothejungle.com/fr/companies/oh-my-cream/jobs/e-merchandising-internship-native-en_paris", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Shopify"],
      pourquoi: "Merchandising hebdomadaire des sites français et anglais, mise en ligne des nouveautés et suivi des pages produits : la gestion concrète d'un site e-commerce.",
      pourquoiEn: "Weekly merchandising of the French and English sites, new product launches and product page upkeep: hands-on e-commerce site management."
    },
    {
      titre: "Assistant·e Chef·fe de projets digitaux – Stage (janvier 2027)",
      entreprise: "Maison 123", domaine: "maison123.com", metier: "ecommerce", contrat: "stage", ville: "Siège Maison 123",
      lien: "https://career.maison123.com/jobs/8509600-assistant-e-chef-fe-de-projets-digitaux-stage-janvier-2027", vuLe: "2026-11-02", expire: "2026-12-14",
      pourquoi: "Refonte de la plateforme, nouveaux modes de paiement et de livraison, site de seconde main et suivi des KPI : une vue complète des évolutions d'un site e-commerce.",
      pourquoiEn: "Platform redesign, new payment and delivery options, a second-hand site and KPI tracking: a complete view of how an e-commerce site evolves."
    },
    {
      titre: "Stage Business Analyst E-Commerce (janvier 2027)",
      entreprise: "Galeries Lafayette", domaine: "galerieslafayette.com", metier: "ecommerce", contrat: "stage", ville: "Siège Galeries Lafayette",
      lien: "https://carrieres.groupegalerieslafayette.com/jobs/8295690-stage-business-analyst-e-commerce-f-h", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Google Analytics", "Power BI"],
      pourquoi: "Suivi quotidien de la performance du site, analyse des écarts aux objectifs et propositions d'amélioration : un stage où l'analyse débouche sur des actions.",
      pourquoiEn: "Daily site performance monitoring, analysis of gaps against targets and improvement proposals: an internship where analysis leads to action."
    }
  ]
};