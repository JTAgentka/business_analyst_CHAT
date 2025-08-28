# Extension Guide: Adding New Workcenters/Branches

This guide explains how to extend the Business Analyst Voice Chat application to support additional workcenters or business domains beyond the current Business Analyst workflow.

## Overview

The application uses a modular agent configuration system that makes it easy to add new workcenters. Each workcenter consists of:
- Multiple specialized agents with specific roles
- Defined handoff patterns between agents
- Custom instructions and personalities
- Optional tools and guardrails

## Step-by-Step Guide to Add a New Workcenter

### 1. Create Your Workcenter Directory

Create a new directory under `src/app/agentConfigs/` with your workcenter name:

```
src/app/agentConfigs/
├── businessAnalyst/        # Existing workcenter
└── yourWorkCenter/         # Your new workcenter
    ├── index.ts            # Main configuration and handoff setup
    ├── seniorAgent.ts      # Orchestrator/senior agent
    ├── agent1.ts           # Specialized agent 1
    ├── agent2.ts           # Specialized agent 2
    └── agent3.ts           # Specialized agent 3
```

### 2. Define Your Agents

Each agent should be created using the `RealtimeAgent` class from `@openai/agents/realtime`. Here's the structure:

**seniorAgent.ts** (Orchestrator):
```typescript
import { RealtimeAgent } from '@openai/agents/realtime';

export const seniorAgent = new RealtimeAgent({
  name: 'Senior [Your Role]',
  voice: 'sage', // or 'verse', 'alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'
  instructions: `
    # Identity
    You are a Senior [Role] who orchestrates the team...
    
    # Core Responsibilities
    - Oversee the entire workflow
    - Delegate to specialized agents
    - Ensure quality and consistency
    
    # Handoff Protocol
    - Explain why you're handing off
    - Provide context to next agent
    - Set clear expectations
  `,
  tools: [], // Add any tools if needed
});
```

**Specialized Agents** (agent1.ts, agent2.ts, etc.):
```typescript
import { RealtimeAgent } from '@openai/agents/realtime';

export const specialistAgent = new RealtimeAgent({
  name: 'Specialist [Role]',
  voice: 'alloy',
  instructions: `
    # Identity
    You are a [Specialist Role] focused on [specific area]...
    
    # Core Tasks
    - [Task 1]
    - [Task 2]
    - [Task 3]
    
    # When to Hand Off
    - After completing [specific milestone]
    - When encountering [specific scenario]
  `,
  tools: [], // Add tools as needed
});
```

### 3. Configure Agent Handoffs

In your `index.ts`, set up the handoff flow between agents:

```typescript
import { seniorAgent } from './seniorAgent';
import { agent1 } from './agent1';
import { agent2 } from './agent2';
import { agent3 } from './agent3';

// Configure handoff flow
// Senior can hand off to any specialist
(seniorAgent.handoffs as any).push(
  agent1,
  agent2,
  agent3
);

// Define sequential flow if needed
// Agent1 → Agent2 → Agent3
(agent1.handoffs as any).push(
  agent2,      // Next in sequence
  seniorAgent  // Escalate to senior
);

(agent2.handoffs as any).push(
  agent3,
  agent1,      // Back to previous
  seniorAgent  // Escalate
);

(agent3.handoffs as any).push(
  agent2,      // Back to previous
  seniorAgent  // Complete with senior
);

// Export the scenario
export const yourWorkCenterScenario = [
  seniorAgent,  // Entry point (first agent)
  agent1,
  agent2,
  agent3,
];

// Optional: Company name for guardrails
export const yourWorkCenterCompanyName = 'Your Company Name';
```

### 4. Register Your Workcenter

Add your workcenter to the main registry in `src/app/agentConfigs/index.ts`:

```typescript
import { customerServiceRetailScenario } from './businessAnalyst';
import { yourWorkCenterScenario } from './yourWorkCenter';  // Add this

import type { RealtimeAgent } from '@openai/agents/realtime';

export const allAgentSets: Record<string, RealtimeAgent[]> = {
  BusinessAnalyst: customerServiceRetailScenario,
  YourWorkCenter: yourWorkCenterScenario,  // Add this
};

export const defaultAgentSetKey = 'BusinessAnalyst';
```

### 5. Update App.tsx (If Needed)

Add your workcenter to the SDK scenario map in `src/app/App.tsx`:

```typescript
const sdkScenarioMap: Record<string, RealtimeAgent[]> = {
  BusinessAnalyst: customerServiceRetailScenario,
  YourWorkCenter: yourWorkCenterScenario,  // Add this
};
```

## Common Patterns for Different Workcenters

### Linear Workflow Pattern
Best for: Step-by-step processes (onboarding, applications)
```
Start → Step1 → Step2 → Step3 → Complete
```

### Hub-and-Spoke Pattern
Best for: Customer service, support desks
```
        Agent1
           ↑
Senior ←→ Agent2
           ↓
        Agent3
```

### Expertise-Based Pattern
Best for: Technical support, consulting
```
Senior → Expert1 (for topic A)
      → Expert2 (for topic B)
      → Expert3 (for topic C)
```

## Example Workcenters You Could Add

### IT Support Center
```
src/app/agentConfigs/itSupport/
├── index.ts
├── supportManager.ts      # Orchestrator
├── tierOneAgent.ts        # Basic troubleshooting
├── networkSpecialist.ts   # Network issues
├── securityExpert.ts      # Security concerns
└── escalationAgent.ts     # Complex issues
```

### HR Services
```
src/app/agentConfigs/hrServices/
├── index.ts
├── hrManager.ts           # Orchestrator
├── recruiterAgent.ts      # Recruitment
├── benefitsAdvisor.ts     # Benefits questions
├── policyExpert.ts        # Policy clarifications
└── onboardingAgent.ts     # New employee onboarding
```

### Sales Department
```
src/app/agentConfigs/sales/
├── index.ts
├── salesManager.ts        # Orchestrator
├── leadQualifier.ts       # Initial qualification
├── productSpecialist.ts   # Product details
├── pricingExpert.ts       # Quotes and pricing
└── closingAgent.ts        # Deal closing
```

## Testing Your New Workcenter

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access your workcenter via URL parameter:
   ```
   http://localhost:3001?agentConfig=YourWorkCenter
   ```

3. Or select it from the dropdown in the UI

## Tips for Success

1. **Clear Role Definition**: Each agent should have a distinct, well-defined role
2. **Smooth Handoffs**: Include context in handoff messages
3. **Personality Consistency**: Match agent personality to their role
4. **Tool Integration**: Add tools for specific capabilities (API calls, calculations)
5. **Testing**: Test all handoff paths thoroughly
6. **Documentation**: Include clear instructions in each agent's prompt

## Adding Custom Tools

If your agents need specific tools, define them in the agent configuration:

```typescript
import { RealtimeAgent } from '@openai/agents/realtime';

const tools = [
  {
    name: 'calculate_price',
    description: 'Calculate product pricing',
    parameters: {
      type: 'object',
      properties: {
        product_id: { type: 'string' },
        quantity: { type: 'number' }
      },
      required: ['product_id', 'quantity']
    }
  }
];

export const pricingAgent = new RealtimeAgent({
  name: 'Pricing Specialist',
  voice: 'nova',
  instructions: '...',
  tools: tools,
});
```

## Troubleshooting

- **Agents not showing up**: Check registration in `agentConfigs/index.ts`
- **Handoffs not working**: Verify handoff configuration in your `index.ts`
- **Voice issues**: Ensure valid voice selection (sage, verse, alloy, etc.)
- **First agent not responding**: Make sure the first agent in your scenario array is the entry point

## Best Practices

1. Start with a simple 2-3 agent setup and expand
2. Keep agent instructions focused and concise
3. Test conversation flows before adding complexity
4. Use consistent naming conventions
5. Document your handoff logic clearly
6. Consider user experience in handoff messages