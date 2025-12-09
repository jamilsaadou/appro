import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer toutes les équipes
export async function GET() {
  try {
    const equipes = await prisma.equipe.findMany({
      include: {
        localite: true,
        users: true,
      },
      orderBy: {
        nom: 'asc',
      },
    })
    return NextResponse.json(equipes)
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des équipes' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle équipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { localiteId, nom, effectif, responsable } = body

    if (!localiteId || !nom || !effectif || !responsable) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const equipe = await prisma.equipe.create({
      data: {
        localiteId: parseInt(localiteId),
        nom,
        effectif: parseInt(effectif),
        responsable,
      },
      include: {
        localite: true,
      },
    })

    return NextResponse.json(equipe, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'équipe' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une équipe
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, localiteId, nom, effectif, responsable } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      )
    }

    const equipe = await prisma.equipe.update({
      where: { id: parseInt(id) },
      data: {
        ...(localiteId && { localiteId: parseInt(localiteId) }),
        ...(nom && { nom }),
        ...(effectif && { effectif: parseInt(effectif) }),
        ...(responsable && { responsable }),
      },
      include: {
        localite: true,
      },
    })

    return NextResponse.json(equipe)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'équipe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'équipe' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une équipe
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

    await prisma.equipe.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Équipe supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'équipe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'équipe' },
      { status: 500 }
    )
  }
}
