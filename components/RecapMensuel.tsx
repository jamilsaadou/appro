'use client';

import { useState } from 'react';
import { FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useData, useAuth } from '@/contexts/AuthContext';
import { PRODUITS_DEFAUT } from '@/types';
import * as XLSX from 'xlsx';

export default function RecapMensuel() {
  const { isAdmin, user } = useAuth();
  const { equipes, localites, besoinsJournaliers } = useData();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filtrer les équipes visibles
  const visibleEquipes = isAdmin 
    ? equipes 
    : equipes.filter(e => e.id === user?.equipeId);

  // Calculer le récapitulatif pour une équipe
  const calculateRecap = (equipeId: number) => {
    const equipe = equipes.find(e => e.id === equipeId);
    if (!equipe) return null;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let totalEffectif = 0;
    let joursComptabilises = 0;

    // Calculer l'effectif total du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const besoins = besoinsJournaliers.find(
        b => b.equipeId === equipeId && b.dateKey === dateKey
      );
      const effectifJour = besoins?.effectifJour || equipe.effectif;
      totalEffectif += effectifJour;
      joursComptabilises++;
    }

    const effectifMoyen = Math.round(totalEffectif / joursComptabilises);

    // Calculer les besoins pour chaque provision
    const besoins: any = {};
    let coutTotal = 0;

    PRODUITS_DEFAUT.forEach((provision) => {
      const besoinBrut = totalEffectif * provision.rationParPersonne;
      const nbConditionnements = Math.ceil(besoinBrut / provision.taille);
      const cout = nbConditionnements * provision.prixUnitaire;

      besoins[provision.nom] = {
        besoinBrut,
        nbConditionnements,
        cout,
        provision,
      };

      coutTotal += cout;
    });

    return {
      equipe,
      effectifMoyen,
      besoins,
      coutTotal,
    };
  };

  const recaps = visibleEquipes.map(e => calculateRecap(e.id)).filter(r => r !== null);

  // Calculer le total global
  const totalGlobal = recaps.reduce((acc, recap) => {
    return {
      effectif: acc.effectif + (recap?.effectifMoyen || 0),
      cout: acc.cout + (recap?.coutTotal || 0),
    };
  }, { effectif: 0, cout: 0 });

  // Export en Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Feuille 1: Synthèse Globale
    const syntheseData = [
      ['RÉCAPITULATIF MENSUEL DES APPROVISIONNEMENTS'],
      [`Période: ${monthNames[month]} ${year}`],
      [''],
      ['SYNTHÈSE GLOBALE'],
      [''],
      ['Nombre d\'équipes', recaps.length],
      ['Effectif total moyen', `${totalGlobal.effectif} personnes`],
      ['Budget total', `${totalGlobal.cout.toLocaleString()} FCFA`],
      [''],
    ];

    const wsSynthese = XLSX.utils.aoa_to_sheet(syntheseData);
    XLSX.utils.book_append_sheet(wb, wsSynthese, 'Synthèse');

    // Feuille 2: Détails par Équipe
    const detailsData: any[] = [
      ['DÉTAILS PAR ÉQUIPE'],
      [`Période: ${monthNames[month]} ${year}`],
      [''],
    ];

    recaps.forEach((recap, index) => {
      if (!recap) return;
      const localite = localites.find(l => l.id === recap.equipe.localiteId);

      detailsData.push([`ÉQUIPE ${index + 1}: ${recap.equipe.nom}`]);
      detailsData.push(['Localité', localite?.nom || '']);
      detailsData.push(['Responsable', recap.equipe.responsable]);
      detailsData.push(['Effectif moyen', `${recap.effectifMoyen} personnes`]);
      detailsData.push(['']);
      detailsData.push(['Provision', 'Besoin Brut', 'Unité', 'Conditionnement', 'Quantité', 'Prix Unitaire', 'Coût Total']);

      Object.entries(recap.besoins).forEach(([nom, data]: [string, any]) => {
        detailsData.push([
          nom,
          data.besoinBrut.toFixed(2),
          data.provision.unite,
          `${data.provision.typeCondit} de ${data.provision.taille} ${data.provision.unite}`,
          data.nbConditionnements,
          data.provision.prixUnitaire.toLocaleString(),
          data.cout.toLocaleString(),
        ]);
      });

      detailsData.push(['', '', '', '', 'TOTAL ÉQUIPE', '', recap.coutTotal.toLocaleString()]);
      detailsData.push(['']);
      detailsData.push(['']);
    });

    const wsDetails = XLSX.utils.aoa_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Détails par Équipe');

    // Feuille 3: Consolidation par Provision
    const consolidationData: any[] = [
      ['CONSOLIDATION PAR PROVISION'],
      [`Période: ${monthNames[month]} ${year}`],
      [''],
      ['Provision', 'Besoin Total', 'Unité', 'Conditionnement', 'Quantité Totale', 'Coût Total', '% Budget'],
      [''],
    ];

    const besoinsParProvision: { [nom: string]: { besoinBrut: number; nbCondits: number; cout: number; provision: any } } = {};

    recaps.forEach(recap => {
      if (!recap) return;
      Object.entries(recap.besoins).forEach(([nom, data]: [string, any]) => {
        if (!besoinsParProvision[nom]) {
          besoinsParProvision[nom] = {
            besoinBrut: 0,
            nbCondits: 0,
            cout: 0,
            provision: data.provision,
          };
        }
        besoinsParProvision[nom].besoinBrut += data.besoinBrut;
        besoinsParProvision[nom].nbCondits += data.nbConditionnements;
        besoinsParProvision[nom].cout += data.cout;
      });
    });

    Object.entries(besoinsParProvision).forEach(([nom, data]) => {
      const percentBudget = ((data.cout / totalGlobal.cout) * 100).toFixed(1);
      consolidationData.push([
        nom,
        data.besoinBrut.toFixed(2),
        data.provision.unite,
        `${data.provision.typeCondit} de ${data.provision.taille} ${data.provision.unite}`,
        data.nbCondits,
        data.cout.toLocaleString(),
        `${percentBudget}%`,
      ]);
    });

    consolidationData.push(['']);
    consolidationData.push(['', '', '', 'TOTAL GÉNÉRAL', '', totalGlobal.cout.toLocaleString(), '100%']);

    const wsConsolidation = XLSX.utils.aoa_to_sheet(consolidationData);
    XLSX.utils.book_append_sheet(wb, wsConsolidation, 'Consolidation');

    // Feuille 4: Tableau Récapitulatif (vue matricielle)
    const matriceData: any[] = [
      ['TABLEAU RÉCAPITULATIF - COÛTS PAR ÉQUIPE ET PROVISION'],
      [`Période: ${monthNames[month]} ${year}`],
      [''],
    ];

    // En-têtes
    const provisions = Object.keys(besoinsParProvision);
    const headerRow = ['Équipe', 'Effectif', ...provisions, 'TOTAL'];
    matriceData.push(headerRow);

    // Lignes par équipe
    recaps.forEach(recap => {
      if (!recap) return;
      const row: any[] = [recap.equipe.nom, recap.effectifMoyen];
      
      provisions.forEach(provision => {
        const besoin = recap.besoins[provision];
        row.push(besoin ? besoin.cout : 0);
      });
      
      row.push(recap.coutTotal);
      matriceData.push(row);
    });

    // Ligne de total
    const totalRow: any[] = ['TOTAL', totalGlobal.effectif];
    provisions.forEach(provision => {
      totalRow.push(besoinsParProvision[provision].cout);
    });
    totalRow.push(totalGlobal.cout);
    matriceData.push(['']);
    matriceData.push(totalRow);

    const wsMatrice = XLSX.utils.aoa_to_sheet(matriceData);
    XLSX.utils.book_append_sheet(wb, wsMatrice, 'Tableau Récapitulatif');

    // Télécharger le fichier
    const fileName = `Recapitulatif_${monthNames[month]}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Récapitulatif Mensuel</h2>
        <p className="text-gray-600 mt-1">Synthèse des approvisionnements du mois</p>
      </div>

      {/* Sélecteur de mois */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#6d7a49]" />
            <h3 className="text-xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h3>
          </div>
          <button
            onClick={goToNextMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Récapitulatif par équipe */}
      <div className="space-y-6">
        {recaps.map((recap) => {
          if (!recap) return null;
          
          const localite = localites.find(l => l.id === recap.equipe.localiteId);

          return (
            <div key={recap.equipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6d7a49] to-[#555f3a] p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-xl font-bold">{recap.equipe.nom}</h3>
                    <p className="text-sm text-white/80">{localite?.nom} - {recap.equipe.responsable}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">Effectif moyen</p>
                    <p className="text-2xl font-bold">{recap.effectifMoyen} pers.</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Provision</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Besoin brut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Conditionnement</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Quantité</th>
                        {isAdmin && (
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Coût</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(recap.besoins).map(([nom, data]: [string, any]) => (
                        <tr key={nom} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{nom}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {data.besoinBrut.toFixed(2)} {data.provision.unite}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {data.provision.typeCondit} de {data.provision.taille} {data.provision.unite}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                            {data.nbConditionnements} {data.provision.typeCondit}(s)
                          </td>
                          {isAdmin && (
                            <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                              {data.cout.toLocaleString()} FCFA
                            </td>
                          )}
                        </tr>
                      ))}
                      {isAdmin && (
                        <tr className="bg-[#eef0e5]">
                          <td colSpan={4} className="py-3 px-4 text-sm font-bold text-gray-900">
                            TOTAL
                          </td>
                          <td className="py-3 px-4 text-sm font-mono font-bold text-right text-[#6d7a49]">
                            {recap.coutTotal.toLocaleString()} FCFA
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthèse globale */}
      {isAdmin && recaps.length > 1 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 p-6">
            <h3 className="text-xl font-bold text-white">Synthèse Globale</h3>
            <p className="text-sm text-white/80">Toutes équipes confondues</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-blue-600 mb-1">Total Équipes</p>
                <p className="text-3xl font-bold text-blue-900">{recaps.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-sm text-green-600 mb-1">Effectif Total</p>
                <p className="text-3xl font-bold text-green-900">{totalGlobal.effectif} pers.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-sm text-purple-600 mb-1">Budget Total</p>
                <p className="text-3xl font-bold text-purple-900 font-mono">
                  {totalGlobal.cout.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'export */}
      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-6 py-3 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter en Excel
        </button>
      </div>
    </div>
  );
}
