import React, { useState, useEffect } from 'react';
import { useStorage, AgentInteraction } from '@/app/hooks/useStorage';

interface AuditTrailProps {
  sessionId: string;
  isVisible: boolean;
  onClose: () => void;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ sessionId, isVisible, onClose }) => {
  const [auditTrail, setAuditTrail] = useState<AgentInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const { getAuditTrail } = useStorage();

  const loadAuditTrail = async () => {
    setLoading(true);
    try {
      const trail = await getAuditTrail(
        sessionId, 
        selectedAgent === 'all' ? undefined : selectedAgent
      );
      setAuditTrail(trail);
    } catch (error) {
      console.error('Error loading audit trail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && sessionId) {
      loadAuditTrail();
    }
  }, [isVisible, sessionId, selectedAgent]);

  const getAgentNames = () => {
    const agents = new Set<string>();
    auditTrail.forEach(item => {
      if (item.metadata?.fromAgent) agents.add(item.metadata.fromAgent);
      if (item.metadata?.toAgent) agents.add(item.metadata.toAgent);
      // Extract agent name from the log entry
      if (typeof (item as any).agentName === 'string') {
        agents.add((item as any).agentName);
      }
    });
    return Array.from(agents).sort();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓';
      case 'answer': return '💬';
      case 'handoff': return '🔄';
      case 'completion': return '✅';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-blue-600';
      case 'answer': return 'text-green-600';
      case 'handoff': return 'text-orange-600';
      case 'completion': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Audit Trail</h2>
            <span className="text-sm text-gray-500">Session: {sessionId}</span>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">Všichni agenti</option>
              {getAgentNames().map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
            <button 
              onClick={loadAuditTrail}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Obnovit
            </button>
            <button 
              onClick={onClose}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Zavřít
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Načítání audit trail...</div>
            </div>
          ) : auditTrail.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Žádné záznamy nenalezeny</div>
            </div>
          ) : (
            <div className="space-y-3">
              {auditTrail.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <span className={`font-medium ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </span>
                      {(item as any).agentName && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {(item as any).agentName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    {item.content}
                  </div>
                  
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                        Metadata
                      </summary>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(item.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Celkem záznamů: {auditTrail.length}</span>
            <div className="flex gap-4">
              <span>❓ Otázky: {auditTrail.filter(i => i.type === 'question').length}</span>
              <span>💬 Odpovědi: {auditTrail.filter(i => i.type === 'answer').length}</span>
              <span>🔄 Předání: {auditTrail.filter(i => i.type === 'handoff').length}</span>
              <span>✅ Dokončení: {auditTrail.filter(i => i.type === 'completion').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;