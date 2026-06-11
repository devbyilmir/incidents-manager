import React, { useState } from 'react';

const CreateIncidentModal = ({ isOpen, onClose, onIncidentCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'утечка',
    priority: 'средний',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/incidents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newIncident = await response.json();

        // Сброс формы
        setFormData({
          title: '',
          description: '',
          type: 'утечка',
          priority: 'средний',
          location: ''
        });

        // Уведомляем родительский компонент
        onIncidentCreated(newIncident);
        onClose();

        // Принудительное обновление страницы
        setTimeout(() => {
          window.location.reload();
        }, 100);

      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при создании инцидента');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError(error.message || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

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
      onClick={handleOverlayClick}
    >
      <div
        className="
          bg-white/80
          backdrop-blur-2xl
          rounded-3xl
          border
          border-white/50
          shadow-2xl
          max-w-2xl
          w-full
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* Хедер */}
        <div className="p-6 border-b border-white/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📝 Создать инцидент</h2>
              <p className="text-gray-500 mt-1">Заполните информацию о новой нештатной ситуации</p>
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
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center">
              <div className="text-red-500 text-lg mr-2">⚠️</div>
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок инцидента *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
              placeholder="Например: Обнаружена утечка нефти возле резервуара РВС-4"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
              placeholder="Подробное описание ситуации..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип инцидента
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
                disabled={loading}
              >
                <option value="утечка">🛢️ Утечка</option>
                <option value="отказ оборудования">⚙️ Отказ оборудования</option>
                <option value="сбой автоматики">🤖 Сбой автоматики</option>
                <option value="загазованность">🌫️ Загазованность</option>
                <option value="пожарная опасность">🔥 Пожарная опасность</option>
                <option value="коррозия">🛠️ Коррозия</option>
                <option value="другое">❓ Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Приоритет
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
                disabled={loading}
              >
                <option value="низкий">🟢 Низкий</option>
                <option value="средний">🟡 Средний</option>
                <option value="высокий">🟠 Высокий</option>
                <option value="критический">🔴 Критический</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Местоположение *

              <p className="text-xs text-gray-500 mt-2">
                Укажите объект, установку, цех или резервуар.
              </p>

            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
              placeholder="Например: Резервуарный парк, РВС-10000"
              required
              disabled={loading}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-2xl font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-800 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Создание...
                </>
              ) : (
                <>
                  <span>✅</span>
                  Создать инцидент
                </>
              )}
            </button>
          </div>
        </form>

        {/* Подсказка */}
        <div className="px-6 pb-6">
          <div className="text-xs text-gray-500 text-center">
            * - обязательные для заполнения поля
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentModal;