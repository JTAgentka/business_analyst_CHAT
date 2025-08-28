import { customerServiceRetailScenario } from './businessAnalyst';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  BusinessAnalyst: customerServiceRetailScenario,
};

export const defaultAgentSetKey = 'BusinessAnalyst';
