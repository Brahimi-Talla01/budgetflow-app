/**
 * Les médias vivent dans `public/assets/` : ils sont servis tels quels par Vite
 * au lieu d'être inlinés ou hachés dans le bundle JavaScript.
 */
export const assets = {
      logo: "/assets/Icon-512.png",
      user: "/assets/enfant.jpeg",
      groupProfile: "/assets/group_profile.png",
      expense: "/assets/expense.png",
      testimonial1: "/assets/test1.jpg",
      testimonial2: "/assets/test2.webp",
      testimonial3: "/assets/test3.jpeg",
      faq: "/assets/faq.jpg",
      budgetflow: "/assets/budgetflow.svg",
      budgetflowVideo: "/assets/budgetflow.mp4",
};

export const footer_data = [
    {
        title: "Fonctionnalités",
        links: [
            { name: "Budgétisation", url: "#" },
            { name: "Suivi des dépenses", url: "#" },
            { name: "Rapports IA", url: "#" },
            { name: "Synchronisation", url: "#" }
        ]
    },
    {
        title: "Support & Aide",
        links: [
            { name: "Centre d'aide", url: "#" },
            { name: "Contactez-nous", url: "#" },
            { name: "Politique de confidentialité", url: "#" },
            { name: "Conditions d'utilisation", url: "#" }
        ]
    },
    {
        title: "Entreprise",
        links: [
            { name: "Tarifs", url: "#price" },
            { name: "Témoignages", url: "#testimonials" },
            { name: "Carrières", url: "#" },
            { name: "Blog", url: "#" }
        ]
    }
];
