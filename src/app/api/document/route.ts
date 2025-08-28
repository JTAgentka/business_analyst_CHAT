import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { BIANDocument, createEmptyBIANDocument } from '@/app/types/document';

const OUTPUT_DIR = path.join(process.cwd(), 'output');

// Ensure output directory exists
async function ensureOutputDirectory() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureOutputDirectory();
    
    const body = await request.json();
    const { action, sessionId, agentName, sectionData, timestamp } = body;

    switch (action) {
      case 'update_document':
        return await updateDocument(sessionId, agentName, sectionData, timestamp);
      
      case 'get_document':
        return await getDocument(sessionId);
      
      case 'create_document':
        return await createDocument(sessionId);
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Document API error:', error);
    return NextResponse.json({ error: 'Document operation failed' }, { status: 500 });
  }
}

async function createDocument(sessionId: string) {
  const documentFile = path.join(OUTPUT_DIR, `${sessionId}_bian_document.json`);
  
  // Check if document already exists
  try {
    await fs.access(documentFile);
    const existing = await fs.readFile(documentFile, 'utf-8');
    return NextResponse.json({ 
      success: true, 
      message: 'Document already exists',
      document: JSON.parse(existing)
    });
  } catch {
    // Document doesn't exist, create new one
    const emptyDoc = createEmptyBIANDocument(sessionId);
    await fs.writeFile(documentFile, JSON.stringify(emptyDoc, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Document created',
      document: emptyDoc
    });
  }
}

async function updateDocument(sessionId: string, agentName: string, sectionData: any, timestamp: string) {
  const documentFile = path.join(OUTPUT_DIR, `${sessionId}_bian_document.json`);
  
  let document: BIANDocument;
  
  try {
    const existing = await fs.readFile(documentFile, 'utf-8');
    document = JSON.parse(existing);
  } catch {
    // Document doesn't exist, create new one
    document = createEmptyBIANDocument(sessionId);
  }

  // Update metadata
  document.metadata.lastUpdatedAt = timestamp || new Date().toISOString();
  document.metadata.lastUpdatedBy = agentName;

  // Update specific section based on agent
  const now = timestamp || new Date().toISOString();
  
  switch (agentName) {
    case 'Concept Analyst':
      document.chapter1.section1_1 = {
        ...document.chapter1.section1_1,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      break;
      
    case 'Business Architect':
      document.chapter1.section1_2 = {
        ...document.chapter1.section1_2,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      // Business Architect also updates AS-IS state
      if (sectionData.asIsData) {
        document.chapter2.section2_1 = {
          ...document.chapter2.section2_1,
          ...sectionData.asIsData,
          updatedBy: agentName,
          updatedAt: now
        };
      }
      break;
      
    case 'Scope Architect':
      document.chapter1.section1_3 = {
        ...document.chapter1.section1_3,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      break;
      
    case 'Design Architect':
      document.chapter3.section3_1 = {
        ...document.chapter3.section3_1,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      break;
      
    case 'Impact Analyst':
      document.chapter3.section3_2 = {
        ...document.chapter3.section3_2,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      break;
      
    case 'Data Analyst':
      document.chapter3.section3_3 = {
        ...document.chapter3.section3_3,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      break;
      
    case 'Non-functional Analyst':
      document.chapter3.section3_4 = {
        ...document.chapter3.section3_4,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      break;
      
    case 'Quality Analyst':
      document.chapter4 = {
        ...document.chapter4,
        ...sectionData,
        updatedBy: agentName,
        updatedAt: now
      };
      // Mark document as completed
      document.metadata.status = 'completed';
      break;
  }

  // Calculate completion percentage
  document.metadata.completionPercentage = calculateCompletionPercentage(document);

  // Save updated document
  await fs.writeFile(documentFile, JSON.stringify(document, null, 2));
  
  return NextResponse.json({ 
    success: true, 
    message: `Document updated by ${agentName}`,
    document,
    completionPercentage: document.metadata.completionPercentage
  });
}

async function getDocument(sessionId: string) {
  const documentFile = path.join(OUTPUT_DIR, `${sessionId}_bian_document.json`);
  
  try {
    const data = await fs.readFile(documentFile, 'utf-8');
    const document = JSON.parse(data);
    return NextResponse.json({ 
      success: true, 
      document,
      completionPercentage: document.metadata.completionPercentage
    });
  } catch {
    // Document doesn't exist, create empty one
    const emptyDoc = createEmptyBIANDocument(sessionId);
    return NextResponse.json({ 
      success: true, 
      document: emptyDoc,
      completionPercentage: 0
    });
  }
}

function calculateCompletionPercentage(document: BIANDocument): number {
  let totalFields = 0;
  let completedFields = 0;

  function checkSection(section: any) {
    for (const [key, value] of Object.entries(section)) {
      if (key === 'updatedBy' || key === 'updatedAt') continue;
      
      totalFields++;
      
      if (Array.isArray(value)) {
        if (value.length > 0) completedFields++;
      } else if (typeof value === 'object' && value !== null) {
        checkSection(value);
      } else if (typeof value === 'string') {
        if (value.trim() !== '') completedFields++;
      }
    }
  }

  checkSection(document.chapter1);
  checkSection(document.chapter2);
  checkSection(document.chapter3);
  checkSection(document.chapter4);

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const sessionId = searchParams.get('sessionId');

  if (action === 'get_document' && sessionId) {
    return await getDocument(sessionId);
  }
  
  if (action === 'list_documents') {
    await ensureOutputDirectory();
    try {
      const files = await fs.readdir(OUTPUT_DIR);
      const documents = files
        .filter(file => file.endsWith('_bian_document.json'))
        .map(file => file.replace('_bian_document.json', ''));
      
      return NextResponse.json({ success: true, documents });
    } catch {
      return NextResponse.json({ success: true, documents: [] });
    }
  }

  return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
}