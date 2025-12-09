import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer les plannings hebdomadaires
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const equipeId = searchParams.get('equipeId')
    const mois = searchParams.get('mois') // Format YYYY-MM

    const where: any = {}
    
    if (equipeId) {
      where.equipeId = parseInt(equipeId)
    }
    
    if (mois) {
      where.mois = mois
    }

    const plannings = await prisma.planningHebdomadaire.findMany({
      where,
      include: {
        equipe: {
          include: {
            localite: true,
          },
        },
      },
      orderBy: {
        mois: 'desc',
      },
    })

    return NextResponse.json(plannings)
  } catch (error) {
    console.error('Erreur lors de la récupération des plannings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des plannings' },
      { status: 500 }
    )
  }
}

// POST - Créer ou mettre à jour un planning hebdomadaire
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { equipeId, mois, jours } = body

    if (!equipeId || !mois || !jours) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être fournis' },
        { status: 400 }
      )
    }

    // Vérifier si l'équipe existe
    const equipe = await prisma.equipe.findUnique({
      where: { id: parseInt(equipeId) },
    })

    if (!equipe) {
      return NextResponse.json(
        { error: `L'équipe avec l'ID ${equipeId} n'existe pas` },
        { status: 404 }
      )
    }

    // Vérifier si un planning existe déjà pour cette équipe et ce mois
    const existingPlanning = await prisma.planningHebdomadaire.findUnique({
      where: {
        equipeId_mois: {
          equipeId: parseInt(equipeId),
          mois,
        },
      },
    })

    let planning
    if (existingPlanning) {
      // Mettre à jour
      planning = await prisma.planningHebdomadaire.update({
        where: {
          equipeId_mois: {
            equipeId: parseInt(equipeId),
            mois,
          },
        },
        data: {
          jours,
        },
        include: {
          equipe: true,
        },
      })
    } else {
      // Créer
      planning = await prisma.planningHebdomadaire.create({
        data: {
          equipeId: parseInt(equipeId),
          mois,
          jours,
        },
        include: {
          equipe: true,
        },
      })
    }

    return NextResponse.json(planning, { status: existingPlanning ? 200 : 201 })
  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde du planning:', error)
    
    // Gestion spécifique des erreurs Prisma
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Erreur de référence: l\'équipe spécifiée n\'existe pas dans la base de données' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du planning', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un planning
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID du planning requis' },
        { status: 400 }
      )
    }

    await prisma.planningHebdomadaire.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du planning:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du planning' },
      { status: 500 }
    )
  }
}
