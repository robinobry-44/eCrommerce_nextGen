/* ==========================================================================
   PREMIER JOB — sélection d'offres juniors (stage, alternance, premier poste).
   Page : /premier-job/ (et /en/first-job/).

   ► RÈGLES
     - Sélection à la main, sans limite de nombre : offres vraiment CRO / analytics / UX / e-commerce, en France et à l'étranger (indiquer le pays dans ville).
     - On ne recopie pas l'annonce : titre, entreprise, lieu + une phrase « pourquoi on l'a retenue ».
       La candidature se fait sur l'annonce d'origine (lien).
     - expire (AAAA-MM-JJ) : date indicative (~6 semaines après vuLe) pour revérifier l'offre. Elle n'archive rien : une offre dont la date est passée reste active.
     - archivee: true : uniquement si l'annonce est indiquée comme pourvue ou a disparu des sites. Jamais pour une autre raison (ni date passée, ni manque de place, ni page illisible). On ne supprime jamais une offre (SEO/GEO) : elle reste sur la page avec un badge.
     - metier : "cro" · "analytics" · "ux" · "ecommerce"
     - contrat : "stage" · "alternance" · "cdi" (premier poste) · "cdd"
     - outils : noms des outils cités dans l'annonce (liés aux pages Outils du site s'ils existent)
     - majLe : date de la dernière mise à jour de la sélection (affichée sur la page)
     - PAGE PAR OFFRE (/premier-job/<slug>/) : chaque offre a sa page, générée depuis ces champs. Le texte est rédigé par NextGen, JAMAIS copié de l'annonce.
         slug : minuscules-tirets, unique, stable (entreprise + intitulé court)
         avis / avisEn : 2 paragraphes (point de vue + éléments clés : contrat, lieu, outils, ce qu'on y apprend)
         conseil / conseilEn : 1 à 2 phrases pour candidater
         relais : [{ slug: "salome-klein", fr: "…", en: "…" }] lien vers un talent, uniquement ce que le talent a réellement dit dans son interview
       Ne rien affirmer qui ne soit dans l'annonce ou l'interview ; si un détail manque, le dire (« à confirmer dans l'annonce »).

   ► MODÈLE
    { titre: "Stage CRO", entreprise: "Marque", metier: "cro", contrat: "stage", ville: "Paris",
      lien: "https://…", vuLe: "2026-10-16", expire: "2026-11-30", outils: ["AB Tasty"],
      pourquoi: "Une phrase.", pourquoiEn: "One sentence." },
   ========================================================================== */

window.JOBS = {
  majLe: "2026-11-05",
  offres: [
    {
      titre: "CRO Analyst Junior",
      entreprise: "Tediber", domaine: "tediber.com", metier: "cro", contrat: "cdi", ville: "Paris (75)",
      lien: "https://www.welcometothejungle.com/fr/companies/tediber/jobs/cro-analyst-junior_paris", vuLe: "2026-10-19", expire: "2026-11-30",
      pourquoi: "Un vrai poste de CRO Analyst junior, intitulé compris, chez une marque née en ligne (literie en direct) : on y apprend le CRO là où il pèse directement sur le chiffre d'affaires.",
      pourquoiEn: "A genuine junior CRO Analyst role, title included, at a digitally native brand (direct-to-consumer bedding): you learn CRO where it directly drives revenue.",
      slug: "tediber-cro-analyst-junior",
      avis: ["Un premier poste qui s'appelle CRO Analyst, c'est assez rare pour être signalé. Dans la plupart des annonces juniors, le CRO se cache derrière « e-commerce » ou « marketing digital ». Ici, le métier est dans l'intitulé et le contrat est un CDI : on vous recrute pour apprendre dans la durée, pas pour une saison.","Tediber est une marque née en ligne, qui vend de la literie en direct. Pour ce type d'acteur, le site est le canal principal : chaque friction se lit vite dans le chiffre d'affaires et chaque test a des conséquences visibles. C'est un bon terrain pour comprendre ce que le CRO change vraiment."],
      avisEn: ["A first job actually called CRO Analyst is rare enough to be worth flagging. In most junior listings, CRO hides behind « e-commerce » or « digital marketing ». Here the craft is in the title and the contract is permanent: you are hired to learn over time, not for a season.","Tediber is a digitally native brand selling bedding direct to consumers. For this kind of company the website is the main channel: every friction shows up quickly in revenue and every test has visible consequences. It is a good place to see what CRO really changes."],
      conseil: "Dans votre candidature, montrez un raisonnement plutôt qu'un diplôme : un parcours de site que vous avez analysé, une hypothèse, la façon dont vous la testeriez. Un junior qui sait dire pourquoi il testerait quelque chose se distingue vite.", conseilEn: "In your application, show reasoning rather than a degree: a site journey you analysed, a hypothesis, how you would test it. A junior who can explain why they would test something stands out quickly.",
      relais: [{"slug":"caroline-hoang","fr":"Caroline a lancé ses premiers tests A/B en alternance. Elle raconte que son test de social proof n'avait rien de révolutionnaire : c'est la rigueur de l'hypothèse, du ciblage et de l'analyse qui a tout fait. C'est l'état d'esprit qu'un poste de CRO Analyst junior demande.","en":"Caroline ran her first A/B tests during her work-study contract. She says her social proof test was nothing revolutionary: it was the rigour of the hypothesis, targeting and analysis that did it. That is the mindset a junior CRO Analyst role asks for."}]
    },
    {
      titre: "Stage : Spécialiste CRO, CX & intelligence digitale",
      entreprise: "Stellantis", domaine: "stellantis.com", metier: "cro", contrat: "stage", ville: "Poissy (78)",
      lien: "https://fr.indeed.com/viewjob?jk=63b0db83b8df825b", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le CRO est dans l'intitulé, ce qui reste rare pour un stage, et chez un grand compte du digital automobile.",
      pourquoiEn: "CRO is right there in the job title, which is still rare for an internship, at a major player in automotive digital.",
      slug: "stellantis-stage-cro-cx-intelligence-digitale",
      avis: ["CRO, CX et intelligence digitale dans le même intitulé : l'annonce assume que la conversion ne se joue pas qu'avec des tests, mais aussi avec de la connaissance client et de la veille. Pour un stagiaire, c'est une porte d'entrée large, qui évite de s'enfermer trop tôt dans un seul outil.","Dans l'automobile, le parcours digital est long : on se renseigne, on compare, on configure, parfois des semaines avant de passer en concession. Optimiser ce genre de parcours demande de la patience et de bons indicateurs intermédiaires. C'est une vraie école pour qui veut sortir de la logique « panier puis paiement »."],
      avisEn: ["CRO, CX and digital intelligence in the same job title: the listing assumes conversion is not only about tests but also about customer knowledge and market watch. For an intern it is a wide entry point that avoids locking you into one tool too early.","In automotive, the digital journey is long: people research, compare and configure, sometimes weeks before visiting a dealership. Optimising that kind of journey takes patience and good intermediate metrics. It is a real school for anyone who wants to move past a « basket then payment » mindset."],
      conseil: "Préparez un exemple de parcours long que vous avez analysé (achat d'un gros équipement, voyage, abonnement). Savoir parler de micro-conversions marque des points sur ce type de poste.", conseilEn: "Prepare an example of a long journey you have analysed (a big-ticket purchase, a trip, a subscription). Being able to talk about micro-conversions scores points for this kind of role.",
      relais: [{"slug":"salome-klein","fr":"Salomé rappelle qu'un taux de conversion global ne veut rien dire sans segmentation par source ou intention. Sur un parcours aussi long que celui de l'automobile, c'est encore plus vrai.","en":"Salomé points out that an overall conversion rate means nothing without segmentation by source or intent. On a journey as long as the automotive one, that is even more true."}]
    },
    {
      titre: "Stage Conversion Rate Optimization Specialist",
      entreprise: "Kering", domaine: "kering.com", metier: "cro", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.glassdoor.fr/job-listing/kering-stage-conversion-rate-optimization-specialist-kering-JV_IC2881970_KO0,52_KE53,59.htm?jl=1010285961810", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Google Analytics 4", "AB Tasty", "Quantum Metric", "Tableau"],
      pourquoi: "Un stage 100 % CRO dans l'équipe e-commerce d'un groupe de luxe : repérer les frictions des parcours, lancer et analyser des A/B tests pour plusieurs maisons.",
      pourquoiEn: "A 100% CRO internship in the e-commerce team of a luxury group: spotting journey frictions, running and analysing A/B tests for several fashion houses.",
      slug: "kering-stage-cro-specialist",
      avis: ["C'est le stage CRO le plus complet de la sélection : repérage des frictions de parcours, lancement et analyse d'A/B tests, pour plusieurs maisons du groupe. Les outils cités (Google Analytics 4, AB Tasty, Quantum Metric, Tableau) couvrent à peu près tout le cycle : mesurer, observer, tester, restituer.","Le luxe est un terrain exigeant pour le CRO. L'image de marque limite ce qu'on peut changer sur une page et il faut défendre chaque hypothèse. Apprendre à tester sans abîmer une marque est une compétence qu'on retrouve ensuite partout."],
      avisEn: ["This is the most complete CRO internship in the selection: spotting journey frictions, launching and analysing A/B tests, for several houses of the group. The tools named (Google Analytics 4, AB Tasty, Quantum Metric, Tableau) cover nearly the whole cycle: measure, observe, test, report.","Luxury is a demanding ground for CRO. Brand image limits what you can change on a page and every hypothesis has to be defended. Learning to test without damaging a brand is a skill you will use everywhere afterwards."],
      conseil: "Citez des outils que vous avez réellement manipulés, même en projet d'école ou en version gratuite. Et préparez une hypothèse de test sur un site de mode ou de luxe : elle vaut mieux qu'une liste de compétences.", conseilEn: "Name tools you have actually used, even in a school project or on a free plan. And prepare a test hypothesis for a fashion or luxury site: it is worth more than a skills list.",
      relais: [{"slug":"caroline-hoang","fr":"Caroline se voit CRO Manager et dit que le luxe l'attire, parce que chaque détail de l'expérience utilisateur y compte. Un stage dans un groupe comme Kering va dans ce sens.","en":"Caroline sees herself as a CRO Manager and says luxury appeals to her, because every detail of the user experience counts. An internship in a group like Kering goes that way."}]
    },
    {
      titre: "Assistant·e Web Analytics – Stage (janvier 2027)",
      entreprise: "Vente-unique.com", domaine: "vente-unique.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.glassdoor.fr/job-listing/assistant-e-web-analytics-stage-hf-vente-unique-com-JV_IC2881970_KO0,34_KE35,51.htm?jl=1010305466396", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Google Analytics 4", "Google Tag Manager", "BigQuery", "Power BI"],
      pourquoi: "Chez un pure player du meuble en ligne, on mesure l'effet des évolutions UX, on fiabilise le tracking et on analyse les parcours : le socle data d'un futur CRO.",
      pourquoiEn: "At an online furniture pure player, you measure the impact of UX changes, make tracking reliable and analyse user journeys: the data foundation of a future CRO.",
      slug: "vente-unique-assistant-web-analytics",
      avis: ["Un poste de web analytics qui part du tracking : fiabiliser les données avant de les interpréter. C'est moins glamour qu'un test A/B, mais c'est ce qui rend les tests crédibles. Un CRO qui ne sait pas vérifier ses données se trompe avec assurance.","Le stage couvre aussi la mesure de l'effet des évolutions UX et l'analyse des parcours. Chez un pure player du meuble, où le panier est élevé et la décision longue, ces analyses ont des conséquences concrètes. Google Analytics 4, Tag Manager, BigQuery et Power BI forment un socle solide pour la suite."],
      avisEn: ["A web analytics role that starts with tracking: making data reliable before interpreting it. It is less glamorous than an A/B test, but it is what makes tests credible. A CRO who cannot check their data is confidently wrong.","The internship also covers measuring the impact of UX changes and analysing journeys. At an online furniture pure player, where baskets are large and decisions slow, those analyses have concrete consequences. Google Analytics 4, Tag Manager, BigQuery and Power BI make a solid foundation."],
      conseil: "Montrez que vous savez poser une question avant d'ouvrir un outil : quel comportement veut-on comprendre, quelle donnée le prouverait ? C'est ce qu'un recruteur analytics cherche chez un stagiaire.", conseilEn: "Show that you can ask a question before opening a tool: which behaviour do we want to understand, which data would prove it? That is what an analytics recruiter looks for in an intern.",
      relais: [{"slug":"antoine-vera","fr":"Antoine le résume ainsi : les outils ne font pas la méthode, ils servent une démarche d'observation, d'expérimentation et d'apprentissage. Un bon analyste commence par la démarche.","en":"Antoine sums it up: tools do not make the method, they serve a process of observation, experimentation and learning. A good analyst starts with the process."}]
    },
    {
      titre: "Consultant Web Analytics – Stage de 6 mois ou alternance (janvier 2027)",
      entreprise: "Converteo", domaine: "converteo.com", metier: "analytics", contrat: "alternance", ville: "Paris (75)",
      lien: "https://jobs.converteo.com/jobs/7613255-consultant-web-analytics-h-f-stage-de-6-mois-ou-alternance-janvier-2027", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Google Tag Manager", "Tealium", "Piano Analytics", "Amplitude", "BigQuery", "Looker Studio"],
      pourquoi: "Ouvert en alternance comme en stage : du plan de taggage à la recette des données, on y apprend le tracking web et app de bout en bout, sur plusieurs clients.",
      pourquoiEn: "Open as a work-study contract or an internship: from tagging plan to data QA, you learn web and app tracking end to end, across several clients.",
      slug: "converteo-consultant-web-analytics",
      avis: ["L'offre est ouverte en stage de six mois comme en alternance, ce qui permet de la viser selon votre situation d'école. Le programme va du plan de taggage à la recette des données, sur le web comme sur les applications.","Un cabinet, c'est surtout de la variété : plusieurs clients, plusieurs stacks (Tealium, Piano Analytics et Amplitude font partie des outils cités). On apprend vite parce qu'on voit beaucoup de configurations, bonnes et mauvaises. En contrepartie, le rythme est soutenu et la qualité des livrables est jugée."],
      avisEn: ["The offer is open as a six-month internship or as a work-study contract, so you can aim for it whichever way your school works. The scope runs from the tagging plan to data QA, on web and on apps.","A consultancy is above all variety: several clients, several stacks (Tealium, Piano Analytics and Amplitude are among the tools named). You learn fast because you see many setups, good and bad. In return the pace is brisk and the quality of your deliverables is judged."],
      conseil: "Un cabinet regarde votre capacité à expliquer. Entraînez-vous à présenter une analyse en deux minutes à quelqu'un qui n'y connaît rien.", conseilEn: "A consultancy looks at your ability to explain. Practise presenting an analysis in two minutes to someone who knows nothing about it.",
      relais: [{"slug":"salome-klein","fr":"Salomé se voit plus tard en cabinet de conseil ou en agence, pour diffuser la culture data CRO auprès de clients variés. Un premier passage par un cabinet est une façon d'y arriver.","en":"Salomé sees herself later in a consultancy or agency, spreading a CRO data culture across varied clients. A first stint in a consultancy is one way to get there."}]
    },
    {
      titre: "Consultant(e) E-commerce – Stage de fin d'études",
      entreprise: "Converteo", domaine: "converteo.com", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=1eaa56e999a44311", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Un cabinet data & e-commerce : plusieurs clients, plusieurs sites, de quoi voir beaucoup de cas en peu de temps.",
      pourquoiEn: "A data & e-commerce consultancy: several clients, several websites, a way to see a lot of cases in a short time.",
      slug: "converteo-consultant-ecommerce",
      avis: ["Ce stage de fin d'études est plus généraliste que l'offre web analytics du même cabinet : on regarde l'e-commerce dans son ensemble, avec plusieurs clients et plusieurs sites. L'annonce que nous avons vue reste courte sur le détail des missions, lisez-la en entier avant de candidater.","L'intérêt est la variété des cas. En quelques mois dans un cabinet, on voit plus de sites que pendant des années dans une seule entreprise, et on apprend à repérer les mêmes problèmes d'un site à l'autre : fiches produit, panier, paiement, promotions."],
      avisEn: ["This end-of-studies internship is more generalist than the same firm's web analytics offer: you look at e-commerce as a whole, across several clients and websites. The listing we saw is short on the detail of the missions, so read it in full before applying.","The interest is the variety of cases. In a few months at a consultancy you see more sites than in years at a single company, and you learn to spot the same problems from one site to the next: product pages, basket, payment, promotions."],
      conseil: "Un stage de fin d'études en cabinet se prépare comme une candidature de premier emploi : un sujet de mémoire ou un projet qui montre votre regard sur l'e-commerce.", conseilEn: "An end-of-studies internship at a consultancy is prepared like a first-job application: a thesis topic or a project that shows how you look at e-commerce.",
      relais: [{"slug":"antoine-vera","fr":"Antoine défend un CRO de couture : plus on sait dialoguer avec les développeurs, les analystes et les équipes contenu, plus on devient utile. Le travail en cabinet oblige à ce grand écart.","en":"Antoine champions CRO as a tailoring craft: the better you can talk with developers, analysts and content teams, the more useful you become. Consultancy work forces exactly that stretch."}]
    },
    {
      titre: "Stage Product design / UX design",
      entreprise: "Bouygues Telecom", domaine: "bouyguestelecom.fr", metier: "ux", contrat: "stage", ville: "Meudon (92)",
      lien: "https://fr.indeed.com/viewjob?jk=5a0f5ea646bc6457", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Pour celles et ceux qui viennent du design : comprendre l'utilisateur avant de tester, c'est le cœur d'un bon CRO.",
      pourquoiEn: "For those coming from design: understanding the user before testing is the heart of good CRO.",
      slug: "bouygues-telecom-stage-product-ux-design",
      avis: ["Pour celles et ceux qui viennent du design, c'est l'entrée par l'autre bout : comprendre l'utilisateur avant de tester. Un bon test A/B commence par une bonne hypothèse, et une bonne hypothèse vient souvent d'une observation, d'un entretien ou d'une maquette qui a fait réagir.","Dans les télécoms, les parcours sont complexes (offres, options, engagement, souscription) et la clarté fait vendre. Un stage de product et UX design apprend à rendre lisible quelque chose de compliqué, ce que le CRO cherche aussi à faire."],
      avisEn: ["For those coming from design, this is the entry from the other end: understanding the user before testing. A good A/B test starts with a good hypothesis, and a good hypothesis often comes from an observation, an interview or a mock-up that made people react.","In telecoms, journeys are complex (plans, options, commitment, sign-up) and clarity sells. A product and UX design internship teaches you to make something complicated readable, which is also what CRO tries to do."],
      conseil: "Apportez un portfolio qui montre le raisonnement, pas seulement les écrans : problème, hypothèse, test avec des utilisateurs, ce que vous avez changé ensuite.", conseilEn: "Bring a portfolio that shows the reasoning, not just the screens: problem, hypothesis, user test, what you changed afterwards.",
      relais: [{"slug":"salome-klein","fr":"Salomé a découvert l'UX/UI et la notion de parcours utilisateur à l'école, avant de glisser vers la data. Son conseil : ne pas rester enfermé dans les chiffres, écouter des appels clients et regarder des session replays.","en":"Salomé discovered UX/UI and the idea of a user journey at school, before moving towards data. Her advice: do not stay locked in the numbers, listen to customer calls and watch session replays."}]
    },
    {
      titre: "Stage Bac+5 – Sciences cognitives / Ergonomie",
      entreprise: "Renault Group", domaine: "renaultgroup.com", metier: "ux", contrat: "stage", ville: "Guyancourt (78)",
      lien: "https://fr.indeed.com/viewjob?jk=a00979e7db856836", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Les sciences cognitives appliquées aux interfaces : la psychologie derrière chaque friction, chaque clic, chaque hésitation.",
      pourquoiEn: "Cognitive science applied to interfaces: the psychology behind every friction, every click, every hesitation.",
      slug: "renault-group-stage-sciences-cognitives-ergonomie",
      avis: ["Un stage rare, orienté sciences cognitives et ergonomie : la psychologie derrière chaque friction, chaque clic, chaque hésitation. Ce n'est pas un poste CRO au sens strict, mais si vous venez de psychologie cognitive, d'ergonomie ou de facteurs humains, c'est une porte vers le CRO que peu de gens regardent.","Les équipes e-commerce manquent souvent de profils capables d'expliquer pourquoi un utilisateur bloque. Les chiffres disent où, la psychologie aide à dire pourquoi. C'est la complémentarité entre quantitatif et qualitatif que décrivent nos talents."],
      avisEn: ["A rare internship in cognitive science and ergonomics: the psychology behind every friction, every click, every hesitation. It is not a CRO role in the strict sense, but if you come from cognitive psychology, ergonomics or human factors, it is a door into CRO that few people look at.","E-commerce teams often lack people who can explain why a user gets stuck. Numbers say where, psychology helps say why. It is the quantitative and qualitative complementarity our talents describe."],
      conseil: "Reliez votre formation à un cas web : un biais cognitif (ancrage, rareté, aversion à la perte) que vous avez repéré sur un site, et la modification que vous testeriez.", conseilEn: "Link your studies to a web case: a cognitive bias (anchoring, scarcity, loss aversion) you spotted on a site, and the change you would test.",
      relais: [{"slug":"caroline-hoang","fr":"Caroline parle de personnalisation émotionnelle : deux personnes sur la même page peuvent avoir des besoins psychologiques très différents. C'est un terrain où les sciences cognitives ont beaucoup à apporter.","en":"Caroline talks about emotional personalisation: two people on the same page can have very different psychological needs. It is a field where cognitive science has a lot to offer."}]
    },
    {
      titre: "Stagiaire UI/UX Designer",
      entreprise: "Printemps", domaine: "printemps.com", metier: "ux", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.glassdoor.fr/job-listing/stagiaire-ui-ux-designer-hf-printemps-JV_IC2881970_KO0,27_KE28,37.htm?jl=1010279190611", vuLe: "2026-10-26", expire: "2026-12-07",
      outils: ["Figma"],
      pourquoi: "De l'UX appliquée à quatre sites e-commerce d'un grand magasin : analyse de parcours, maquettes, prototypes et accessibilité, au plus près de la conversion.",
      pourquoiEn: "UX applied to four e-commerce sites of a department store: journey analysis, mock-ups, prototypes and accessibility, right next to conversion.",
      slug: "printemps-stagiaire-ui-ux-designer",
      avis: ["Quatre sites e-commerce pour un grand magasin : de quoi faire de l'analyse de parcours, des maquettes, des prototypes et de l'accessibilité sur un trafic réel. Pour un stage UI/UX, c'est proche de la conversion, ce qui n'est pas toujours le cas.","L'accessibilité mentionnée dans l'annonce est un bon signal : elle améliore l'expérience de tous les visiteurs et devient une obligation pour de nombreux sites. Savoir utiliser Figma est le minimum, la capacité à justifier un choix par une observation fera la différence."],
      avisEn: ["Four e-commerce sites for a department store: room for journey analysis, mock-ups, prototypes and accessibility on real traffic. For a UI/UX internship, that sits close to conversion, which is not always the case.","The accessibility mentioned in the listing is a good sign: it improves the experience for every visitor and is becoming an obligation for many sites. Knowing Figma is the minimum; being able to justify a choice with an observation will make the difference."],
      conseil: "Préparez une critique argumentée d'un parcours de mode en ligne (fiche produit, panier), avec une maquette de correction. C'est un excellent support d'entretien.", conseilEn: "Prepare a reasoned critique of an online fashion journey (product page, basket) with a mock-up of your fix. It makes an excellent interview prop.",
      relais: [{"slug":"salome-klein","fr":"Salomé conseille d'aller parler aux équipes support et de regarder des session replays : la data donne la piste, l'empathie donne la solution. Un designer qui fait la même chose propose de meilleures maquettes.","en":"Salomé advises talking to support teams and watching session replays: data gives the lead, empathy gives the solution. A designer who does the same produces better mock-ups."}]
    },
    {
      titre: "Intern E-business Performance Analyst (janvier 2027)",
      entreprise: "Balenciaga", domaine: "balenciaga.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=319ae68aa8549f2a", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Google Analytics", "Contentsquare", "Tableau", "Power BI", "Looker Studio"],
      pourquoi: "Suivi des KPI e-commerce, tableaux de bord sur le parcours client et analyses ponctuelles pour plusieurs équipes : un poste d'analyse de la performance en ligne, dans le luxe.",
      pourquoiEn: "E-commerce KPI tracking, customer-journey dashboards and ad hoc analyses for several teams: an online performance analysis role, in luxury.",
      slug: "balenciaga-ebusiness-performance-analyst",
      avis: ["Suivi des KPI e-commerce, dashboards sur le parcours client, analyses ponctuelles pour plusieurs équipes : c'est un poste d'analyse de la performance en ligne, à la croisée du business et de la donnée. Contentsquare figure dans les outils cités, ce qui ouvre aussi à l'analyse comportementale.","Le point fort est le contact avec plusieurs équipes. Un analyste qui sait restituer un chiffre à un merchandiser, à un responsable marketing et à un chef de projet apprend à rendre la donnée utile, pas seulement correcte. Point d'attention : les analyses ponctuelles peuvent vite virer au reporting. Demandez en entretien la part d'analyse réelle."],
      avisEn: ["E-commerce KPI tracking, customer-journey dashboards, ad hoc analyses for several teams: an online performance analysis role, at the crossroads of business and data. Contentsquare appears among the tools named, which also opens the door to behavioural analysis.","The strength is contact with several teams. An analyst who can present a number to a merchandiser, a marketing lead and a project manager learns to make data useful, not just correct. One thing to watch: ad hoc analyses can quickly turn into reporting. Ask in the interview how much real analysis the role involves."],
      conseil: "Montrez un dashboard que vous avez construit (Looker Studio fait très bien l'affaire) et expliquez la décision qu'il aide à prendre.", conseilEn: "Show a dashboard you built (Looker Studio does the job nicely) and explain the decision it helps make.",
      relais: [{"slug":"salome-klein","fr":"Salomé a eu son déclic en stage chez Orange, en pilotant la refonte d'un projet de dashboards, du cadrage des besoins métiers à l'intégration des données. C'est un bon exemple de ce qu'un stage analytics peut offrir.","en":"Salomé had her breakthrough during an internship at Orange, leading the rebuild of a dashboard project from scoping business needs to integrating the data. It is a good example of what an analytics internship can offer."}]
    },
    {
      titre: "Stage Data Analytics eCommerce",
      entreprise: "Kering", domaine: "kering.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.wizbii.com/company/kering/job/kering-stage-data-analytics-ecommerce", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["SQL", "Python"],
      pourquoi: "Croiser ventes et tracking web, analyser les parcours pour repérer les frictions et mesurer l'impact des évolutions des sites : un stage directement relié à la conversion.",
      pourquoiEn: "Combining sales and web tracking data, analysing journeys to spot frictions and measuring the impact of site changes: an internship directly tied to conversion.",
      slug: "kering-stage-data-analytics-ecommerce",
      avis: ["Croiser ventes et tracking web, repérer les frictions dans les parcours, mesurer l'effet des évolutions de site : le stage relie la donnée à la conversion, avec SQL et Python plutôt que des outils clés en main. Il faut être à l'aise avec le code, mais c'est ce qui donne de l'autonomie.","À lire avec le stage CRO du même groupe : l'un teste, l'autre mesure. Les deux équipes ont besoin l'une de l'autre, et un analyste qui comprend le CRO devient un partenaire précieux."],
      avisEn: ["Combining sales and web tracking data, spotting friction in journeys, measuring the impact of site changes: the internship ties data to conversion, with SQL and Python rather than ready-made tools. You need to be comfortable with code, but that is what gives you autonomy.","Read it alongside the CRO internship at the same group: one tests, the other measures. Both teams need each other, and an analyst who understands CRO becomes a valuable partner."],
      conseil: "Ayez un petit projet SQL ou Python sur des données e-commerce publiques (un jeu de données de commandes, par exemple) à présenter en entretien.", conseilEn: "Have a small SQL or Python project on public e-commerce data (an orders dataset, for example) ready to present in the interview.",
      relais: [{"slug":"antoine-vera","fr":"Antoine conseille de ne pas avoir peur des sujets techniques annexes, car le CRO touche à tout. Pour un analyste, être à l'aise avec le code fait partie de ces sujets.","en":"Antoine advises not to be afraid of side technical topics, because CRO touches everything. For an analyst, being comfortable with code is one of them."}]
    },
    {
      titre: "Stage Business Analyste Web",
      entreprise: "Nespresso", domaine: "nespresso.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.engagement-jeunes.com/fr/detail-offre/39694549/stage-nestle-operational-services-worldwide-sa-business-analyste-web-f-h.html", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Google Analytics 4", "Adobe Analytics", "Contentsquare", "Looker Studio", "Power BI"],
      pourquoi: "Performance du site et de l'app, études sur les parcours clients et évolution du tracking : le quotidien d'un web analyst, de la mesure à l'analyse.",
      pourquoiEn: "Site and app performance, customer-journey studies and tracking evolution: the day-to-day of a web analyst, from measurement to analysis.",
      slug: "nespresso-stage-business-analyste-web",
      avis: ["Le quotidien d'un web analyst : performance du site et de l'app, études de parcours, évolution du tracking. Trois outils d'analytics sont cités (Google Analytics 4, Adobe Analytics, Contentsquare), ce qui est généreux pour un stage et permet de comparer des approches.","Une marque qui vend en direct en ligne a tout intérêt à comprendre ses parcours : l'analyse a un client interne identifié, ce qui donne du sens au travail. L'annonce passe par Nestlé Operational Services Worldwide, vérifiez le rattachement exact de l'équipe avant de candidater."],
      avisEn: ["The day-to-day of a web analyst: site and app performance, journey studies, tracking evolution. Three analytics tools are named (Google Analytics 4, Adobe Analytics, Contentsquare), which is generous for an internship and lets you compare approaches.","A brand that sells directly online has every reason to understand its journeys: the analysis has an identified internal client, which gives the work meaning. The listing goes through Nestlé Operational Services Worldwide, so check which team the role really belongs to before applying."],
      conseil: "Si vous n'avez pas utilisé Adobe Analytics, ce n'est pas rédhibitoire : montrez que vous maîtrisez les concepts (sessions, événements, segments) sur Google Analytics 4.", conseilEn: "If you have not used Adobe Analytics, that is not a deal-breaker: show that you master the concepts (sessions, events, segments) on Google Analytics 4.",
      relais: [{"slug":"salome-klein","fr":"Salomé cite le RPV comme KPI préféré et le taux d'engagement UX comme le plus négligé. De bons réflexes à avoir pour un premier poste d'analyse.","en":"Salomé names RPV as her favourite KPI and UX engagement rate as the most overlooked. Good habits to have for a first analysis role."}]
    },
    {
      titre: "Assistant(e) E-Commerce – Stage (janvier 2027)",
      entreprise: "Oh My Cream", domaine: "ohmycream.com", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://www.welcometothejungle.com/fr/companies/oh-my-cream/jobs/e-merchandising-internship-native-en_paris", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Shopify"],
      pourquoi: "Merchandising hebdomadaire des sites français et anglais, mise en ligne des nouveautés et suivi des pages produits : la gestion concrète d'un site e-commerce.",
      pourquoiEn: "Weekly merchandising of the French and English sites, new product launches and product page upkeep: hands-on e-commerce site management.",
      slug: "oh-my-cream-assistant-ecommerce",
      avis: ["Merchandising hebdomadaire des sites français et anglais, mise en ligne des nouveautés, suivi des pages produits : la gestion concrète d'un site, sur Shopify. Il n'est pas question de CRO ici, et c'est ce qui rend l'offre intéressante : on apprend ce qui fait fonctionner un site avant de chercher à l'optimiser.","Une structure à taille humaine permet de toucher à beaucoup de choses, et le site existe en deux langues, ce qui donne une première expérience d'e-commerce international. L'annonce semble viser un profil à l'aise en anglais, vérifiez-le avant de candidater."],
      avisEn: ["Weekly merchandising of the French and English sites, new product launches, product page upkeep: hands-on site management, on Shopify. CRO is not mentioned, and that is what makes the offer interesting: you learn what makes a site work before trying to optimise it.","A human-sized company lets you touch many things, and the site exists in two languages, which gives a first taste of international e-commerce. The listing seems to look for someone comfortable in English, so check that before applying."],
      conseil: "Montrez votre goût du détail : titres, visuels, descriptions, cohérence d'une fiche à l'autre. Un petit site Shopify personnel ou un projet d'école bien fini vaut mieux qu'un CV générique.", conseilEn: "Show your eye for detail: titles, visuals, descriptions, consistency from one page to the next. A small personal Shopify store or a well-finished school project beats a generic CV.",
      relais: [{"slug":"antoine-vera","fr":"Antoine a fait ses armes dans le retail avant le CRO. Il explique que c'est en voyant le poids du parcours client digital qu'il a compris qu'une friction supprimée peut peser plus qu'une campagne.","en":"Antoine cut his teeth in retail before CRO. He explains that seeing the weight of the digital customer journey made him realise that one removed friction can matter more than a campaign."}]
    },
    {
      titre: "Assistant·e Chef·fe de projets digitaux – Stage (janvier 2027)",
      entreprise: "Maison 123", domaine: "maison123.com", metier: "ecommerce", contrat: "stage", ville: "Siège Maison 123",
      lien: "https://career.maison123.com/jobs/8509600-assistant-e-chef-fe-de-projets-digitaux-stage-janvier-2027", vuLe: "2026-11-02", expire: "2026-12-14",
      pourquoi: "Refonte de la plateforme, nouveaux modes de paiement et de livraison, site de seconde main et suivi des KPI : une vue complète des évolutions d'un site e-commerce.",
      pourquoiEn: "Platform redesign, new payment and delivery options, a second-hand site and KPI tracking: a complete view of how an e-commerce site evolves.",
      slug: "maison-123-assistant-chef-projets-digitaux",
      avis: ["Refonte de la plateforme, nouveaux modes de paiement et de livraison, site de seconde main, suivi des KPI : c'est un stage de gestion de projet e-commerce, avec une vue d'ensemble rare. On y comprend comment un site évolue, avec les arbitrages entre technique, business et expérience.","Le paiement et la livraison comptent parmi les leviers de conversion les plus puissants d'un site. Participer à leur évolution, c'est se placer à la source des tests que feront ensuite les équipes CRO. Chef de projet digital est aussi une voie directe vers un rôle de CRO manager."],
      avisEn: ["Platform redesign, new payment and delivery options, a second-hand site, KPI tracking: an e-commerce project management internship with a rare overview. You see how a site evolves, with the trade-offs between tech, business and experience.","Payment and delivery are among the most powerful conversion levers on a site. Taking part in their evolution puts you at the source of the tests CRO teams will run afterwards. Digital project manager is also a direct path to a CRO manager role."],
      conseil: "Préparez un exemple de projet que vous avez mené (associatif, scolaire, personnel), avec un calendrier, des contraintes et un résultat. Un recruteur projet cherche d'abord de l'organisation.", conseilEn: "Prepare an example of a project you led (volunteering, school, personal), with a timeline, constraints and a result. A project recruiter looks first for organisation.",
      relais: [{"slug":"antoine-vera","fr":"Antoine est E-Commerce & CRO Project Manager. Pour lui, plus on sait dialoguer avec les développeurs, les analystes et les équipes contenu, plus on devient utile : c'est le cœur d'un poste de chef de projet digital.","en":"Antoine is an E-Commerce & CRO Project Manager. For him, the better you can talk with developers, analysts and content teams, the more useful you become: that is the heart of a digital project manager role."}]
    },
    {
      titre: "Stage Business Analyst E-Commerce (janvier 2027)",
      entreprise: "Galeries Lafayette", domaine: "galerieslafayette.com", metier: "ecommerce", contrat: "stage", ville: "Siège Galeries Lafayette",
      lien: "https://carrieres.groupegalerieslafayette.com/jobs/8295690-stage-business-analyst-e-commerce-f-h", vuLe: "2026-11-02", expire: "2026-12-14",
      outils: ["Google Analytics", "Power BI"],
      pourquoi: "Suivi quotidien de la performance du site, analyse des écarts aux objectifs et propositions d'amélioration : un stage où l'analyse débouche sur des actions.",
      pourquoiEn: "Daily site performance monitoring, analysis of gaps against targets and improvement proposals: an internship where analysis leads to action.",
      slug: "galeries-lafayette-business-analyst-ecommerce",
      avis: ["Suivi quotidien de la performance du site, analyse des écarts aux objectifs, propositions d'amélioration : le stage s'arrête rarement au constat. C'est ce qui plaît dans cette offre, l'analyse doit déboucher sur des recommandations, donc sur des décisions.","Pour un grand magasin, la performance d'un site se lit au jour le jour, avec des temps forts commerciaux (soldes, Black Friday, Noël) qui déforment tout. Savoir lire un écart à l'objectif en tenant compte du calendrier commercial est une compétence très recherchée."],
      avisEn: ["Daily site performance monitoring, analysis of gaps against targets, improvement proposals: the internship rarely stops at the observation. That is what is appealing here: the analysis has to lead to recommendations, so to decisions.","For a department store, site performance is read day by day, with commercial peaks (sales, Black Friday, Christmas) that distort everything. Reading a gap against target while accounting for the retail calendar is a highly sought-after skill."],
      conseil: "Entraînez-vous à écrire une recommandation en trois lignes : constat, cause probable, action proposée. C'est le format que ce type de poste attend.", conseilEn: "Practise writing a recommendation in three lines: observation, probable cause, proposed action. It is the format this kind of role expects.",
      relais: [{"slug":"salome-klein","fr":"Salomé s'impose une règle avant chaque test : croiser plusieurs sources de données, poser une vraie hypothèse, prioriser. La même rigueur vaut pour une recommandation d'analyste.","en":"Salomé sets herself a rule before every test: cross several data sources, state a real hypothesis, prioritise. The same rigour applies to an analyst's recommendation."}]
    },
    {
      titre: "Data Analyst Intern (janvier 2027)",
      entreprise: "Back Market", domaine: "backmarket.com", metier: "analytics", contrat: "stage", ville: "Barcelone (Espagne)",
      lien: "https://www.welcometothejungle.com/fr/companies/back-market/jobs/data-analyst-intern_barcelona", vuLe: "2026-11-05", expire: "2026-12-17",
      outils: ["SQL", "Google Analytics", "Amplitude"],
      pourquoi: "Dans l'équipe data Care & Shipping d'une marketplace, des analyses pour améliorer les processus et la satisfaction client, avec des recommandations présentées aux équipes métiers.",
      pourquoiEn: "In a marketplace's Care & Shipping data team, analyses to improve processes and customer satisfaction, with recommendations presented to business teams.",
      slug: "back-market-data-analyst-intern",
      avis: ["Une offre à l'international : le stage est à Barcelone, dans l'équipe data Care & Shipping d'une marketplace. Le sujet n'est pas le tunnel d'achat mais ce qui se passe après : service client, livraison, satisfaction. L'angle est moins courant et il apprend que la conversion ne s'arrête pas au paiement.","Les recommandations sont présentées aux équipes métiers, ce qui entraîne à raconter une analyse. Avec SQL, Google Analytics et Amplitude, le socle technique est solide. Prévoyez aussi la dimension pratique d'un stage à l'étranger : langue de travail, logement, convention de stage."],
      avisEn: ["An international offer: the internship is in Barcelona, in the Care & Shipping data team of a marketplace. The topic is not the purchase funnel but what happens afterwards: customer care, delivery, satisfaction. The angle is less common and teaches that conversion does not end at payment.","Recommendations are presented to business teams, which trains you to tell the story of an analysis. With SQL, Google Analytics and Amplitude, the technical foundation is solid. Also plan for the practical side of an internship abroad: working language, housing, internship agreement."],
      conseil: "Une candidature en anglais soignée est probablement un prérequis pour une équipe internationale. Faites-la relire.", conseilEn: "A polished application in English is probably a prerequisite for an international team. Have it proofread.",
      relais: [{"slug":"salome-klein","fr":"Salomé estime que si une optimisation détruit la valeur client, dégrade l'expérience globale ou génère des retours, elle est perdante. Une équipe Care & Shipping est l'endroit où l'on voit cet effet.","en":"Salomé says that if an optimisation destroys customer value, harms the overall experience or generates returns, it is a losing one. A Care & Shipping team is where you see that effect."}]
    },
    {
      titre: "Stagiaire SEO & CRO – Acquisition digitale",
      entreprise: "Skill and You", domaine: "skillandyou.com", metier: "cro", contrat: "stage", ville: "Levallois-Perret (92)",
      lien: "https://fr.indeed.com/viewjob?jk=aa18851c8765b563", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Un stage qui relie acquisition et conversion : idéal pour comprendre tout le funnel, du trafic à la vente.",
      pourquoiEn: "An internship that links acquisition and conversion: ideal to understand the whole funnel, from traffic to sale.",
      slug: "skill-and-you-stagiaire-seo-cro",
      avis: ["Un stage qui relie acquisition et conversion, SEO d'un côté, CRO de l'autre. Le duo est logique : du trafic qui arrive sur un site qui convertit mal est du trafic gaspillé. Il permet de comprendre le funnel entier, du premier clic à la vente.","Vérifiez dans l'annonce le type de site sur lequel vous interviendrez. Que les parcours soient une vente directe, une inscription ou une prise de contact, le travail de CRO change beaucoup."],
      avisEn: ["An internship that links acquisition and conversion, SEO on one side, CRO on the other. The pairing is logical: traffic landing on a site that converts badly is wasted traffic. It lets you understand the whole funnel, from first click to sale.","Check in the listing which type of site you would work on. Whether the journeys are a direct sale, a sign-up or a contact request, the CRO work changes a lot."],
      conseil: "Mentionnez un résultat SEO ou CRO chiffré, même modeste, obtenu sur un projet personnel. Un chiffre vaut mieux qu'un adjectif.", conseilEn: "Mention a SEO or CRO result with a number, even a modest one, from a personal project. A number beats an adjective.",
      relais: [{"slug":"antoine-vera","fr":"Antoine raconte avoir compris que le vrai levier de croissance ne se jouait plus seulement sur le produit ou le prix, mais sur l'expérience et l'optimisation continue du tunnel. Un stage SEO et CRO donne cette vision complète.","en":"Antoine says he realised the real growth lever was no longer only the product or the price, but the experience and the continuous optimisation of the funnel. An SEO and CRO internship gives that complete view."}]
    },
    {
      titre: "Internship – Support on Conversational Analytics (janvier 2027)",
      entreprise: "LVMH", domaine: "lvmh.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=9ce710845ed466da", vuLe: "2026-10-16", expire: "2026-12-15",
      pourquoi: "L'analytics appliquée aux conversations clients dans le luxe : un sujet d'avenir, là où chaque détail de l'expérience compte.",
      pourquoiEn: "Analytics applied to customer conversations in luxury: a forward-looking topic, where every detail of the experience matters.",
      slug: "lvmh-conversational-analytics",
      avis: ["L'analytics appliquée aux conversations clients : l'annonce reste courte sur le détail, mais le sujet est d'avenir. Les conversations contiennent ce que les parcours ne disent pas, c'est-à-dire les raisons.","Dans le luxe, l'expérience client se joue sur des détails et la relation passe souvent par une personne. Faire parler ces échanges avec de la donnée, c'est du qualitatif à grande échelle, une compétence rare et précieuse pour un futur CRO."],
      avisEn: ["Analytics applied to customer conversations: the listing is short on detail, but the topic looks to the future. Conversations contain what journeys do not tell you, namely the reasons.","In luxury, customer experience is played out in details and the relationship often goes through a person. Making those exchanges speak with data is qualitative research at scale, a rare and valuable skill for a future CRO."],
      conseil: "Montrez votre curiosité pour le qualitatif : une analyse de verbatims, d'avis clients ou de questions de support que vous avez réalisée, même sur un petit échantillon.", conseilEn: "Show your curiosity for qualitative work: an analysis of verbatims, customer reviews or support questions you carried out, even on a small sample.",
      relais: [{"slug":"caroline-hoang","fr":"Caroline cite LVMH parmi les employeurs qui l'attirent : dans le luxe, dit-elle, le CRO a un rôle énorme à jouer parce que chaque détail de l'expérience compte.","en":"Caroline names LVMH among the employers that attract her: in luxury, she says, CRO has a huge role to play because every detail of the experience counts."},{"slug":"salome-klein","fr":"Salomé voit dans l'IA générative un booster pour analyser de la donnée qualitative à grande échelle sans perdre en finesse. C'est exactement le terrain de cette offre.","en":"Salomé sees generative AI as a booster for analysing qualitative data at scale without losing nuance. That is exactly the ground of this offer."}]
    },
    {
      titre: "Internship Product Data Analyst",
      entreprise: "Cheerz", domaine: "cheerz.com", metier: "analytics", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=6f7447e622b5c514", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "De la data produit chez un pure player e-commerce : le terrain de jeu idéal pour apprendre à transformer des chiffres en hypothèses.",
      pourquoiEn: "Product data at an e-commerce pure player: the perfect playground to learn how to turn numbers into hypotheses.",
      slug: "cheerz-product-data-analyst",
      avis: ["De la data produit chez un pure player e-commerce : on y apprend à transformer des chiffres en hypothèses, le geste central du CRO. L'intitulé dit « produit » plutôt que « web », donc l'analyse porte probablement sur l'usage et les parcours, à confirmer dans l'annonce.","Cheerz vit de photos imprimées, et le produit est aussi le parcours de création : choisir, personnaliser, commander. C'est un bon terrain pour comprendre comment les utilisateurs se comportent dans un tunnel long."],
      avisEn: ["Product data at an e-commerce pure player: you learn to turn numbers into hypotheses, the central gesture of CRO. The title says « product » rather than « web », so the analysis probably focuses on usage and journeys, to be confirmed in the listing.","Cheerz lives on printed photos, and the product is also the creation journey: choose, personalise, order. It is a good place to learn how users behave in a long funnel."],
      conseil: "Apprenez à formuler une hypothèse en une phrase : « si on change X, alors Y, parce que Z ». C'est le langage commun entre data, produit et CRO.", conseilEn: "Learn to state a hypothesis in one sentence: « if we change X, then Y, because Z ». It is the common language between data, product and CRO.",
      relais: [{"slug":"salome-klein","fr":"Salomé raconte avoir voulu enchaîner les tests au début : beaucoup sont sortis neutres, sans rien apprendre. Aujourd'hui, aucun test ne part sans hypothèse et sans priorisation.","en":"Salomé says she wanted to chain tests early on: many came out neutral and taught nothing. Today no test goes out without a hypothesis and prioritisation."}]
    },
    {
      titre: "Stage – Data Analyst et Tracking",
      entreprise: "Ekstend", metier: "analytics", contrat: "stage", ville: "Marseille (13)",
      lien: "https://fr.indeed.com/viewjob?jk=304aa3d45e79d35a", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le tracking, c'est la compétence que nos talents disent avoir apprise sur le tas. Ici, elle est au programme dès le stage.",
      pourquoiEn: "Tracking is the skill our talents say they learned on the job. Here, it's part of the internship from day one.",
      slug: "ekstend-data-analyst-tracking",
      avis: ["Le tracking est la compétence que nos talents disent avoir apprise sur le tas. Ici, elle est au programme dès le stage : une bonne façon de ne pas la découvrir par surprise dans un premier poste.","L'offre est à Marseille, une option à regarder si vous êtes mobile et que vous ne voulez pas vous limiter à Paris. Nous connaissons peu l'entreprise : regardez son site, ses clients et le détail de l'annonce avant de candidater."],
      avisEn: ["Tracking is the skill our talents say they learned on the job. Here it is on the programme from the internship onwards: a good way not to discover it by surprise in a first job.","The offer is in Marseille, an option to consider if you are mobile and do not want to limit yourself to Paris. We know little about the company: look at its website, its clients and the detail of the listing before applying."],
      conseil: "Préparez un mini-exercice : décrire le plan de tracking (événements, paramètres) d'un parcours d'achat que vous connaissez. C'est concret et facile à montrer.", conseilEn: "Prepare a mini exercise: describe the tracking plan (events, parameters) of a purchase journey you know. It is concrete and easy to show.",
      relais: [{"slug":"salome-klein","fr":"Salomé pensait se concentrer sur l'analyse et la stratégie en sortant d'école. Savoir paramétrer le tracking et coder ses tests est devenu son plus grand levier d'autonomie.","en":"Salomé expected to focus on analysis and strategy when leaving school. Knowing how to set up tracking and code her own tests became her biggest lever for autonomy."}]
    },
    {
      titre: "Stage Business Analyst / PPO e-commerce",
      entreprise: "VISEO", domaine: "viseo.com", metier: "ecommerce", contrat: "stage", ville: "Boulogne-Billancourt (92)",
      lien: "https://fr.indeed.com/viewjob?jk=700324e35089060a", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Côté produit e-commerce : apprendre à cadrer un besoin et à dialoguer avec les développeurs, deux réflexes clés du CRO.",
      pourquoiEn: "On the e-commerce product side: learning to scope a need and to talk with developers, two key CRO reflexes.",
      slug: "viseo-business-analyst-ppo-ecommerce",
      avis: ["PPO signifie que le stage peut déboucher sur une embauche : il se vit comme une période d'essai, ce qui change la façon d'y entrer. Côté contenu, c'est du produit e-commerce : cadrer un besoin, le formuler pour les équipes techniques, suivre ce qui est livré.","Ce sont deux réflexes de CRO : un test A/B est d'abord un besoin à cadrer, puis une demande à expliquer à un développeur. VISEO étant une société de conseil et de technologie, vous verrez sans doute plusieurs projets, ce qui élargit le regard."],
      avisEn: ["PPO means the internship can lead to a job offer: it works like a trial period, which changes how you approach it. Content-wise it is e-commerce product work: scoping a need, wording it for technical teams, following what gets delivered.","Those are two CRO reflexes: an A/B test is first a need to scope, then a request to explain to a developer. VISEO being a consulting and technology firm, you will probably see several projects, which widens your view."],
      conseil: "Un PPO se prépare comme un recrutement : demandez en entretien qui vous accompagnera au quotidien et comment la décision d'embauche est prise à la fin du stage.", conseilEn: "A PPO is prepared like a hiring process: ask in the interview who will support you day to day and how the hiring decision is made at the end of the internship.",
      relais: [{"slug":"salome-klein","fr":"Salomé affirme que le CRO est un sport d'équipe : sans designers, développeurs et équipes produit embarqués, les insights restent au placard.","en":"Salomé says CRO is a team sport: without designers, developers and product teams on board, insights stay in the drawer."}]
    },
    {
      titre: "Stage Coordinateur e-commerce & animation commerciale B to C",
      entreprise: "Nespresso", domaine: "nespresso.com", metier: "ecommerce", contrat: "stage", ville: "Paris (75)",
      lien: "https://fr.indeed.com/viewjob?jk=e6eb150846231995", vuLe: "2026-10-16", expire: "2026-11-30",
      pourquoi: "Le quotidien d'un site e-commerce de marque : animation, mises en avant, performance. La base avant d'optimiser.",
      pourquoiEn: "The day-to-day of a brand e-commerce site: merchandising, promotions, performance. The basics before optimising.",
      slug: "nespresso-coordinateur-ecommerce",
      avis: ["Animation, mises en avant, performance : le quotidien d'un site e-commerce de marque, côté opérations. C'est la base avant d'optimiser : on apprend ce qui se trouve sur une page d'accueil, pourquoi, et à quel rythme le contenu change.","Les temps forts commerciaux rythment le calendrier. Un coordinateur apprend à planifier, à tenir des délais et à lire le résultat d'une opération. Ce sont des réflexes précieux pour un futur CRO, parce que ce sont les mêmes équipes qui mettent en ligne les tests."],
      avisEn: ["Merchandising, promotions, performance: the day-to-day of a brand e-commerce site, on the operations side. It is the foundation before optimising: you learn what sits on a homepage, why, and how often the content changes.","Commercial peaks set the calendar. A coordinator learns to plan, meet deadlines and read the outcome of an operation. These are valuable reflexes for a future CRO, because the same teams put the tests live."],
      conseil: "Montrez votre sens de l'organisation et votre goût pour les chiffres : un exemple d'opération que vous avez planifiée et mesurée (événement associatif, boutique en ligne personnelle).", conseilEn: "Show your sense of organisation and your taste for numbers: an example of an operation you planned and measured (a volunteer event, a personal online store).",
      relais: [{"slug":"antoine-vera","fr":"Antoine a travaillé dans le retail sportif avant de basculer vers le CRO. La connaissance du terrain commercial reste, pour lui, un atout dans le métier.","en":"Antoine worked in sports retail before moving to CRO. Knowing the commercial field remains an asset in the job, in his view."}]
    }
  ]
};