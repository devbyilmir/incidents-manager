import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">🚨 Инцидент-Менеджер</h1>
            </div>
            <nav className="ml-10 flex space-x-8">
              <a href="#incidents" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Инциденты
              </a>
              <a href="#create" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Создать инцидент
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700">Привет, {user.name}!</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'master' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
                <button 
                  onClick={onLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;