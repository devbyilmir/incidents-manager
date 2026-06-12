import { useQuery } from "@tanstack/react-query";

export const useIncidents = () => {
  return useQuery({
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
};