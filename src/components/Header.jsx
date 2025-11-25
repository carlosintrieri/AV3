import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold text-blue-600">AEROCODE</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => navigate('/dashboard')}
            className={`font-medium transition-colors ${isActive('/dashboard')
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
              : 'text-gray-700 hover:text-blue-600'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/projects')}
            className={`font-medium transition-colors ${isActive('/projects') || location.pathname.includes('/production')
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
              : 'text-gray-700 hover:text-blue-600'
              }`}
          >
            Projetos
          </button>
          <button
            onClick={() => navigate('/resources')}
            className={`font-medium transition-colors ${isActive('/resources')
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
              : 'text-gray-700 hover:text-blue-600'
              }`}
          >
            Recursos
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
