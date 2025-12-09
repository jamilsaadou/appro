'use client';

import { useState } from 'react';
import { Package, Plus, Edit, Trash2, X } from 'lucide-react';
import { useData } from '@/contexts/AuthContext';
import { Produit } from '@/types';

export default function Produits() {
  const { produits, addProduit, updateProduit, deleteProduit } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    unite: 'kg',
    rationParPersonne: 0,
    taille: 0,
    typeCondit: '',
    prixUnitaire: 0,
    categorie: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduit) {
      updateProduit(editingProduit.id, formData);
    } else {
      addProduit(formData);
    }
    resetForm();
  };

  const handleEdit = (produit: Produit) => {
    setEditingProduit(produit);
    setFormData({
      nom: produit.nom,
      unite: produit.unite,
      rationParPersonne: produit.rationParPersonne,
      taille: produit.taille,
      typeCondit: produit.typeCondit,
      prixUnitaire: produit.prixUnitaire,
      categorie: produit.categorie || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduit(id);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      unite: 'kg',
      rationParPersonne: 0,
      taille: 0,
      typeCondit: '',
      prixUnitaire: 0,
      categorie: '',
    });
    setEditingProduit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
          <p className="text-gray-600 mt-1">Configurer les produits et leurs rations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau Produit
        </button>
      </div>

      {/* Tableau des produits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Produit</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Catégorie</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Ration/pers</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Conditionnement</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Prix unitaire</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {produits.map((produit) => (
                <tr key={produit.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6d7a49] rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{produit.nom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {produit.categorie || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {produit.rationParPersonne} {produit.unite}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {produit.typeCondit} de {produit.taille} {produit.unite}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-gray-900">
                      {produit.prixUnitaire.toLocaleString()} FCFA
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(produit)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(produit.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduit ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Ex: Riz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Ex: Céréales"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ration par personne *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.001"
                    min="0"
                    value={formData.rationParPersonne || ''}
                    onChange={(e) => setFormData({ ...formData, rationParPersonne: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Ex: 0.2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité *
                  </label>
                  <select
                    required
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="unité">unité</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type conditionnement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.typeCondit}
                    onChange={(e) => setFormData({ ...formData, typeCondit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Ex: Sac, Boîte, Bidon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille conditionnement *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0"
                    value={formData.taille || ''}
                    onChange={(e) => setFormData({ ...formData, taille: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                    placeholder="Ex: 50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix unitaire (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.prixUnitaire || ''}
                  onChange={(e) => setFormData({ ...formData, prixUnitaire: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  placeholder="Ex: 25000"
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
                  {editingProduit ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
