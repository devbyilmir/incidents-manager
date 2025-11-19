import React, { useState, useEffect } from 'react';
import Login from './Login';
import Header from './Header';
import IncidentList from './IncidentList';
import CreateIncidentModal from './CreateIncidentModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Проверка авторизации
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Выход из системы
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Открытие модалки создания инцидента
  const handleCreateIncident = () => {
    setIsCreateModalOpen(true);
  };

  // После создания инцидента
  const handleIncidentCreated = (newIncident) => {
  console.log('Новый инцидент создан:', newIncident);
  setIsCreateModalOpen(false);
    
    // ТРИГГЕРИМ ОБНОВЛЕНИЕ СПИСКА!
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? (
        <>
          <Header 
            user={user} 
            onLogout={handleLogout} 
            onCreateIncident={handleCreateIncident}
          />
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <IncidentList refreshTrigger={refreshTrigger} /> {/* ← Передаём триггер */}
          </main>
          
          <CreateIncidentModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onIncidentCreated={handleIncidentCreated}
          />
        </>
      ) : (
        <Login onLogin={checkAuth} />
      )}
    </div>
  );
}

export default App;