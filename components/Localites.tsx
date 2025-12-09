'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import { useData } from '@/contexts/AuthContext';
import { Localite } from '@/types';

export default function Localites() {
  const { localites, equipes, addLocalite, updateLocalite, deleteLocalite } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocalite, setEditingLocalite] = useState<Localite | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    region: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLocalite) {
      updateLocalite(editingLocalite.id, formData);
    } else {
      addLocalite(formData);
    }
    resetForm();
  };

  const handleEdit = (localite: Localite) => {
    setEditingLocalite(localite);
    setFormData({
      nom: localite.nom,
      region: localite.region,
      description: localite.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette localité ?')) {
      deleteLocalite(id);
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', region: '', description: '' });
    setEditingLocalite(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Localités</h2>
          <p className="text-gray-600 mt-1">Gérer les zones géographiques de déploiement</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Localité
        </button>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localites.map((localite) => {
          const equipesCount = equipes.filter(e => e.localiteId === localite.id).length;
          const effectifTotal = equipes
            .filter(e => e.localiteId === localite.id)
            .reduce((sum, e) => sum + e.effectif, 0);

          return (
            <div key={localite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-br from-[#6d7a49] to-[#555f3a] p-6">
                <div className="flex items-center gap-3 text-white mb-2">
                  <MapPin className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">{localite.nom}</h3>
                </div>
                <p className="text-white/80 text-sm">{localite.region}</p>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{localite.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Équipes</p>
                    <p className="text-xl font-bold text-gray-900">{equipesCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Effectif</p>
                    <p className="text-xl font-bold text-gray-900">{effectifTotal}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(localite)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(localite.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingLocalite ? 'Modifier la Localité' : 'Nouvelle Localité'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la zone *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Ex: Zone Nord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région *
                </label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Ex: Agadez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Description de la zone..."
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
                  {editingLocalite ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
