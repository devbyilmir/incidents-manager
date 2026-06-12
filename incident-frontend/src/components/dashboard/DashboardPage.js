import React from 'react';
import { useIncidents } from "../../hooks/useIncidents";
import IncidentStats from '../incidents/IncidentStats';
import RecentActivity from '../incidents/RecentActivity';

const DashboardPage = () => {
  const {
    data: incidents = []
  } = useIncidents();

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