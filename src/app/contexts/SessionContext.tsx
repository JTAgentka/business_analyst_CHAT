"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface SessionContextType {
  sessionId: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ sessionId, children }: { sessionId: string; children: ReactNode }) {
  return (
    <SessionContext.Provider value={{ sessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Global session storage for agent tools
let globalSessionId = '';

export function setGlobalSessionId(sessionId: string) {
  globalSessionId = sessionId;
  // Store in window for agent tools to access
  if (typeof window !== 'undefined') {
    (window as any).__CURRENT_SESSION_ID = sessionId;
  }
}

export function getGlobalSessionId(): string {
  if (typeof window !== 'undefined' && (window as any).__CURRENT_SESSION_ID) {
    return (window as any).__CURRENT_SESSION_ID;
  }
  return globalSessionId || 'default_session';
}