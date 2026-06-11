import React from "react";

const RecentActivity = ({ incidents = [] }) => {
  return (
    <div
      className="
        max-h-[700px]
        overflow-y-auto
        sticky
        top-24
        h-full
        bg-white/60
        backdrop-blur-2xl
        rounded-3xl
        border
        border-white/40
        shadow-xl
        p-6
      "
    >
      <h3 className="text-lg font-semibold mb-6">
        Последние события
      </h3>

      <div className="space-y-5">
        {console.log("ACTIVITY INCIDENTS", incidents)}

        {[...incidents]
          .sort(
            (a, b) =>
              new Date(b.created_at) -
              new Date(a.created_at)
          )
          .slice(0, 5)
          .map((incident) => (

            <div
              key={incident.id}
              className="flex gap-4"
            >

              <div
                className={`
                w-3
                h-3
                rounded-full
                mt-2
                shrink-0

                ${incident.risk_level === "HIGH"
                    ? "bg-red-500"
                    : incident.risk_level === "MEDIUM"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }
              `}
              />

              <div>

                <div className="font-medium text-slate-900">
                  {incident.title}
                </div>

                <div className="text-sm text-slate-500">
                  {incident.type}
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  {new Date(
                    incident.created_at
                  ).toLocaleString("ru-RU")}
                </div>

              </div>

            </div>

          ))}

      </div>
    </div>
  );
};

export default RecentActivity;