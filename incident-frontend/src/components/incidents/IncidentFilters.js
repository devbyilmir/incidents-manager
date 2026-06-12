import React from 'react';
import { Search } from 'lucide-react';

const IncidentFilters = ({ searchTerm, setSearchTerm, filter, setFilter, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Все инциденты</h1>
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
            <div
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            >
              <Search size={18} />
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
            onClick={onRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentFilters;