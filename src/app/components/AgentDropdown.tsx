import React, { useState, useRef, useEffect } from 'react';
import { documentStructure, DocumentChapter } from '@/app/agentConfigs/businessAnalyst/documentStructure';

interface AgentDropdownProps {
  selectedAgentName: string;
  agents: any[];
  onAgentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  agentSetKey: string | null;
}

export default function AgentDropdown({ 
  selectedAgentName, 
  agents, 
  onAgentChange,
  agentSetKey 
}: AgentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if this is the Business Analyst scenario
  const isBusinessAnalyst = agentSetKey === 'businessAnalyst';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderChapterItem = (chapter: DocumentChapter, level: number = 0) => {
    const paddingLeft = level * 20 + 12;
    const hasResponsible = chapter.responsibleAgent && chapter.responsibleAgent !== '';
    
    return (
      <div key={chapter.id}>
        <div 
          className={`py-1 px-3 flex items-center justify-between hover:bg-gray-50 ${
            !hasResponsible ? 'font-semibold bg-gray-50' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <div className="flex items-center gap-2">
            <span className={`inline-block w-4 h-4 rounded-full ${
              chapter.isCompleted ? 'bg-green-500' : 'bg-gray-300'
            }`}></span>
            <span className="text-sm">{chapter.title}</span>
          </div>
          {hasResponsible && (
            <span className="text-xs text-gray-500 ml-2">{chapter.responsibleAgent}</span>
          )}
        </div>
        {chapter.subChapters?.map(subChapter => 
          renderChapterItem(subChapter, level + 1)
        )}
      </div>
    );
  };

  const getCompletionStats = () => {
    let completed = 0;
    let total = 0;

    const countChapters = (chapters: DocumentChapter[]) => {
      chapters.forEach(chapter => {
        if (chapter.responsibleAgent) {
          total++;
          if (chapter.isCompleted) completed++;
        }
        if (chapter.subChapters) {
          countChapters(chapter.subChapters);
        }
      });
    };

    countChapters(documentStructure);
    return { completed, total };
  };

  if (!isBusinessAnalyst) {
    // Standard dropdown for other scenarios
    return (
      <div className="relative inline-block">
        <select
          value={selectedAgentName}
          onChange={onAgentChange}
          className="appearance-none border border-gray-300 rounded-lg text-base px-2 py-1 pr-8 cursor-pointer font-normal focus:outline-none"
        >
          {agents.map((agent) => (
            <option key={agent.name} value={agent.name}>
              {agent.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-600">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.44l3.71-3.21a.75.75 0 111.04 1.08l-4.25 3.65a.75.75 0 01-1.04 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Custom dropdown for Business Analyst showing document structure
  const stats = getCompletionStats();
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded-lg text-base px-3 py-1 pr-8 cursor-pointer font-normal focus:outline-none bg-white min-w-[300px]"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">Business Analyst</span>
          <span className="text-sm text-gray-600">
            {stats.completed}/{stats.total} kapitol ({completionPercentage}%)
          </span>
        </div>
        <div className="mt-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-600">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.44l3.71-3.21a.75.75 0 111.04 1.08l-4.25 3.65a.75.75 0 01-1.04 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-[400px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
          <div className="py-2">
            <div className="px-3 py-2 border-b border-gray-200">
              <div className="font-semibold text-sm">Struktura dokumentu BIAN</div>
              <div className="text-xs text-gray-500 mt-1">
                Aktuální agent: <span className="font-medium">{selectedAgentName}</span>
              </div>
            </div>
            {documentStructure.map(chapter => renderChapterItem(chapter))}
          </div>
          <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <span>Dokončeno</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-300"></span>
                <span>Čeká na zpracování</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}