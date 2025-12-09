import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer des produits
  console.log('📦 Création des produits...')
  const produits = await Promise.all([
    prisma.produit.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nom: 'Riz',
        unite: 'kg',
        rationParPersonne: 0.2,
        taille: 50,
        typeCondit: 'Sac',
        prixUnitaire: 25000,
        categorie: 'Céréales',
      },
    }),
    prisma.produit.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        nom: 'Café',
        unite: 'kg',
        rationParPersonne: 0.01,
        taille: 1,
        typeCondit: 'Boîte',
        prixUnitaire: 5000,
        categorie: 'Boissons',
      },
    }),
    prisma.produit.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        nom: 'Lait en poudre',
        unite: 'kg',
        rationParPersonne: 0.015,
        taille: 2.5,
        typeCondit: 'Boîte',
        prixUnitaire: 12000,
        categorie: 'Boissons',
      },
    }),
    prisma.produit.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        nom: 'Concentré tomate',
        unite: 'kg',
        rationParPersonne: 0.02,
        taille: 0.4,
        typeCondit: 'Boîte',
        prixUnitaire: 800,
        categorie: 'Condiments',
      },
    }),
    prisma.produit.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        nom: 'Huile',
        unite: 'L',
        rationParPersonne: 0.03,
        taille: 5,
        typeCondit: 'Bidon',
        prixUnitaire: 8000,
        categorie: 'Condiments',
      },
    }),
    prisma.produit.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        nom: 'Sucre',
        unite: 'kg',
        rationParPersonne: 0.05,
        taille: 1,
        typeCondit: 'Sac',
        prixUnitaire: 600,
        categorie: 'Condiments',
      },
    }),
  ])
  console.log(`✅ ${produits.length} produits créés`)

  // Créer des localités
  console.log('📍 Création des localités...')
  const localites = await Promise.all([
    prisma.localite.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nom: 'Niamey',
        region: 'Niamey',
        description: 'Capitale du Niger',
      },
    }),
    prisma.localite.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        nom: 'Maradi',
        region: 'Maradi',
        description: 'Troisième ville du Niger',
      },
    }),
    prisma.localite.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        nom: 'Zinder',
        region: 'Zinder',
        description: 'Deuxième ville du Niger',
      },
    }),
  ])
  console.log(`✅ ${localites.length} localités créées`)

  // Créer des équipes
  console.log('👥 Création des équipes...')
  const equipes = await Promise.all([
    prisma.equipe.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        localiteId: 1,
        nom: 'Équipe Alpha',
        effectif: 25,
        responsable: 'Moussa Ibrahim',
      },
    }),
    prisma.equipe.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        localiteId: 1,
        nom: 'Équipe Beta',
        effectif: 30,
        responsable: 'Fatima Hassan',
      },
    }),
    prisma.equipe.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        localiteId: 2,
        nom: 'Équipe Gamma',
        effectif: 20,
        responsable: 'Abdoulaye Sani',
      },
    }),
  ])
  console.log(`✅ ${equipes.length} équipes créées`)

  // Créer des utilisateurs
  console.log('👤 Création des utilisateurs...')
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@sigap.ne' },
      update: {},
      create: {
        nom: 'Administrateur',
        email: 'admin@sigap.ne',
        password: 'admin123', // À hash dans une vraie application
        role: 'admin',
      },
    }),
    prisma.user.upsert({
      where: { email: 'moussa@sigap.ne' },
      update: {},
      create: {
        nom: 'Moussa Ibrahim',
        email: 'moussa@sigap.ne',
        password: 'resp123', // À hash dans une vraie application
        role: 'responsable',
        equipeId: 1,
      },
    }),
    prisma.user.upsert({
      where: { email: 'fatima@sigap.ne' },
      update: {},
      create: {
        nom: 'Fatima Hassan',
        email: 'fatima@sigap.ne',
        password: 'resp123', // À hash dans une vraie application
        role: 'responsable',
        equipeId: 2,
      },
    }),
  ])
  console.log(`✅ ${users.length} utilisateurs créés`)

  console.log('✨ Seeding terminé avec succès !')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
