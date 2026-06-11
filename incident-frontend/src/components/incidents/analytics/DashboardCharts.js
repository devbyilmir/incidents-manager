import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

export default function DashboardCharts({
  riskDistribution,
  incidentTypes,
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

      {/* Risk Chart */}

      <div
        className="
          bg-white/60
          backdrop-blur-2xl
          border
          border-white/40
          rounded-3xl
          p-6
          shadow-xl
        "
      >
        <h3 className="text-lg font-semibold mb-4">
          Risk Distribution
        </h3>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={riskDistribution}
                dataKey="count"
                nameKey="risk_level"
                innerRadius={70}
                outerRadius={100}
              >

                {riskDistribution.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Types Chart */}

      <div
        className="
          bg-white/60
          backdrop-blur-2xl
          border
          border-white/40
          rounded-3xl
          p-6
          shadow-xl
        "
      >
        <h3 className="text-lg font-semibold mb-4">
          Incident Types
        </h3>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={incidentTypes}>

              <XAxis dataKey="type" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}