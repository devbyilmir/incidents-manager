import React from 'react';
import DashboardCharts from "../analytics/DashboardCharts";
import CountUp from "react-countup";
import { useDashboard } from "../../hooks/useDashboard";
import { useIncidents } from "../../hooks/useIncidents";


const IncidentStats = () => {
    const {
        data: dashboard,
        isLoading
    } = useDashboard();

    const {
        data: incidents = []
    } = useIncidents();

    if (isLoading || !dashboard) {
        return null;
    }

    const {
        stats,
        resolution,
        riskDistribution,
        locations,
        incidentTypes
    } = dashboard;

    if (!stats) {
        return null;
    }

    const highRisk =
        riskDistribution.find(r => r.risk_level === 'HIGH')?.count || 0;

    return (
        <div className="space-y-4">
            <div
                className="
                    bg-white/60
                    backdrop-blur-2xl
                    rounded-3xl
                    border
                    border-white/40
                    shadow-xl
                    p-8
                "
            >

                <div className="text-sm text-slate-500">
                    INCIDENT ANALYTICS
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mt-2">
                    Operations Dashboard
                </h1>

                <p className="text-slate-500 mt-3">
                    Мониторинг производственной безопасности и инцидентов.
                </p>

            </div>
            
            <div
                className="
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    rounded-3xl
                    p-6
                    text-white
                "
                >

                <div className="text-sm opacity-80">
                    AI SUMMARY
                </div>

                <div className="text-2xl font-bold mt-2">
                    Сводка системы
                </div>

                <div className="mt-4 space-y-2">

                    <div>
                    Всего инцидентов: {stats.total}
                    </div>

                    <div>
                    HIGH риск: {highRisk}
                    </div>

                    <div>
                    Средний риск: {stats.average_risk}
                    </div>

                    <div>
                    Самый частый тип:
                    {" "}
                    {incidentTypes[0]?.type || "Нет данных"}
                    </div>

                </div>

                </div>

            <DashboardCharts
                riskDistribution={riskDistribution}
                incidentTypes={incidentTypes}
                incidents={incidents}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <div
                    className="
                        bg-white/60
                        backdrop-blur-2xl
                        rounded-3xl
                        border
                        border-white/40
                        shadow-xl
                        p-6
                        hover:shadow-2xl
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                    "
                >
                    <div className="text-3xl font-bold text-slate-900">
                        <CountUp
                            end={stats.total}
                            duration={1.5}
                        />
                    </div>
                    <div className="text-gray-500 text-sm">
                        Всего инцидентов
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                        База данных активных инцидентов
                    </div>
                </div>

                <div
                    className="
                        bg-white/60
                        backdrop-blur-2xl
                        rounded-3xl
                        border
                        border-white/40
                        shadow-xl
                        p-6
                        hover:shadow-2xl
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                    "
                >
                    <div className="text-3xl font-bold text-green-600">
                        <CountUp
                            end={stats.open}
                            duration={1.5}
                        />
                    </div>
                    <div className="text-gray-500 text-sm">
                        Открыто
                    </div>
                    <div className="text-xs text-emerald-500 mt-2">
                        Требует внимания
                    </div>
                </div>

                <div
                    className="
                        bg-white/60
                        backdrop-blur-2xl
                        rounded-3xl
                        border
                        border-white/40
                        shadow-xl
                        p-6
                        hover:shadow-2xl
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                    "
                >
                    <div className="text-3xl font-bold text-blue-600">
                        <CountUp
                            end={stats.in_progress}
                            duration={1.5}
                        />
                    </div>
                    <div className="text-gray-500 text-sm">
                        В работе
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                        В процессе
                    </div>
                </div>

                <div
                    className="
                        bg-white/60
                        backdrop-blur-2xl
                        rounded-3xl
                        border
                        border-white/40
                        shadow-xl
                        p-6
                        hover:shadow-2xl
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                    "
                >
                    <div className="text-3xl font-bold text-gray-700">
                        <CountUp
                            end={stats.closed}
                            duration={1.5}
                        />
                    </div>
                    <div className="text-gray-500 text-sm">
                        Закрыто
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        Успешно решено
                    </div>
                </div>

                <div
                    className="
                        bg-white/60
                        backdrop-blur-2xl
                        rounded-3xl
                        border
                        border-white/40
                        shadow-xl
                        p-6
                        hover:shadow-2xl
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                    "
                >
                    <div className="text-3xl font-bold text-red-600">
                        <CountUp
                            end={highRisk}
                            duration={1.5}
                        />
                    </div>
                    <div className="text-gray-500 text-sm">
                        HIGH риск
                    </div>
                    <div className="text-xs text-red-500 mt-2">
                        Критические ситуации
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="
                    bg-white/70
                    backdrop-blur-xl
                    rounded-3xl
                    border
                    border-white/50
                    shadow-lg
                    p-6
                ">
                    <div className="text-lg font-semibold mb-2">
                        Средний риск
                    </div>

                    <div className="text-3xl font-bold text-orange-600">
                        {stats.average_risk}
                    </div>
                </div>

                <div className="
                    bg-white/70
                    backdrop-blur-xl
                    rounded-3xl
                    border
                    border-white/50
                    shadow-lg
                    p-6
                ">
                    <div className="text-lg font-semibold mb-2">
                        Среднее время решения
                    </div>

                    <div className="text-3xl font-bold text-indigo-600">
                        {resolution?.average_hours || 0} ч
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Risk Distribution */}

                <div className="
                    bg-white/70
                    backdrop-blur-xl
                    rounded-3xl
                    border
                    border-white/50
                    shadow-lg
                    p-6
                ">

                    <div className="text-lg font-semibold mb-4">
                        📊 Распределение рисков
                    </div>

                    <div className="space-y-3">

                        {riskDistribution.map((risk, index) => (

                            <div
                                key={index}
                                className="flex justify-between items-center"
                            >

                                <span>
                                    {risk.risk_level}
                                </span>

                                <span
                                    className={`
                                        px-3
                                        py-1
                                        rounded-xl
                                        font-bold

                                        ${risk.risk_level === 'HIGH'
                                            ? 'bg-red-100 text-red-700'
                                            : risk.risk_level === 'MEDIUM'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-green-100 text-green-700'
                                        }
                                    `}
                                >
                                    {risk.count}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Locations */}

                <div className="
                    bg-white/70
                    backdrop-blur-xl
                    rounded-3xl
                    border
                    border-white/50
                    shadow-lg
                    p-6
                ">

                    <div className="text-lg font-semibold mb-4">
                        🔥 ТОП проблемных локаций
                    </div>

                    <div className="space-y-3">

                        {locations.slice(0, 5).map((location, index) => (

                            <div
                                key={index}
                                className="flex justify-between"
                            >
                                <span>
                                    {location.location}
                                </span>

                                <span className="font-bold text-red-600">
                                    {location.count}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default IncidentStats;