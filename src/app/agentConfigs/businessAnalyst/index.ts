import { businessAnalystSenior } from './businessAnalystSenior';
import { conceptAnalyst } from './conceptAnalyst';
import { analysisAnalyst } from './analysisAnalyst';
import { detailingAnalyst } from './detailingAnalyst';
import { validationAnalyst } from './validationAnalyst';

// Configure the handoff flow for Business Analyst workflow
// Senior BA can hand off to any junior analyst
(businessAnalystSenior.handoffs as any).push(
  conceptAnalyst,
  analysisAnalyst,
  detailingAnalyst,
  validationAnalyst
);

// Sequential handoff flow: Concept → Analysis → Detailing → Validation
// Each junior can hand back to senior or forward to next phase

// Concept can hand to Analysis or back to Senior
(conceptAnalyst.handoffs as any).push(
  analysisAnalyst,
  businessAnalystSenior
);

// Analysis can hand to Detailing, back to Concept, or escalate to Senior
(analysisAnalyst.handoffs as any).push(
  detailingAnalyst,
  conceptAnalyst,
  businessAnalystSenior
);

// Detailing can hand to Validation, back to Analysis, or escalate to Senior
(detailingAnalyst.handoffs as any).push(
  validationAnalyst,
  analysisAnalyst,
  businessAnalystSenior
);

// Validation can hand back to Detailing or complete with Senior
(validationAnalyst.handoffs as any).push(
  detailingAnalyst,
  businessAnalystSenior
);

// Export the complete Business Analyst scenario with Senior as the entry point
export const businessAnalystScenario = [
  businessAnalystSenior,
  conceptAnalyst,
  analysisAnalyst,
  detailingAnalyst,
  validationAnalyst,
];

// Keep the old export name for backward compatibility
export const customerServiceRetailScenario = businessAnalystScenario;

// Company name for guardrails
export const customerServiceRetailCompanyName = 'BIAN Business Analysis Services';