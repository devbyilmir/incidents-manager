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
        Recent Activity
      </h3>

      <div className="space-y-5">

        {incidents.slice(0, 5).map((incident) => (

          <div
            key={incident.id}
            className="flex gap-4"
          >

            <div
              className="
                w-3
                h-3
                rounded-full
                bg-violet-500
                mt-2
                shrink-0
              "
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