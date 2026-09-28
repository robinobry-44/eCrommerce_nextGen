/* ==========================================================================
   INSIGHTS — contenus transversaux construits à partir des interviews.
   Laissez la liste vide tant qu'il n'y a pas assez de matière originale :
   la section Insights n'apparaît (menu, pages, sitemap) que si la liste contient au moins un Insight.

   ► MODÈLE

  {
    slug: "outils-cro-promo-2026",           // URL : /insights/outils-cro-promo-2026/
    titre: "Les outils CRO les plus cités par la Promo 2026",
    date: "2026-12-01",                        // AAAA-MM-JJ
    chapo: "Une phrase qui résume l'enseignement principal.",
    sections: [
      {
        titre: "Titre explicite de la section (H2)",
        texte: ["Paragraphe 1", "Paragraphe 2"],
        people: ["antoine-vera"]               // slugs des talents cités : liens automatiques
      }
    ]
  },

   ========================================================================== */

window.INSIGHTS = [];
