'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Localite, Equipe, Produit, PlanningHebdomadaire, PRODUITS_DEFAUT, BesoinsJour, DemandeModification, StatutDemande, PROVISIONS_CONFIG } from '@/types';
import { 
  SEED_USERS, 
  SEED_LOCALITES, 
  SEED_EQUIPES, 
  SEED_PRODUITS_SUPPLEMENTAIRES, 
  SEED_PLANNINGS, 
  SEED_BESOINS_JOURNALIERS, 
  SEED_DEMANDES 
} from '@/data/seed-data';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  switchRole: () => void;
}

interface DataContextType {
  localites: Localite[];
  equipes: Equipe[];
  produits: Produit[];
  utilisateurs: User[];
  plannings: PlanningHebdomadaire[];
  besoinsJournaliers: BesoinsJour[];
  demandesModification: DemandeModification[];
  addLocalite: (localite: Omit<Localite, 'id'>) => void;
  updateLocalite: (id: number, localite: Partial<Localite>) => void;
  deleteLocalite: (id: number) => void;
  addEquipe: (equipe: Omit<Equipe, 'id'>) => void;
  updateEquipe: (id: number, equipe: Partial<Equipe>) => void;
  deleteEquipe: (id: number) => void;
  addUtilisateur: (utilisateur: Omit<User, 'id'>) => void;
  updateUtilisateur: (id: number, updates: Partial<User & { password?: string }>) => void;
  deleteUtilisateur: (id: number) => void;
  addProduit: (produit: Omit<Produit, 'id'>) => void;
  updateProduit: (id: number, produit: Partial<Produit>) => void;
  deleteProduit: (id: number) => void;
  savePlanning: (planning: Omit<PlanningHebdomadaire, 'id'>) => void;
  getPlanning: (equipeId: number, mois: string) => PlanningHebdomadaire | undefined;
  getBesoinsJour: (equipeId: number, dateKey: string) => BesoinsJour | undefined;
  updateBesoinsJour: (equipeId: number, dateKey: string, repas: Partial<Record<'petit_dejeuner' | 'dejeuner' | 'diner', number>>) => void;
  soumettreCalendrier: (equipeId: number, mois: string) => Promise<boolean>;
  creerDemandeModification: (demande: Omit<DemandeModification, 'id' | 'statut' | 'dateCreation'>) => void;
  traiterDemande: (demandeId: number, statut: StatutDemande, commentaire?: string) => void;
  getDemandesEquipe: (equipeId: number) => DemandeModification[];
  getDemandesEnAttente: () => DemandeModification[];
  isCalendrierSoumis: (equipeId: number, mois: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DataContext = createContext<DataContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  // Auth state - L'utilisateur doit se connecter
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('sigap_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('sigap_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Data state avec données initiales depuis seed-data
  const [localites, setLocalites] = useState<Localite[]>(SEED_LOCALITES);
  const [equipes, setEquipes] = useState<Equipe[]>(SEED_EQUIPES);
  const [produits, setProduits] = useState<Produit[]>([...PRODUITS_DEFAUT, ...SEED_PRODUITS_SUPPLEMENTAIRES]);
  const [utilisateurs, setUtilisateurs] = useState<User[]>(SEED_USERS);
  const [plannings, setPlannings] = useState<PlanningHebdomadaire[]>(SEED_PLANNINGS);
  const [besoinsJournaliers, setBesoinsJournaliers] = useState<BesoinsJour[]>(SEED_BESOINS_JOURNALIERS);
  const [demandesModification, setDemandesModification] = useState<DemandeModification[]>(SEED_DEMANDES);

  const isAdmin = user?.role === 'admin';

  // Charger les données depuis la base de données au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les localités
        const localitesRes = await fetch('/api/localites');
        if (localitesRes.ok) {
          const localitesData = await localitesRes.json();
          if (localitesData.length > 0) {
            setLocalites(localitesData);
          }
        }

        // Charger les équipes
        const equipesRes = await fetch('/api/equipes');
        if (equipesRes.ok) {
          const equipesData = await equipesRes.json();
          if (equipesData.length > 0) {
            setEquipes(equipesData);
          }
        }

        // Charger les produits
        const produitsRes = await fetch('/api/produits');
        if (produitsRes.ok) {
          const produitsData = await produitsRes.json();
          if (produitsData.length > 0) {
            setProduits(produitsData);
          }
        }

        // Charger les plannings hebdomadaires
        const planningsRes = await fetch('/api/plannings');
        if (planningsRes.ok) {
          const planningsData = await planningsRes.json();
          if (planningsData.length > 0) {
            setPlannings(planningsData);
          }
        }

        // Charger les besoins journaliers
        const besoinsRes = await fetch('/api/besoins-jours');
        if (besoinsRes.ok) {
          const besoinsData = await besoinsRes.json();
          if (besoinsData.length > 0) {
            setBesoinsJournaliers(besoinsData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  const login = (email: string, password: string) => {
    // Simulation de connexion
    let loggedUser: User;
    if (email === 'admin@sigap.com') {
      loggedUser = {
        id: 1,
        nom: 'Admin Principal',
        email: 'admin@sigap.com',
        role: 'admin',
      };
    } else {
      loggedUser = {
        id: 2,
        nom: 'Commandant Abdou',
        email: 'abdou@sigap.com',
        role: 'responsable',
        equipeId: 1,
      };
    }
    setUser(loggedUser);
    // Sauvegarder dans localStorage
    localStorage.setItem('sigap_user', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    // Supprimer de localStorage
    localStorage.removeItem('sigap_user');
  };

  const switchRole = () => {
    let newUser: User;
    if (user?.role === 'admin') {
      newUser = {
        id: 2,
        nom: 'Commandant Abdou',
        email: 'abdou@sigap.com',
        role: 'responsable',
        equipeId: 1,
      };
    } else {
      newUser = {
        id: 1,
        nom: 'Admin Principal',
        email: 'admin@sigap.com',
        role: 'admin',
      };
    }
    setUser(newUser);
    // Sauvegarder dans localStorage
    localStorage.setItem('sigap_user', JSON.stringify(newUser));
  };

  // Localités management
  const addLocalite = async (localite: Omit<Localite, 'id'>) => {
    try {
      const response = await fetch('/api/localites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localite),
      });
      
      if (response.ok) {
        const newLocalite = await response.json();
        setLocalites([...localites, newLocalite]);
      } else {
        console.error('Erreur lors de l\'ajout de la localité');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const updateLocalite = async (id: number, updates: Partial<Localite>) => {
    try {
      const response = await fetch('/api/localites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (response.ok) {
        const updatedLocalite = await response.json();
        setLocalites(localites.map((l) => (l.id === id ? updatedLocalite : l)));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteLocalite = async (id: number) => {
    try {
      const response = await fetch(`/api/localites?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setLocalites(localites.filter((l) => l.id !== id));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Équipes management
  const addEquipe = async (equipe: Omit<Equipe, 'id'>) => {
    try {
      const response = await fetch('/api/equipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipe),
      });
      
      if (response.ok) {
        const newEquipe = await response.json();
        setEquipes([...equipes, newEquipe]);
      } else {
        console.error('Erreur lors de l\'ajout de l\'équipe');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const updateEquipe = async (id: number, updates: Partial<Equipe>) => {
    try {
      const response = await fetch('/api/equipes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (response.ok) {
        const updatedEquipe = await response.json();
        setEquipes(equipes.map((e) => (e.id === id ? updatedEquipe : e)));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteEquipe = async (id: number) => {
    try {
      const response = await fetch(`/api/equipes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEquipes(equipes.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Utilisateurs management
  const addUtilisateur = (utilisateurData: Omit<User, 'id'>) => {
    const newId = Math.max(...utilisateurs.map((u) => u.id), 0) + 1;
    setUtilisateurs([...utilisateurs, { ...utilisateurData, id: newId }]);
  };

  const updateUtilisateur = (id: number, updates: Partial<User & { password?: string }>) => {
    // On ignore le password ici car c'est juste pour la demo
    // Dans une vraie app, il faudrait hasher et stocker le password
    const { password, ...userUpdates } = updates;
    setUtilisateurs(utilisateurs.map((u) => (u.id === id ? { ...u, ...userUpdates } : u)));
  };

  const deleteUtilisateur = (id: number) => {
    setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
  };

  // Produits management
  const addProduit = async (produit: Omit<Produit, 'id'>) => {
    try {
      const response = await fetch('/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produit),
      });
      
      if (response.ok) {
        const newProduit = await response.json();
        setProduits([...produits, newProduit]);
      } else {
        console.error('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const updateProduit = async (id: number, updates: Partial<Produit>) => {
    try {
      const response = await fetch('/api/produits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (response.ok) {
        const updatedProduit = await response.json();
        setProduits(produits.map((p) => (p.id === id ? updatedProduit : p)));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteProduit = async (id: number) => {
    try {
      const response = await fetch(`/api/produits?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProduits(produits.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Plannings management
  const savePlanning = async (planningData: Omit<PlanningHebdomadaire, 'id'>) => {
    try {
      const response = await fetch('/api/plannings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planningData),
      });
      
      if (response.ok) {
        const savedPlanning = await response.json();
        
        // Mettre à jour l'état local
        const existingIndex = plannings.findIndex(
          (p) => p.equipeId === planningData.equipeId && p.mois === planningData.mois
        );

        if (existingIndex >= 0) {
          const updated = [...plannings];
          updated[existingIndex] = savedPlanning;
          setPlannings(updated);
        } else {
          setPlannings([...plannings, savedPlanning]);
        }
      } else {
        console.error('Erreur lors de la sauvegarde du planning');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getPlanning = (equipeId: number, mois: string) => {
    return plannings.find((p) => p.equipeId === equipeId && p.mois === mois);
  };

  // Besoins journaliers management
  const getBesoinsJour = (equipeId: number, dateKey: string) => {
    return besoinsJournaliers.find((b) => b.equipeId === equipeId && b.dateKey === dateKey);
  };

  const updateBesoinsJour = async (
    equipeId: number, 
    dateKey: string, 
    repasEffectifs: Partial<Record<'petit_dejeuner' | 'dejeuner' | 'diner', number>>
  ) => {
    const existingIndex = besoinsJournaliers.findIndex(
      (b) => b.equipeId === equipeId && b.dateKey === dateKey
    );

    const existing = existingIndex >= 0 ? besoinsJournaliers[existingIndex] : null;

    // Fonction helper pour calculer les provisions d'un repas
    const calculerProvisionsRepas = (effectif: number) => {
      const provisions: { [produitNom: string]: number } = {};
      PROVISIONS_CONFIG.forEach((prov) => {
        provisions[prov.nom] = effectif * prov.rationRepas;
      });
      return provisions;
    };

    // Créer ou mettre à jour chaque repas
    const petit_dejeuner = {
      effectif: repasEffectifs.petit_dejeuner ?? existing?.repas.petit_dejeuner.effectif ?? 0,
      provisions: calculerProvisionsRepas(repasEffectifs.petit_dejeuner ?? existing?.repas.petit_dejeuner.effectif ?? 0),
    };

    const dejeuner = {
      effectif: repasEffectifs.dejeuner ?? existing?.repas.dejeuner.effectif ?? 0,
      provisions: calculerProvisionsRepas(repasEffectifs.dejeuner ?? existing?.repas.dejeuner.effectif ?? 0),
    };

    const diner = {
      effectif: repasEffectifs.diner ?? existing?.repas.diner.effectif ?? 0,
      provisions: calculerProvisionsRepas(repasEffectifs.diner ?? existing?.repas.diner.effectif ?? 0),
    };

    // Calculer l'effectif total du jour
    const effectifJour = petit_dejeuner.effectif + dejeuner.effectif + diner.effectif;

    const besoinData = {
      equipeId,
      dateKey,
      effectifJour,
      repas: {
        petit_dejeuner,
        dejeuner,
        diner,
      },
      soumis: existing?.soumis || false,
    };

    try {
      // Sauvegarder dans la base de données
      const response = await fetch('/api/besoins-jours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(besoinData),
      });

      if (response.ok) {
        const savedBesoin = await response.json();
        
        // Mettre à jour l'état local
        if (existingIndex >= 0) {
          const updated = [...besoinsJournaliers];
          updated[existingIndex] = savedBesoin;
          setBesoinsJournaliers(updated);
        } else {
          setBesoinsJournaliers([...besoinsJournaliers, savedBesoin]);
        }
      } else {
        console.error('Erreur lors de la sauvegarde du besoin journalier');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const soumettreCalendrier = async (equipeId: number, mois: string): Promise<boolean> => {
    try {
      // Récupérer tous les besoins du mois et les marquer comme soumis
      const besoinsASubmit = besoinsJournaliers.filter(
        (b) => b.equipeId === equipeId && b.dateKey.startsWith(mois)
      );

      // Soumettre chaque besoin via l'API
      for (const besoin of besoinsASubmit) {
        await fetch('/api/besoins-jours', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            equipeId: besoin.equipeId,
            dateKey: besoin.dateKey,
          }),
        });
      }

      // Mettre à jour l'état local
      const dateNow = new Date().toISOString();
      const updated = besoinsJournaliers.map((b) => {
        if (b.equipeId === equipeId && b.dateKey.startsWith(mois)) {
          return { ...b, soumis: true, dateSubmission: dateNow };
        }
        return b;
      });
      setBesoinsJournaliers(updated);
      return true;
    } catch (error) {
      console.error('Erreur lors de la soumission du calendrier:', error);
      return false;
    }
  };

  const isCalendrierSoumis = (equipeId: number, mois: string): boolean => {
    const besoins = besoinsJournaliers.filter(
      (b) => b.equipeId === equipeId && b.dateKey.startsWith(mois)
    );
    return besoins.length > 0 && besoins.every((b) => b.soumis);
  };

  // Demandes de modification management
  const creerDemandeModification = (demandeData: Omit<DemandeModification, 'id' | 'statut' | 'dateCreation'>) => {
    const newId = Math.max(...demandesModification.map((d) => d.id), 0) + 1;
    const nouvelleDemande: DemandeModification = {
      ...demandeData,
      id: newId,
      statut: 'en_attente',
      dateCreation: new Date().toISOString(),
    };
    setDemandesModification([...demandesModification, nouvelleDemande]);
  };

  const traiterDemande = (demandeId: number, statut: StatutDemande, commentaire?: string) => {
    const demande = demandesModification.find((d) => d.id === demandeId);
    if (!demande) return;

    // Si approuvé, démarquer les besoins du mois comme non soumis pour permettre la modification
    if (statut === 'approuvee') {
      const updated = besoinsJournaliers.map((b) => {
        if (b.equipeId === demande.equipeId && b.dateKey.startsWith(demande.mois)) {
          return { ...b, soumis: false };
        }
        return b;
      });
      setBesoinsJournaliers(updated);
    }

    // Mettre à jour la demande
    const updatedDemandes = demandesModification.map((d) => {
      if (d.id === demandeId) {
        return {
          ...d,
          statut,
          dateTraitement: new Date().toISOString(),
          commentaireAdmin: commentaire,
        };
      }
      return d;
    });
    setDemandesModification(updatedDemandes);
  };

  const getDemandesEquipe = (equipeId: number) => {
    return demandesModification.filter((d) => d.equipeId === equipeId);
  };

  const getDemandesEnAttente = () => {
    return demandesModification.filter((d) => d.statut === 'en_attente');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout, switchRole }}>
      <DataContext.Provider
        value={{
          localites,
          equipes,
          produits,
          utilisateurs,
          plannings,
          besoinsJournaliers,
          demandesModification,
          addLocalite,
          updateLocalite,
          deleteLocalite,
          addEquipe,
          updateEquipe,
          deleteEquipe,
          addUtilisateur,
          updateUtilisateur,
          deleteUtilisateur,
          addProduit,
          updateProduit,
          deleteProduit,
          savePlanning,
          getPlanning,
          getBesoinsJour,
          updateBesoinsJour,
          soumettreCalendrier,
          creerDemandeModification,
          traiterDemande,
          getDemandesEquipe,
          getDemandesEnAttente,
          isCalendrierSoumis,
        }}
      >
        {children}
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};
