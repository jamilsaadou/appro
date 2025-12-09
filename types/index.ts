// Types pour la plateforme SIGAP

export type UserRole = 'admin' | 'responsable';

export interface User {
  id: number;
  nom: string;
  email: string;
  role: UserRole;
  equipeId?: number; // Pour les responsables d'équipe
}

export interface Localite {
  id: number;
  nom: string;
  region: string;
  description: string;
}

export interface Equipe {
  id: number;
  localiteId: number;
  nom: string;
  effectif: number;
  responsable: string;
}

// Nouveau: Produit alimentaire configurable par l'admin
export interface Produit {
  id: number;
  nom: string;
  unite: string; // kg, L, unité, etc.
  rationParPersonne: number; // Ration par personne pour ce produit
  taille: number; // Taille du conditionnement
  typeCondit: string; // Sac, Boîte, Bidon, etc.
  prixUnitaire: number; // Prix par conditionnement (visible admin uniquement)
  categorie?: string; // Céréales, Condiments, Boissons, etc.
}

// Planning des repas pour un jour
export interface PlanningRepasJour {
  petit_dejeuner: number[]; // IDs des produits pour le petit déjeuner
  dejeuner: number[]; // IDs des produits pour le déjeuner
  diner: number[]; // IDs des produits pour le dîner
}

// Planning hebdomadaire (7 jours) - maintenant avec détail par repas
export interface PlanningHebdomadaire {
  id: number;
  equipeId: number;
  mois: string; // Format YYYY-MM
  jours: {
    [jourSemaine: string]: PlanningRepasJour; // Planning par repas pour chaque jour
  };
}

export interface RecapMensuel {
  equipeId: number;
  mois: string;
  effectifTotal: number; // Effectif * jours du mois
  besoins: {
    [produitId: number]: {
      produit: Produit;
      besoinBrut: number;
      nbConditionnements: number;
      cout: number; // visible admin uniquement
    };
  };
  coutTotal: number; // visible admin uniquement
}

// Produits par défaut
export const PRODUITS_DEFAUT: Produit[] = [
  {
    id: 1,
    nom: 'Riz',
    unite: 'kg',
    rationParPersonne: 0.2,
    taille: 50,
    typeCondit: 'Sac',
    prixUnitaire: 25000,
    categorie: 'Céréales',
  },
  {
    id: 2,
    nom: 'Café',
    unite: 'kg',
    rationParPersonne: 0.01,
    taille: 1,
    typeCondit: 'Boîte',
    prixUnitaire: 5000,
    categorie: 'Boissons',
  },
  {
    id: 3,
    nom: 'Lait en poudre',
    unite: 'kg',
    rationParPersonne: 0.015,
    taille: 2.5,
    typeCondit: 'Boîte',
    prixUnitaire: 12000,
    categorie: 'Boissons',
  },
  {
    id: 4,
    nom: 'Concentré tomate',
    unite: 'kg',
    rationParPersonne: 0.02,
    taille: 0.4,
    typeCondit: 'Boîte',
    prixUnitaire: 800,
    categorie: 'Condiments',
  },
  {
    id: 5,
    nom: 'Huile',
    unite: 'L',
    rationParPersonne: 0.03,
    taille: 5,
    typeCondit: 'Bidon',
    prixUnitaire: 8000,
    categorie: 'Condiments',
  },
  {
    id: 6,
    nom: 'Sucre',
    unite: 'kg',
    rationParPersonne: 0.05,
    taille: 1,
    typeCondit: 'Sac',
    prixUnitaire: 600,
    categorie: 'Condiments',
  },
];

export const JOURS_SEMAINE = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

// Type de repas
export type TypeRepas = 'petit_dejeuner' | 'dejeuner' | 'diner';

// Besoins par repas
export interface BesoinsRepas {
  effectif: number;
  provisions: {
    [produitNom: string]: number;
  };
}

// Besoins journaliers par équipe (maintenant avec détail par repas)
export interface BesoinsJour {
  equipeId: number;
  dateKey: string; // Format: YYYY-MM-DD
  effectifJour: number; // Effectif total (pour rétrocompatibilité)
  repas: {
    petit_dejeuner: BesoinsRepas;
    dejeuner: BesoinsRepas;
    diner: BesoinsRepas;
  };
  soumis: boolean; // true si le calendrier a été soumis
  dateSubmission?: string;
}

// Statut d'une demande de modification
export type StatutDemande = 'en_attente' | 'approuvee' | 'rejetee';

// Demande de modification de calendrier
export interface DemandeModification {
  id: number;
  equipeId: number;
  responsableId: number;
  responsableNom: string;
  mois: string; // Format: YYYY-MM
  motif: string;
  dateKey?: string; // Si modification d'un jour spécifique
  nouvelEffectif?: number; // Si modification d'effectif
  statut: StatutDemande;
  dateCreation: string;
  dateTraitement?: string;
  commentaireAdmin?: string;
}

// Configuration des provisions par défaut (pour le Calendrier.tsx)
// rationRepas = ratio par repas (et non par jour)
export const PROVISIONS_CONFIG = [
  { nom: 'Riz', unite: 'kg', rationRepas: 0.2, taille: 50, prixUnitaire: 25000 },
  { nom: 'Café', unite: 'kg', rationRepas: 0.01, taille: 1, prixUnitaire: 5000 },
  { nom: 'Lait en poudre', unite: 'kg', rationRepas: 0.015, taille: 2.5, prixUnitaire: 12000 },
  { nom: 'Concentré tomate', unite: 'kg', rationRepas: 0.02, taille: 0.4, prixUnitaire: 800 },
  { nom: 'Huile', unite: 'L', rationRepas: 0.03, taille: 5, prixUnitaire: 8000 },
  { nom: 'Sucre', unite: 'kg', rationRepas: 0.05, taille: 1, prixUnitaire: 600 },
];

// Labels des repas pour l'affichage
export const REPAS_LABELS: Record<TypeRepas, string> = {
  petit_dejeuner: 'Petit déjeuner',
  dejeuner: 'Déjeuner',
  diner: 'Dîner',
};
