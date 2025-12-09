'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, UserPlus, Eye, EyeOff, Mail, Lock, Users as UsersIcon } from 'lucide-react';
import { useAuth, useData } from '@/contexts/AuthContext';
import { User } from '@/types';

export default function Utilisateurs() {
  const { user: currentUser } = useAuth();
  const { equipes, utilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    equipeId: 0,
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nom: user.nom,
        email: user.email,
        password: '',
        equipeId: user.equipeId || 0,
      });
    } else {
      setEditingUser(null);
      setFormData({
        nom: '',
        email: '',
        password: '',
        equipeId: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      nom: '',
      email: '',
      password: '',
      equipeId: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.email || !formData.equipeId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!editingUser && !formData.password) {
      alert('Le mot de passe est obligatoire pour un nouvel utilisateur');
      return;
    }

    if (editingUser) {
      // Mise à jour
      updateUtilisateur(editingUser.id, {
        nom: formData.nom,
        email: formData.email,
        equipeId: formData.equipeId,
        ...(formData.password && { password: formData.password }),
      });
    } else {
      // Création - le password est stocké séparément dans une vraie app
      addUtilisateur({
        nom: formData.nom,
        email: formData.email,
        role: 'responsable',
        equipeId: formData.equipeId,
      });
    }

    handleCloseModal();
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUtilisateur(userId);
    }
  };

  // Filtrer uniquement les responsables d'équipe
  const responsables = utilisateurs.filter(u => u.role === 'responsable');

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600 mt-1">
            Créez et gérez les comptes des responsables d'équipe
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#5a6639] transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Équipe Assignée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responsables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucun utilisateur créé pour le moment</p>
                    <p className="text-sm mt-1">Cliquez sur "Nouvel Utilisateur" pour commencer</p>
                  </td>
                </tr>
              ) : (
                responsables.map((utilisateur) => {
                  const equipe = equipes.find(e => e.id === utilisateur.equipeId);
                  
                  return (
                    <tr key={utilisateur.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#6d7a49] rounded-full flex items-center justify-center text-white font-semibold">
                            {utilisateur.nom.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {utilisateur.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{utilisateur.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {equipe ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{equipe.nom}</div>
                            <div className="text-xs text-gray-500">
                              Effectif: {equipe.effectif} personnes
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">Équipe non assignée</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Actif
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(utilisateur)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(utilisateur.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{responsables.length}</p>
            </div>
            <UsersIcon className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Équipes Assignées</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {responsables.filter(u => u.equipeId).length}
              </p>
            </div>
            <UsersIcon className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Équipes Sans Responsable</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {equipes.length - responsables.filter(u => u.equipeId).length}
              </p>
            </div>
            <UsersIcon className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d7a49] focus:border-transparent"
                  placeholder="Ex: Commandant Abdou"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d7a49] focus:border-transparent"
                  placeholder="exemple@sigap.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe {!editingUser && '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d7a49] focus:border-transparent pr-10"
                    placeholder={editingUser ? 'Laisser vide pour ne pas modifier' : 'Minimum 6 caractères'}
                    required={!editingUser}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {editingUser && (
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour conserver le mot de passe actuel
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Équipe assignée *
                </label>
                <select
                  value={formData.equipeId}
                  onChange={(e) => setFormData({ ...formData, equipeId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d7a49] focus:border-transparent"
                  required
                >
                  <option value={0}>Sélectionnez une équipe</option>
                  {equipes.map((equipe) => (
                    <option key={equipe.id} value={equipe.id}>
                      {equipe.nom} - Effectif: {equipe.effectif}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#6d7a49] text-white rounded-lg hover:bg-[#5a6639] transition-colors"
                >
                  {editingUser ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
