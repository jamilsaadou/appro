'use client';

import { Settings, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Parametres() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
        <p className="text-gray-600 mt-1">Configuration du système SIGAP</p>
      </div>

      <div className="space-y-6">
        {/* Informations utilisateur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Informations du compte</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={user?.nom || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <input
                type="text"
                value={user?.role === 'admin' ? 'Administrateur' : 'Responsable d\'équipe'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Paramètres système (Admin uniquement) */}
        {isAdmin && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Paramètres système</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ration journalière de base (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={0.2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ration de céréales par personne et par jour
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Devise
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]">
                    <option value="FCFA">FCFA</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notifications par email</p>
                    <p className="text-xs text-gray-500">Recevoir des alertes pour les approvisionnements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6d7a49]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6d7a49]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mode développement</p>
                    <p className="text-xs text-gray-500">Afficher les données de test et le bouton de changement de rôle</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6d7a49]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6d7a49]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des données</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full px-4 py-3 border border-[#6d7a49] text-[#6d7a49] rounded-lg hover:bg-[#eef0e5] transition-colors text-left">
                  <p className="font-medium">Exporter toutes les données</p>
                  <p className="text-xs text-gray-600 mt-1">Télécharger un fichier JSON avec toutes les données</p>
                </button>
                <button className="w-full px-4 py-3 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-left">
                  <p className="font-medium">Importer des données</p>
                  <p className="text-xs text-gray-600 mt-1">Charger des données depuis un fichier JSON</p>
                </button>
                <button className="w-full px-4 py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left">
                  <p className="font-medium">Réinitialiser les données</p>
                  <p className="text-xs text-gray-600 mt-1">Supprimer toutes les données et revenir aux valeurs par défaut</p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49]"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#6d7a49] text-white rounded-lg hover:bg-[#555f3a] transition-colors">
            <Save className="w-5 h-5" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}
