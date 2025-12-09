import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer tous les produits
export async function GET() {
  try {
    const produits = await prisma.produit.findMany({
      orderBy: {
        nom: 'asc',
      },
    })
    return NextResponse.json(produits)
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, unite, rationParPersonne, taille, typeCondit, prixUnitaire, categorie } = body

    if (!nom || !unite || !rationParPersonne || !taille || !typeCondit || !prixUnitaire) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être fournis' },
        { status: 400 }
      )
    }

    const produit = await prisma.produit.create({
      data: {
        nom,
        unite,
        rationParPersonne: parseFloat(rationParPersonne),
        taille: parseFloat(taille),
        typeCondit,
        prixUnitaire: parseFloat(prixUnitaire),
        categorie,
      },
    })

    return NextResponse.json(produit, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nom, unite, rationParPersonne, taille, typeCondit, prixUnitaire, categorie } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      )
    }

    const produit = await prisma.produit.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom && { nom }),
        ...(unite && { unite }),
        ...(rationParPersonne && { rationParPersonne: parseFloat(rationParPersonne) }),
        ...(taille && { taille: parseFloat(taille) }),
        ...(typeCondit && { typeCondit }),
        ...(prixUnitaire && { prixUnitaire: parseFloat(prixUnitaire) }),
        ...(categorie !== undefined && { categorie }),
      },
    })

    return NextResponse.json(produit)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit
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

    await prisma.produit.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Produit supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}
