import { useCallback } from 'react';
import { BIANDocument } from '@/app/types/document';

export interface UseDocumentReturn {
  updateDocument: (sessionId: string, agentName: string, sectionData: any) => Promise<boolean>;
  getDocument: (sessionId: string) => Promise<BIANDocument | null>;
  createDocument: (sessionId: string) => Promise<BIANDocument | null>;
}

export function useDocument(): UseDocumentReturn {
  const updateDocument = useCallback(async (
    sessionId: string, 
    agentName: string, 
    sectionData: any
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_document',
          sessionId,
          agentName,
          sectionData,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(`📄 Document updated by ${agentName} (${result.completionPercentage}% complete)`);
      }
      return result.success || false;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  }, []);

  const getDocument = useCallback(async (sessionId: string): Promise<BIANDocument | null> => {
    try {
      const response = await fetch(`/api/document?action=get_document&sessionId=${sessionId}`);
      const result = await response.json();
      return result.success ? result.document : null;
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  }, []);

  const createDocument = useCallback(async (sessionId: string): Promise<BIANDocument | null> => {
    try {
      const response = await fetch('/api/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_document',
          sessionId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(`📄 BIAN Document initialized for session: ${sessionId}`);
      }
      return result.success ? result.document : null;
    } catch (error) {
      console.error('Error creating document:', error);
      return null;
    }
  }, []);

  return {
    updateDocument,
    getDocument,
    createDocument,
  };
}