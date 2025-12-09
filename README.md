# SIGAP - Système Intégré de Gestion d'Approvisionnement des Personnels

Plateforme web moderne conçue pour optimiser la gestion des approvisionnements en vivres des équipes déployées en régions.

## 🚀 Fonctionnalités

### Pour les Administrateurs
- ✅ **Tableau de bord complet** avec statistiques et budgets
- ✅ **Gestion des localités** (zones géographiques)
- ✅ **Gestion des équipes** avec effectifs
- ✅ **Calendrier journalier** pour toutes les équipes
- ✅ **Récapitulatif mensuel** avec coûts détaillés
- ✅ **Paramètres système** et configuration
- ✅ **Visibilité complète** sur les prix et budgets

### Pour les Responsables d'Équipe
- ✅ **Tableau de bord** sans informations financières
- ✅ **Vue des équipes** (lecture seule)
- ✅ **Calendrier journalier** pour leur équipe uniquement
- ✅ **Récapitulatif mensuel** sans coûts
- ✅ **Accès limité** aux fonctionnalités sensibles

## 🛠️ Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **Lucide React** - Icônes SVG
- **React Hooks** - Gestion d'état

## 📦 Installation

```bash
# Cloner le projet
cd sigap

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Système de Contrôle d'Accès

### Rôles
- **Admin** : Accès complet, gestion de toutes les données, visibilité sur les coûts
- **Responsable** : Accès limité à son équipe, sans visibilité sur les coûts

### Changement de Rôle (Dev Mode)
Un bouton "Changer rôle" est disponible dans le header pour basculer entre admin et responsable pendant le développement.

## 📊 Configuration des Provisions

Le système calcule automatiquement les besoins basés sur :
- **Riz** : 200g/pers/jour - 50 kg/sac - 25,000 FCFA
- **Café** : 10g/pers/jour - 1 kg/boîte - 5,000 FCFA
- **Lait en poudre** : 15g/pers/jour - 2.5 kg/boîte - 12,000 FCFA
- **Concentré tomate** : 20g/pers/jour - 400g/boîte - 800 FCFA
- **Huile** : 30ml/pers/jour - 5 L/bidon - 8,000 FCFA

## 📅 Utilisation du Calendrier

1. Sélectionner une équipe
2. Cliquer sur un jour pour modifier l'effectif
3. Le système calcule automatiquement les besoins
4. Option "Appliquer à tout le mois" disponible

## 📈 Récapitulatif Mensuel

- Calcul automatique des besoins mensuels
- Conversion en conditionnements
- Coûts totaux (admin uniquement)
- Synthèse globale de toutes les équipes

## 🗂️ Structure du Projet

```
sigap/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
├── components/
│   ├── Header.tsx          # En-tête avec recherche
│   ├── Sidebar.tsx         # Menu de navigation
│   ├── Dashboard.tsx       # Tableau de bord
│   ├── Localites.tsx       # Gestion des localités
│   ├── Equipes.tsx         # Gestion des équipes
│   ├── Calendrier.tsx      # Calendrier journalier
│   ├── RecapMensuel.tsx    # Récapitulatif mensuel
│   └── Parametres.tsx      # Paramètres système
├── contexts/
│   └── AuthContext.tsx     # Contexte auth et données
├── types/
│   └── index.ts            # Types TypeScript
└── README.md
```

## 🎨 Design System

### Couleurs
- **Olive 600** (#6d7a49) - Couleur principale
- **Olive 700** (#555f3a) - Hover/accents
- **Olive 100** (#eef0e5) - Fond actif
- **Olive 50** (#f7f8f3) - Fond léger

### Typographie
- **Inter** - Police principale
- Tailles cohérentes et hiérarchie claire

## 🔄 Évolutions Futures

- [ ] Backend API REST avec Node.js/Express
- [ ] Base de données PostgreSQL
- [ ] Authentification JWT
- [ ] Gestion des stocks en temps réel
- [ ] Notifications email/SMS
- [ ] Export PDF/Excel
- [ ] Application mobile React Native

## 📝 Notes de Développement

- Les données sont actuellement stockées en mémoire (state React)
- Le système de rôles est simulé pour la démo
- Mode développement activé avec bouton de changement de rôle

## 📄 License

Usage interne uniquement

---

**Version:** 1.0  
**Date:** Décembre 2025
