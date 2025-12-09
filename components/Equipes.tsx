'use client';

import { useState } from 'react';
import { Users, Plus, Edit, Trash2, X } from 'lucide-react';
import { useData } from '@/contexts/AuthContext';
import { Equipe } from '@/types';

export default function Equipes() {
  const { localites, equipes, produits, addEquipe, updateEquipe, deleteEquipe } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipe, setEditingEquipe] = useState<Equipe | null>(null);
  const [formData, setFormData] = useState({
    localiteId: 0,
    nom: '',
    effectif: 0,
    responsable: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipe) {
      updateEquipe(editingEquipe.id, formData);
    } else {
      addEquipe(formData);
    }
    resetForm();
  };

  const handleEdit = (equipe: Equipe) => {
    setEditingEquipe(equipe);
    setFormData({
      localiteId: equipe.localiteId,
      nom: equipe.nom,
      effectif: equipe.effectif,
      responsable: equipe.responsable,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      deleteEquipe(id);
    }
  };

  const resetForm = () => {
    setFormData({ localiteId: 0, nom: '', effectif: 0, responsable: '' });
    setEditingEquipe(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Équipes</h2>
          <p className="text-gray-600 mt-1">Gérer les unités et leurs effectifs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Équipe
        </button>
      </div>

      {/* Tableau des équipes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Équipe</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Localité</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Effectif</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Responsable</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Besoins journaliers</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipes.map((equipe) => {
                const localite = localites.find(l => l.id === equipe.localiteId);
                
                return (
                  <tr key={equipe.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d7a49] rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{equipe.nom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {localite?.nom || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-gray-900">{equipe.effectif} pers.</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{equipe.responsable}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-gray-600 space-y-1">
                        {produits.slice(0, 3).map((p) => (
                          <div key={p.id}>
                            {p.nom}: {(equipe.effectif * p.rationParPersonne).toFixed(2)} {p.unite}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(equipe)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(equipe.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEquipe ? 'Modifier l\'Équipe' : 'Nouvelle Équipe'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localité *
                </label>
                <select
                  required
                  value={formData.localiteId}
                  onChange={(e) => setFormData({ ...formData, localiteId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                >
                  <option value={0}>Sélectionner une localité</option>
                  {localites.map((localite) => (
                    <option key={localite.id} value={localite.id}>
                      {localite.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'équipe *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Ex: Unité Alpha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effectif *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.effectif || ''}
                  onChange={(e) => setFormData({ ...formData, effectif: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Ex: 25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable *
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Ex: Commandant Abdou"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
                >
                  {editingEquipe ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
