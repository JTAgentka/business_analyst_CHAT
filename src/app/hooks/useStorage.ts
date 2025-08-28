import { useCallback } from 'react';

export interface AgentInteraction {
  type: 'question' | 'answer' | 'handoff' | 'completion';
  content: string;
  timestamp: string;
  metadata?: any;
}

export interface UseStorageReturn {
  saveAgentData: (sessionId: string, agentName: string, data: any) => Promise<boolean>;
  logInteraction: (sessionId: string, agentName: string, interaction: AgentInteraction) => Promise<boolean>;
  getSessionData: (sessionId: string) => Promise<any>;
  getAuditTrail: (sessionId: string, agentName?: string) => Promise<AgentInteraction[]>;
}

export function useStorage(): UseStorageReturn {
  const saveAgentData = useCallback(async (sessionId: string, agentName: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_agent_data',
          sessionId,
          agentName,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error saving agent data:', error);
      return false;
    }
  }, []);

  const logInteraction = useCallback(async (sessionId: string, agentName: string, interaction: AgentInteraction): Promise<boolean> => {
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'log_interaction',
          sessionId,
          agentName,
          data: interaction,
          timestamp: interaction.timestamp || new Date().toISOString(),
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error logging interaction:', error);
      return false;
    }
  }, []);

  const getSessionData = useCallback(async (sessionId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/storage?action=get_session_data&sessionId=${sessionId}`);
      const result = await response.json();
      return result.success ? result.data : {};
    } catch (error) {
      console.error('Error getting session data:', error);
      return {};
    }
  }, []);

  const getAuditTrail = useCallback(async (sessionId: string, agentName?: string): Promise<AgentInteraction[]> => {
    try {
      const url = agentName 
        ? `/api/storage?action=get_audit_trail&sessionId=${sessionId}&agentName=${agentName}`
        : `/api/storage?action=get_audit_trail&sessionId=${sessionId}`;
      
      const response = await fetch(url);
      const result = await response.json();
      return result.success ? result.auditTrail : [];
    } catch (error) {
      console.error('Error getting audit trail:', error);
      return [];
    }
  }, []);

  return {
    saveAgentData,
    logInteraction,
    getSessionData,
    getAuditTrail,
  };
}