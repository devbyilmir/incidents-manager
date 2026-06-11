import React, { useState, useEffect } from 'react';
import Login from './Login';
import Header from './Header';
import IncidentList from './components/incidents/IncidentList';
import CreateIncidentModal from './CreateIncidentModal';
import IncidentStats from './components/incidents/IncidentStats';
import RecentActivity from './components/incidents/RecentActivity';
import DashboardPage from './components/dashboard/DashboardPage';
import './App.css';
import {
  LayoutDashboard,
  ShieldAlert,
  BarChart3
} from "lucide-react";


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
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [activeTab, setActiveTab] = useState("dashboard");


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
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
    <div className="min-h-screen relative overflow-hidden">

      {/* Background */}

      <div
        className="
          absolute
          w-[800px]
          h-[800px]
          rounded-full
          bg-violet-400/15
          blur-[180px]
          transition-transform
          duration-500
        "
        style={{
          left: -250 + mousePosition.x * 0.02,
          top: -250 + mousePosition.y * 0.02,
        }}
      />

      <div
        className="
          absolute
          w-[700px]
          h-[700px]
          rounded-full
          bg-blue-400/15
          blur-[180px]
          transition-transform
          duration-500
        "
        style={{
          right: -250 - mousePosition.x * 0.02,
          top: 100 + mousePosition.y * 0.01,
        }}
      />

      <div
        className="
          absolute
          w-[600px]
          h-[600px]
          rounded-full
          bg-pink-400/10
          blur-[180px]
          transition-transform
          duration-500
        "
        style={{
          left: 500 + mousePosition.x * 0.01,
          bottom: -250 - mousePosition.y * 0.02,
        }}
      />

      {/* <div className="flex"> */}
      <div className="flex min-h-screen">
        <aside
          className="
            fixed
            left-0
            top-0
            bottom-0

            w-64

            border-r
            border-white/40

            bg-white/40
            backdrop-blur-3xl

            p-6

            hidden
            xl:flex
            flex-col

            overflow-y-auto
          "
        >

          {/* SIDEBAR */}

          <div className="mb-10">

            <h2 className="text-2xl font-bold text-slate-900">
              Incident AI
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Analytics Platform
            </p>

          </div>

          <nav className="space-y-2">

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-2xl
                transition-all
                duration-300

                ${activeTab === "dashboard"
                  ? "bg-white shadow-lg text-slate-900"
                  : "text-slate-500 hover:bg-white/60"
                }
              `}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("incidents")}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-2xl
                transition-all
                duration-300

                ${activeTab === "incidents"
                  ? "bg-white shadow-lg text-slate-900"
                  : "text-slate-500 hover:bg-white/60"
                }
              `}
            >
              <ShieldAlert size={18} />
              Incidents
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-2xl
                transition-all
                duration-300

                ${activeTab === "analytics"
                  ? "bg-white shadow-lg text-slate-900"
                  : "text-slate-500 hover:bg-white/60"
                }
              `}
            >
              <BarChart3 size={18} />
              Analytics
            </button>

          </nav>

          

          <div className="mt-auto space-y-4">

            <button
              onClick={openCreateModal}
              className="
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                text-white
                font-semibold
                shadow-xl
              "
            >
              Новый инцидент
            </button>

          </div>

        </aside>

        {/* CONTENT */}

        <div className="flex-1 ml-64">

          <Header
            user={user}
            onLogout={logout}
            onCreateIncident={openCreateModal}
          />

          <main className="max-w-[1800px] mx-auto px-8 py-8">
            {activeTab === "dashboard" && (
                <DashboardPage />
            )}

            {activeTab === "incidents" && (
                <IncidentList refreshTrigger={refreshTrigger} />
            )}

            {activeTab === "analytics" && (
                <IncidentStats />
            )}

          </main>

        </div>

      </div>

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