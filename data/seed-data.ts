import { User, Localite, Equipe, Produit, PlanningHebdomadaire, BesoinsJour, DemandeModification } from '@/types';

// Utilisateurs d'exemple
export const SEED_USERS: User[] = [
  {
    id: 1,
    nom: 'Admin Principal',
    email: 'admin@sigap.com',
    role: 'admin',
  },
  {
    id: 2,
    nom: 'Commandant Abdou Moussa',
    email: 'abdou@sigap.com',
    role: 'responsable',
    equipeId: 1,
  },
  {
    id: 3,
    nom: 'Lieutenant Amina Halidou',
    email: 'amina@sigap.com',
    role: 'responsable',
    equipeId: 2,
  },
  {
    id: 4,
    nom: 'Capitaine Ibrahim Mahamane',
    email: 'ibrahim@sigap.com',
    role: 'responsable',
    equipeId: 3,
  },
  {
    id: 5,
    nom: 'Major Fatima Issoufou',
    email: 'fatima@sigap.com',
    role: 'responsable',
    equipeId: 4,
  },
  {
    id: 6,
    nom: 'Lieutenant Ousmane Ali',
    email: 'ousmane@sigap.com',
    role: 'responsable',
    equipeId: 5,
  },
  {
    id: 7,
    nom: 'Capitaine Mariama Sani',
    email: 'mariama@sigap.com',
    role: 'responsable',
    equipeId: 6,
  },
  {
    id: 8,
    nom: 'Commandant Seydou Amadou',
    email: 'seydou@sigap.com',
    role: 'responsable',
    equipeId: 7,
  },
];

// Localités d'exemple (régions du Niger)
export const SEED_LOCALITES: Localite[] = [
  {
    id: 1,
    nom: 'Zone Nord - Agadez',
    region: 'Agadez',
    description: 'Zone désertique du nord, conditions climatiques extrêmes',
  },
  {
    id: 2,
    nom: 'Zone Sud - Dosso',
    region: 'Dosso',
    description: 'Zone agricole du sud, proximité avec le Nigeria',
  },
  {
    id: 3,
    nom: 'Zone Centre - Tahoua',
    region: 'Tahoua',
    description: 'Zone centrale, région pastorale importante',
  },
  {
    id: 4,
    nom: 'Zone Est - Diffa',
    region: 'Diffa',
    description: 'Zone frontalière est, région du lac Tchad',
  },
  {
    id: 5,
    nom: 'Zone Ouest - Tillabéri',
    region: 'Tillabéri',
    description: 'Zone ouest, le long du fleuve Niger',
  },
  {
    id: 6,
    nom: 'Capitale - Niamey',
    region: 'Niamey',
    description: 'District de la capitale, centre administratif',
  },
];

// Équipes d'exemple
export const SEED_EQUIPES: Equipe[] = [
  {
    id: 1,
    localiteId: 1,
    nom: 'Unité Alpha - Agadez',
    effectif: 25,
    responsable: 'Commandant Abdou Moussa',
  },
  {
    id: 2,
    localiteId: 1,
    nom: 'Unité Bravo - Arlit',
    effectif: 30,
    responsable: 'Lieutenant Amina Halidou',
  },
  {
    id: 3,
    localiteId: 2,
    nom: 'Unité Charlie - Dosso',
    effectif: 20,
    responsable: 'Capitaine Ibrahim Mahamane',
  },
  {
    id: 4,
    localiteId: 3,
    nom: 'Unité Delta - Tahoua',
    effectif: 35,
    responsable: 'Major Fatima Issoufou',
  },
  {
    id: 5,
    localiteId: 4,
    nom: 'Unité Echo - Diffa',
    effectif: 28,
    responsable: 'Lieutenant Ousmane Ali',
  },
  {
    id: 6,
    localiteId: 5,
    nom: 'Unité Foxtrot - Tillabéri',
    effectif: 32,
    responsable: 'Capitaine Mariama Sani',
  },
  {
    id: 7,
    localiteId: 6,
    nom: 'Unité Golf - Niamey Centre',
    effectif: 40,
    responsable: 'Commandant Seydou Amadou',
  },
];

// Produits supplémentaires (en plus des PRODUITS_DEFAUT)
export const SEED_PRODUITS_SUPPLEMENTAIRES: Produit[] = [
  {
    id: 7,
    nom: 'Mil',
    unite: 'kg',
    rationParPersonne: 0.15,
    taille: 50,
    typeCondit: 'Sac',
    prixUnitaire: 22000,
    categorie: 'Céréales',
  },
  {
    id: 8,
    nom: 'Haricots',
    unite: 'kg',
    rationParPersonne: 0.08,
    taille: 25,
    typeCondit: 'Sac',
    prixUnitaire: 18000,
    categorie: 'Légumineuses',
  },
  {
    id: 9,
    nom: 'Sel',
    unite: 'kg',
    rationParPersonne: 0.005,
    taille: 1,
    typeCondit: 'Sachet',
    prixUnitaire: 400,
    categorie: 'Condiments',
  },
  {
    id: 10,
    nom: 'Thé',
    unite: 'kg',
    rationParPersonne: 0.002,
    taille: 0.5,
    typeCondit: 'Boîte',
    prixUnitaire: 2500,
    categorie: 'Boissons',
  },
  {
    id: 11,
    nom: 'Pâtes alimentaires',
    unite: 'kg',
    rationParPersonne: 0.1,
    taille: 5,
    typeCondit: 'Carton',
    prixUnitaire: 4500,
    categorie: 'Céréales',
  },
  {
    id: 12,
    nom: 'Oignons',
    unite: 'kg',
    rationParPersonne: 0.03,
    taille: 10,
    typeCondit: 'Sac',
    prixUnitaire: 3000,
    categorie: 'Légumes',
  },
];

// Plannings hebdomadaires d'exemple - maintenant avec détail par repas
export const SEED_PLANNINGS: PlanningHebdomadaire[] = [
  {
    id: 1,
    equipeId: 1,
    mois: '2025-01',
    jours: {
      Lundi: {
        petit_dejeuner: [2, 3, 6], // Café, Lait, Sucre
        dejeuner: [1, 4, 5], // Riz, Concentré tomate, Huile
        diner: [1, 4, 5], // Riz, Concentré tomate, Huile
      },
      Mardi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 5, 6],
        diner: [1, 4, 5],
      },
      Mercredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5],
        diner: [1, 4, 5],
      },
      Jeudi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 5, 6],
        diner: [1, 4, 5],
      },
      Vendredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5],
        diner: [1, 4, 5],
      },
      Samedi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 5, 6],
        diner: [1, 4, 5],
      },
      Dimanche: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5],
        diner: [1, 4, 5],
      },
    },
  },
  {
    id: 2,
    equipeId: 2,
    mois: '2025-01',
    jours: {
      Lundi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Mardi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Mercredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Jeudi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Vendredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Samedi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Dimanche: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
    },
  },
  {
    id: 3,
    equipeId: 3,
    mois: '2025-01',
    jours: {
      Lundi: {
        petit_dejeuner: [2, 3],
        dejeuner: [1, 5],
        diner: [1, 5],
      },
      Mardi: {
        petit_dejeuner: [2, 3],
        dejeuner: [1, 5],
        diner: [1, 5],
      },
      Mercredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5],
        diner: [1, 4, 5],
      },
      Jeudi: {
        petit_dejeuner: [2, 3],
        dejeuner: [1, 5],
        diner: [1, 5],
      },
      Vendredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5],
        diner: [1, 4, 5],
      },
      Samedi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 5, 6],
        diner: [1, 5],
      },
      Dimanche: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 5, 6],
        diner: [1, 5],
      },
    },
  },
  {
    id: 4,
    equipeId: 4,
    mois: '2025-01',
    jours: {
      Lundi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Mardi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Mercredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Jeudi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Vendredi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Samedi: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
      Dimanche: {
        petit_dejeuner: [2, 3, 6],
        dejeuner: [1, 4, 5, 6],
        diner: [1, 4, 5],
      },
    },
  },
];

// Besoins journaliers d'exemple (janvier 2025) - maintenant avec détail par repas
export const SEED_BESOINS_JOURNALIERS: BesoinsJour[] = [
  // Équipe 1 - Quelques jours de janvier
  {
    equipeId: 1,
    dateKey: '2025-01-06',
    effectifJour: 75, // 25 personnes x 3 repas
    repas: {
      petit_dejeuner: {
        effectif: 25,
        provisions: {
          'Riz': 5.0,
          'Café': 0.25,
          'Lait en poudre': 0.375,
          'Concentré tomate': 0.5,
          'Huile': 0.75,
          'Sucre': 1.25,
        },
      },
      dejeuner: {
        effectif: 25,
        provisions: {
          'Riz': 5.0,
          'Café': 0.25,
          'Lait en poudre': 0.375,
          'Concentré tomate': 0.5,
          'Huile': 0.75,
          'Sucre': 1.25,
        },
      },
      diner: {
        effectif: 25,
        provisions: {
          'Riz': 5.0,
          'Café': 0.25,
          'Lait en poudre': 0.375,
          'Concentré tomate': 0.5,
          'Huile': 0.75,
          'Sucre': 1.25,
        },
      },
    },
    soumis: true,
    dateSubmission: '2025-01-05T14:30:00Z',
  },
  {
    equipeId: 1,
    dateKey: '2025-01-07',
    effectifJour: 75,
    repas: {
      petit_dejeuner: {
        effectif: 25,
        provisions: {
          'Riz': 5.0,
          'Café': 0.25,
          'Lait en poudre': 0.375,
          'Concentré tomate': 0.5,
          'Huile': 0.75,
          'Sucre': 1.25,
        },
      },
      dejeuner: {
        effectif: 25,
        provisions: {
          'Riz': 5.0,
          'Café': 0.25,
          'Lait en poudre': 0.375,
          'Concentré tomate': 0.5,
          'Huile': 0.75,
          'Sucre': 1.25,
        },
      },
      diner: {
        effectif: 25,
        provisions: {
          'Riz': 5.0,
          'Café': 0.25,
          'Lait en poudre': 0.375,
          'Concentré tomate': 0.5,
          'Huile': 0.75,
          'Sucre': 1.25,
        },
      },
    },
    soumis: true,
    dateSubmission: '2025-01-05T14:30:00Z',
  },
  {
    equipeId: 1,
    dateKey: '2025-01-08',
    effectifJour: 72, // 24 personnes x 3 repas
    repas: {
      petit_dejeuner: {
        effectif: 24,
        provisions: {
          'Riz': 4.8,
          'Café': 0.24,
          'Lait en poudre': 0.36,
          'Concentré tomate': 0.48,
          'Huile': 0.72,
          'Sucre': 1.2,
        },
      },
      dejeuner: {
        effectif: 24,
        provisions: {
          'Riz': 4.8,
          'Café': 0.24,
          'Lait en poudre': 0.36,
          'Concentré tomate': 0.48,
          'Huile': 0.72,
          'Sucre': 1.2,
        },
      },
      diner: {
        effectif: 24,
        provisions: {
          'Riz': 4.8,
          'Café': 0.24,
          'Lait en poudre': 0.36,
          'Concentré tomate': 0.48,
          'Huile': 0.72,
          'Sucre': 1.2,
        },
      },
    },
    soumis: true,
    dateSubmission: '2025-01-05T14:30:00Z',
  },
  // Équipe 2
  {
    equipeId: 2,
    dateKey: '2025-01-06',
    effectifJour: 90, // 30 personnes x 3 repas
    repas: {
      petit_dejeuner: {
        effectif: 30,
        provisions: {
          'Riz': 6.0,
          'Café': 0.3,
          'Lait en poudre': 0.45,
          'Concentré tomate': 0.6,
          'Huile': 0.9,
          'Sucre': 1.5,
        },
      },
      dejeuner: {
        effectif: 30,
        provisions: {
          'Riz': 6.0,
          'Café': 0.3,
          'Lait en poudre': 0.45,
          'Concentré tomate': 0.6,
          'Huile': 0.9,
          'Sucre': 1.5,
        },
      },
      diner: {
        effectif: 30,
        provisions: {
          'Riz': 6.0,
          'Café': 0.3,
          'Lait en poudre': 0.45,
          'Concentré tomate': 0.6,
          'Huile': 0.9,
          'Sucre': 1.5,
        },
      },
    },
    soumis: true,
    dateSubmission: '2025-01-04T10:15:00Z',
  },
  {
    equipeId: 2,
    dateKey: '2025-01-07',
    effectifJour: 90,
    repas: {
      petit_dejeuner: {
        effectif: 30,
        provisions: {
          'Riz': 6.0,
          'Café': 0.3,
          'Lait en poudre': 0.45,
          'Concentré tomate': 0.6,
          'Huile': 0.9,
          'Sucre': 1.5,
        },
      },
      dejeuner: {
        effectif: 30,
        provisions: {
          'Riz': 6.0,
          'Café': 0.3,
          'Lait en poudre': 0.45,
          'Concentré tomate': 0.6,
          'Huile': 0.9,
          'Sucre': 1.5,
        },
      },
      diner: {
        effectif: 30,
        provisions: {
          'Riz': 6.0,
          'Café': 0.3,
          'Lait en poudre': 0.45,
          'Concentré tomate': 0.6,
          'Huile': 0.9,
          'Sucre': 1.5,
        },
      },
    },
    soumis: true,
    dateSubmission: '2025-01-04T10:15:00Z',
  },
  // Équipe 3
  {
    equipeId: 3,
    dateKey: '2025-01-06',
    effectifJour: 60, // 20 personnes x 3 repas
    repas: {
      petit_dejeuner: {
        effectif: 20,
        provisions: {
          'Riz': 4.0,
          'Café': 0.2,
          'Lait en poudre': 0.3,
          'Concentré tomate': 0.4,
          'Huile': 0.6,
          'Sucre': 1.0,
        },
      },
      dejeuner: {
        effectif: 20,
        provisions: {
          'Riz': 4.0,
          'Café': 0.2,
          'Lait en poudre': 0.3,
          'Concentré tomate': 0.4,
          'Huile': 0.6,
          'Sucre': 1.0,
        },
      },
      diner: {
        effectif: 20,
        provisions: {
          'Riz': 4.0,
          'Café': 0.2,
          'Lait en poudre': 0.3,
          'Concentré tomate': 0.4,
          'Huile': 0.6,
          'Sucre': 1.0,
        },
      },
    },
    soumis: false,
  },
  {
    equipeId: 3,
    dateKey: '2025-01-07',
    effectifJour: 60,
    repas: {
      petit_dejeuner: {
        effectif: 20,
        provisions: {
          'Riz': 4.0,
          'Café': 0.2,
          'Lait en poudre': 0.3,
          'Concentré tomate': 0.4,
          'Huile': 0.6,
          'Sucre': 1.0,
        },
      },
      dejeuner: {
        effectif: 20,
        provisions: {
          'Riz': 4.0,
          'Café': 0.2,
          'Lait en poudre': 0.3,
          'Concentré tomate': 0.4,
          'Huile': 0.6,
          'Sucre': 1.0,
        },
      },
      diner: {
        effectif: 20,
        provisions: {
          'Riz': 4.0,
          'Café': 0.2,
          'Lait en poudre': 0.3,
          'Concentré tomate': 0.4,
          'Huile': 0.6,
          'Sucre': 1.0,
        },
      },
    },
    soumis: false,
  },
  // Équipe 4
  {
    equipeId: 4,
    dateKey: '2025-01-06',
    effectifJour: 105, // 35 personnes x 3 repas
    repas: {
      petit_dejeuner: {
        effectif: 35,
        provisions: {
          'Riz': 7.0,
          'Café': 0.35,
          'Lait en poudre': 0.525,
          'Concentré tomate': 0.7,
          'Huile': 1.05,
          'Sucre': 1.75,
        },
      },
      dejeuner: {
        effectif: 35,
        provisions: {
          'Riz': 7.0,
          'Café': 0.35,
          'Lait en poudre': 0.525,
          'Concentré tomate': 0.7,
          'Huile': 1.05,
          'Sucre': 1.75,
        },
      },
      diner: {
        effectif: 35,
        provisions: {
          'Riz': 7.0,
          'Café': 0.35,
          'Lait en poudre': 0.525,
          'Concentré tomate': 0.7,
          'Huile': 1.05,
          'Sucre': 1.75,
        },
      },
    },
    soumis: true,
    dateSubmission: '2025-01-03T16:45:00Z',
  },
];

// Demandes de modification d'exemple
export const SEED_DEMANDES: DemandeModification[] = [
  {
    id: 1,
    equipeId: 1,
    responsableId: 2,
    responsableNom: 'Commandant Abdou Moussa',
    mois: '2025-01',
    motif: 'Augmentation temporaire de l\'effectif suite à une mission spéciale',
    dateKey: '2025-01-10',
    nouvelEffectif: 30,
    statut: 'approuvee',
    dateCreation: '2025-01-08T09:00:00Z',
    dateTraitement: '2025-01-08T14:30:00Z',
    commentaireAdmin: 'Demande approuvée. Mission validée par le commandement.',
  },
  {
    id: 2,
    equipeId: 2,
    responsableId: 3,
    responsableNom: 'Lieutenant Amina Halidou',
    mois: '2025-01',
    motif: 'Erreur dans la saisie de l\'effectif pour la semaine du 13 janvier',
    statut: 'en_attente',
    dateCreation: '2025-01-09T11:20:00Z',
  },
  {
    id: 3,
    equipeId: 5,
    responsableId: 6,
    responsableNom: 'Lieutenant Ousmane Ali',
    mois: '2025-01',
    motif: 'Modification du planning suite à un redéploiement',
    dateKey: '2025-01-15',
    statut: 'en_attente',
    dateCreation: '2025-01-10T08:45:00Z',
  },
  {
    id: 4,
    equipeId: 3,
    responsableId: 4,
    responsableNom: 'Capitaine Ibrahim Mahamane',
    mois: '2024-12',
    motif: 'Correction de l\'effectif pour fin décembre (congés de fin d\'année)',
    nouvelEffectif: 15,
    statut: 'rejetee',
    dateCreation: '2024-12-28T10:00:00Z',
    dateTraitement: '2024-12-29T09:15:00Z',
    commentaireAdmin: 'Demande rejetée. Délai de modification dépassé pour le mois de décembre.',
  },
  {
    id: 5,
    equipeId: 7,
    responsableId: 8,
    responsableNom: 'Commandant Seydou Amadou',
    mois: '2025-01',
    motif: 'Ajustement de l\'effectif suite à des formations externes',
    dateKey: '2025-01-20',
    nouvelEffectif: 35,
    statut: 'en_attente',
    dateCreation: '2025-01-11T15:30:00Z',
  },
];
