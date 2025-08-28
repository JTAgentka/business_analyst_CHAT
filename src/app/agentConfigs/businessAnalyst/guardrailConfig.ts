// Guardrail configuration for J&T Bank onboarding agents

export const guardrailConfig = {
  // Enable/disable guardrails globally
  enabled: true,
  
  // Enable/disable specific checks
  checks: {
    offensive: true,
    offBrand: true,
    violence: true,
    sensitiveDataLeak: true,
    financialAdvice: true,
    complianceViolation: true,
    incorrectProcess: true,
  },
  
  // Sensitivity levels (1-5, where 5 is most strict)
  sensitivity: {
    offensive: 4,
    offBrand: 3,
    violence: 5,
    sensitiveDataLeak: 5,
    financialAdvice: 4,
    complianceViolation: 5,
    incorrectProcess: 4,
  },
  
  // Czech-specific terms to flag
  czechTerms: {
    profanity: [
      'kurva', 'prdel', 'hovno', 'sráč', 'debil', 'kokot', 
      'kunda', 'píča', 'zmrd', 'čurák', 'hajzl'
    ],
    competitors: [
      'Česká spořitelna', 'ČSOB', 'Komerční banka', 
      'Raiffeisenbank', 'UniCredit', 'Moneta', 'Air Bank',
      'Fio banka', 'mBank', 'Equa bank'
    ],
    sensitivePatterns: [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /\b\d{6}\/\d{4}\b/, // Czech birth number (rodné číslo)
      /\bPIN[\s:]*\d{4,6}\b/i, // PIN
      /heslo[\s:]*[\w@#$%]+/i, // Password in Czech
    ]
  },
  
  // Messages to show when guardrail is triggered
  messages: {
    OFFENSIVE: 'Omlouvám se, ale nemohu použít tento typ jazyka. Pojďme pokračovat profesionálně.',
    OFF_BRAND: 'Zaměřme se prosím na služby J&T Banky.',
    VIOLENCE: 'Nemohu diskutovat o násilných tématech. Vraťme se k onboardingu.',
    SENSITIVE_DATA_LEAK: 'Z bezpečnostních důvodů nemohu sdílet citlivé údaje tímto způsobem.',
    FINANCIAL_ADVICE: 'Nemohu poskytovat konkrétní investiční poradenství. Pro detailní konzultaci kontaktujte našeho specialistu.',
    COMPLIANCE_VIOLATION: 'Tato informace by mohla porušit regulační požadavky. Postupujme podle standardního procesu.',
    INCORRECT_PROCESS: 'Musíme dodržet správný postup onboardingu. Vraťme se k aktuálnímu kroku.',
  },
  
  // Logging configuration
  logging: {
    logTriggered: true,
    logDetails: true,
    sendAnalytics: false,
  },
  
  // Performance settings
  performance: {
    // Skip API call for messages shorter than this
    minLengthForApiCall: 20,
    // Maximum message length to check
    maxLengthToCheck: 5000,
    // Timeout for guardrail check (ms)
    timeout: 3000,
  }
};

// Helper function to check if a message contains blocked terms
export function quickCheckBlockedTerms(message: string): {
  blocked: boolean;
  category?: string;
  term?: string;
} {
  const lowerMessage = message.toLowerCase();
  
  // Check profanity
  for (const term of guardrailConfig.czechTerms.profanity) {
    if (lowerMessage.includes(term.toLowerCase())) {
      return { blocked: true, category: 'OFFENSIVE', term };
    }
  }
  
  // Check sensitive patterns
  for (const pattern of guardrailConfig.czechTerms.sensitivePatterns) {
    if (pattern.test(message)) {
      return { blocked: true, category: 'SENSITIVE_DATA_LEAK', term: 'sensitive_pattern' };
    }
  }
  
  return { blocked: false };
}

// Export for use in agent instructions
export const guardrailInstructions = `
# Bezpečnostní a Compliance Pravidla

NIKDY:
- Nesdílejte kompletní čísla karet, PINy nebo hesla
- Neposkytujte konkrétní investiční doporučení s garantovanými výnosy
- Neporovnávejte J&T Banku negativně s konkurencí
- Nepoužívejte vulgární nebo urážlivý jazyk
- Nepřeskakujte povinné kroky onboardingu

VŽDY:
- Chraňte osobní údaje klientů
- Dodržujte AML/KYC požadavky
- Respektujte GDPR
- Postupujte podle definovaného onboarding procesu
- Při nejistotě odkažte na specialistu
`;