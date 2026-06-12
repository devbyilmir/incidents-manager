import {
  createContext,
  useContext,
  useEffect
} from "react";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {

    let socket = null;
    let reconnectTimer = null;

    const connect = () => {

        socket = new WebSocket(
        "ws://localhost:8000/incidents/ws"
        );

        socket.onopen = () => {
        console.log("WS connected");

        toast.success(
            "Realtime подключен"
        );
        };

        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log("WS event:", data);

        switch (data.type) {

            case "incident_created":

            toast.success(
                "Создан новый инцидент"
            );

            queryClient.invalidateQueries({
                queryKey: ["incidents"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            break;

            case "incident_updated":

            toast(
                "Статус инцидента обновлен"
            );

            queryClient.invalidateQueries({
                queryKey: ["incidents"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            break;

            case "incident_deleted":

            toast.error(
                "Инцидент удален"
            );

            queryClient.invalidateQueries({
                queryKey: ["incidents"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            break;

            default:
            break;
        }
        };

        socket.onclose = () => {

        console.log(
            "WS disconnected"
        );

        reconnectTimer = setTimeout(
            () => {
            connect();
            },
            5000
        );
        };
    };

    connect();

    return () => {

        if (reconnectTimer) {
        clearTimeout(
            reconnectTimer
        );
        }

        if (socket) {
        socket.close();
        }
    };

    }, [queryClient]);

  return (
    <WebSocketContext.Provider value={null}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};