import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer toutes les localités
export async function GET() {
  try {
    const localites = await prisma.localite.findMany({
      include: {
        equipes: true,
      },
      orderBy: {
        nom: 'asc',
      },
    })
    return NextResponse.json(localites)
  } catch (error) {
    console.error('Erreur lors de la récupération des localités:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des localités' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle localité
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, region, description } = body

    if (!nom || !region || !description) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const localite = await prisma.localite.create({
      data: {
        nom,
        region,
        description,
      },
    })

    return NextResponse.json(localite, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la localité:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la localité' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une localité
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nom, region, description } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      )
    }

    const localite = await prisma.localite.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom && { nom }),
        ...(region && { region }),
        ...(description && { description }),
      },
      include: {
        equipes: true,
      },
    })

    return NextResponse.json(localite)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la localité:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la localité' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une localité
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      )
    }

    const localiteId = parseInt(id)

    // Vérifier si la localité existe avant de la supprimer
    const localiteExistante = await prisma.localite.findUnique({
      where: { id: localiteId },
    })

    if (!localiteExistante) {
      return NextResponse.json(
        { error: 'Localité non trouvée ou déjà supprimée' },
        { status: 404 }
      )
    }

    await prisma.localite.delete({
      where: { id: localiteId },
    })

    return NextResponse.json({ message: 'Localité supprimée avec succès' })
  } catch (error: unknown) {
    console.error('Erreur lors de la suppression de la localité:', error)
    
    // Gérer spécifiquement l'erreur P2025 (enregistrement non trouvé)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Localité non trouvée ou déjà supprimée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la localité' },
      { status: 500 }
    )
  }
}
