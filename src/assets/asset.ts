import logo from './Icon-512.png';
import user from './enfant.jpeg';
import testimonial1 from './test1.jpg';
import testimonial2 from './test2.webp';
import testimonial3 from './test3.jpeg';
import faq from './faq.jpg';
import budgetflow from './budgetflow.svg';
import type { ExpenseProps } from '../domain/entities/Expense';

export const assets = {
      logo,
      user,
      testimonial1,
      testimonial2,
      testimonial3,
      faq,
      budgetflow,
}


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


export const mockExpenses: ExpenseProps[] = [
    {
        id: 1,
        amount: 10,
        category: "Alimentation",
        description: "Courses du mois – supermarché",
        date: new Date("2025-01-12T10:32:00"),
        isActive: true,
        createdAt: new Date("2025-01-12T10:32:00"),
        userId: 1,
        projectId: 1
    },
    {
        id: 2,
        amount: 19,
        category: "Transport",
        description: "Réparation du véhicule",
        date: new Date("2025-01-20T15:10:00"),
        isActive: true,
        createdAt: new Date("2025-01-20T15:10:00"),
        userId: 1,
    },
    {
        id: 3,
        amount: 7,
        category: "Divertissement",
        description: "Sortie cinéma + snacks",
        date: new Date("2025-01-25T20:45:00"),
        isActive: false,
        createdAt: new Date("2025-01-25T20:45:00"),
        userId: 1
    },
    {
        id: 4,
        amount: 39,
        category: "Transport",
        description: "Sortie simple avec des amis",
        date: new Date("2025-01-25T20:45:00"),
        isActive: false,
        createdAt: new Date("2025-01-25T20:45:00"),
        userId: 1
    },
];
