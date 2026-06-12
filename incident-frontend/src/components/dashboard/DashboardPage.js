import React from 'react';
import { useQuery } from "@tanstack/react-query";
import IncidentStats from '../incidents/IncidentStats';
import RecentActivity from '../incidents/RecentActivity';

const DashboardPage = () => {
  const {
    data: incidents = []
  } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:8000/incidents/",
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки инцидентов");
      }

      return response.json();
    }
  });

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6 items-stretch">

      <div className="2xl:col-span-4">
        <IncidentStats />
      </div>

      <div className="h-full">
        <RecentActivity incidents={incidents} />
      </div>

    </div>
  );
};

export default DashboardPage;