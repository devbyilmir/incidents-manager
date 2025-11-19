import React, { useState, useEffect } from 'react';

const IncidentList = ({ refreshTrigger }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'критический':
        return '🔴';
      case 'высокий':
        return '🟠';
      case 'средний':
        return '🟡';
      default:
        return '🟢';
    }
  };

  // ПРОСМОТР ДЕТАЛЕЙ
  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
  };

  // ЗАКРЫТИЕ ИНЦИДЕНТА
  const handleCloseIncident = async (incidentId) => {
    if (!window.confirm('Вы уверены, что хотите закрыть этот инцидент?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/incidents/${incidentId}?status=закрыт`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Инцидент закрыт!');
        fetchIncidents();
      } else {
        alert('Ошибка при закрытии инцидента');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером');
    }
  };

  // ОТКРЫТИЕ ИНЦИДЕНТА
  const handleOpenIncident = async (incidentId) => {
    try {
      const response = await fetch(`http://localhost:8000/incidents/${incidentId}?status=открыт`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Инцидент открыт!');
        fetchIncidents();
      } else {
        alert('Ошибка при открытии инцидента');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером');
    }
  };

  // УДАЛЕНИЕ ИНЦИДЕНТА
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

  // РЕДАКТИРОВАНИЕ ИНЦИДЕНТА
  const handleEditIncident = (incident) => {
    setEditingIncident(incident);
    setEditForm({
      title: incident.title,
      description: incident.description,
      type: incident.type,
      priority: incident.priority,
      location: incident.location
    });
  };

  const handleUpdateIncident = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8000/incidents/${editingIncident.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      
      if (response.ok) {
        alert('Инцидент обновлен!');
        setEditingIncident(null);
        setEditForm({});
        fetchIncidents();
      } else {
        alert('Ошибка при обновлении инцидента');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером');
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Все инциденты</h1>
            <p className="text-gray-600 mt-1">Управление нештатными ситуациями на нефтебазе</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск инцидентов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все инциденты</option>
              <option value="критический">Критические</option>
              <option value="высокий">Высокий приоритет</option>
              <option value="средний">Средний приоритет</option>
              <option value="низкий">Низкий приоритет</option>
              <option value="открыт">Только открытые</option>
              <option value="закрыт">Только закрытые</option>
            </select>
            
            <button 
              onClick={fetchIncidents}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2"
            >
              <span>🔄</span>
              Обновить
            </button>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-2xl font-bold text-gray-900">{incidents.length}</div>
          <div className="text-gray-600 text-sm">Всего инцидентов</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-2xl font-bold text-red-600">
            {incidents.filter(i => i.priority === 'критический').length}
          </div>
          <div className="text-gray-600 text-sm">Критические</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-2xl font-bold text-orange-600">
            {incidents.filter(i => i.priority === 'высокий').length}
          </div>
          <div className="text-gray-600 text-sm">Высокий приоритет</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {incidents.filter(i => i.status === 'открыт').length}
          </div>
          <div className="text-gray-600 text-sm">Открытые</div>
        </div>
      </div>

      {/* Модалка деталей инцидента */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">📄 Детали инцидента</h2>
                  <p className="text-blue-100 mt-1">Полная информация о нештатной ситуации</p>
                </div>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="text-white hover:text-blue-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                <div className="text-lg font-semibold text-gray-900">{selectedIncident.title}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedIncident.description || 'Нет описания'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип</label>
                  <div className="font-medium">{selectedIncident.type}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
                  <div className="font-medium">{selectedIncident.priority}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Местоположение</label>
                <div className="font-medium">{selectedIncident.location}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedIncident.status === 'открыт' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedIncident.status}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Создатель</label>
                  <div className="font-medium">{selectedIncident.creator?.name || 'Неизвестно'}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Дата создания</label>
                <div className="font-medium">
                  {new Date(selectedIncident.created_at).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка редактирования */}
      {editingIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">✏️ Редактировать инцидент</h2>
                  <p className="text-blue-100 mt-1">Внесите изменения в информацию об инциденте</p>
                </div>
                <button 
                  onClick={() => setEditingIncident(null)}
                  className="text-white hover:text-blue-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateIncident} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок *</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="утечка">Утечка</option>
                    <option value="поломка">Поломка</option>
                    <option value="сбой_автоматики">Сбой автоматики</option>
                    <option value="загазованность">Загазованность</option>
                    <option value="пожарная_опасность">Пожарная опасность</option>
                    <option value="коррозия">Коррозия</option>
                    <option value="другое">Другое</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="низкий">Низкий</option>
                    <option value="средний">Средний</option>
                    <option value="высокий">Высокий</option>
                    <option value="критический">Критический</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Местоположение *</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingIncident(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <div 
              key={incident.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
            >
              {/* Верхняя полоска приоритета */}
              <div className={`h-1 ${
                incident.priority === 'критический' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                incident.priority === 'высокий' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                incident.priority === 'средний' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-green-500 to-green-600'
              }`}></div>
              
              <div className="p-5">
                {/* Заголовок и приоритет */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {incident.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <span className="text-lg">{getPriorityIcon(incident.priority)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      incident.priority === 'критический' ? 'bg-red-100 text-red-800' :
                      incident.priority === 'высокий' ? 'bg-orange-100 text-orange-800' :
                      incident.priority === 'средний' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.priority}
                    </span>
                  </div>
                </div>

                {/* Локация */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="mr-2">📍</span>
                  <span className="line-clamp-1">{incident.location}</span>
                </div>

                {/* Описание */}
                {incident.description && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {incident.description}
                  </p>
                )}

                {/* Метки */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    🏷️ {incident.type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                    incident.status === 'открыт' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {incident.status === 'открыт' ? '🔓' : '🔒'} {incident.status}
                  </span>
                </div>

                {/* Футер с автором и датой */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {incident.creator?.name?.charAt(0) || '?'}
                    </div>
                    <div className="ml-2">
                      <p className="text-xs font-medium text-gray-900">
                        {incident.creator?.name || 'Неизвестно'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(incident.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {new Date(incident.created_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* Ховер-действия */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleViewDetails(incident)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <span>👁️</span>
                    Подробнее
                  </button>
                  <div className="flex gap-2">
                    {incident.status === 'открыт' ? (
                      <button 
                        onClick={() => handleCloseIncident(incident.id)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Закрыть инцидент"
                      >
                        ✅
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenIncident(incident.id)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Открыть инцидент"
                      >
                        🔓
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditIncident(incident)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteIncident(incident.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
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