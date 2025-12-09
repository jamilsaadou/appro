'use client';

import { useState } from 'react';
import { useData, useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Clock, MessageSquare, Calendar } from 'lucide-react';
import { DemandeModification } from '@/types';

export default function ApprobationsCalendrier() {
  const { isAdmin } = useAuth();
  const { demandesModification, equipes, traiterDemande } = useData();
  const [selectedDemande, setSelectedDemande] = useState<DemandeModification | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const [filterStatut, setFilterStatut] = useState<'tous' | 'en_attente' | 'approuvee' | 'rejetee'>('en_attente');

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Accès réservé aux administrateurs</p>
        </div>
      </div>
    );
  }

  const demandesFiltrees = demandesModification.filter((d) => {
    if (filterStatut === 'tous') return true;
    return d.statut === filterStatut;
  });

  const handleApprouver = () => {
    if (selectedDemande) {
      traiterDemande(selectedDemande.id, 'approuvee', commentaire);
      setSelectedDemande(null);
      setCommentaire('');
    }
  };

  const handleRejeter = () => {
    if (selectedDemande) {
      traiterDemande(selectedDemande.id, 'rejetee', commentaire);
      setSelectedDemande(null);
      setCommentaire('');
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case 'approuvee':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Approuvée
          </span>
        );
      case 'rejetee':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rejetée
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Demandes de Modification de Calendrier</h2>
        <p className="text-gray-600 mt-1">Approuvez ou rejetez les demandes des responsables d'équipe</p>
      </div>

      {/* Filtres */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatut('tous')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'tous'
                  ? 'bg-[#6d7a49] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({demandesModification.length})
            </button>
            <button
              onClick={() => setFilterStatut('en_attente')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'en_attente'
                  ? 'bg-[#6d7a49] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente ({demandesModification.filter((d) => d.statut === 'en_attente').length})
            </button>
            <button
              onClick={() => setFilterStatut('approuvee')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'approuvee'
                  ? 'bg-[#6d7a49] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approuvées ({demandesModification.filter((d) => d.statut === 'approuvee').length})
            </button>
            <button
              onClick={() => setFilterStatut('rejetee')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === 'rejetee'
                  ? 'bg-[#6d7a49] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejetées ({demandesModification.filter((d) => d.statut === 'rejetee').length})
            </button>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {demandesFiltrees.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucune demande à afficher</p>
          </div>
        ) : (
          demandesFiltrees.map((demande) => {
            const equipe = equipes.find((e) => e.id === demande.equipeId);
            return (
              <div
                key={demande.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{equipe?.nom}</h3>
                      {getStatutBadge(demande.statut)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Responsable: <span className="font-medium">{demande.responsableNom}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Période: <span className="font-medium">{demande.mois}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date de demande: <span className="font-medium">{formatDate(demande.dateCreation)}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Motif de la demande:</p>
                  <p className="text-sm text-gray-900">{demande.motif}</p>
                </div>

                {demande.statut !== 'en_attente' && demande.commentaireAdmin && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Commentaire administrateur:</p>
                    <p className="text-sm text-blue-800">{demande.commentaireAdmin}</p>
                    {demande.dateTraitement && (
                      <p className="text-xs text-blue-600 mt-2">
                        Traité le {formatDate(demande.dateTraitement)}
                      </p>
                    )}
                  </div>
                )}

                {demande.statut === 'en_attente' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedDemande(demande)}
                      className="flex-1 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors font-medium"
                    >
                      Traiter la demande
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de traitement */}
      {selectedDemande && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Traiter la demande de modification</h3>
              <p className="text-sm text-gray-600 mt-1">
                {equipes.find((e) => e.id === selectedDemande.equipeId)?.nom} - {selectedDemande.mois}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Motif de la demande:</p>
                <p className="text-sm text-gray-900">{selectedDemande.motif}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire administrateur (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49] resize-none"
                  placeholder="Ajoutez un commentaire pour justifier votre décision..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedDemande(null);
                    setCommentaire('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRejeter}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeter
                </button>
                <button
                  onClick={handleApprouver}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approuver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
