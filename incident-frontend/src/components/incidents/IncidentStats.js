import React, { useEffect, useState } from 'react';

const IncidentStats = () => {
    const [stats, setStats] = useState(null);
    const [resolution, setResolution] = useState(null);
    const [riskDistribution, setRiskDistribution] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [
                statsRes,
                resolutionRes,
                riskRes,
                locationsRes,
            ] = await Promise.all([
                fetch('http://localhost:8000/incidents/stats', {
                    credentials: 'include'
                }),
                fetch('http://localhost:8000/incidents/stats/resolution-time', {
                    credentials: 'include'
                }),
                fetch('http://localhost:8000/incidents/stats/risk-distribution', {
                    credentials: 'include'
                }),
                fetch('http://localhost:8000/incidents/stats/locations', {
                    credentials: 'include'
                }),
            ]);

            const statsData = await statsRes.json();
            const resolutionData = await resolutionRes.json();
            const riskData = await riskRes.json();
            const locationsData = await locationsRes.json();

            setStats(statsData);
            setResolution(resolutionData);
            setRiskDistribution(riskData);
            setLocations(locationsData);

        } catch (error) {
            console.error(error);
        }
    };

    if (!stats) {
        return null;
    }

    const highRisk =
        riskDistribution.find(r => r.risk_level === 'HIGH')?.count || 0;

    return (
        <div className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <div className="bg-white/70
                        backdrop-blur-xl
                        rounded-3xl
                        border
                        border-white/50
                        shadow-lg
                        p-5">
                    <div className="text-4xl font-bold">
                        {stats.total}
                    </div>
                    <div className="text-gray-500 text-sm">
                        Всего инцидентов
                    </div>
                </div>

                <div className="bg-white/70
                        backdrop-blur-xl
                        rounded-3xl
                        border
                        border-white/50
                        shadow-lg
                        p-5">
                    <div className="text-4xl font-bold text-green-600">
                        {stats.open}
                    </div>
                    <div className="text-gray-500 text-sm">
                        Открыто
                    </div>
                </div>

                <div className="bg-white/70
                        backdrop-blur-xl
                        rounded-3xl
                        border
                        border-white/50
                        shadow-lg
                        p-5">
                    <div className="text-4xl font-bold text-blue-600">
                        {stats.in_progress}
                    </div>
                    <div className="text-gray-500 text-sm">
                        В работе
                    </div>
                </div>

                <div className="bg-white/70
                        backdrop-blur-xl
                        rounded-3xl
                        border
                        border-white/50
                        shadow-lg
                        p-5">
                    <div className="text-4xl font-bold text-gray-700">
                        {stats.closed}
                    </div>
                    <div className="text-gray-500 text-sm">
                        Закрыто
                    </div>
                </div>

                <div className="bg-white/70
                        backdrop-blur-xl
                        rounded-3xl
                        border
                        border-white/50
                        shadow-lg
                        p-5">
                    <div className="text-4xl font-bold text-red-600">
                        {highRisk}
                    </div>
                    <div className="text-gray-500 text-sm">
                        HIGH риск
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

                    <div className="text-4xl font-bold text-orange-600">
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

                    <div className="text-4xl font-bold text-indigo-600">
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