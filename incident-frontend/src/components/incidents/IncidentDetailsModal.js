import React from 'react';

const IncidentDetailsModal = ({ selectedIncident, onClose }) => {
    if (!selectedIncident) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white">📄 Детали инцидента</h2>
                            <p className="text-blue-100 mt-1">Полная информация о нештатной ситуации</p>
                        </div>
                        <button
                            onClick={onClose}
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
                            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${selectedIncident.status === 'открыт' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
    );
};

export default IncidentDetailsModal;