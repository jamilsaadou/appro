'use client';

import { useState, useEffect } from 'react';
import { Calendar, Check, Save } from 'lucide-react';
import { useData, useAuth } from '@/contexts/AuthContext';
import { JOURS_SEMAINE, PlanningRepasJour, REPAS_LABELS, TypeRepas } from '@/types';

export default function PlanningHebdo() {
  const { user, isAdmin } = useAuth();
  const { equipes, produits, getPlanning, savePlanning } = useData();
  
  const [currentDate] = useState(new Date());
  const [selectedEquipeId, setSelectedEquipeId] = useState<number>(
    user?.equipeId || (equipes.length > 0 ? equipes[0].id : 0)
  );
  const [selectedProduits, setSelectedProduits] = useState<{ [jour: string]: PlanningRepasJour }>({
    Lundi: { petit_dejeuner: [], dejeuner: [], diner: [] },
    Mardi: { petit_dejeuner: [], dejeuner: [], diner: [] },
    Mercredi: { petit_dejeuner: [], dejeuner: [], diner: [] },
    Jeudi: { petit_dejeuner: [], dejeuner: [], diner: [] },
    Vendredi: { petit_dejeuner: [], dejeuner: [], diner: [] },
    Samedi: { petit_dejeuner: [], dejeuner: [], diner: [] },
    Dimanche: { petit_dejeuner: [], dejeuner: [], diner: [] },
  });
  const [selectedRepas, setSelectedRepas] = useState<TypeRepas>('petit_dejeuner');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const moisKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Filtrer les équipes visibles
  const visibleEquipes = isAdmin 
    ? equipes 
    : equipes.filter(e => e.id === user?.equipeId);

  const selectedEquipe = equipes.find(e => e.id === selectedEquipeId);

  // Charger le planning existant
  useEffect(() => {
    const planning = getPlanning(selectedEquipeId, moisKey);
    if (planning && planning.jours) {
      setSelectedProduits(planning.jours);
    } else {
      // Réinitialiser
      setSelectedProduits({
        Lundi: { petit_dejeuner: [], dejeuner: [], diner: [] },
        Mardi: { petit_dejeuner: [], dejeuner: [], diner: [] },
        Mercredi: { petit_dejeuner: [], dejeuner: [], diner: [] },
        Jeudi: { petit_dejeuner: [], dejeuner: [], diner: [] },
        Vendredi: { petit_dejeuner: [], dejeuner: [], diner: [] },
        Samedi: { petit_dejeuner: [], dejeuner: [], diner: [] },
        Dimanche: { petit_dejeuner: [], dejeuner: [], diner: [] },
      });
    }
  }, [selectedEquipeId, moisKey, getPlanning]);

  const toggleProduit = (jour: string, repas: TypeRepas, produitId: number) => {
    setSelectedProduits(prev => {
      const jourData = prev[jour] || { petit_dejeuner: [], dejeuner: [], diner: [] };
      const repasProduits = jourData[repas] || [];
      const isSelected = repasProduits.includes(produitId);
      
      return {
        ...prev,
        [jour]: {
          ...jourData,
          [repas]: isSelected
            ? repasProduits.filter(id => id !== produitId)
            : [...repasProduits, produitId]
        }
      };
    });
  };

  const handleSave = () => {
    savePlanning({
      equipeId: selectedEquipeId,
      mois: moisKey,
      jours: selectedProduits,
    });
    alert('Planning hebdomadaire enregistré avec succès !');
  };

  // Calculer le besoin total pour un repas d'un jour
  const calculateRepasNeeds = (jour: string, repas: TypeRepas) => {
    const jourData = selectedProduits[jour];
    if (!jourData) return null;
    
    const repasProduits = jourData[repas] || [];
    if (!selectedEquipe || repasProduits.length === 0) return null;

    const besoins: { [key: string]: number } = {};
    repasProduits.forEach(produitId => {
      const produit = produits.find(p => p.id === produitId);
      if (produit) {
        const besoin = selectedEquipe.effectif * produit.rationParPersonne;
        besoins[produit.nom] = besoin;
      }
    });

    return besoins;
  };

  // Obtenir les icônes pour chaque repas
  const getRepasIcon = (repas: TypeRepas) => {
    switch (repas) {
      case 'petit_dejeuner': return '🌅';
      case 'dejeuner': return '☀️';
      case 'diner': return '🌙';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Planning Hebdomadaire</h2>
        <p className="text-gray-600 mt-1">
          Sélectionnez les produits pour chaque repas de chaque jour de la semaine
        </p>
      </div>

      {/* Sélection de l'équipe et du mois */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipe
            </label>
            <select
              value={selectedEquipeId}
              onChange={(e) => setSelectedEquipeId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
              disabled={!isAdmin}
            >
              {visibleEquipes.map((equipe) => (
                <option key={equipe.id} value={equipe.id}>
                  {equipe.nom} - Effectif: {equipe.effectif} pers.
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mois
            </label>
            <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <Calendar className="w-5 h-5 text-[#6d7a49]" />
              <span className="font-medium text-gray-900">
                {monthNames[month]} {year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de repas */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Repas à configurer
        </label>
        <div className="flex gap-3">
          {(['petit_dejeuner', 'dejeuner', 'diner'] as TypeRepas[]).map((repas) => (
            <button
              key={repas}
              onClick={() => setSelectedRepas(repas)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                selectedRepas === repas
                  ? 'bg-[#6d7a49] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getRepasIcon(repas)} {REPAS_LABELS[repas]}
            </button>
          ))}
        </div>
      </div>

      {/* Planning par jour pour le repas sélectionné */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {JOURS_SEMAINE.map((jour) => {
          const repasNeeds = calculateRepasNeeds(jour, selectedRepas);
          const selectedCount = selectedProduits[jour]?.[selectedRepas]?.length || 0;

          return (
            <div key={jour} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6d7a49] to-[#555f3a] p-4">
                <div className="flex items-center justify-between text-white">
                  <h3 className="text-lg font-bold">{jour}</h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {selectedCount} produit{selectedCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {/* Liste des produits */}
                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {produits.map((produit) => {
                    const isSelected = selectedProduits[jour]?.[selectedRepas]?.includes(produit.id);
                    
                    return (
                      <button
                        key={produit.id}
                        onClick={() => toggleProduit(jour, selectedRepas, produit.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-[#6d7a49] bg-[#eef0e5]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#6d7a49] bg-[#6d7a49]'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900 text-sm">{produit.nom}</p>
                            <p className="text-xs text-gray-600">
                              {produit.rationParPersonne} {produit.unite}/pers
                            </p>
                          </div>
                        </div>
                        {produit.categorie && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {produit.categorie}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Besoins calculés */}
                {repasNeeds && Object.keys(repasNeeds).length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-900 mb-2">
                      Besoins {REPAS_LABELS[selectedRepas]} ({selectedEquipe?.effectif} pers.):
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(repasNeeds).map(([nom, besoin]) => (
                        <div key={nom} className="flex justify-between text-xs">
                          <span className="text-gray-600">{nom}:</span>
                          <span className="font-medium text-gray-900">
                            {besoin.toFixed(2)} {produits.find(p => p.nom === nom)?.unite}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Récapitulatif tous repas */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Récapitulatif de la semaine</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {JOURS_SEMAINE.map((jour) => {
            const jourData = selectedProduits[jour];
            const petitDejCount = jourData?.petit_dejeuner?.length || 0;
            const dejeunerCount = jourData?.dejeuner?.length || 0;
            const dinerCount = jourData?.diner?.length || 0;
            const total = petitDejCount + dejeunerCount + dinerCount;
            
            return (
              <div key={jour} className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-sm text-gray-900 mb-2">{jour}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌅 Matin:</span>
                    <span className="font-medium">{petitDejCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">☀️ Midi:</span>
                    <span className="font-medium">{dejeunerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌙 Soir:</span>
                    <span className="font-medium">{dinerCount}</span>
                  </div>
                  <div className="pt-1 border-t border-gray-200 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-[#6d7a49]">{total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bouton sauvegarder */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors shadow-lg"
        >
          <Save className="w-5 h-5" />
          Enregistrer le planning du mois
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>ℹ️ Information:</strong> Ce planning hebdomadaire sera automatiquement appliqué à tous les jours du mois de {monthNames[month]} {year}. 
          Par exemple, tous les lundis du mois utiliseront les produits que vous avez sélectionnés pour chaque repas du "Lundi".
        </p>
      </div>
    </div>
  );
}
