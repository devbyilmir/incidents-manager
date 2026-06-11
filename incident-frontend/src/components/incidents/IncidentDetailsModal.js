import React from 'react';

const IncidentDetailsModal = ({ selectedIncident, onClose }) => {
  if (!selectedIncident) return null;

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'bg-red-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-400 text-black';
      default:
        return 'bg-green-500 text-white';
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/30
        backdrop-blur-md
        flex
        items-center
        justify-center
        p-4
        z-50
      "
    >
      <div
        className="
          bg-white/80
          backdrop-blur-2xl
          rounded-3xl
          shadow-2xl
          border
          border-white/50
          max-w-3xl
          w-full
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* Header */}
        <div
          className="
            p-6
            border-b
            border-white/50
            flex
            justify-between
            items-start
          "
        >
          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-red-500
                  to-orange-500
                  flex
                  items-center
                  justify-center
                  text-white
                  shadow-lg
                "
              >
                🚨
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Детали инцидента
                </h2>

                <p className="text-sm text-gray-500">
                  Полная информация о событии
                </p>
              </div>

            </div>

          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-2xl
              bg-gray-100
              hover:bg-gray-200
              transition
              text-xl
            "
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Название */}
          <div>

            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Заголовок
            </div>

            <h3 className="text-2xl font-semibold text-gray-900">
              {selectedIncident.title}
            </h3>

          </div>

          {/* Блок риска */}
          <div className="flex flex-wrap gap-3">

            <div
              className={`
                px-4
                py-2
                rounded-2xl
                text-sm
                font-semibold
                ${getRiskColor(selectedIncident.risk_level)}
              `}
            >
              Risk Level: {selectedIncident.risk_level}
            </div>

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-slate-100
                text-slate-700
                text-sm
                font-semibold
              "
            >
              Risk Score: {selectedIncident.risk_score}
            </div>

          </div>

          {/* Описание */}
          <div>

            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Описание
            </div>

            <div
              className="
                bg-slate-50
                rounded-2xl
                p-4
                text-gray-700
                leading-relaxed
              "
            >
              {selectedIncident.description || 'Описание отсутствует'}
            </div>

          </div>

          {/* Карточки */}
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                Тип инцидента
              </div>

              <div className="font-semibold text-gray-900">
                {selectedIncident.type}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                Приоритет
              </div>

              <div className="font-semibold text-gray-900">
                {selectedIncident.priority}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                Местоположение
              </div>

              <div className="font-semibold text-gray-900">
                {selectedIncident.location}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                Статус
              </div>

              <div
                className={`
                  inline-flex
                  px-3
                  py-1
                  rounded-xl
                  text-sm
                  font-medium

                  ${
                    selectedIncident.status === 'открыт'
                      ? 'bg-green-100 text-green-700'
                      : selectedIncident.status === 'в работе'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                `}
              >
                {selectedIncident.status}
              </div>
            </div>

          </div>

          {/* Автор */}
          <div
            className="
              bg-white/60
              border
              border-white/50
              rounded-3xl
              p-5
            "
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                "
              >
                {selectedIncident.creator?.name?.charAt(0) || '?'}
              </div>

              <div>

                <div className="font-semibold text-gray-900">
                  {selectedIncident.creator?.name || 'Неизвестно'}
                </div>

                <div className="text-sm text-gray-500">
                  Создатель инцидента
                </div>

              </div>

            </div>
          </div>

          {/* Даты */}
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                Создан
              </div>

              <div className="font-medium">
                {new Date(
                  selectedIncident.created_at
                ).toLocaleString('ru-RU')}
              </div>
            </div>

            {selectedIncident.closed_at && (
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-1">
                  Закрыт
                </div>

                <div className="font-medium">
                  {new Date(
                    selectedIncident.closed_at
                  ).toLocaleString('ru-RU')}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsModal;