'use client';

import { useState } from 'react';
import { FileText, Download, Eye, EyeOff, FileDown, Coffee, UtensilsCrossed, Moon } from 'lucide-react';
import { useData, useAuth } from '@/contexts/AuthContext';
import { JOURS_SEMAINE } from '@/types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type RepasType = 'petit_dejeuner' | 'dejeuner' | 'diner';
type CoutParRepas = { petit_dejeuner: number; dejeuner: number; diner: number; total: number };
type BesoinsParRepas = {
  [produitId: number]: {
    petit_dejeuner: { besoinBrut: number; nbCondits: number; cout: number };
    dejeuner: { besoinBrut: number; nbCondits: number; cout: number };
    diner: { besoinBrut: number; nbCondits: number; cout: number };
    total: { besoinBrut: number; nbCondits: number; cout: number };
  };
};

export default function RecapAvance() {
  const { isAdmin } = useAuth();
  const { equipes, produits, plannings } = useData();
  const [moisSelectionne] = useState('2025-12');
  const [viewMode, setViewMode] = useState<'simple' | 'avance'>('simple');

  // Fonction pour calculer le nombre d'occurrences de chaque jour dans un mois
  const getJourOccurrences = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0);
    const occurrences: { [key: string]: number } = {
      Lundi: 0,
      Mardi: 0,
      Mercredi: 0,
      Jeudi: 0,
      Vendredi: 0,
      Samedi: 0,
      Dimanche: 0,
    };

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      const dayName = JOURS_SEMAINE[date.getDay() === 0 ? 6 : date.getDay() - 1];
      occurrences[dayName]++;
    }

    return occurrences;
  };

  // Calculer les coûts par repas pour une équipe
  const calculateCoutsParRepas = (equipeId: number): CoutParRepas | null => {
    const planning = plannings.find(p => p.equipeId === equipeId && p.mois === moisSelectionne);
    const equipe = equipes.find(e => e.id === equipeId);
    
    if (!planning || !equipe) return null;

    const [year, month] = moisSelectionne.split('-').map(Number);
    const jourOccurrences = getJourOccurrences(year, month);

    const couts: CoutParRepas = { petit_dejeuner: 0, dejeuner: 0, diner: 0, total: 0 };
    const repasTypes: RepasType[] = ['petit_dejeuner', 'dejeuner', 'diner'];

    JOURS_SEMAINE.forEach(jour => {
      const repasJour = planning.jours[jour];
      if (!repasJour) return;
      
      const nbOccurrences = jourOccurrences[jour];

      repasTypes.forEach(repasType => {
        const produitsRepas = repasJour[repasType] || [];
        
        produitsRepas.forEach(produitId => {
          const produit = produits.find(p => p.id === produitId);
          if (!produit) return;

          const besoinParRepas = equipe.effectif * produit.rationParPersonne;
          const besoinTotal = besoinParRepas * nbOccurrences;
          const nbCondits = Math.ceil(besoinTotal / produit.taille);
          const cout = nbCondits * produit.prixUnitaire;

          couts[repasType] += cout;
        });
      });
    });

    couts.total = couts.petit_dejeuner + couts.dejeuner + couts.diner;
    return couts;
  };

  // Calculer les besoins mensuels par équipe avec détail par repas
  const calculateBesoinsEquipeParRepas = (equipeId: number): BesoinsParRepas | null => {
    const planning = plannings.find(p => p.equipeId === equipeId && p.mois === moisSelectionne);
    const equipe = equipes.find(e => e.id === equipeId);
    
    if (!planning || !equipe) return null;

    const [year, month] = moisSelectionne.split('-').map(Number);
    const jourOccurrences = getJourOccurrences(year, month);

    const besoinsParProduit: BesoinsParRepas = {};
    const repasTypes: RepasType[] = ['petit_dejeuner', 'dejeuner', 'diner'];

    JOURS_SEMAINE.forEach(jour => {
      const repasJour = planning.jours[jour];
      if (!repasJour) return;
      
      const nbOccurrences = jourOccurrences[jour];

      repasTypes.forEach(repasType => {
        const produitsRepas = repasJour[repasType] || [];
        
        produitsRepas.forEach(produitId => {
          const produit = produits.find(p => p.id === produitId);
          if (!produit) return;

          const besoinParRepas = equipe.effectif * produit.rationParPersonne;
          const besoinTotal = besoinParRepas * nbOccurrences;

          if (!besoinsParProduit[produitId]) {
            besoinsParProduit[produitId] = {
              petit_dejeuner: { besoinBrut: 0, nbCondits: 0, cout: 0 },
              dejeuner: { besoinBrut: 0, nbCondits: 0, cout: 0 },
              diner: { besoinBrut: 0, nbCondits: 0, cout: 0 },
              total: { besoinBrut: 0, nbCondits: 0, cout: 0 },
            };
          }

          besoinsParProduit[produitId][repasType].besoinBrut += besoinTotal;
        });
      });
    });

    // Calculer les conditionnements et coûts pour chaque repas
    Object.keys(besoinsParProduit).forEach(produitId => {
      const produit = produits.find(p => p.id === Number(produitId));
      if (!produit) return;

      const besoin = besoinsParProduit[Number(produitId)];
      
      repasTypes.forEach(repasType => {
        if (besoin[repasType].besoinBrut > 0) {
          besoin[repasType].nbCondits = Math.ceil(besoin[repasType].besoinBrut / produit.taille);
          besoin[repasType].cout = besoin[repasType].nbCondits * produit.prixUnitaire;
        }
      });

      // Calculer les totaux
      besoin.total.besoinBrut = besoin.petit_dejeuner.besoinBrut + besoin.dejeuner.besoinBrut + besoin.diner.besoinBrut;
      besoin.total.nbCondits = Math.ceil(besoin.total.besoinBrut / produit.taille);
      besoin.total.cout = besoin.total.nbCondits * produit.prixUnitaire;
    });

    return besoinsParProduit;
  };

  // Calculer les besoins mensuels par équipe (version simple)
  const calculateBesoinsEquipe = (equipeId: number) => {
    const besoins = calculateBesoinsEquipeParRepas(equipeId);
    if (!besoins) return null;
    
    // Convertir en format simple
    const besoinsSimple: { [produitId: number]: { besoinBrut: number; nbCondits: number; cout: number } } = {};
    Object.entries(besoins).forEach(([produitId, data]) => {
      besoinsSimple[Number(produitId)] = data.total;
    });
    return besoinsSimple;
  };

  // Calculer le total pour toutes les équipes
  const calculateTotalGlobal = () => {
    const totalParProduit: { [produitId: number]: { besoinBrut: number; nbCondits: number; cout: number } } = {};

    equipes.forEach(equipe => {
      const besoins = calculateBesoinsEquipe(equipe.id);
      if (!besoins) return;

      Object.entries(besoins).forEach(([produitId, data]) => {
        const id = Number(produitId);
        if (!totalParProduit[id]) {
          totalParProduit[id] = { besoinBrut: 0, nbCondits: 0, cout: 0 };
        }
        totalParProduit[id].besoinBrut += data.besoinBrut;
        totalParProduit[id].nbCondits += data.nbCondits;
        totalParProduit[id].cout += data.cout;
      });
    });

    return totalParProduit;
  };

  const totalGlobal = calculateTotalGlobal();
  const budgetTotal = Object.values(totalGlobal).reduce((sum, data) => sum + data.cout, 0);

  // Export en Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const [year, month] = moisSelectionne.split('-');
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthName = monthNames[parseInt(month) - 1];

    // Feuille 1: Synthèse Globale
    const syntheseData = [
      ['RÉCAPITULATIF MENSUEL - BASÉ SUR PLANNINGS HEBDOMADAIRES'],
      [`Période: ${monthName} ${year}`],
      [''],
      ['SYNTHÈSE GLOBALE'],
      [''],
      ['Nombre d\'équipes', equipes.length],
      ['Nombre de produits différents', Object.keys(totalGlobal).length],
      ['Budget total mensuel', `${budgetTotal.toLocaleString()} FCFA`],
      [''],
      ['Généré le', new Date().toLocaleString('fr-FR')],
    ];

    const wsSynthese = XLSX.utils.aoa_to_sheet(syntheseData);
    XLSX.utils.book_append_sheet(wb, wsSynthese, 'Synthèse');

    // Feuille 2: Détails par Équipe
    const detailsData: any[] = [
      ['DÉTAILS PAR ÉQUIPE'],
      [`Période: ${monthName} ${year}`],
      [''],
    ];

    equipes.forEach((equipe, index) => {
      const besoins = calculateBesoinsEquipe(equipe.id);
      if (!besoins || Object.keys(besoins).length === 0) return;

      const totalEquipe = Object.values(besoins).reduce((sum, data) => sum + data.cout, 0);

      detailsData.push([`ÉQUIPE ${index + 1}: ${equipe.nom}`]);
      detailsData.push(['Effectif', `${equipe.effectif} personnes`]);
      detailsData.push(['Responsable', equipe.responsable]);
      detailsData.push(['']);
      detailsData.push(['Produit', 'Catégorie', 'Besoin Brut', 'Unité', 'Conditionnement', 'Quantité', 'Prix Unit.', 'Coût Total']);

      Object.entries(besoins).forEach(([produitId, data]) => {
        const produit = produits.find(p => p.id === Number(produitId));
        if (!produit) return;

        detailsData.push([
          produit.nom,
          produit.categorie || '',
          data.besoinBrut.toFixed(2),
          produit.unite,
          `${produit.typeCondit} de ${produit.taille} ${produit.unite}`,
          data.nbCondits,
          produit.prixUnitaire.toLocaleString(),
          data.cout.toLocaleString(),
        ]);
      });

      detailsData.push(['', '', '', '', '', '', 'TOTAL ÉQUIPE', totalEquipe.toLocaleString()]);
      detailsData.push(['']);
      detailsData.push(['']);
    });

    const wsDetails = XLSX.utils.aoa_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Détails par Équipe');

    // Feuille 3: Vue Consolidée
    const consolidationData: any[] = [
      ['VUE CONSOLIDÉE - TOUS LES PRODUITS'],
      [`Période: ${monthName} ${year}`],
      [''],
      ['Produit', 'Catégorie', 'Besoin Total', 'Unité', 'Conditionnement', 'Quantité Totale', 'Prix Unit.', 'Coût Total', '% Budget'],
      [''],
    ];

    Object.entries(totalGlobal)
      .sort(([, a], [, b]) => b.cout - a.cout) // Trier par coût décroissant
      .forEach(([produitId, data]) => {
        const produit = produits.find(p => p.id === Number(produitId));
        if (!produit) return;

        const percentBudget = ((data.cout / budgetTotal) * 100).toFixed(1);

        consolidationData.push([
          produit.nom,
          produit.categorie || '',
          data.besoinBrut.toFixed(2),
          produit.unite,
          `${produit.typeCondit} de ${produit.taille} ${produit.unite}`,
          data.nbCondits,
          produit.prixUnitaire.toLocaleString(),
          data.cout.toLocaleString(),
          `${percentBudget}%`,
        ]);
      });

    consolidationData.push(['']);
    consolidationData.push(['', '', '', '', '', '', 'TOTAL GÉNÉRAL', budgetTotal.toLocaleString(), '100%']);

    const wsConsolidation = XLSX.utils.aoa_to_sheet(consolidationData);
    XLSX.utils.book_append_sheet(wb, wsConsolidation, 'Vue Consolidée');

    // Feuille 4: Tableau Croisé (Équipes x Produits)
    const croiseData: any[] = [
      ['TABLEAU CROISÉ - COÛTS PAR ÉQUIPE ET PRODUIT'],
      [`Période: ${monthName} ${year}`],
      [''],
    ];

    // En-têtes des colonnes
    const produitsIds = Object.keys(totalGlobal).map(Number);
    const produitsNoms = produitsIds.map(id => {
      const p = produits.find(prod => prod.id === id);
      return p ? p.nom : '';
    });
    
    const headerRow = ['Équipe', 'Effectif', ...produitsNoms, 'TOTAL'];
    croiseData.push(headerRow);

    // Lignes par équipe
    let totalEffectif = 0;
    const totauxProduits: { [id: number]: number } = {};
    let grandTotal = 0;

    equipes.forEach(equipe => {
      const besoins = calculateBesoinsEquipe(equipe.id);
      const row: any[] = [equipe.nom, equipe.effectif];
      let totalLigne = 0;

      produitsIds.forEach(produitId => {
        const cout = besoins?.[produitId]?.cout || 0;
        row.push(cout);
        totalLigne += cout;
        totauxProduits[produitId] = (totauxProduits[produitId] || 0) + cout;
      });

      row.push(totalLigne);
      croiseData.push(row);
      
      totalEffectif += equipe.effectif;
      grandTotal += totalLigne;
    });

    // Ligne de totaux
    croiseData.push(['']);
    const totalRow: any[] = ['TOTAL', totalEffectif];
    produitsIds.forEach(produitId => {
      totalRow.push(totauxProduits[produitId] || 0);
    });
    totalRow.push(grandTotal);
    croiseData.push(totalRow);

    const wsCroise = XLSX.utils.aoa_to_sheet(croiseData);
    XLSX.utils.book_append_sheet(wb, wsCroise, 'Tableau Croisé');

    // Feuille 5: Répartition par Catégorie
    const categoriesData: any[] = [
      ['RÉPARTITION PAR CATÉGORIE'],
      [`Période: ${monthName} ${year}`],
      [''],
      ['Catégorie', 'Nombre de Produits', 'Coût Total', '% Budget'],
      [''],
    ];

    const parCategorie: { [cat: string]: { nbProduits: number; cout: number } } = {};

    Object.entries(totalGlobal).forEach(([produitId, data]) => {
      const produit = produits.find(p => p.id === Number(produitId));
      const categorie = produit?.categorie || 'Non classé';

      if (!parCategorie[categorie]) {
        parCategorie[categorie] = { nbProduits: 0, cout: 0 };
      }
      parCategorie[categorie].nbProduits++;
      parCategorie[categorie].cout += data.cout;
    });

    Object.entries(parCategorie)
      .sort(([, a], [, b]) => b.cout - a.cout)
      .forEach(([categorie, data]) => {
        const percent = ((data.cout / budgetTotal) * 100).toFixed(1);
        categoriesData.push([
          categorie,
          data.nbProduits,
          data.cout.toLocaleString(),
          `${percent}%`,
        ]);
      });

    categoriesData.push(['']);
    categoriesData.push(['TOTAL', Object.values(parCategorie).reduce((s, d) => s + d.nbProduits, 0), budgetTotal.toLocaleString(), '100%']);

    const wsCategories = XLSX.utils.aoa_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, wsCategories, 'Par Catégorie');

    // Télécharger le fichier
    const fileName = `Rapport_Complet_${monthName}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Export en PDF
  const handleExportPDF = () => {
    const [year, month] = moisSelectionne.split('-');
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthName = monthNames[parseInt(month) - 1];

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // En-tête du document
    doc.setFontSize(18);
    doc.setTextColor(109, 122, 73); // #6d7a49
    doc.text('SIGAP - Rapport d\'Approvisionnement', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Récapitulatif Mensuel - ${monthName} ${year}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });

    // Synthèse globale
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(109, 122, 73);
    doc.text('SYNTHÈSE GLOBALE', 14, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const totalEffectif = equipes.reduce((sum, e) => sum + e.effectif, 0);
    
    const syntheseData = [
      ['Nombre d\'équipes', `${equipes.length}`],
      ['Effectif total', `${totalEffectif} personnes`],
      ['Nombre de produits', `${Object.keys(totalGlobal).length}`],
      ['Budget total mensuel', `${budgetTotal.toLocaleString()} FCFA`],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [],
      body: syntheseData,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      margin: { left: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Vue consolidée des produits
    doc.setFontSize(12);
    doc.setTextColor(109, 122, 73);
    doc.text('VUE CONSOLIDÉE - TOUS LES PRODUITS', 14, yPosition);

    yPosition += 5;

    const consolidatedTableData = Object.entries(totalGlobal)
      .sort(([, a], [, b]) => b.cout - a.cout)
      .map(([produitId, data]) => {
        const produit = produits.find(p => p.id === Number(produitId));
        if (!produit) return null;
        const percentBudget = ((data.cout / budgetTotal) * 100).toFixed(1);
        return [
          produit.nom,
          produit.categorie || '-',
          `${data.besoinBrut.toFixed(2)} ${produit.unite}`,
          `${data.nbCondits}`,
          `${data.cout.toLocaleString()} F`,
          `${percentBudget}%`,
        ];
      })
      .filter(Boolean);

    autoTable(doc, {
      startY: yPosition,
      head: [['Produit', 'Catégorie', 'Besoin Total', 'Qté', 'Coût', '% Budget']],
      body: consolidatedTableData as string[][],
      theme: 'striped',
      headStyles: { fillColor: [109, 122, 73], textColor: 255 },
      styles: { fontSize: 9 },
      foot: [['TOTAL GÉNÉRAL', '', '', '', `${budgetTotal.toLocaleString()} F`, '100%']],
      footStyles: { fillColor: [240, 240, 240], textColor: [109, 122, 73], fontStyle: 'bold' },
    });

    // Nouvelle page pour les détails par équipe
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.setTextColor(109, 122, 73);
    doc.text('DÉTAILS PAR ÉQUIPE', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Pour chaque équipe
    equipes.forEach((equipe, index) => {
      const besoins = calculateBesoinsEquipe(equipe.id);
      const coutsRepas = calculateCoutsParRepas(equipe.id);
      if (!besoins || Object.keys(besoins).length === 0 || !coutsRepas) return;

      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      // Titre de l'équipe
      doc.setFontSize(11);
      doc.setTextColor(109, 122, 73);
      doc.text(`${index + 1}. ${equipe.nom}`, 14, yPosition);
      
      yPosition += 5;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Effectif: ${equipe.effectif} personnes | Responsable: ${equipe.responsable}`, 14, yPosition);

      yPosition += 8;

      // Tableau des coûts par repas
      const coutsRepasData = [
        ['Petit Déjeuner', `${coutsRepas.petit_dejeuner.toLocaleString()} F`],
        ['Déjeuner', `${coutsRepas.dejeuner.toLocaleString()} F`],
        ['Dîner', `${coutsRepas.diner.toLocaleString()} F`],
        ['TOTAL', `${coutsRepas.total.toLocaleString()} F`],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Repas', 'Coût Mensuel']],
        body: coutsRepasData,
        theme: 'striped',
        headStyles: { fillColor: [180, 130, 70], textColor: 255, fontSize: 8 },
        styles: { fontSize: 8, cellWidth: 'auto' },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 50, halign: 'right' },
        },
        margin: { left: 14, right: 100 },
        tableWidth: 100,
      });

      yPosition = (doc as any).lastAutoTable.finalY + 5;

      // Tableau des besoins de l'équipe
      const equipeTableData = Object.entries(besoins).map(([produitId, data]) => {
        const produit = produits.find(p => p.id === Number(produitId));
        if (!produit) return null;
        return [
          produit.nom,
          `${data.besoinBrut.toFixed(2)} ${produit.unite}`,
          `${produit.typeCondit} ${produit.taille}${produit.unite}`,
          `${data.nbCondits}`,
          `${data.cout.toLocaleString()} F`,
        ];
      }).filter(Boolean);

      autoTable(doc, {
        startY: yPosition,
        head: [['Produit', 'Besoin Brut', 'Condit.', 'Qté', 'Coût']],
        body: equipeTableData as string[][],
        theme: 'grid',
        headStyles: { fillColor: [109, 122, 73], textColor: 255, fontSize: 8 },
        styles: { fontSize: 8 },
        foot: [['TOTAL', '', '', '', `${coutsRepas.total.toLocaleString()} F`]],
        footStyles: { fillColor: [238, 240, 229], fontStyle: 'bold', fontSize: 8 },
        margin: { left: 14, right: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    });

    // Nouvelle page pour la répartition par catégorie
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.setTextColor(109, 122, 73);
    doc.text('RÉPARTITION PAR CATÉGORIE', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Calcul par catégorie
    const parCategorie: { [cat: string]: { nbProduits: number; cout: number } } = {};
    Object.entries(totalGlobal).forEach(([produitId, data]) => {
      const produit = produits.find(p => p.id === Number(produitId));
      const categorie = produit?.categorie || 'Non classé';
      if (!parCategorie[categorie]) {
        parCategorie[categorie] = { nbProduits: 0, cout: 0 };
      }
      parCategorie[categorie].nbProduits++;
      parCategorie[categorie].cout += data.cout;
    });

    const categorieTableData = Object.entries(parCategorie)
      .sort(([, a], [, b]) => b.cout - a.cout)
      .map(([categorie, data]) => {
        const percent = ((data.cout / budgetTotal) * 100).toFixed(1);
        return [categorie, `${data.nbProduits}`, `${data.cout.toLocaleString()} F`, `${percent}%`];
      });

    autoTable(doc, {
      startY: yPosition,
      head: [['Catégorie', 'Nb Produits', 'Coût Total', '% Budget']],
      body: categorieTableData,
      theme: 'striped',
      headStyles: { fillColor: [109, 122, 73], textColor: 255 },
      styles: { fontSize: 10 },
      foot: [['TOTAL', `${Object.values(parCategorie).reduce((s, d) => s + d.nbProduits, 0)}`, `${budgetTotal.toLocaleString()} F`, '100%']],
      footStyles: { fillColor: [240, 240, 240], textColor: [109, 122, 73], fontStyle: 'bold' },
    });

    // Pied de page sur toutes les pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`SIGAP - Système de Gestion d'Approvisionnement | Page ${i}/${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    // Télécharger le PDF
    const fileName = `Rapport_SIGAP_${monthName}_${year}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Récapitulatif Mensuel</h2>
          <p className="text-gray-600 mt-1">Analyse des besoins basée sur les plannings hebdomadaires</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'simple' ? 'avance' : 'simple')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'simple' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            {viewMode === 'simple' ? 'Vue Avancée' : 'Vue Simple'}
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
          >
            <Download className="w-5 h-5" />
            Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            PDF
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Mois</p>
          <p className="text-2xl font-bold text-gray-900">{moisSelectionne}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Équipes</p>
          <p className="text-2xl font-bold text-gray-900">{equipes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Produits</p>
          <p className="text-2xl font-bold text-gray-900">{Object.keys(totalGlobal).length}</p>
        </div>
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Budget Total</p>
            <p className="text-2xl font-bold text-[#6d7a49]">{Math.round(budgetTotal / 1000)}k F</p>
          </div>
        )}
      </div>

      {/* Vue Simple */}
      {viewMode === 'simple' && (
        <div className="space-y-6">
          {equipes.map(equipe => {
            const besoins = calculateBesoinsEquipe(equipe.id);
            const coutsRepas = calculateCoutsParRepas(equipe.id);
            if (!besoins || Object.keys(besoins).length === 0 || !coutsRepas) return null;

            return (
              <div key={equipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#6d7a49] to-[#555f3a] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{equipe.nom}</h3>
                      <p className="text-sm opacity-90">Effectif: {equipe.effectif} personnes</p>
                    </div>
                    {isAdmin && (
                      <div className="text-right">
                        <p className="text-2xl font-bold">{coutsRepas.total.toLocaleString()} F</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coûts par repas */}
                {isAdmin && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Coffee className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Petit Déjeuner</p>
                        <p className="text-lg font-bold text-amber-700">{coutsRepas.petit_dejeuner.toLocaleString()} F</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Déjeuner</p>
                        <p className="text-lg font-bold text-orange-700">{coutsRepas.dejeuner.toLocaleString()} F</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Moon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dîner</p>
                        <p className="text-lg font-bold text-indigo-700">{coutsRepas.diner.toLocaleString()} F</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Produit</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Besoin Brut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Conditionnement</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Quantité</th>
                        {isAdmin && (
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Coût</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(besoins).map(([produitId, data]) => {
                        const produit = produits.find(p => p.id === Number(produitId));
                        if (!produit) return null;

                        return (
                          <tr key={produitId} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{produit.nom}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {data.besoinBrut.toFixed(2)} {produit.unite}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {produit.typeCondit} de {produit.taille} {produit.unite}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                              {data.nbCondits}
                            </td>
                            {isAdmin && (
                              <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                                {data.cout.toLocaleString()} F
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vue Avancée */}
      {viewMode === 'avance' && isAdmin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vue Consolidée</h3>
            <p className="text-sm text-gray-600 mt-1">Totaux tous équipes confondues</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Produit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Besoin Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Conditionnement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Quantité</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Coût Total</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">% Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(totalGlobal).map(([produitId, data]) => {
                  const produit = produits.find(p => p.id === Number(produitId));
                  if (!produit) return null;

                  const percentBudget = (data.cout / budgetTotal) * 100;

                  return (
                    <tr key={produitId} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{produit.nom}</p>
                          <p className="text-xs text-gray-500">{produit.categorie}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {data.besoinBrut.toFixed(2)} {produit.unite}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {produit.typeCondit} de {produit.taille} {produit.unite}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {data.nbCondits}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                        {data.cout.toLocaleString()} F
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">
                        {percentBudget.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={4} className="py-3 px-4 text-sm text-gray-900">TOTAL GÉNÉRAL</td>
                  <td className="py-3 px-4 text-sm font-mono text-right text-[#6d7a49]">
                    {budgetTotal.toLocaleString()} F
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
