'use client';

import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Package,
  Calendar, 
  FileText, 
  Settings,
  CheckSquare,
  UserCog
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, admin: false },
    { id: 'localites', label: 'Localités', icon: MapPin, admin: true },
    { id: 'equipes', label: 'Équipes', icon: Users, admin: true },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: UserCog, admin: true },
    { id: 'produits', label: 'Produits', icon: Package, admin: true },
    { id: 'calendrier', label: 'Calendrier', icon: Calendar, admin: false },
    { id: 'planning', label: 'Planning Hebdo', icon: Calendar, admin: false },
    { id: 'recap', label: 'Récapitulatif', icon: FileText, admin: false },
    { id: 'approbations', label: 'Approbations', icon: CheckSquare, admin: true },
    { id: 'parametres', label: 'Paramètres', icon: Settings, admin: true },
  ];

  // Filtrer les items selon le rôle
  const visibleItems = menuItems.filter(item => !item.admin || isAdmin);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#6d7a49]">SIGAP</h1>
        <p className="text-xs text-gray-500 mt-1">Système de Gestion d'Approvisionnement</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#eef0e5] text-[#6d7a49] shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-[#f7f8f3] rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-900 mb-1">Aide & Support</p>
          <p className="text-xs text-gray-600">
            Besoin d'assistance ? Contactez le support technique.
          </p>
        </div>
      </div>
    </aside>
  );
}
