import React from 'react';
import {
  MapPin,
  ShieldAlert,
  Eye,
  Trash2
} from "lucide-react";

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
      className={`
        bg-white/70
        backdrop-blur-xl
        rounded-3xl
        border
        border-white/50
        shadow-xl
        overflow-hidden
        group
        transition-all
        duration-300
        relative

        ${
          incident.status === 'закрыт'
            ? 'opacity-70'
            // : 'hover:-translate-y-2 hover:shadow-2xl'
            : 'hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)]'
        }
      `}
    >
      {incident.status === 'закрыт' && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-400/5 pointer-events-none" />
      )}

      <div
        className={`h-2 ${
          incident.status === 'закрыт'
            ? 'bg-gradient-to-r from-gray-400 to-gray-500'
            : incident.priority === 'критический'
            ? 'bg-gradient-to-r from-red-500 to-red-600'
            : incident.priority === 'высокий'
            ? 'bg-gradient-to-r from-orange-500 to-orange-600'
            : incident.priority === 'средний'
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            : 'bg-gradient-to-r from-green-500 to-green-600'
        }`}
      />

      <div className="p-6 relative">

        {/* Заголовок */}
        <div className="flex justify-between items-start mb-4">

          <h3
            className={`
              text-xl
              font-semibold
              leading-tight
              line-clamp-2
              transition-colors

              ${
                incident.status === 'закрыт'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900 group-hover:text-blue-600'
              }
            `}
          >
            {incident.title}
          </h3>

          <div className="flex items-center gap-2 ml-3">

            <span className="text-lg">
              {getPriorityIcon(incident.priority)}
            </span>

            <div
              className={`
                px-2
                py-1
                rounded-xl
                text-[10px]
                font-bold
                ${getRiskColor(incident.risk_level)}
              `}
            >
              {incident.risk_level}
            </div>

            <span
              className={`
                px-3
                py-1
                rounded-xl
                text-xs
                font-bold

                ${
                  incident.priority === 'критический'
                    ? 'bg-red-100 text-red-800'
                    : incident.priority === 'высокий'
                    ? 'bg-orange-100 text-orange-800'
                    : incident.priority === 'средний'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }
              `}
            >
              {incident.priority}
            </span>

          </div>

        </div>

        {/* Risk Score */}
        <div className="flex gap-2 mb-4">

          <div
            className={`
              px-3
              py-1
              rounded-xl
              text-xs
              font-semibold

              ${
                incident.risk_level === 'HIGH'
                  ? 'bg-red-100 text-red-700'
                  : incident.risk_level === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }
            `}
          >
            Risk Score: {incident.risk_score}
          </div>

        </div>

        {/* AI Recommendation */}

        <div
          className="
            mb-4
            rounded-2xl
            border
            border-violet-200
            bg-violet-50
            p-3
          "
        >

          <div className="text-xs font-semibold text-violet-600 mb-1">
            AI Recommendation
          </div>

          <div className="text-sm text-gray-700">

            {incident.recommendation}

          </div>

        </div>

        {/* Локация */}
        <div
          className="
            flex
            items-center
            text-sm
            text-slate-500
            mb-4
            bg-slate-50
            rounded-xl
            px-3
            py-2
          "
        >
          <span className="mr-2"><MapPin size={14} /></span>
          <span className="line-clamp-1">{incident.location}</span>
        </div>

        {/* Описание */}
        {incident.description && (
          <p className="text-gray-700 text-sm mb-5 line-clamp-3 leading-relaxed">
            {incident.description}
          </p>
        )}

        {/* Метки */}
        <div className="flex flex-wrap gap-2 mb-5">

          <span
            className="
              inline-flex
              items-center
              px-3
              py-1
              rounded-xl
              text-xs
              font-medium
              bg-blue-500/10
              text-blue-700
              border
              border-blue-300
            "
          >
            🏷️ {incident.type}
          </span>

          <span
            className={`
              inline-flex
              items-center
              px-3
              py-1
              rounded-xl
              text-xs
              font-medium
              border

              ${
                incident.status === 'открыт'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : incident.status === 'в работе'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }
            `}
          >
            {incident.status}
          </span>

        </div>

        {/* Автор */}
        <div className="flex items-center justify-between pt-4 border-t border-white/50">

          <div className="flex items-center">

            <div
              className="
                w-10
                h-10
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-purple-600
                flex
                items-center
                justify-center
                text-white
                text-sm
                font-bold
                shadow-md
              "
            >
              {incident.creator?.name?.charAt(0) || '?'}
            </div>

            <div className="ml-3">

              <p className="text-sm font-medium text-gray-900">
                {incident.creator?.name || 'Неизвестно'}
              </p>

              <p className="text-xs text-gray-500">
                {new Date(incident.created_at).toLocaleDateString('ru-RU')}
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

      {/* Нижняя панель */}
      <div
        className="
          px-6
          py-4
          bg-white/40
          backdrop-blur-xl
          border-t
          border-white/50
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-200
        "
      >
        <div className="flex justify-between items-center">

          <button
            onClick={onViewDetails}
            className="
              text-blue-600
              hover:text-blue-700
              text-sm
              font-medium
            "
          >
            <Eye size={16} />
          </button>

          <div className="flex gap-3">

            <button
              onClick={onToggleStatus}
              className="
                text-gray-400
                hover:text-green-600
                transition-colors
              "
            >
              {incident.status === 'открыт' ? '✅' : '🔓'}
            </button>

            <button
              onClick={onDelete}
              className="
                text-gray-400
                hover:text-red-600
                transition-colors
              "
            >
              <Trash2 size={16} />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentCard;