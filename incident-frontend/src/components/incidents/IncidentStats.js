import React from 'react';

const IncidentStats = ({ incidents }) => {
    return (
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
    );
};

export default IncidentStats;