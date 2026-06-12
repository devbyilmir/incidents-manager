import React, { useState } from 'react';
import IncidentFilters from './IncidentFilters';
import IncidentCard from './IncidentCard';
import IncidentDetailsModal from './IncidentDetailsModal';
import toast from "react-hot-toast";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import { useIncidents } from "../../hooks/useIncidents";


const IncidentList = ({ refreshTrigger }) => {
  const {
  data: incidents = [],
  isLoading: loading,
  error,
  refetch
} = useIncidents();

  const queryClient = useQueryClient();
  const deleteIncidentMutation = useMutation({
    mutationFn: async (incidentId) => {
      const response = await fetch(
        `http://localhost:8000/incidents/${incidentId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка удаления");
      }

      return response.json();
    },

    onSuccess: () => {
      toast.success("Инцидент удален");

      queryClient.invalidateQueries({
        queryKey: ["incidents"]
      });
    },

    onError: () => {
      toast.error("Ошибка удаления");
    }
  });
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      incidentId,
      newStatus
    }) => {

      const response = await fetch(
        `http://localhost:8000/incidents/${incidentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка обновления");
      }

      return response.json();
    },

    onSuccess: () => {
      toast.success("Статус обновлен");

      queryClient.invalidateQueries({
        queryKey: ["incidents"]
      });
    },

    onError: () => {
      toast.error("Ошибка обновления");
    }
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

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
  const handleDeleteIncident = (incidentId) => {
    deleteIncidentMutation.mutate(incidentId);
  };

  const handleToggleStatus = (
    incidentId,
    currentStatus
  ) => {

    const newStatus =
      currentStatus === "открыт"
        ? "закрыт"
        : "открыт";

    updateStatusMutation.mutate({
      incidentId,
      newStatus
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
          onClick={() => refetch()}
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
        onRefresh={refetch}
      />

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
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            2xl:grid-cols-3
            gap-8
            items-stretch
          "
        >
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