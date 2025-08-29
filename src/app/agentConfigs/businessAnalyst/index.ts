import { stakeholderRoom } from './stakeholderRoom';
import { businessArchitect } from './businessArchitect';
import { scopeArchitect } from './scopeArchitect';
import { designArchitect } from './designArchitect';
import { impactAnalyst } from './impactAnalyst';
import { dataAnalyst } from './dataAnalyst';
import { nonfunctionalAnalyst } from './nonfunctionalAnalyst';
import { qualityAnalyst } from './qualityAnalyst';

// Manual switching only - no automatic handoffs configured

// Export the complete Business Analyst scenario with Stakeholder Room as the entry point
export const businessAnalystScenario = [
  stakeholderRoom,
  businessArchitect,
  scopeArchitect,
  designArchitect,
  impactAnalyst,
  dataAnalyst,
  nonfunctionalAnalyst,
  qualityAnalyst,
];

// Keep the old export name for backward compatibility
export const customerServiceRetailScenario = businessAnalystScenario;

// Company name for guardrails
export const customerServiceRetailCompanyName = 'BIAN Business Analysis Services';

// Export document structure utilities
export { documentStructure, updateChapterStatus, getChaptersByAgent } from './documentStructure';
