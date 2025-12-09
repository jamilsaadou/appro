# Configuration de la Base de Données MySQL pour SIGAP

## ✅ Configuration Complétée

La base de données MySQL a été configurée avec succès avec les éléments suivants:

### 📋 Schéma de Base de Données

Les tables suivantes ont été créées dans la base `appro`:

1. **users** - Utilisateurs (admin et responsables d'équipe)
2. **localites** - Localités/Sites
3. **equipes** - Équipes sur chaque site
4. **produits** - Produits alimentaires configurables
5. **plannings_hebdomadaires** - Plannings hebdomadaires des équipes
6. **besoins_jours** - Besoins journaliers par équipe
7. **demandes_modifications** - Demandes de modification des calendriers

### 🌱 Données de Test

Les données suivantes ont été insérées:

- **6 Produits**: Riz, Café, Lait en poudre, Concentré tomate, Huile, Sucre
- **3 Localités**: Niamey, Maradi, Zinder
- **3 Équipes**: Équipe Alpha, Équipe Beta, Équipe Gamma
- **3 Utilisateurs**: 
  - admin@sigap.ne (admin) - mot de passe: admin123
  - moussa@sigap.ne (responsable) - mot de passe: resp123
  - fatima@sigap.ne (responsable) - mot de passe: resp123

## 🔧 Configuration

### Variables d'Environnement (.env)

```env
DATABASE_URL="mysql://root:root@localhost:8889/appro"
```

### Prisma

- Version: 5.22.0
- Client généré: ✅
- Migrations appliquées: ✅

## 🚀 API Routes Disponibles

### 1. Localités

**GET /api/localites**
- Récupère toutes les localités avec leurs équipes
```bash
curl http://localhost:3000/api/localites
```

**POST /api/localites**
- Crée une nouvelle localité
```bash
curl -X POST http://localhost:3000/api/localites \
  -H "Content-Type: application/json" \
  -d '{"nom":"Tahoua","region":"Tahoua","description":"Ville de Tahoua"}'
```

### 2. Équipes

**GET /api/equipes**
- Récupère toutes les équipes
```bash
curl http://localhost:3000/api/equipes
```

**POST /api/equipes**
- Crée une nouvelle équipe
```bash
curl -X POST http://localhost:3000/api/equipes \
  -H "Content-Type: application/json" \
  -d '{"localiteId":1,"nom":"Équipe Delta","effectif":15,"responsable":"Ali Mohamed"}'
```

**PUT /api/equipes**
- Met à jour une équipe
```bash
curl -X PUT http://localhost:3000/api/equipes \
  -H "Content-Type: application/json" \
  -d '{"id":1,"effectif":28}'
```

### 3. Produits

**GET /api/produits**
- Récupère tous les produits
```bash
curl http://localhost:3000/api/produits
```

**POST /api/produits**
- Crée un nouveau produit
```bash
curl -X POST http://localhost:3000/api/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"Pâtes","unite":"kg","rationParPersonne":0.15,"taille":25,"typeCondit":"Carton","prixUnitaire":15000,"categorie":"Céréales"}'
```

**PUT /api/produits**
- Met à jour un produit
```bash
curl -X PUT http://localhost:3000/api/produits \
  -H "Content-Type: application/json" \
  -d '{"id":1,"prixUnitaire":26000}'
```

**DELETE /api/produits?id=7**
- Supprime un produit
```bash
curl -X DELETE "http://localhost:3000/api/produits?id=7"
```

### 4. Besoins Journaliers

**GET /api/besoins-jours**
- Récupère les besoins (avec filtres optionnels)
```bash
# Tous les besoins
curl http://localhost:3000/api/besoins-jours

# Besoins d'une équipe
curl "http://localhost:3000/api/besoins-jours?equipeId=1"

# Besoins d'un mois
curl "http://localhost:3000/api/besoins-jours?mois=2025-01"

# Besoins d'un jour spécifique
curl "http://localhost:3000/api/besoins-jours?equipeId=1&dateKey=2025-01-15"
```

**POST /api/besoins-jours**
- Crée ou met à jour un besoin journalier
```bash
curl -X POST http://localhost:3000/api/besoins-jours \
  -H "Content-Type: application/json" \
  -d '{
    "equipeId": 1,
    "dateKey": "2025-01-15",
    "effectifJour": 25,
    "repas": {
      "petit_dejeuner": {
        "effectif": 25,
        "provisions": {"Café": 0.25, "Lait en poudre": 0.375, "Sucre": 1.25}
      },
      "dejeuner": {
        "effectif": 25,
        "provisions": {"Riz": 5, "Huile": 0.75, "Concentré tomate": 0.5}
      },
      "diner": {
        "effectif": 25,
        "provisions": {"Riz": 5, "Huile": 0.75, "Concentré tomate": 0.5}
      }
    },
    "soumis": false
  }'
```

**PUT /api/besoins-jours**
- Soumet les besoins (marque comme soumis)
```bash
curl -X PUT http://localhost:3000/api/besoins-jours \
  -H "Content-Type: application/json" \
  -d '{"equipeId":1,"dateKey":"2025-01-15"}'
```

## 📊 Accès à la Base de Données

### Via Prisma Studio

Pour visualiser et modifier les données directement:

```bash
cd sigap
npx prisma studio
```

Cela ouvrira une interface web sur http://localhost:5555

### Via MySQL

Connexion directe à MySQL:

```bash
mysql -u root -p -h localhost -P 8889 appro
```

Commandes utiles:

```sql
-- Voir toutes les tables
SHOW TABLES;

-- Voir les produits
SELECT * FROM produits;

-- Voir les équipes avec leurs localités
SELECT e.*, l.nom as localite_nom 
FROM equipes e 
JOIN localites l ON e.localiteId = l.id;

-- Voir les besoins journaliers
SELECT * FROM besoins_jours 
ORDER BY dateKey DESC;
```

## 🔄 Commandes de Maintenance

### Réinitialiser la base de données

```bash
# Supprimer et recréer les tables
npx prisma migrate reset

# Réappliquer les migrations
npx prisma migrate dev

# Régénérer les données de test
npx tsx prisma/seed.ts
```

### Régénérer le client Prisma

```bash
npx prisma generate
```

### Créer une nouvelle migration

```bash
npx prisma migrate dev --name nom_de_la_migration
```

## 🧪 Tests

### Test rapide de la connexion

```bash
# Démarrer le serveur de développement
npm run dev

# Dans un autre terminal, tester une route
curl http://localhost:3000/api/produits
```

Vous devriez recevoir une réponse JSON avec la liste des 6 produits.

## 📝 Structure des Fichiers

```
sigap/
├── prisma/
│   ├── schema.prisma         # Schéma de base de données
│   ├── seed.ts               # Script de données initiales
│   └── migrations/           # Migrations SQL
├── lib/
│   └── prisma.ts            # Client Prisma singleton
├── app/
│   └── api/
│       ├── localites/       # API Localités
│       ├── equipes/         # API Équipes
│       ├── produits/        # API Produits
│       └── besoins-jours/   # API Besoins journaliers
└── .env                     # Configuration (DATABASE_URL)
```

## ⚠️ Notes Importantes

1. **Sécurité**: Les mots de passe dans le seed sont en clair. En production, utilisez un système de hashing (bcrypt)
2. **Connexion**: Assurez-vous que MySQL tourne sur le port 8889 (MAMP par défaut)
3. **Base de données**: La base `appro` doit exister avant d'exécuter les migrations
4. **Environnement**: Le fichier .env est exclu de git pour la sécurité

## 🎯 Prochaines Étapes

Pour intégrer la base de données dans vos composants React:

1. Remplacer les imports de `data/seed-data.ts` par des appels API
2. Utiliser `fetch` ou `axios` pour récupérer les données
3. Implémenter la gestion d'état (useState, useEffect)
4. Ajouter la gestion des erreurs et le loading

Exemple:

```typescript
// Dans un composant
const [produits, setProduits] = useState([])

useEffect(() => {
  fetch('/api/produits')
    .then(res => res.json())
    .then(data => setProduits(data))
    .catch(error => console.error('Erreur:', error))
}, [])
```

## 📞 Support

Pour toute question sur la base de données ou les API, consultez:
- Documentation Prisma: https://www.prisma.io/docs
- Documentation Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
