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
// import RecentActivity from "../incidents/RecentActivity";

// const COLORS = [
//   "#22c55e",
//   "#f59e0b",
//   "#ef4444",
// ];
const getRiskColor = (risk) => {
  switch (risk) {
    case "HIGH":
      return "#ef4444";

    case "MEDIUM":
      return "#f59e0b";

    default:
      return "#22c55e";
  }
};

export default function DashboardCharts({
  riskDistribution,
  incidentTypes,
  incidents,
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

        <div className="h-[300px] flex items-center">

          <div className="w-36 space-y-4">

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">High</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Medium</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Low</span>
            </div>

          </div>

          <div className="flex-1 h-full">

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
                      fill={getRiskColor(entry.risk_level)}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>
          
          </div>
        </div>

      </div>

      {/* <div className="2xl:col-span-2 row-span-2">

        <RecentActivity incidents={incidents} />

      </div> */}

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

              <defs>

                <linearGradient
                  id="incidentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#8b5cf6"
                  />

                  <stop
                    offset="100%"
                    stopColor="#3b82f6"
                  />

                </linearGradient>

              </defs>

              <XAxis dataKey="type" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="url(#incidentGradient)"
                radius={[12, 12, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}