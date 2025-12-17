import React from 'react';

const IncidentCard = ({ incident, onViewDetails, onDelete, onToggleStatus }) => {
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

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group transition-all duration-300 relative ${
        incident.status === 'закрыт' 
          ? 'opacity-70 grayscale-[30%]' 
          : 'hover:shadow-xl transform hover:-translate-y-1'
      }`}
    >
      {/* Анимация завершения */}
      {incident.status === 'закрыт' && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-400/5 rounded-2xl pointer-events-none" />
      )}
      
      {/* Верхняя полоска - серая для закрытых */}
      <div className={`h-1 ${
        incident.status === 'закрыт' ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
        incident.priority === 'критический' ? 'bg-gradient-to-r from-red-500 to-red-600' :
        incident.priority === 'высокий' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
        incident.priority === 'средний' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
        'bg-gradient-to-r from-green-500 to-green-600'
      }`}></div>
      
      <div className="p-5 relative">
        {/* Заголовок и приоритет */}
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-bold line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors ${
            incident.status === 'закрыт' 
              ? 'text-gray-500 line-through decoration-2' 
              : 'text-gray-900'
          }`}>
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
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <span>👁️</span>
            Подробнее
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onToggleStatus}
              className={`${
                incident.status === 'открыт' 
                  ? 'text-gray-400 hover:text-green-600' 
                  : 'text-gray-400 hover:text-blue-600'
              } transition-colors`}
              title={incident.status === 'открыт' ? 'Закрыть инцидент' : 'Открыть инцидент'}
            >
              {incident.status === 'открыт' ? '✅' : '🔓'}
            </button>
            <button 
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;