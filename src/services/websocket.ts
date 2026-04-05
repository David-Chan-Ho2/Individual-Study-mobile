import { HvacPayload } from "@/types/hvac.types";

const WS_URL = "wss://your-websocket-url-here";

export type WsMessage =
  | { type: "data"; payload: HvacPayload }
  | { type: "error"; message: string };

export type WsStatus = "connecting" | "connected" | "disconnected" | "error";

export type WsHandlers = {
  onMessage: (msg: WsMessage) => void;
  onStatusChange: (status: WsStatus) => void;
};

export function createWebSocketConnection(handlers: WsHandlers): () => void {
  let ws: WebSocket;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  function connect() {
    handlers.onStatusChange("connecting");
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      handlers.onStatusChange("connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        handlers.onMessage(msg);
      } catch {
        handlers.onMessage({ type: "error", message: "Invalid message format" });
      }
    };

    ws.onerror = () => {
      handlers.onMessage({ type: "error", message: "WebSocket error" });
      handlers.onStatusChange("error");
    };

    ws.onclose = () => {
      if (destroyed) return;
      handlers.onStatusChange("disconnected");
      reconnectTimeout = setTimeout(connect, 3000);
    };
  }

  connect();

  return () => {
    destroyed = true;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    ws?.close();
  };
}
