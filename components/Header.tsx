'use client';

import { Search, Bell, User, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout, switchRole } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <div className="max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d7a49] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Bouton pour basculer entre admin et responsable (dev only) */}
        <button
          onClick={switchRole}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Basculer le rôle (dev)"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden md:inline">Changer rôle</span>
        </button>

        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user?.nom}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? 'Administrateur' : 'Responsable'}
            </p>
          </div>
          <div className="w-10 h-10 bg-[#6d7a49] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
