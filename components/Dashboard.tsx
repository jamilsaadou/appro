'use client';

import { Users, MapPin, Package, DollarSign } from 'lucide-react';
import { useAuth, useData } from '@/contexts/AuthContext';
import { PRODUITS_DEFAUT } from '@/types';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { localites, equipes, besoinsJournaliers } = useData();

  const totalEquipes = equipes.length;
  const totalEffectif = equipes.reduce((sum, e) => sum + e.effectif, 0);

  // Calcul du coût total estimé mensuel (30 jours)
  const coutMensuelEstime = totalEffectif * 30 * PRODUITS_DEFAUT.reduce((sum, p) => {
    return sum + (p.rationParPersonne * (p.prixUnitaire / p.taille));
  }, 0);

  const stats = [
    {
      label: 'Total Localités',
      value: localites.length,
      icon: MapPin,
      color: 'bg-blue-500',
      show: true,
    },
    {
      label: 'Total Équipes',
      value: totalEquipes,
      icon: Users,
      color: 'bg-green-500',
      show: true,
    },
    {
      label: 'Effectif Total',
      value: totalEffectif,
      icon: Package,
      color: 'bg-yellow-500',
      show: true,
    },
    {
      label: 'Budget Mensuel Estimé',
      value: `${Math.round(coutMensuelEstime / 1000)}k FCFA`,
      icon: DollarSign,
      color: 'bg-purple-500',
      show: isAdmin,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme SIGAP</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.filter(s => s.show).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Localités */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Localités</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {localites.map((localite) => {
                const equipesCount = equipes.filter(e => e.localiteId === localite.id).length;
                const effectifTotal = equipes
                  .filter(e => e.localiteId === localite.id)
                  .reduce((sum, e) => sum + e.effectif, 0);

                return (
                  <div key={localite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{localite.nom}</p>
                      <p className="text-sm text-gray-600">{localite.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{equipesCount} équipes</p>
                      <p className="text-xs text-gray-600">{effectifTotal} personnes</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Équipes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Équipes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {equipes.slice(0, 5).map((equipe) => {
                const localite = localites.find(l => l.id === equipe.localiteId);
                return (
                  <div key={equipe.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{equipe.nom}</p>
                      <p className="text-sm text-gray-600">{localite?.nom}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{equipe.effectif} pers.</p>
                      <p className="text-xs text-gray-600">{equipe.responsable}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Provisions Configuration */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Configuration des Provisions</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Provision</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Ration/jour</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Conditionnement</th>
                  {isAdmin && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Prix unitaire</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {PRODUITS_DEFAUT.map((provision, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{provision.nom}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {provision.rationParPersonne} {provision.unite}/pers
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {provision.typeCondit} de {provision.taille} {provision.unite}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-sm font-mono text-gray-900">
                        {provision.prixUnitaire} FCFA
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
