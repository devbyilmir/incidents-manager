import React, { useState, useEffect } from 'react';
import Login from './Login';
import Header from './Header';
import IncidentList from './components/incidents/IncidentList';
import CreateIncidentModal from './CreateIncidentModal';
import './App.css';

// Кастомный хук для авторизации
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const logout = async () => {
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

  return { isLoggedIn, user, loading, checkAuth, logout };
};

// Кастомный хук для управления инцидентами
const useIncidents = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleIncidentCreated = (newIncident) => {
    console.log('Новый инцидент создан:', newIncident);
    setIsCreateModalOpen(false);
    // ТРИГГЕРИМ ОБНОВЛЕНИЕ СПИСКА!
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    isCreateModalOpen,
    refreshTrigger,
    openCreateModal,
    closeCreateModal,
    handleIncidentCreated
  };
};

function App() {
  const { isLoggedIn, user, loading, checkAuth, logout } = useAuth();
  const { 
    isCreateModalOpen, 
    refreshTrigger, 
    openCreateModal, 
    closeCreateModal, 
    handleIncidentCreated 
  } = useIncidents();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={checkAuth} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={logout} 
        onCreateIncident={openCreateModal}
      />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <IncidentList refreshTrigger={refreshTrigger} />
      </main>
      
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onIncidentCreated={handleIncidentCreated}
      />
    </div>
  );
}

// Компонент загрузки
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Проверка авторизации...</p>
    </div>
  </div>
);

export default App;