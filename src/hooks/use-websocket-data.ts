import { useEffect, useRef, useState } from "react";

import { createWebSocketConnection, WsStatus } from "@/services/websocket";
import { HvacPayload } from "@/types/hvac.types";

type State = {
  items: HvacPayload[];
  status: WsStatus;
  error: string | null;
};

export function useWebSocketData() {
  const [state, setState] = useState<State>({
    items: [],
    status: "connecting",
    error: null,
  });

  const itemsRef = useRef<HvacPayload[]>([]);

  useEffect(() => {
    const disconnect = createWebSocketConnection({
      onMessage(msg) {
        if (msg.type === "data") {
          const payload = msg.payload;
          const existing = itemsRef.current.findIndex(
            (i) => i.device === payload.device
          );
          const updated =
            existing >= 0
              ? itemsRef.current.map((i, idx) =>
                  idx === existing ? payload : i
                )
              : [...itemsRef.current, payload];

          itemsRef.current = updated;
          setState((prev) => ({ ...prev, items: updated, error: null }));
        } else {
          setState((prev) => ({ ...prev, error: msg.message }));
        }
      },
      onStatusChange(status) {
        setState((prev) => ({ ...prev, status }));
      },
    });

    return disconnect;
  }, []);

  return {
    items: state.items,
    status: state.status,
    error: state.error,
    loading: state.status === "connecting" && state.items.length === 0,
  };
}
