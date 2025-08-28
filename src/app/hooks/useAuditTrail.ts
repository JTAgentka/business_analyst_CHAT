import { useCallback, useRef } from 'react';
import { useStorage, AgentInteraction } from './useStorage';

interface UseAuditTrailOptions {
  sessionId: string;
  currentAgent: string;
  enabled?: boolean;
}

export function useAuditTrail({ sessionId, currentAgent, enabled = true }: UseAuditTrailOptions) {
  const { logInteraction } = useStorage();
  const lastMessageRef = useRef<string>('');

  const logUserMessage = useCallback(async (message: string) => {
    if (!enabled || !sessionId || !currentAgent || !message?.trim()) return;
    
    await logInteraction(sessionId, currentAgent, {
      type: 'answer',
      content: message,
      timestamp: new Date().toISOString(),
      metadata: { source: 'user' }
    });
  }, [logInteraction, sessionId, currentAgent, enabled]);

  const logAgentMessage = useCallback(async (message: string) => {
    if (!enabled || !sessionId || !currentAgent || !message?.trim()) return;
    
    // Avoid logging duplicate messages
    if (message === lastMessageRef.current) return;
    lastMessageRef.current = message;
    
    // Determine message type
    let messageType: AgentInteraction['type'] = 'question';
    if (message.includes('Děkuji za informace. Předávám na')) {
      messageType = 'handoff';
    } else if (message.includes('je dokončena') || message.includes('je nyní kompletní')) {
      messageType = 'completion';
    }
    
    await logInteraction(sessionId, currentAgent, {
      type: messageType,
      content: message,
      timestamp: new Date().toISOString(),
      metadata: { source: 'agent' }
    });
  }, [logInteraction, sessionId, currentAgent, enabled]);

  const logAgentData = useCallback(async (data: any, context?: string) => {
    if (!enabled || !sessionId || !currentAgent) return;
    
    await logInteraction(sessionId, currentAgent, {
      type: 'question', // Generic type for data logging
      content: `Agent data saved${context ? ` - ${context}` : ''}`,
      timestamp: new Date().toISOString(),
      metadata: { 
        source: 'system',
        data,
        context
      }
    });
  }, [logInteraction, sessionId, currentAgent, enabled]);

  return {
    logUserMessage,
    logAgentMessage, 
    logAgentData,
  };
}