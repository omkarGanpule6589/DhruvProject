import * as signalR from "@microsoft/signalr";
import { apiUrl } from "../components/API/apiConfig";

let connection: signalR.HubConnection;

export const startConnection = async () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${apiUrl}/focohub`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("✅ SignalR connection established");
    return "connected";
  } catch (err) {
    console.error("❌ SignalR connection failed", err);
    throw err;
  }
};

export const getConnection = () => connection;

export const registerRouteCard = async (
  routeCardId: number,
  machineId: number
) => {
  if (!connection) throw new Error("SignalR not connected");
  try {
    await connection.invoke("RegisterRouteCard", routeCardId, machineId);
  } catch (err) {
    console.error("❌ RegisterRouteCard failed", err);
  }
};

export const onLensDataReceived = (callback: (message: any) => void) => {
  if (!connection) return;
  connection.on("LensDataReceived", callback);
};

export const onRouteCardRegistered = (
  callback: (message: { success: boolean; message: string }) => void
) => {
  if (!connection) return;
  connection.on("RouteCardRegistered", callback);
};
