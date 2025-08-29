import { tool } from '@openai/agents/realtime';

interface BRDocumentMetadata {
  sessionId: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  version: string;
  status: string;
  completionPercentage: number;
}

interface Stakeholder {
  jmeno: string;
  role: string;
  ovlivneniZmenou: string;
}

interface Section1 {
  businessPozadavek: string;
  businessCil: string;
  hraniceRozsahu: {
    vRozsahu: string;
    mimoRozsah: string;
  };
  stakeholderi: Stakeholder[];
  spousteciUdalost: string;
  ocekavanaHodnota: string;
  pocatecniPredpoklady: string[];
  metadata: {
    datumAnalyzy: string;
    analytik: string;
    zdrojDat: 'manualEntry' | 'imported' | 'updatedByOtherAgent';
  };
}

export const readBRDocument = tool({
  name: 'read_BR_document',
  description: 'Read the complete BR document from BR_document.json file',
  parameters: {
    type: 'object',
    properties: {
      sectionFilter: {
        type: 'string',
        description: 'Optional: Specific section to read (e.g., "Section 1", "Section 2", etc.)',
        enum: ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6', 'Section 7', 'Section 8', 'Section 9']
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async ({ sectionFilter }: { sectionFilter?: string } = {}) => {
    try {
      const response = await fetch('/api/br-document', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to read BR document');
      }
      
      if (sectionFilter && result.document) {
        return {
          success: true,
          metadata: result.document.metadata,
          [sectionFilter]: result.document[sectionFilter],
          message: `Successfully read ${sectionFilter} from BR document`
        };
      }
      
      return {
        success: true,
        document: result.document,
        message: 'Successfully read complete BR document'
      };
    } catch (error) {
      console.error('Error reading BR document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to read BR document'
      };
    }
  }
});

export const writeBRDocument = tool({
  name: 'write_BR_document',
  description: 'Write or update data in the BR_document.json file. For Section 1, provide data with the correct structure including businessPozadavek, businessCil, hraniceRozsahu, stakeholderi, etc.',
  parameters: {
    type: 'object',
    properties: {
      section: {
        type: 'string',
        description: 'Section to update (e.g., "Section 1", "Section 2", etc.)',
        enum: ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6', 'Section 7', 'Section 8', 'Section 9']
      },
      data: {
        type: 'object',
        description: 'Data to write or update in the specified section. For Section 1, use structure with businessPozadavek, businessCil, hraniceRozsahu, stakeholderi, etc.',
        additionalProperties: true
      },
      agentName: {
        type: 'string',
        description: 'Name of the agent making the update'
      },
      mergeStrategy: {
        type: 'string',
        description: 'How to merge the data: "replace" (default), "merge" (shallow merge), or "deep" (deep merge)',
        enum: ['replace', 'merge', 'deep'],
        default: 'merge'
      }
    },
    required: ['section', 'data', 'agentName'],
    additionalProperties: false
  },
  execute: async ({ section, data, agentName, mergeStrategy = 'merge' }: { 
    section: string; 
    data: any; 
    agentName: string; 
    mergeStrategy?: 'replace' | 'merge' | 'deep' 
  }) => {
    try {
      const response = await fetch('/api/br-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          data,
          agentName,
          mergeStrategy
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to write to BR document');
      }
      
      return {
        success: true,
        section,
        updatedData: result.updatedData,
        metadata: result.metadata,
        message: `Successfully updated ${section} in BR document`
      };
    } catch (error) {
      console.error('Error writing BR document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to write to BR document'
      };
    }
  }
});

export const brDocumentTools = [readBRDocument, writeBRDocument];