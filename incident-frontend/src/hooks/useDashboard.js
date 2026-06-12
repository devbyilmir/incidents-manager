import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [
        statsRes,
        resolutionRes,
        riskRes,
        locationsRes,
        typesRes
      ] = await Promise.all([
        fetch(
          "http://localhost:8000/incidents/stats",
          {
            credentials: "include"
          }
        ),
        fetch(
          "http://localhost:8000/incidents/stats/resolution-time",
          {
            credentials: "include"
          }
        ),
        fetch(
          "http://localhost:8000/incidents/stats/risk-distribution",
          {
            credentials: "include"
          }
        ),
        fetch(
          "http://localhost:8000/incidents/stats/locations",
          {
            credentials: "include"
          }
        ),
        fetch(
          "http://localhost:8000/incidents/stats/types",
          {
            credentials: "include"
          }
        )
      ]);

      return {
        stats: await statsRes.json(),
        resolution: await resolutionRes.json(),
        riskDistribution: await riskRes.json(),
        locations: await locationsRes.json(),
        incidentTypes: await typesRes.json()
      };
    }
  });
};