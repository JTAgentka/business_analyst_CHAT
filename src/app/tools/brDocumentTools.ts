import { tool } from '@openai/agents/realtime';
import * as fs from 'fs';
import * as path from 'path';

const BR_DOCUMENT_PATH = './output/BR_document.json';

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

interface BRDocument {
  metadata: BRDocumentMetadata;
  'Section 1': Partial<Section1>;
  'Section 2': Record<string, any>;
  'Section 3': Record<string, any>;
  'Section 4': Record<string, any>;
  'Section 5': Record<string, any>;
  'Section 6': Record<string, any>;
  'Section 7': Record<string, any>;
  'Section 8': Record<string, any>;
  'Section 9': Record<string, any>;
}

const ensureOutputDirectory = () => {
  const outputDir = path.dirname(BR_DOCUMENT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};

const getDefaultDocument = (): BRDocument => ({
  metadata: {
    sessionId: 'current_session',
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System',
    version: '1.0.0',
    status: 'draft',
    completionPercentage: 0
  },
  'Section 1': {
    businessPozadavek: '',
    businessCil: '',
    hraniceRozsahu: {
      vRozsahu: '',
      mimoRozsah: ''
    },
    stakeholderi: [],
    spousteciUdalost: '',
    ocekavanaHodnota: '',
    pocatecniPredpoklady: [],
    metadata: {
      datumAnalyzy: '',
      analytik: '',
      zdrojDat: 'manualEntry'
    }
  },
  'Section 2': {},
  'Section 3': {},
  'Section 4': {},
  'Section 5': {},
  'Section 6': {},
  'Section 7': {},
  'Section 8': {},
  'Section 9': {}
});

const calculateCompletionPercentage = (doc: BRDocument): number => {
  let totalFields = 0;
  let completedFields = 0;

  const checkValue = (value: any): boolean => {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  const countFields = (obj: any, exclude: string[] = []): void => {
    for (const [key, value] of Object.entries(obj)) {
      if (exclude.includes(key)) continue;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        countFields(value);
      } else {
        totalFields++;
        if (checkValue(value)) {
          completedFields++;
        }
      }
    }
  };

  // Count fields in all sections except metadata
  for (const [sectionKey, sectionValue] of Object.entries(doc)) {
    if (sectionKey === 'metadata') continue;
    if (typeof sectionValue === 'object' && sectionValue !== null) {
      countFields(sectionValue, ['metadata']);
    }
  }

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

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
      ensureOutputDirectory();
      
      let document: BRDocument;
      
      if (fs.existsSync(BR_DOCUMENT_PATH)) {
        const fileContent = fs.readFileSync(BR_DOCUMENT_PATH, 'utf-8');
        document = JSON.parse(fileContent);
      } else {
        document = getDefaultDocument();
        fs.writeFileSync(BR_DOCUMENT_PATH, JSON.stringify(document, null, 2));
      }

      if (sectionFilter) {
        return {
          success: true,
          metadata: document.metadata,
          [sectionFilter]: document[sectionFilter as keyof BRDocument],
          message: `Successfully read ${sectionFilter} from BR document`
        };
      }

      return {
        success: true,
        document,
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
  description: 'Write or update data in the BR_document.json file',
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
        description: 'Data to write or update in the specified section',
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
      ensureOutputDirectory();
      
      let document: BRDocument;
      
      if (fs.existsSync(BR_DOCUMENT_PATH)) {
        const fileContent = fs.readFileSync(BR_DOCUMENT_PATH, 'utf-8');
        document = JSON.parse(fileContent);
      } else {
        document = getDefaultDocument();
      }

      // Deep merge function
      const deepMerge = (target: any, source: any): any => {
        if (source === null || source === undefined) return target;
        if (target === null || target === undefined) return source;
        
        if (Array.isArray(source)) return source;
        
        if (typeof source !== 'object') return source;
        
        const result = { ...target };
        
        for (const key in source) {
          if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
              result[key] = deepMerge(result[key] || {}, source[key]);
            } else {
              result[key] = source[key];
            }
          }
        }
        
        return result;
      };

      // Update the section based on merge strategy
      const sectionKey = section as keyof BRDocument;
      
      if (mergeStrategy === 'replace') {
        (document as any)[sectionKey] = data;
      } else if (mergeStrategy === 'merge') {
        (document as any)[sectionKey] = { ...document[sectionKey], ...data };
      } else if (mergeStrategy === 'deep') {
        (document as any)[sectionKey] = deepMerge(document[sectionKey], data);
      }

      // Update metadata
      document.metadata.lastUpdatedAt = new Date().toISOString();
      document.metadata.lastUpdatedBy = agentName;
      document.metadata.completionPercentage = calculateCompletionPercentage(document);

      // Save the document
      fs.writeFileSync(BR_DOCUMENT_PATH, JSON.stringify(document, null, 2));

      return {
        success: true,
        section,
        updatedData: document[sectionKey],
        metadata: document.metadata,
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