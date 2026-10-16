/* ==========================================================================
   VERSION ANGLAISE — traductions du site (pages générées sous /en/).

   ► PRINCIPE : on ne réécrit que les TEXTES. Tout le reste (slug, photos,
     liens LinkedIn, dates, numéros, noms d'outils…) vient de interviews.js.
     - site : remplace les textes de data/site.js
     - interviews : une entrée par slug, mêmes noms de champs qu'interviews.js
     - Les listes ([…]) se lisent dans le même ordre que l'original :
       null = garder le texte d'origine (ex. un nom d'école).
     - Ne pas traduire  section  pour "parcours", "declic", "mindset",
       "conseil", "hottake" (ce sont des clés techniques). Les autres
       sections (ex. "Sa plus belle réussite") se traduisent : c'est leur titre.

   ► NOUVEAU TALENT : ajoutez son bloc ici. S'il manque, la page anglaise
     s'affiche en français et le build l'indique.
   ========================================================================== */

window.EN = {
  site: {
    description: "eCROmmerce NextGen shines a light on the new generation of CRO and e-commerce: the career paths, methods, tools and convictions of young talents.",
    baseline: "The new generation of CRO & e-commerce.",
    sousTitre: "Discover the career paths, methods and convictions of the talents shaping digital commerce.",
    projetCourt: "Unfiltered conversations about their journey, their wins, their failures, their inspirations and their vision of tomorrow's e-commerce.",
    newsletter: {
      titre: "Never miss a Talent",
      texte: "New Next Gen portraits, straight to your inbox. No spam, unsubscribe in one click.",
      bouton: "Subscribe",
      merci: "You're in, welcome to the Next Gen! Check your inbox (and your spam folder) to confirm your subscription."
    },
    footer: {
      gauche: "#eCROmmerce NextGen — a series by Robin Aubry, CRO · UX · E-commerce @ Air360",
      droite: "#Stay Tuned · next portrait coming soon…"
    },
    apropos: {
      citation: "“Don't talk to me about <span class=\"pink\">age</span>.”",
      pourquoi: [
        "<strong>Because in CRO, as in e-commerce, what matters isn't age. It's what you have to share, to learn and to bring.</strong>",
        "That's the mindset behind this series. With one simple ambition: to shine a light on the rising talents of CRO and e-commerce.",
        "An idea that had been growing for a long time, and that is finally coming to life thanks to a generation of young CRO(cs) ready to dive in and share their experience, their vision and their takes on e-commerce, digital, data and AI."
      ],
      maintenant: [
        "They're young and <strong>CRO</strong>wing fast. They are arriving in an e-commerce world in full transformation.",
        "At a time when AI is redefining how we work, our tools and our processes, they may be the best placed to rethink today's practices and imagine tomorrow's.",
        "They are a force to be reckoned with. And that is exactly why I want to give them a voice today."
      ],
      maintenantCitation: "“Valour does not wait upon the number of years.”",
      format: [
        { titre: "Their path", texte: "Education, first jobs, turning points." },
        { titre: "First steps in CRO / e-com", texte: "What pulled them into the job." },
        { titre: "Wins… and failures", texte: "The winning tests, and the ones they learned the most from." },
        { titre: "Inspirations & toolbox", texte: "Their mentors, their everyday tools." },
        { titre: "Tomorrow's e-commerce", texte: "Their vision, their convictions, their hot take." }
      ],
      quiEst: [
        "Early-career talents in CRO and e-commerce, on the brand side as well as the agency side.",
        "The criterion isn't age: it's what they have to share, to learn and to bring.",
        "They are suggested by the community in LinkedIn comments, then interviewed on the five angles of the format."
      ],
      auteur: {
        bio: "He helps brands optimise their digital experience and grow their conversions. Author of #eCROmmerce NextGen.",
        tags: ["CRO", "UX", "E-commerce", "Partnerships"],
        parcours: [
          { detail: "EMEA Partnerships Manager" },
          { detail: "Previous experience" },
          { detail: "Master's in Management" }
        ]
      }
    },
    categoriesOutils: {
      "Shopify": "E-commerce platform",
      "Welyft A/B Tests Identifier": "A/B test monitoring",
      "Jira": "Project management"
    }
  },

  interviews: {

    "antoine-vera": {
      secteur: "Sports retail",
      citation: "CRO is a craft of tailoring more than a craft of tools.",
      accroche: "A simple A/B test or removing one point of friction can have more impact than a marketing campaign.",
      intro: "Antoine Vera is E-Commerce & CRO Project Manager at Sport 2000. After studying sports science (STAPS) and then at KEDGE, he built his career in sports retail, from GO Sport to Fitness Park, Intersport and now Sport 2000. Seeing how much the digital customer journey drove performance, online and in store alike, is what steered him towards CRO. For him, the job is cross-functional: you have to be able to talk with developers, analysts and content teams, and the tool doesn't make the method. In this interview, he looks back on his turning point, the tools he uses to test and analyse, the voices that inspire him, and where he stands on AI and GEO.",
      careerPath: [
        { etape: "STAPS (sports science)" },
        null, null, null, null, null
      ],
      reponses: [
        { question: "Education", reponse: ["STAPS (sports science)", null] },
        { question: "Experience" },
        { titreSection: "How Antoine got into CRO", question: "How did you get into CRO?", reponse: "Seeing how directly the digital customer journey influenced performance, in store as well as online, I understood that the real growth lever was no longer just about product or price, but about the experience and the continuous optimisation of the conversion funnel. Realising that a simple A/B test or removing one point of friction could have more impact than a marketing campaign naturally led me to CRO and e-commerce." },
        { question: "Your go-to phrase?", titre: "With great power comes great responsibility", reponse: "When you have access to data and the power to change the experience of thousands of users, you have a responsibility to do it rigorously." },
        { titreSection: "Why Antoine sees CRO as a craft of tailoring", question: "Your advice to a junior?", titre: "CRO is a craft of tailoring more than a craft of tools.", reponse: "Don't focus only on mastering one tool, and don't be afraid of the technical topics around it, because CRO touches everything. The better you can talk with developers, analysts and content teams, the more useful you become." },
        { titreSection: "How Antoine sees the impact of AI on e-commerce", question: "Honestly, aren't we overdoing it with AI?", ouiContexte: "on how AI is talked about", oui: "Clearly, there is a fad where every deliverable now has to carry an “AI” label to look legitimate.", nonContexte: "on actual use", non: "Topics like GEO aren't buzz: they are structural changes in the way users discover and choose a product." }
      ],
      outils: [
        { usage: "Designing, launching and running A/B tests" },
        { usage: "Monitoring and inspiration: spotting the tests other sites are running" },
        { usage: "Heatmaps and session replays to confirm points of friction" },
        { usage: "More in-depth business data analysis" },
        { usage: "More in-depth business data analysis" }
      ],
      mentors: [
        { citation: "A reference for CRO methodology and A/B testing in France, with very hands-on content and real-world cases." },
        { citation: "For a broader view of e-commerce and growth, complementary to a pure CRO approach." }
      ],
      sujets: ["AI", "GEO"],
      aRetenir: {
        points: [
          { titre: "CRO is cross-functional.", texte: "Data, UX, tech and business have to work together." },
          { titre: "A hunch is not proof.", texte: "Measurement lets you test convictions against real behaviour." },
          { titre: "Tools don't make the method.", texte: "They serve an approach built on observation, experimentation and learning." }
        ]
      }
    },

    "caroline-hoang": {
      poste: "CRO Specialist",
      citation: "CRO is the art of turning curiosity into conviction.",
      accroche: "Intuition generates the best hypotheses; data tells you whether you were right.",
      intro: "Caroline Hoang is a CRO Specialist on a work-study contract at Showroomprivé. Her path was built step by step: commerce first, with a BTS in International Trade, then digital, with a Bachelor in Design & Digital Marketing, and finally data, with a Master's in Digital Marketing & Data Analytics at EMLV. In two years, she has worked on every stage of CRO, from ideation to results analysis, including the technical implementation of A/B tests. Two months after she joined, a social proof test on the Travel section sent transactions per session soaring on mobile web. In this interview, she looks back on that first win, the balance between intuition and data, emotional personalisation, and her conviction: CRO is a strategic investment, not a collection of quick wins.",
      careerPath: [
        { etape: "BTS in International Trade" },
        null,
        null,
        { detail: "CRO Specialist (work-study)" }
      ],
      reponses: [
        { question: "Education", reponse: ["BTS in International Trade", null, null] },
        { question: "Experience", reponse: ["CRO Specialist (work-study) · Showroomprivé (2 years)"] },
        { titreSection: "How Caroline got into CRO", question: "What was your path?", reponse: "My path is fairly unusual: I started with a BTS in International Trade, then went on to a Bachelor in Design & Digital Marketing before joining EMLV for a Master's in Digital Marketing & Data Analytics. At each step, I tried to go a little further: first understanding commerce, then digital, then data." },
        { section: "Her proudest win", titreSection: "The social proof test that launched Caroline", question: "Your proudest win?", reponse: "Two months after joining Showroomprivé, I worked on a social proof test on the Travel section. The idea: show, in real time, how many people were viewing an offer, “X people are currently viewing this offer”. One of the variants drove a sharp rise in transactions per session on mobile web. What I take away most is that the idea wasn't revolutionary: it was the rigour of the hypothesis, the targeting and the analysis that made all the difference." },
        { section: "Her biggest discovery", titreSection: "Why Caroline relies on intuition as much as on data", question: "Your biggest discovery?", reponse: "Many people think CRO is just about making the numbers talk. In reality, intuition generates the best hypotheses, and data tells you whether you were right. So both are essential!" },
        { section: "Her biggest challenge", titreSection: "The challenge of actionable insights", question: "The biggest challenge in CRO?", reponse: "Generating truly actionable insights. We often have lots of data, but going from raw data to a relevant hypothesis takes perspective, empathy and a real product culture." },
        { section: "The trend that excites her", titreSection: "Why Caroline is interested in emotional personalisation", question: "The trend that excites you most?", reponse: "Emotional personalisation: the idea of adapting the experience to the user's emotional profile. We're already working on it at Showroomprivé with Emotion AI (EAI). It's fascinating to see that two people on the same page can have very different psychological needs." },
        { question: "Is CRO just A/B testing?", ouiContexte: "on the method", oui: "The A/B test is the means of transport.", nonContexte: "on the substance", non: "It isn't the destination: behind every test, there is a real question about human behaviour." },
        { section: "What she would change", titreSection: "CRO, a strategic investment", question: "If you could change one thing?", reponse: "For CRO to be seen as a strategic investment rather than a “quick win” tool. To me, the best CRO programmes are the ones built for the long term, within a culture of continuous learning." },
        { section: "What's next?", titreSection: "Where Caroline sees herself in 3 to 5 years", question: "Where do you see yourself in 3 to 5 years?", reponse: "I see myself as a CRO Manager or Growth Manager, with real expertise in personalisation and data. Luxury really appeals to me, and LVMH in particular: I think CRO has a huge role to play in a sector where every detail of the user experience matters." }
      ],
      outils: [
        { usage: "Designing and running A/B tests" },
        { usage: "Documenting and sharing knowledge" },
        { usage: "Tracking tests and projects" }
      ],
      mentors: [
        { citation: "My work-study supervisor at Showroomprivé. He's the one who introduced me to the world of CRO and believed in me from the very start!" }
      ],
      sujets: ["Personalisation", "Emotion AI"],
      aRetenir: {
        points: [
          { titre: "Rigour drives results.", texte: "A simple idea can have a big impact if the hypothesis, the targeting and the analysis are solid." },
          { titre: "Intuition and data go together.", texte: "Intuition generates the hypotheses; data confirms or refutes them." },
          { titre: "CRO is a long game.", texte: "A CRO programme is a strategic investment built on continuous learning." }
        ]
      },
      motsCles: ["Curiosity"]
    },

    "salome-klein": {
      citation: "Fewer certainties, more experiments.",
      accroche: "Data gives you the lead, but human empathy gives you the solution.",
      intro: "Salomé Klein is CRO & Web Analyst at CEWE. After EM Strasbourg and then BSB Lyon, she discovered UX/UI at business school, then had her turning point at Orange, leading the overhaul of the Datorama project and building dashboards. At the French Red Cross (Croix-Rouge française), she structured the CRO method and trained the teams to make the data reflex part of the internal culture. At CEWE, she learned that running test after test is pointless without a strict framework: no test now goes live without cross-checking quantitative and qualitative data, setting a real hypothesis and going through a prioritisation grid. In this interview, she talks about prioritisation, KPIs, HiPPO culture, AI as a co-pilot, and her conviction: CRO is a team sport.",
      careerPath: [
        { detail: "Bachelor in International Business" },
        { detail: "Master's in Digital Project Management" },
        { detail: "Internship" },
        null,
        null
      ],
      reponses: [
        { question: "Education", reponse: ["Bachelor in International Business · EM Strasbourg", "Master's in Digital Project Management · BSB Lyon"] },
        { question: "Experience", reponse: ["Internship · Orange", null, null] },
        { titreSection: "How Salomé got into CRO", question: "What was your turning point?", reponse: "I have a fairly classic business school background, with quite general programmes where you touch a bit of everything, but that's where I discovered UX/UI and the idea of the user journey. The real turning point came during my internship at Orange, thanks to an amazing internship supervisor who put me straight onto big projects. I was entrusted with the overhaul and rollout of the Datorama project: from scoping the business needs to integrating multi-channel data flows (Meta, Search…) and building dashboards. Seeing the direct impact of those analyses on performance and on the user journey is what clicked for me." },
        { section: "The lesson learned on the job", titreSection: "Why Salomé codes her own A/B tests", question: "What skill did you learn on the job?", reponse: "Technical implementation (JS / CSS). Coming out of school, I thought I would focus on analysis and strategy. But being able to code my own A/B tests and set up tracking quickly became my biggest lever for autonomy and speed." },
        { section: "Her proudest win", titreSection: "Evangelising CRO at the French Red Cross", question: "Your proudest win?", reponse: "Without hesitation, evangelising CRO at the French Red Cross. The approach already existed, but my time there helped structure a method. We grew together: I trained myself and I trained the teams to make the data reflex part of the internal culture. Analysing the numbers and isolating points of friction became the norm, thanks to an incredible manager and team. In a different vein, taking part in the migration of Croix-Rouge Compétence onto the main website taught me to lead cross-functionally and to bridge product, marketing, business teams and agencies." },
        { section: "The mistake that taught her the most", titreSection: "Why test volume isn't enough", question: "The mistake that taught you the most?", reponse: "Early on at CEWE, carried away by my eagerness to do well, I wanted to run as many A/B tests as possible, very fast. The problem: many came out “neutral”, without teaching us anything about our users. I realised that volume was pointless without a strict framework. Today, no test goes live without cross-checking several data sources, setting a real hypothesis and going through a prioritisation grid." },
        { section: "Her biggest surprise", titreSection: "Why our certainties are often wrong", question: "Your biggest surprise since you started in CRO?", reponse: "Seeing how often our certainties are wrong. We all come in with assumptions about what will work, but the data systematically proves us wrong. That's what makes the job so beautiful: it's neither our intuitions nor the opinions of the various stakeholders that win, it's always the users." },
        { section: "Her definition of CRO", titreSection: "CRO, a tool to get to know your users", question: "What is your definition of CRO?", reponse: "CRO is above all a fantastic tool for getting to know our users better. Business performance remains the goal, but the real value lies in customer knowledge. A negative test is never a failure: it's valuable data that sharpens our understanding and prevents bad decisions at scale. It's the perfect intersection between UX sensitivity and data rigour." },
        { section: "Her biggest challenge", titreSection: "The challenge of prioritisation", question: "The biggest challenge in CRO?", reponse: "Prioritisation, clearly. We have dozens of ideas, but isolating the right opportunity amid all the noise is what turns a roadmap you put up with into a profitable strategy. To avoid choices driven by gut feeling, I rely on an ICE-type method and a simple protocol: always cross-check quantitative and qualitative data before validating a hypothesis." },
        { section: "Her stack", titreSection: "Why UX Analytics is essential, according to Salomé", question: "Which tools do you use every day?", reponse: "My stack is very complete, and AI has become a fantastic tool to speed up UX research and ideation. But the must-have remains a UX Analytics solution: quantitative data tells you what is happening, but qualitative insight and session replays give you the why. It's the only way to isolate the real points of friction and come up with hypotheses that hit the mark." },
        { section: "Her inspirations", titreSection: "Who inspires Salomé", question: "Who inspires you?", reponse: "I think of all the people I've met throughout my career: my managers, my colleagues and the agency teams. And I have to admit there's a real fit with the experts at Air360! To keep progressing, the watchword is curiosity, especially in digital where everything moves incredibly fast: reading books or white papers, attending webinars and events dedicated to CRO or digital, keeping an active watch on LinkedIn by following the experts in the field." },
        { question: "Your everyday philosophy?", titre: "Without data, you're just another person with an opinion.", reponse: "It's a reminder to stay humble in the face of certainties and to always give the user the final say." },
        { section: "Her KPIs", titreSection: "The KPIs Salomé watches (and the ones she avoids)", question: "Your favourite KPI, the most overlooked, the most misused?", reponse: "My favourite is RPV: it measures real value creation, not just a one-off sale. The metric that is too often overlooked is the UX engagement rate (real interactions, qualified scroll), which reveals points of friction very early. And the most misused is still the overall conversion rate: it means nothing without segmenting by source or intent." },
        { section: "The myth to debunk", titreSection: "Why a good conversion rate isn't everything", question: "The myth to debunk?", reponse: "Believing that a good conversion rate is everything. Optimising one step to push a number up in the short term is easy, but if it destroys customer value or the overall experience, or generates returns, it's a losing game." },
        { section: "The trend that excites her", titreSection: "Generative AI in the service of UX research", question: "The trend that excites you most?", reponse: "The arrival of generative AI applied to UX research and personalisation. Being able to model behaviour or analyse qualitative data at scale without losing nuance is a real boost that lets us focus on strategy." },
        { section: "E-commerce in 3 years", titreSection: "Towards hyper-personalised, predictive e-commerce", question: "How do you see e-commerce in 3 years?", reponse: "I see e-commerce becoming even more hyper-personalised and predictive. We'll finally move beyond the classic linear journey: the experience will adapt in real time to the context, the intent and the precise buying behaviour of each user." },
        { section: "What she would change", titreSection: "Quality of hypotheses before volume of tests", question: "If you could change one thing in the industry?", reponse: "Stop the race for test volume and favour the quality of hypotheses instead. Less “testing for the sake of testing”, more real value delivered to users." },
        { titreSection: "Salomé's advice for getting started", question: "Your advice to someone who wants to get started?", titre: "Don't stay locked inside your numbers.", reponse: "Go and talk to the support teams, listen to customer calls, watch session replays. Data gives you the lead, but human empathy gives you the solution." },
        { section: "Her secret sauce", titreSection: "Cross-checking quant and qual, every time", question: "Your everyday secret sauce?", reponse: "Systematically cross-checking quantitative and qualitative data before validating even the smallest hypothesis. I never launch a test based only on a feeling or a single metric. And my most effective hack for progressing fast: analysing other people's failures and my own. Dissecting A/B tests that failed or gave a counter-intuitive result teaches you ten times more about human behaviour than any success story on LinkedIn." },
        { section: "Her hot take", titreSection: "Is a negative test a failure?", question: "Your hot take?", reponse: "Everyone thinks a negative test is a failure, when it's sometimes the best data of the year. Better to invalidate a bad idea with an A/B test in two weeks than to hurt revenue for six months after a blind rollout." },
        { section: "If she could hit reset", titreSection: "Putting an end to HiPPO culture", question: "If you could hit “reset”?", reponse: "I would get rid of the “HiPPO” culture (the decision made on the gut feeling of the highest-paid person in the room). I would make every product decision rely on a tested, documented hypothesis." },
        { section: "What nobody dares to say", titreSection: "Doing CRO just to say you do it", question: "What nobody dares to say?", reponse: "Many companies do CRO to say they do it, without ever giving teams the means or the autonomy to apply the results. Tests pile up, but the real changes get stuck in QA." },
        { section: "Wow or ouch?", titreSection: "The risk of e-commerce looking all the same", question: "Facing the future of digital: wow or ouch?", reponse: "“Wow” for the speed of innovation, but “ouch” at the risk of standardisation: if everyone uses the same tools and the same recipes, all e-commerce sites will end up looking alike." },
        { question: "AI: are we overdoing it?", ouiContexte: "on the hype", oui: "Too much hype about magical automation that would replace thinking.", nonContexte: "on actual use", non: "Not enough pragmatic use to get rid of repetitive tasks and free up time for UX analysis. AI remains a co-pilot, not the pilot." },
        { section: "What's next?", titreSection: "Where Salomé sees herself in 3 to 5 years", question: "Where do you see yourself in 3 to 5 years?", reponse: "I see myself at a consulting firm or an agency, supporting a variety of clients and spreading this CRO data culture on a larger scale. I'd like to take on bigger challenges around personalisation and integrating AI to automate UX research. To reach the next level, I'd like to develop my skills in Product Management and global experimentation strategy: structuring complex CRO programmes across an entire organisation, leading cross-functional teams and linking our tests even more directly to financial and business stakes. As for the company, an organisation with a strong product and data culture (or, let's be honest, an ambitious UX Analytics vendor like Air360! 😉)." },
        { section: "Open mic", titreSection: "CRO, a team sport", question: "One last word?", reponse: "CRO is a team sport. You can have the best tech stack and the cleanest data in the world: if you don't bring designers, developers and product teams on board, the insights stay on the shelf. The real victory in CRO isn't just winning an A/B test, it's getting an entire company to ask the right questions, test its hypotheses and put the user experience at the heart of every business decision." }
      ],
      outils: [{ usage: "UX Analytics: qualitative insight and session replays give the why behind points of friction" }],
      ressources: [{ raison: "I recommend reading “Don't Make Me Think” by Steve Krug, or white papers." }],
      sujets: ["AI", "Personalisation", "UX research", "Prioritisation"],
      methode: {
        titre: "Salomé's protocol before every test",
        etapes: [
          { titre: "Cross-check the sources", texte: "Quantitative and qualitative data (session replays, customer calls, support teams) before any hypothesis." },
          { titre: "Set a real hypothesis", texte: "Never a test based only on a feeling or a single metric." },
          { titre: "Prioritise", texte: "Run every idea through an ICE-type prioritisation grid to avoid choices driven by gut feeling." },
          { titre: "Learn from every result", texte: "A negative test is never a failure: it's data that prevents a bad decision at scale." }
        ]
      },
      aRetenir: {
        points: [
          { titre: "Quality before volume.", texte: "Less testing for the sake of testing, more solid, prioritised hypotheses." },
          { titre: "Quant tells you what, qual tells you why.", texte: "Cross-checking both is the only way to isolate the real points of friction." },
          { titre: "CRO is a team sport.", texte: "Without designers, developers and product teams on board, the insights stay on the shelf." }
        ]
      },
      motsCles: ["Learning"]
    }
  }
};
