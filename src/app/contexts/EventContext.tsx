"use client";

import React, { createContext, useContext, useState, FC, PropsWithChildren, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { LoggedEvent } from "@/app/types";

type EventContextValue = {
  loggedEvents: LoggedEvent[];
  logClientEvent: (eventObj: Record<string, any>, eventNameSuffix?: string) => void;
  logServerEvent: (eventObj: Record<string, any>, eventNameSuffix?: string) => void;
  logHistoryItem: (item: any) => void;
  toggleExpand: (id: number | string) => void;
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

export const EventProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);
  const eventQueueRef = useRef<Set<string>>(new Set());
  const lastEventTimeRef = useRef<{ [key: string]: number }>({});

  const addLoggedEvent = useCallback((direction: "client" | "server", eventName: string, eventData: Record<string, any>) => {
    const id = eventData.event_id || uuidv4();
    const eventKey = `${direction}-${eventName}-${JSON.stringify(eventData)}`;
    const now = Date.now();
    
    // Prevent duplicate events within 100ms
    if (lastEventTimeRef.current[eventKey] && (now - lastEventTimeRef.current[eventKey]) < 100) {
      return;
    }
    
    // Prevent adding the same event if it's already being processed
    if (eventQueueRef.current.has(eventKey)) {
      return;
    }
    
    eventQueueRef.current.add(eventKey);
    lastEventTimeRef.current[eventKey] = now;
    
    setLoggedEvents((prev) => {
      // Limit to last 100 events to prevent memory issues
      const newEvents = [
        ...prev,
        {
          id,
          direction,
          eventName,
          eventData,
          timestamp: new Date().toLocaleTimeString(),
          expanded: false,
        },
      ].slice(-100);
      
      // Clean up the queue after state update
      setTimeout(() => {
        eventQueueRef.current.delete(eventKey);
      }, 0);
      
      return newEvents;
    });
  }, []);

  const logClientEvent: EventContextValue["logClientEvent"] = (eventObj, eventNameSuffix = "") => {
    const name = `${eventObj.type || ""} ${eventNameSuffix || ""}`.trim();
    addLoggedEvent("client", name, eventObj);
  };

  const logServerEvent: EventContextValue["logServerEvent"] = (eventObj, eventNameSuffix = "") => {
    const name = `${eventObj.type || ""} ${eventNameSuffix || ""}`.trim();
    addLoggedEvent("server", name, eventObj);
  };

  const logHistoryItem: EventContextValue['logHistoryItem'] = (item) => {
    let eventName = item.type;
    if (item.type === 'message') {
      eventName = `${item.role}.${item.status}`;
    }
    if (item.type === 'function_call') {
      eventName = `function.${item.name}.${item.status}`;
    }
    addLoggedEvent('server', eventName, item);
  };

  const toggleExpand: EventContextValue['toggleExpand'] = (id) => {
    setLoggedEvents((prev) =>
      prev.map((log) => {
        if (log.id === id) {
          return { ...log, expanded: !log.expanded };
        }
        return log;
      })
    );
  };


  return (
    <EventContext.Provider
      value={{ loggedEvents, logClientEvent, logServerEvent, logHistoryItem, toggleExpand }}
    >
      {children}
    </EventContext.Provider>
  );
};

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}