import {
  createContext,
  useContext,
  useEffect
} from "react";

import { useQueryClient } from "@tanstack/react-query";

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
        };

        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log("WS event:", data);

        switch (data.type) {

            case "incident_created":

            queryClient.invalidateQueries({
                queryKey: ["incidents"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            break;

            case "incident_updated":

            queryClient.invalidateQueries({
                queryKey: ["incidents"]
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            break;

            case "incident_deleted":

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