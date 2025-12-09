'use client';

import { useState } from 'react';
import { AppProviders, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Localites from '@/components/Localites';
import Equipes from '@/components/Equipes';
import Produits from '@/components/Produits';
import PlanningHebdo from '@/components/PlanningHebdo';
import DashboardAdmin from '@/components/DashboardAdmin';
import RecapAvance from '@/components/RecapAvance';
import Parametres from '@/components/Parametres';
import ApprobationsCalendrier from '@/components/ApprobationsCalendrier';
import Calendrier from '@/components/Calendrier';
import Utilisateurs from '@/components/Utilisateurs';
import Login from '@/components/Login';

function MainApp() {
  const { user, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Afficher un écran de chargement pendant la vérification de la session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la page de connexion
  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <DashboardAdmin /> : <PlanningHebdo />;
      case 'localites':
        return <Localites />;
      case 'equipes':
        return <Equipes />;
      case 'utilisateurs':
        return <Utilisateurs />;
      case 'produits':
        return <Produits />;
      case 'calendrier':
        return <Calendrier />;
      case 'planning':
        return <PlanningHebdo />;
      case 'recap':
        return <RecapAvance />;
      case 'approbations':
        return <ApprobationsCalendrier />;
      case 'parametres':
        return <Parametres />;
      default:
        return isAdmin ? <DashboardAdmin /> : <PlanningHebdo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProviders>
      <MainApp />
    </AppProviders>
  );
}
