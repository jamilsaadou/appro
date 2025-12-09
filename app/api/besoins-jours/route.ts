import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer les besoins journaliers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const equipeId = searchParams.get('equipeId')
    const dateKey = searchParams.get('dateKey')
    const mois = searchParams.get('mois') // Format YYYY-MM

    const where: any = {}
    
    if (equipeId) {
      where.equipeId = parseInt(equipeId)
    }
    
    if (dateKey) {
      where.dateKey = dateKey
    } else if (mois) {
      // Récupérer tous les besoins d'un mois
      where.dateKey = {
        startsWith: mois
      }
    }

    const besoins = await prisma.besoinsJour.findMany({
      where,
      include: {
        equipe: {
          include: {
            localite: true,
          },
        },
      },
      orderBy: {
        dateKey: 'desc',
      },
    })

    return NextResponse.json(besoins)
  } catch (error) {
    console.error('Erreur lors de la récupération des besoins:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des besoins' },
      { status: 500 }
    )
  }
}

// POST - Créer ou mettre à jour un besoin journalier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { equipeId, dateKey, effectifJour, repas, soumis } = body

    if (!equipeId || !dateKey || !effectifJour || !repas) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être fournis' },
        { status: 400 }
      )
    }

    // Vérifier si un besoin existe déjà pour cette équipe et cette date
    const existingBesoin = await prisma.besoinsJour.findUnique({
      where: {
        equipeId_dateKey: {
          equipeId: parseInt(equipeId),
          dateKey,
        },
      },
    })

    let besoin
    if (existingBesoin) {
      // Mettre à jour
      besoin = await prisma.besoinsJour.update({
        where: {
          equipeId_dateKey: {
            equipeId: parseInt(equipeId),
            dateKey,
          },
        },
        data: {
          effectifJour: parseInt(effectifJour),
          repas,
          soumis: soumis || false,
          dateSubmission: soumis ? new Date() : null,
        },
        include: {
          equipe: true,
        },
      })
    } else {
      // Créer
      besoin = await prisma.besoinsJour.create({
        data: {
          equipeId: parseInt(equipeId),
          dateKey,
          effectifJour: parseInt(effectifJour),
          repas,
          soumis: soumis || false,
          dateSubmission: soumis ? new Date() : null,
        },
        include: {
          equipe: true,
        },
      })
    }

    return NextResponse.json(besoin, { status: existingBesoin ? 200 : 201 })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du besoin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du besoin' },
      { status: 500 }
    )
  }
}

// PUT - Soumettre les besoins (marquer comme soumis)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { equipeId, dateKey } = body

    if (!equipeId || !dateKey) {
      return NextResponse.json(
        { error: 'equipeId et dateKey requis' },
        { status: 400 }
      )
    }

    const besoin = await prisma.besoinsJour.update({
      where: {
        equipeId_dateKey: {
          equipeId: parseInt(equipeId),
          dateKey,
        },
      },
      data: {
        soumis: true,
        dateSubmission: new Date(),
      },
      include: {
        equipe: true,
      },
    })

    return NextResponse.json(besoin)
  } catch (error) {
    console.error('Erreur lors de la soumission du besoin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la soumission du besoin' },
      { status: 500 }
    )
  }
}
