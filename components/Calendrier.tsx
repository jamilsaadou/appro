'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Send, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import { useData, useAuth } from '@/contexts/AuthContext';
import { PROVISIONS_CONFIG, REPAS_LABELS, TypeRepas } from '@/types';

export default function Calendrier() {
  const { user, isAdmin } = useAuth();
  const { equipes, getBesoinsJour, updateBesoinsJour, soumettreCalendrier, isCalendrierSoumis, creerDemandeModification, getDemandesEquipe } = useData();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEquipeId, setSelectedEquipeId] = useState<number>(
    user?.equipeId || (equipes.length > 0 ? equipes[0].id : 0)
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [effectifsPetitDej, setEffectifsPetitDej] = useState(0);
  const [effectifsDejeuner, setEffectifsDejeuner] = useState(0);
  const [effectifsDiner, setEffectifsDiner] = useState(0);
  const [showDemandeModal, setShowDemandeModal] = useState(false);
  const [motifDemande, setMotifDemande] = useState('');

  // Filtrer les équipes visibles
  const visibleEquipes = isAdmin 
    ? equipes 
    : equipes.filter(e => e.id === user?.equipeId);

  const selectedEquipe = equipes.find(e => e.id === selectedEquipeId);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();

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

  const handleDayClick = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const besoins = getBesoinsJour(selectedEquipeId, dateKey);
    
    setSelectedDay(dateKey);
    setEffectifsPetitDej(besoins?.repas.petit_dejeuner.effectif || selectedEquipe?.effectif || 0);
    setEffectifsDejeuner(besoins?.repas.dejeuner.effectif || selectedEquipe?.effectif || 0);
    setEffectifsDiner(besoins?.repas.diner.effectif || selectedEquipe?.effectif || 0);
  };

  const handleSaveEffectifs = () => {
    if (selectedDay) {
      updateBesoinsJour(selectedEquipeId, selectedDay, {
        petit_dejeuner: effectifsPetitDej,
        dejeuner: effectifsDejeuner,
        diner: effectifsDiner,
      });
      setSelectedDay(null);
    }
  };

  const handleApplyToMonth = () => {
    if (selectedEquipe) {
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        updateBesoinsJour(selectedEquipeId, dateKey, {
          petit_dejeuner: effectifsPetitDej,
          dejeuner: effectifsDejeuner,
          diner: effectifsDiner,
        });
      }
      setSelectedDay(null);
    }
  };

  const handleSoumettreCalendrier = async () => {
    const mois = `${year}-${String(month + 1).padStart(2, '0')}`;
    const success = await soumettreCalendrier(selectedEquipeId, mois);
    if (success) {
      alert('Calendrier soumis avec succès! Pour toute modification, veuillez faire une demande à l\'administrateur.');
    }
  };

  const handleDemandeModification = () => {
    if (!user) return;
    
    const mois = `${year}-${String(month + 1).padStart(2, '0')}`;
    creerDemandeModification({
      equipeId: selectedEquipeId,
      responsableId: user.id,
      responsableNom: user.nom,
      mois,
      motif: motifDemande,
    });
    
    setShowDemandeModal(false);
    setMotifDemande('');
    alert('Demande de modification envoyée! L\'administrateur recevra votre demande.');
  };

  const moisCourant = `${year}-${String(month + 1).padStart(2, '0')}`;
  const calendrierSoumis = isCalendrierSoumis(selectedEquipeId, moisCourant);
  const demandesEquipe = getDemandesEquipe(selectedEquipeId);
  const demandeEnAttente = demandesEquipe.find(
    d => d.mois === moisCourant && d.statut === 'en_attente'
  );

  const getDayInfo = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const besoins = getBesoinsJour(selectedEquipeId, dateKey);
    const effectifTotal = besoins?.effectifJour || (selectedEquipe?.effectif ? selectedEquipe.effectif * 3 : 0);
    const isModified = !!besoins;

    return { effectifTotal, isModified };
  };

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const { effectifTotal, isModified } = getDayInfo(day);
    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={`aspect-square border rounded-lg p-2 hover:border-[#6d7a49] hover:bg-[#f7f8f3] transition-all ${
          isModified 
            ? 'border-[#6d7a49] bg-[#eef0e5]' 
            : 'border-gray-200 bg-white'
        }`}
      >
        <div className="text-sm font-semibold text-gray-900">{day}</div>
        <div className="text-xs text-gray-600 mt-1">{effectifTotal} repas</div>
      </button>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Calendrier Journalier</h2>
        <p className="text-gray-600 mt-1">Saisie des besoins par repas (petit déjeuner, déjeuner, dîner)</p>
      </div>

      {/* Sélection de l'équipe */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner une équipe
        </label>
        <select
          value={selectedEquipeId}
          onChange={(e) => setSelectedEquipeId(Number(e.target.value))}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
        >
          {visibleEquipes.map((equipe) => (
            <option key={equipe.id} value={equipe.id}>
              {equipe.nom} - Effectif de base: {equipe.effectif} pers.
            </option>
          ))}
        </select>
      </div>

      {/* Statut du calendrier et actions */}
      {!isAdmin && (
        <div className="mb-6">
          {calendrierSoumis ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-900">Calendrier soumis</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Le calendrier de ce mois a été soumis. Pour toute modification, veuillez faire une demande.
                  </p>
                  {demandeEnAttente ? (
                    <div className="mt-3 flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Demande de modification en attente d'approbation</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDemandeModal(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Demander une modification
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900">Calendrier non soumis</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Complétez le calendrier puis soumettez-le pour validation.
                  </p>
                  <button
                    onClick={handleSoumettreCalendrier}
                    className="mt-3 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Soumettre le calendrier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header du calendrier */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#6d7a49] to-[#555f3a]">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-white">
            <CalendarIcon className="w-6 h-6" />
            <h3 className="text-xl font-bold">
              {monthNames[month]} {year}
            </h3>
          </div>
          <button
            onClick={goToNextMonth}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-2 p-6 pb-3 bg-gray-50 border-b border-gray-200">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-900">
              {day}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-2 p-6">
          {days}
        </div>

        {/* Légende */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-200 bg-white rounded"></div>
              <span className="text-gray-600">Effectifs de base</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#6d7a49] bg-[#eef0e5] rounded"></div>
              <span className="text-gray-600">Effectifs personnalisés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de modification */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Modifier les effectifs - {selectedDay}
              </h3>
              <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Info:</strong> Renseignez l'effectif pour chaque repas. Les ratios sont calculés par repas.
                </p>
              </div>

              {/* Effectifs par repas */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    🌅 {REPAS_LABELS.petit_dejeuner}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={effectifsPetitDej}
                    onChange={(e) => setEffectifsPetitDej(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Nombre de personnes"
                  />
                  {effectifsPetitDej > 0 && (
                    <div className="mt-3 bg-gray-50 rounded p-3 space-y-1">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Besoins pour ce repas:</p>
                      {PROVISIONS_CONFIG.map((prov) => (
                        <div key={prov.nom} className="flex justify-between text-xs">
                          <span className="text-gray-600">{prov.nom}:</span>
                          <span className="font-medium text-gray-900">
                            {(effectifsPetitDej * prov.rationRepas).toFixed(2)} {prov.unite}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    ☀️ {REPAS_LABELS.dejeuner}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={effectifsDejeuner}
                    onChange={(e) => setEffectifsDejeuner(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Nombre de personnes"
                  />
                  {effectifsDejeuner > 0 && (
                    <div className="mt-3 bg-gray-50 rounded p-3 space-y-1">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Besoins pour ce repas:</p>
                      {PROVISIONS_CONFIG.map((prov) => (
                        <div key={prov.nom} className="flex justify-between text-xs">
                          <span className="text-gray-600">{prov.nom}:</span>
                          <span className="font-medium text-gray-900">
                            {(effectifsDejeuner * prov.rationRepas).toFixed(2)} {prov.unite}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    🌙 {REPAS_LABELS.diner}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={effectifsDiner}
                    onChange={(e) => setEffectifsDiner(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Nombre de personnes"
                  />
                  {effectifsDiner > 0 && (
                    <div className="mt-3 bg-gray-50 rounded p-3 space-y-1">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Besoins pour ce repas:</p>
                      {PROVISIONS_CONFIG.map((prov) => (
                        <div key={prov.nom} className="flex justify-between text-xs">
                          <span className="text-gray-600">{prov.nom}:</span>
                          <span className="font-medium text-gray-900">
                            {(effectifsDiner * prov.rationRepas).toFixed(2)} {prov.unite}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Total journalier */}
              <div className="bg-[#eef0e5] rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  📊 Total journalier ({effectifsPetitDej + effectifsDejeuner + effectifsDiner} repas)
                </p>
                <div className="space-y-2">
                  {PROVISIONS_CONFIG.map((prov) => {
                    const total = (effectifsPetitDej + effectifsDejeuner + effectifsDiner) * prov.rationRepas;
                    return (
                      <div key={prov.nom} className="flex justify-between text-sm">
                        <span className="text-gray-700">{prov.nom}:</span>
                        <span className="font-semibold text-gray-900">
                          {total.toFixed(2)} {prov.unite}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEffectifs}
                  className="flex-1 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
                >
                  Enregistrer
                </button>
              </div>

              <button
                onClick={handleApplyToMonth}
                className="w-full px-4 py-2 border-2 border-[#6d7a49] text-[#6d7a49] rounded-lg hover:bg-[#eef0e5] transition-colors font-medium"
              >
                Appliquer à tout le mois
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de demande de modification */}
      {showDemandeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Demande de modification
              </h3>
              <button onClick={() => setShowDemandeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Mois concerné:</strong> {monthNames[month]} {year}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la demande *
                </label>
                <textarea
                  value={motifDemande}
                  onChange={(e) => setMotifDemande(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49] resize-none"
                  placeholder="Expliquez pourquoi vous avez besoin de modifier le calendrier..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Soyez précis dans votre explication pour faciliter l'approbation
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDemandeModal(false);
                    setMotifDemande('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDemandeModification}
                  disabled={!motifDemande.trim()}
                  className="flex-1 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
