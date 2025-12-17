import React, { useState, useEffect } from 'react';
import IncidentFilters from './IncidentFilters';
import IncidentStats from './IncidentStats';
import IncidentCard from './IncidentCard';
import IncidentDetailsModal from './IncidentDetailsModal';

const IncidentList = ({ refreshTrigger }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, [refreshTrigger]);

  const fetchIncidents = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/incidents/', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      } else {
        throw new Error('Ошибка загрузки инцидентов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Не удалось загрузить инциденты');
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация инцидентов
  const filteredIncidents = incidents.filter(incident => {
    const matchesFilter = filter === 'all' || 
                         incident.priority === filter || 
                         incident.status === filter;
    
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.creator?.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Обработчики действий
  const handleDeleteIncident = async (incidentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот инцидент? Это действие нельзя отменить!')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/incidents/${incidentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Инцидент удален!');
        fetchIncidents();
      } else {
        alert('Ошибка при удалении инцидента');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером');
    }
  };

  const handleToggleStatus = async (incidentId, currentStatus) => {
    const newStatus = currentStatus === 'открыт' ? 'закрыт' : 'открыт';
    
    try {
      const response = await fetch(`http://localhost:8000/incidents/${incidentId}?status=${newStatus}`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert(`Инцидент ${newStatus === 'закрыт' ? 'закрыт' : 'открыт'}!`);
        fetchIncidents();
      } else {
        alert('Ошибка при изменении статуса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения');
    }
  };

  if (loading) return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-xl text-gray-600">Загрузка инцидентов...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">❌</div>
        <div className="text-xl text-gray-600 mb-4">{error}</div>
        <button 
          onClick={fetchIncidents}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Хедер с фильтрами */}
      <IncidentFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        onRefresh={fetchIncidents}
      />

      {/* Статистика */}
      <IncidentStats incidents={incidents} />

      {/* Модалка деталей инцидента */}
      <IncidentDetailsModal 
        selectedIncident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

      {/* Список инцидентов */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filter !== 'all' ? 'Инцеденты не найдены' : 'Инцедентов пока нет'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filter !== 'all' 
              ? 'Попробуйте изменить параметры поиска или фильтрации' 
              : 'Будьте первым, кто создаст инцидент'
            }
          </p>
          {(searchTerm || filter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredIncidents.map(incident => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onViewDetails={() => setSelectedIncident(incident)}
              onDelete={() => handleDeleteIncident(incident.id)}
              onToggleStatus={() => handleToggleStatus(incident.id, incident.status)}
            />
          ))}
        </div>
      )}

      {/* Футер с информацией */}
      <div className="text-center text-gray-500 text-sm">
        Показано {filteredIncidents.length} из {incidents.length} инцидентов
        {(searchTerm || filter !== 'all') && ' (отфильтровано)'}
      </div>
    </div>
  );
};

export default IncidentList;