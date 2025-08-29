# Guide for Updating Remaining Agents to Use Shared BR Document Tools

## Overview
All agents should be updated to use the shared BR document tools instead of their individual tool implementations. This ensures all agents read from and write to the same `BR_document.json` file.

## Key Changes Required

### 1. Import Changes
Replace:
```typescript
import { RealtimeAgent, tool } from '@openai/agents/realtime';
```

With:
```typescript
import { RealtimeAgent } from '@openai/agents/realtime';
import { brDocumentTools } from '../../tools/brDocumentToolsBrowser';
```

### 2. Tool Definition Changes
Replace the entire `tools: [...]` array with:
```typescript
tools: brDocumentTools,
```

### 3. Instruction Updates
Update agent instructions to reference the new tools:
- Replace any mention of agent-specific tools with `read_BR_document` and `write_BR_document`
- Add instructions about which section to update

## Section Mapping for Each Agent

### Section 1 - Stakeholder Room (formerly Concept Analyst)
- **Data Structure**: 
  - businessPozadavek
  - businessCil
  - hraniceRozsahu (vRozsahu, mimoRozsah)
  - stakeholderi (array of {jmeno, role, ovlivneniZmenou})
  - spousteciUdalost
  - ocekavanaHodnota
  - pocatecniPredpoklady
  - metadata

### Section 2 - Business Architect
- **Data Structure**:
  - mainMotivation
  - businessProblem
  - expectedBenefits
  - stakeholderExpectations
  - businessCase
  - strategicAlignment
  - currentStateAnalysis
  - risksAndLimitations

### Section 3 - Scope Architect
Should define scope boundaries, in/out of scope items

### Section 4 - Design Architect
Should contain design specifications and solution approach

### Section 5 - Impact Analyst
Should document impact analysis on systems and processes

### Section 6 - Data Analyst
Should contain data requirements and data flow analysis

### Section 7 - Nonfunctional Analyst
Should document non-functional requirements (performance, security, etc.)

### Section 8 - Quality Analyst
Should contain quality criteria and testing requirements

### Section 9 - Reserved for future use

## Example Update Pattern

For each agent:

1. **Update imports** as shown above

2. **Update instructions** to include:
```typescript
instructions: `
DŮLEŽITÉ: Při zahájení práce:
1. NEJPRVE si načtěte kontext z BR dokumentu voláním read_BR_document
2. Analyzujte obsah všech sekcí, zejména Section [X] která je vaší zodpovědností
3. Při ukládání použijte write_BR_document s parametry:
   - section: "Section [X]"
   - data: { /* struktura dat pro danou sekci */ }
   - agentName: "[Agent Name]"
   - mergeStrategy: "deep" // nebo "merge" nebo "replace" podle potřeby

// ... rest of instructions
`
```

3. **Replace tools array** with shared tools

## Testing
After updating each agent:
1. Test that the agent can read the BR_document.json
2. Test that the agent correctly writes to its designated section
3. Verify that data from other agents' sections is preserved

## Benefits
- Single source of truth for all BR data
- Consistent data structure across all agents
- Easier to track document completion
- Simplified maintenance