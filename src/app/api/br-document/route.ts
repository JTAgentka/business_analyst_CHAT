import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const BR_DOCUMENT_PATH = path.join(process.cwd(), 'output', 'BR_document.json');

interface BRDocumentMetadata {
  sessionId: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  version: string;
  status: string;
  completionPercentage: number;
}

interface BRDocument {
  metadata: BRDocumentMetadata;
  section1_sponsorIdea: Record<string, any>;
  section2_stakeholderPerspectives: any[];
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
  section1_sponsorIdea: {
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
  section2_stakeholderPerspectives: [],
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
    if (typeof value === 'object') return Object.keys(value).some(k => k !== 'metadata' && checkValue(value[k]));
    return true;
  };

  const countFields = (obj: any, exclude: string[] = []): void => {
    for (const [key, value] of Object.entries(obj)) {
      if (exclude.includes(key)) continue;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        countFields(value, ['metadata']);
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

export async function GET() {
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

    return NextResponse.json({
      success: true,
      document,
      message: 'Successfully read BR document'
    });
  } catch (error) {
    console.error('Error reading BR document:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to read BR document'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data, agentName, mergeStrategy = 'merge' } = body;
    
    if (!section || !data || !agentName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: section, data, and agentName are required',
        message: 'Invalid request'
      }, { status: 400 });
    }
    
    ensureOutputDirectory();
    
    let document: BRDocument;
    
    if (fs.existsSync(BR_DOCUMENT_PATH)) {
      const fileContent = fs.readFileSync(BR_DOCUMENT_PATH, 'utf-8');
      document = JSON.parse(fileContent);
    } else {
      document = getDefaultDocument();
    }

    // Update the section based on merge strategy
    const sectionKey = section as keyof BRDocument;
    
    // Special handling for section2_stakeholderPerspectives (array)
    if (sectionKey === 'section2_stakeholderPerspectives') {
      if (mergeStrategy === 'replace') {
        (document as any)[sectionKey] = data;
      } else {
        // For merge and deep strategies, append to array if data is an item, replace if data is array
        if (Array.isArray(data)) {
          (document as any)[sectionKey] = data;
        } else {
          // Append single item to array
          if (!Array.isArray(document[sectionKey])) {
            (document as any)[sectionKey] = [];
          }
          
          // Check if this stakeholder already exists (to avoid duplicates)
          const existingPerspectives = (document as any)[sectionKey];
          const stakeholderName = data?.stakeholder?.jmeno;
          
          if (stakeholderName) {
            // Remove any existing perspective from the same stakeholder
            const filteredPerspectives = existingPerspectives.filter((p: any) => 
              p?.stakeholder?.jmeno !== stakeholderName
            );
            // Add the new perspective
            (document as any)[sectionKey] = [...filteredPerspectives, data];
          } else {
            // If no stakeholder name, just append
            (document as any)[sectionKey].push(data);
          }
        }
      }
    } else {
      // Standard object handling for other sections
      if (mergeStrategy === 'replace') {
        (document as any)[sectionKey] = data;
      } else if (mergeStrategy === 'merge') {
        (document as any)[sectionKey] = { ...document[sectionKey], ...data };
      } else if (mergeStrategy === 'deep') {
        (document as any)[sectionKey] = deepMerge(document[sectionKey], data);
      }
    }

    // Update metadata
    document.metadata.lastUpdatedAt = new Date().toISOString();
    document.metadata.lastUpdatedBy = agentName;
    document.metadata.completionPercentage = calculateCompletionPercentage(document);

    // Save the document
    fs.writeFileSync(BR_DOCUMENT_PATH, JSON.stringify(document, null, 2));

    return NextResponse.json({
      success: true,
      section,
      updatedData: document[sectionKey],
      metadata: document.metadata,
      message: `Successfully updated ${section} in BR document`
    });
  } catch (error) {
    console.error('Error writing BR document:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to write to BR document'
    }, { status: 500 });
  }
}