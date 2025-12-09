'use client';

import { Users, MapPin, Package, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth, useData } from '@/contexts/AuthContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardAdmin() {
  const { isAdmin } = useAuth();
  const { localites, equipes, produits, plannings } = useData();

  const totalEquipes = equipes.length;
  const totalEffectif = equipes.reduce((sum, e) => sum + e.effectif, 0);

  // Calculer les dépenses par mois (simulation avec données des 6 derniers mois)
  const depensesParMois = [
    { mois: 'Juil', depense: 2450000 },
    { mois: 'Août', depense: 2780000 },
    { mois: 'Sept', depense: 2650000 },
    { mois: 'Oct', depense: 2890000 },
    { mois: 'Nov', depense: 3120000 },
    { mois: 'Déc', depense: 2950000 },
  ];

  // Calculer la répartition par catégorie de produits
  const repartitionParCategorie = produits.reduce((acc: any[], produit) => {
    const existing = acc.find(item => item.name === produit.categorie);
    const value = produit.prixUnitaire;
    
    if (existing) {
      existing.value += value;
    } else {
      acc.push({
        name: produit.categorie || 'Autres',
        value: value,
      });
    }
    return acc;
  }, []);

  const COLORS = ['#6d7a49', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  // Budget total estimé pour le mois en cours
  const budgetMoisActuel = depensesParMois[depensesParMois.length - 1].depense;
  const variationBudget = ((budgetMoisActuel - depensesParMois[depensesParMois.length - 2].depense) / depensesParMois[depensesParMois.length - 2].depense) * 100;

  const stats = [
    {
      label: 'Total Localités',
      value: localites.length,
      icon: MapPin,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Équipes',
      value: totalEquipes,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Effectif Total',
      value: totalEffectif,
      icon: Package,
      color: 'bg-yellow-500',
    },
    {
      label: 'Budget Décembre',
      value: `${Math.round(budgetMoisActuel / 1000)}k FCFA`,
      icon: DollarSign,
      color: 'bg-purple-500',
      variation: variationBudget,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h2>
        <p className="text-gray-600 mt-1">Vue d'ensemble et analyse des dépenses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.variation !== undefined && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className={`w-4 h-4 ${stat.variation >= 0 ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={`text-xs font-medium ${stat.variation >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {stat.variation >= 0 ? '+' : ''}{stat.variation.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dépenses par mois */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dépenses Mensuelles (6 derniers mois)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={depensesParMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${(value / 1000).toFixed(0)}k FCFA`} />
              <Legend />
              <Bar dataKey="depense" fill="#6d7a49" name="Dépenses (FCFA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par catégorie */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type de Produit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repartitionParCategorie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {repartitionParCategorie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Résumé des produits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Produits Configurés ({produits.length})</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produits.map((produit) => (
              <div key={produit.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{produit.nom}</h4>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {produit.categorie}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Ration: {produit.rationParPersonne} {produit.unite}/pers</p>
                  <p className="font-mono text-[#6d7a49]">
                    Prix: {produit.prixUnitaire} FCFA/{produit.typeCondit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plannings actifs */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plannings Hebdomadaires Actifs</h3>
        <div className="space-y-3">
          {plannings.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucun planning créé pour le moment</p>
          ) : (
            plannings.map((planning) => {
              const equipe = equipes.find(e => e.id === planning.equipeId);
              const totalProduits = Object.values(planning.jours).reduce((sum: number, jour: any) => sum + jour.length, 0);
              
              return (
                <div key={planning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{equipe?.nom}</p>
                    <p className="text-sm text-gray-600">Mois: {planning.mois}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{totalProduits} produits sélectionnés</p>
                    <p className="text-xs text-gray-600">sur la semaine</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
