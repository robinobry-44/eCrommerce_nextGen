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
  majLe: "2026-10-16",
  offres: [
    {
      titre: "Stage : Spécialiste CRO, CX & intelligence digitale",
      entreprise: "Stellantis", metier: "cro", contrat: "stage", ville: "Poissy (78)",
      lien: "https://fr.indeed.com/viewjob?jk=63b0db83b8df825b", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le CRO est dans l'intitulé, ce qui reste rare pour un stage, et chez un grand compte du digital automobile.",
      pourquoiEn: "CRO is right there in the job title, which is still rare for an internship, at a major player in automotive digital."
    },
    {
      titre: "Stagiaire SEO & CRO – Acquisition digitale",
      entreprise: "Skill and You", metier: "cro", contrat: "stage", ville: "Levallois-Perret (92)",
      lien: "https://fr.indeed.com/viewjob?jk=aa18851c8765b563", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Un stage qui relie acquisition et conversion : idéal pour comprendre tout le funnel, du trafic à la vente.",
      pourquoiEn: "An internship that links acquisition and conversion: ideal to understand the whole funnel, from traffic to sale."
    },
    {
      titre: "Internship – Support on Conversational Analytics (janvier 2027)",
      entreprise: "LVMH", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=9ce710845ed466da", vuLe: "2026-10-16", expire: "2026-12-15",
      pourquoi: "L'analytics appliquée aux conversations clients dans le luxe : un sujet d'avenir, là où chaque détail de l'expérience compte.",
      pourquoiEn: "Analytics applied to customer conversations in luxury: a forward-looking topic, where every detail of the experience matters."
    },
    {
      titre: "Internship Product Data Analyst",
      entreprise: "Cheerz", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=6f7447e622b5c514", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "De la data produit chez un pure player e-commerce : le terrain de jeu idéal pour apprendre à transformer des chiffres en hypothèses.",
      pourquoiEn: "Product data at an e-commerce pure player: the perfect playground to learn how to turn numbers into hypotheses."
    },
    {
      titre: "Stage – Data Analyst et Tracking",
      entreprise: "Ekstend", metier: "analytics", contrat: "stage", ville: "Marseille (13)",
      lien: "https://fr.indeed.com/viewjob?jk=304aa3d45e79d35a", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le tracking, c'est la compétence que nos talents disent avoir apprise sur le tas. Ici, elle est au programme dès le stage.",
      pourquoiEn: "Tracking is the skill our talents say they learned on the job. Here, it's part of the internship from day one."
    },
    {
      titre: "Consultant(e) E-commerce – Stage de fin d'études",
      entreprise: "Converteo", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=1eaa56e999a44311", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Un cabinet data & e-commerce : plusieurs clients, plusieurs sites, de quoi voir beaucoup de cas en peu de temps.",
      pourquoiEn: "A data & e-commerce consultancy: several clients, several websites, a way to see a lot of cases in a short time."
    },
    {
      titre: "Stage Business Analyst / PPO e-commerce",
      entreprise: "VISEO", metier: "ecommerce", contrat: "stage", ville: "Boulogne-Billancourt (92)",
      lien: "https://fr.indeed.com/viewjob?jk=700324e35089060a", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Côté produit e-commerce : apprendre à cadrer un besoin et à dialoguer avec les développeurs, deux réflexes clés du CRO.",
      pourquoiEn: "On the e-commerce product side: learning to scope a need and to talk with developers, two key CRO reflexes."
    },
    {
      titre: "Stage Coordinateur e-commerce & animation commerciale B to C",
      entreprise: "Nespresso", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=e6eb150846231995", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le quotidien d'un site e-commerce de marque : animation, mises en avant, performance. La base avant d'optimiser.",
      pourquoiEn: "The day-to-day of a brand e-commerce site: merchandising, promotions, performance. The basics before optimising."
    },
    {
      titre: "Stage Product design / UX design",
      entreprise: "Bouygues Telecom", metier: "ux", contrat: "stage", ville: "Meudon (92)",
      lien: "https://fr.indeed.com/viewjob?jk=5a0f5ea646bc6457", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Pour celles et ceux qui viennent du design : comprendre l'utilisateur avant de tester, c'est le cœur d'un bon CRO.",
      pourquoiEn: "For those coming from design: understanding the user before testing is the heart of good CRO."
    },
    {
      titre: "Stage Bac+5 – Sciences cognitives / Ergonomie",
      entreprise: "Renault Group", metier: "ux", contrat: "stage", ville: "Guyancourt (78)",
      lien: "https://fr.indeed.com/viewjob?jk=a00979e7db856836", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Les sciences cognitives appliquées aux interfaces : la psychologie derrière chaque friction, chaque clic, chaque hésitation.",
      pourquoiEn: "Cognitive science applied to interfaces: the psychology behind every friction, every click, every hesitation."
    }
  ]
};
