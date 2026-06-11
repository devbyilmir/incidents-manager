import React, { useEffect, useState } from 'react';

import IncidentStats from '../incidents/IncidentStats';
import RecentActivity from '../incidents/RecentActivity';

const DashboardPage = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/incidents/',
        {
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">

      <div className="2xl:col-span-4">
        <IncidentStats />
      </div>

      <div>
        <RecentActivity incidents={incidents} />
      </div>

    </div>
  );
};

export default DashboardPage;