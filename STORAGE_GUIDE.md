# Storage and Audit Trail System

## Overview

This application now includes a comprehensive file storage system and audit trail for tracking all Business Analyst agent interactions.

## Features

### 1. **File Storage System**
- **Location**: `/storage/` directory (auto-created)
- **Session Data**: Stores structured data per session in `/storage/sessions/`
- **Audit Logs**: Stores detailed interaction logs in `/storage/audit/`

### 2. **UI Agent Handoff Updates**
- **Automatic UI Updates**: Agent dropdown in top-right updates automatically when agents handoff
- **Real-time Reflection**: Current agent is always reflected in the UI
- **Session Tracking**: Each session has a unique ID for tracking

### 3. **Audit Trail Logging**
- **Complete Interaction History**: Every question, answer, and handoff is logged
- **Per-Agent Logs**: Separate log files per agent per session
- **Timestamped Entries**: All entries include precise timestamps
- **Structured Data**: JSON format for easy parsing and analysis

## File Structure

```
storage/
├── sessions/           # Session data files
│   └── session_[timestamp]_[id].json
└── audit/             # Audit trail logs
    └── session_[timestamp]_[id]_[AgentName].jsonl
```

## API Endpoints

### POST /api/storage
Actions supported:
- `save_agent_data` - Save structured data per agent
- `log_interaction` - Log individual interactions
- `get_session_data` - Retrieve session data
- `get_audit_trail` - Get audit trail for session/agent

### GET /api/storage
Query parameters:
- `action=get_session_data&sessionId=[id]`
- `action=get_audit_trail&sessionId=[id]&agentName=[name]`

## Usage in Application

### 1. **Viewing Audit Trail**
- Click the **"📋 Audit Trail"** button in the bottom toolbar
- Filter by specific agent or view all interactions
- Real-time updates as the session progresses

### 2. **Session Management**
- Each browser session gets a unique session ID
- All agent interactions are automatically logged
- Data persists across browser refreshes

### 3. **Agent Handoff Tracking**
```javascript
// Automatic logging on agent handoff
onAgentHandoff: async (agentName: string) => {
  // Log handoff event
  await logInteraction(sessionId, previousAgent, {
    type: 'handoff',
    content: `Handoff to ${agentName}`,
    timestamp: new Date().toISOString()
  });
  
  // Update UI
  setSelectedAgentName(agentName);
}
```

## Data Formats

### Session Data Format
```json
{
  "Concept Analyst": {
    "data": { /* agent collected data */ },
    "timestamp": "2025-01-XX...",
    "updatedAt": "2025-01-XX..."
  }
}
```

### Audit Log Entry Format (JSONL)
```json
{
  "timestamp": "2025-01-XX...",
  "sessionId": "session_xxx",
  "agentName": "Business Architect", 
  "type": "question",
  "content": "Proč tento požadavek vznikl?",
  "metadata": { "source": "agent" }
}
```

## Types of Logged Interactions

- **📝 question**: Agent asks a question
- **💬 answer**: User provides an answer  
- **🔄 handoff**: Agent hands off to another agent
- **✅ completion**: Process completion/final summary

## Security and Privacy

- **Local Storage**: All data stored locally on your server
- **No External Transmission**: Audit data stays within your infrastructure
- **Session Isolation**: Each session's data is completely separate
- **Structured Access**: API provides controlled access to stored data

## Benefits

1. **Full Audit Trail**: Complete history of all business analysis sessions
2. **Quality Assurance**: Review agent performance and user interactions
3. **Process Improvement**: Analyze common patterns and bottlenecks
4. **Compliance**: Maintain records for business analysis governance
5. **Debug Support**: Detailed logs help troubleshoot agent behavior
6. **UI Consistency**: Agent changes always reflected in interface

The system is designed to be non-intrusive while providing comprehensive tracking and storage capabilities for your Business Analyst agent interactions.