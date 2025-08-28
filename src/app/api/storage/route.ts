import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const AUDIT_DIR = path.join(STORAGE_DIR, 'audit');
const SESSIONS_DIR = path.join(STORAGE_DIR, 'sessions');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
  
  try {
    await fs.access(AUDIT_DIR);
  } catch {
    await fs.mkdir(AUDIT_DIR, { recursive: true });
  }
  
  try {
    await fs.access(SESSIONS_DIR);
  } catch {
    await fs.mkdir(SESSIONS_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();
    
    const body = await request.json();
    const { action, sessionId, agentName, data, timestamp } = body;

    switch (action) {
      case 'save_agent_data':
        return await saveAgentData(sessionId, agentName, data, timestamp);
      
      case 'log_interaction':
        return await logInteraction(sessionId, agentName, data, timestamp);
      
      case 'get_session_data':
        return await getSessionData(sessionId);
      
      case 'get_audit_trail':
        return await getAuditTrail(sessionId, agentName);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Storage operation failed' }, { status: 500 });
  }
}

async function saveAgentData(sessionId: string, agentName: string, data: any, timestamp: string) {
  const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
  
  let sessionData = {};
  try {
    const existing = await fs.readFile(sessionFile, 'utf-8');
    sessionData = JSON.parse(existing);
  } catch {
    // File doesn't exist, start with empty object
  }

  // Store agent data with timestamp
  (sessionData as any)[agentName] = {
    data,
    timestamp,
    updatedAt: new Date().toISOString()
  };

  await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2));
  
  return NextResponse.json({ success: true, sessionId, agentName });
}

async function logInteraction(sessionId: string, agentName: string, interaction: any, timestamp: string) {
  const auditFile = path.join(AUDIT_DIR, `${sessionId}_${agentName}.jsonl`);
  
  const logEntry = {
    timestamp: timestamp || new Date().toISOString(),
    sessionId,
    agentName,
    ...interaction
  };

  // Append to JSONL file (one JSON object per line)
  const logLine = JSON.stringify(logEntry) + '\n';
  await fs.appendFile(auditFile, logLine);
  
  return NextResponse.json({ success: true, logged: true });
}

async function getSessionData(sessionId: string) {
  const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
  
  try {
    const data = await fs.readFile(sessionFile, 'utf-8');
    return NextResponse.json({ success: true, data: JSON.parse(data) });
  } catch {
    return NextResponse.json({ success: true, data: {} });
  }
}

async function getAuditTrail(sessionId: string, agentName?: string) {
  try {
    const files = await fs.readdir(AUDIT_DIR);
    const matchingFiles = files.filter(file => {
      if (agentName) {
        return file === `${sessionId}_${agentName}.jsonl`;
      } else {
        return file.startsWith(`${sessionId}_`) && file.endsWith('.jsonl');
      }
    });

    const auditData = [];
    for (const file of matchingFiles) {
      const filePath = path.join(AUDIT_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          auditData.push(JSON.parse(line));
        } catch (e) {
          console.error('Error parsing audit log line:', e);
        }
      }
    }

    // Sort by timestamp
    auditData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return NextResponse.json({ success: true, auditTrail: auditData });
  } catch (error) {
    console.error('Error reading audit trail:', error);
    return NextResponse.json({ success: true, auditTrail: [] });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const sessionId = searchParams.get('sessionId');
  const agentName = searchParams.get('agentName');

  if (action === 'get_session_data' && sessionId) {
    return await getSessionData(sessionId);
  }
  
  if (action === 'get_audit_trail' && sessionId) {
    return await getAuditTrail(sessionId, agentName || undefined);
  }

  return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
}