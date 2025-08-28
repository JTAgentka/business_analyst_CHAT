// BIAN Document Structure Types
export interface BIANDocument {
  metadata: DocumentMetadata;
  chapter1: Chapter1_DescriptionRequirement;
  chapter2: Chapter2_AsIsState;
  chapter3: Chapter3_ToBeState;
  chapter4: Chapter4_AcceptanceCriteria;
}

export interface DocumentMetadata {
  sessionId: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  version: string;
  status: 'draft' | 'in_progress' | 'completed';
  completionPercentage: number;
}

// Chapter 1: Popis požadavku
export interface Chapter1_DescriptionRequirement {
  section1_1: Section1_1_BasicDescription;
  section1_2: Section1_2_ReasonsGoals;
  section1_3: Section1_3_OutOfScope;
}

export interface Section1_1_BasicDescription {
  basicDescription: string;
  businessProblem: string;
  opportunityDescription: string;
  overallContext: string;
  changeBoundaries: string;
  keyStakeholders: string[];
  existingDomainProcesses: string;
  currentSystems: string;
  assumptions: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface Section1_2_ReasonsGoals {
  mainMotivation: string;
  businessProblem: string;
  expectedBenefits: string;
  measurableGoals: string[];
  successCriteria: string[];
  stakeholderAnalysis: {
    mainStakeholders: string[];
    conflictingExpectations: string[];
    agreedPriorities: string[];
  };
  updatedBy: string;
  updatedAt: string;
}

export interface Section1_3_OutOfScope {
  solutionApproach: string;
  areasOfChange: string[];
  explicitExclusions: string[];
  futurePhasesExcluded: string[];
  criticalDependencies: string[];
  scopeConfirmation: string;
  implementationStrategy: string;
  updatedBy: string;
  updatedAt: string;
}

// Chapter 2: AS-IS Stav
export interface Chapter2_AsIsState {
  section2_1: Section2_1_AsIsDescription;
}

export interface Section2_1_AsIsDescription {
  currentProcesses: string;
  currentProblems: string[];
  currentSystems: string[];
  businessDrivers: string;
  currentStateAnalysis: string;
  identifiedIssues: string[];
  technicalFeasibility: string;
  businessFeasibility: string;
  risksAndLimitations: string[];
  updatedBy: string;
  updatedAt: string;
}

// Chapter 3: TO-BE Stav
export interface Chapter3_ToBeState {
  section3_1: Section3_1_ToBeDescription;
  section3_2: Section3_2_ChangeVisualization;
  section3_3: Section3_3_BusinessDataAnalysis;
  section3_4: Section3_4_NonFunctionalRequirements;
}

export interface Section3_1_ToBeDescription {
  mainFunctionality: string[];
  userExperience: string;
  dataAndIntegration: string;
  processChanges: string[];
  basicCriteria: string[];
  detailedRequirements: string[];
  userScenarios: string[];
  integrationPoints: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface Section3_2_ChangeVisualization {
  affectedSystems: string[];
  systemImpacts: string[];
  technicalDependencies: string[];
  implementationComplexity: string;
  implementationSequence: string[];
  riskAssessment: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface Section3_3_BusinessDataAnalysis {
  keyBusinessData: string[];
  dataEntities: string[];
  dataAttributes: string[];
  gdprCompliance: string;
  dataPrivacy: string[];
  dataQuality: string;
  dataFlows: string[];
  validationRules: string[];
  reportingNeeds: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface Section3_4_NonFunctionalRequirements {
  performanceRequirements: {
    responseTime: string;
    throughput: string;
    availability: string;
  };
  userExperience: {
    usabilityRequirements: string[];
    accessibilityRequirements: string[];
  };
  securityCompliance: {
    securityRequirements: string[];
    complianceStandards: string[];
  };
  scalabilityIntegration: {
    scalabilityRequirements: string;
    integrationStandards: string[];
  };
  updatedBy: string;
  updatedAt: string;
}

// Chapter 4: Akceptační kritéria
export interface Chapter4_AcceptanceCriteria {
  basicAcceptanceConditions: string[];
  businessCriteria: string[];
  performanceCriteria: string[];
  testingStrategy: string;
  acceptanceProcess: string;
  measurableAcceptanceCriteria: string[];
  testScenarios: string[];
  successMetrics: string[];
  definitionOfDone: string[];
  updatedBy: string;
  updatedAt: string;
}

// Helper function to create empty document structure
export function createEmptyBIANDocument(sessionId: string): BIANDocument {
  const now = new Date().toISOString();
  
  return {
    metadata: {
      sessionId,
      createdAt: now,
      lastUpdatedAt: now,
      lastUpdatedBy: 'System',
      version: '1.0.0',
      status: 'draft',
      completionPercentage: 0
    },
    chapter1: {
      section1_1: {
        basicDescription: '',
        businessProblem: '',
        opportunityDescription: '',
        overallContext: '',
        changeBoundaries: '',
        keyStakeholders: [],
        existingDomainProcesses: '',
        currentSystems: '',
        assumptions: [],
        updatedBy: '',
        updatedAt: ''
      },
      section1_2: {
        mainMotivation: '',
        businessProblem: '',
        expectedBenefits: '',
        measurableGoals: [],
        successCriteria: [],
        stakeholderAnalysis: {
          mainStakeholders: [],
          conflictingExpectations: [],
          agreedPriorities: []
        },
        updatedBy: '',
        updatedAt: ''
      },
      section1_3: {
        solutionApproach: '',
        areasOfChange: [],
        explicitExclusions: [],
        futurePhasesExcluded: [],
        criticalDependencies: [],
        scopeConfirmation: '',
        implementationStrategy: '',
        updatedBy: '',
        updatedAt: ''
      }
    },
    chapter2: {
      section2_1: {
        currentProcesses: '',
        currentProblems: [],
        currentSystems: [],
        businessDrivers: '',
        currentStateAnalysis: '',
        identifiedIssues: [],
        technicalFeasibility: '',
        businessFeasibility: '',
        risksAndLimitations: [],
        updatedBy: '',
        updatedAt: ''
      }
    },
    chapter3: {
      section3_1: {
        mainFunctionality: [],
        userExperience: '',
        dataAndIntegration: '',
        processChanges: [],
        basicCriteria: [],
        detailedRequirements: [],
        userScenarios: [],
        integrationPoints: [],
        updatedBy: '',
        updatedAt: ''
      },
      section3_2: {
        affectedSystems: [],
        systemImpacts: [],
        technicalDependencies: [],
        implementationComplexity: '',
        implementationSequence: [],
        riskAssessment: [],
        updatedBy: '',
        updatedAt: ''
      },
      section3_3: {
        keyBusinessData: [],
        dataEntities: [],
        dataAttributes: [],
        gdprCompliance: '',
        dataPrivacy: [],
        dataQuality: '',
        dataFlows: [],
        validationRules: [],
        reportingNeeds: [],
        updatedBy: '',
        updatedAt: ''
      },
      section3_4: {
        performanceRequirements: {
          responseTime: '',
          throughput: '',
          availability: ''
        },
        userExperience: {
          usabilityRequirements: [],
          accessibilityRequirements: []
        },
        securityCompliance: {
          securityRequirements: [],
          complianceStandards: []
        },
        scalabilityIntegration: {
          scalabilityRequirements: '',
          integrationStandards: []
        },
        updatedBy: '',
        updatedAt: ''
      }
    },
    chapter4: {
      basicAcceptanceConditions: [],
      businessCriteria: [],
      performanceCriteria: [],
      testingStrategy: '',
      acceptanceProcess: '',
      measurableAcceptanceCriteria: [],
      testScenarios: [],
      successMetrics: [],
      definitionOfDone: [],
      updatedBy: '',
      updatedAt: ''
    }
  };
}