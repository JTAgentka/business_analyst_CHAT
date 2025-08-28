import { zodTextFormat } from 'openai/helpers/zod';
import { GuardrailOutputZod, GuardrailOutput } from '@/app/types';

// Czech language specific guardrail for J&T Bank onboarding
export async function runCzechBankingGuardrail(
  message: string,
  companyName: string = 'J&T Bank',
): Promise<GuardrailOutput> {
  const messages = [
    {
      role: 'user',
      content: `You are an expert at classifying Czech language text for a banking onboarding system according to moderation and compliance policies. Consider the provided message, analyze potential classes from output_classes, and output the best classification. Output json, following the provided schema. Keep your analysis and reasoning short and to the point, maximum 2 sentences.

      <info>
      - Company name: ${companyName}
      - Context: Czech banking onboarding process
      - Language: Czech
      </info>

      <message>
      ${message}
      </message>

      <output_classes>
      - OFFENSIVE: Content that includes hate speech, discriminatory language, insults, slurs, or harassment in Czech or any other language.
      - OFF_BRAND: Content that discusses other banks or financial institutions in a disparaging way, or that doesn't align with J&T Bank's professional standards.
      - VIOLENCE: Content that includes explicit threats, incitement of harm, or graphic descriptions of physical injury or violence.
      - SENSITIVE_DATA_LEAK: Content that inappropriately shares sensitive personal data like full credit card numbers, passwords, or PINs.
      - FINANCIAL_ADVICE: Content that provides specific investment advice or guarantees returns without proper disclaimers.
      - COMPLIANCE_VIOLATION: Content that violates banking regulations, AML/KYC requirements, or GDPR.
      - INCORRECT_PROCESS: Content that instructs the client to skip required onboarding steps or provides incorrect procedural information.
      - NONE: If no other classes are appropriate and the message is fine.
      </output_classes>

      Note: Be aware that the text may be in Czech. Common Czech profanities or inappropriate language should be caught under OFFENSIVE.
      `,
    },
  ];

  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: messages,
      text: {
        format: zodTextFormat(GuardrailOutputZod, 'output_format'),
      },
    }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return Promise.reject('Error with runCzechBankingGuardrail.');
  }

  const data = await response.json();

  try {
    const output = GuardrailOutputZod.parse(data.output_parsed);
    return {
      ...output,
      testText: message,
    };
  } catch (error) {
    console.error('Error parsing the message content as GuardrailOutput:', error);
    return Promise.reject('Failed to parse guardrail output.');
  }
}

export interface RealtimeOutputGuardrailResult {
  tripwireTriggered: boolean;
  outputInfo: any;
}

export interface RealtimeOutputGuardrailArgs {
  agentOutput: string;
  agent?: any;
  context?: any;
}

// Creates a Czech banking-specific guardrail for J&T Bank
export function createCzechBankingGuardrail(companyName: string = 'J&T Bank') {
  return {
    name: 'czech_banking_guardrail',

    async execute({ agentOutput }: RealtimeOutputGuardrailArgs): Promise<RealtimeOutputGuardrailResult> {
      try {
        // Quick pre-check for obviously problematic content
        const quickChecks = [
          // Check for potential data leaks (card numbers, etc.)
          /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
          /\bPIN[\s:]*\d{4,6}\b/i, // PIN disclosure
          
          // Check for common Czech profanities (simplified examples)
          /\b(kurva|prdel|hovno|sráč|debil|kokot)\b/i,
          
          // Check for competitor banks mentioned inappropriately
          /\b(Česká spořitelna|ČSOB|Komerční banka|Raiffeisenbank|UniCredit|Moneta)\b.*\b(lepší|lépe|výhodnější)\b/i,
        ];

        let quickTrigger = false;
        for (const pattern of quickChecks) {
          if (pattern.test(agentOutput)) {
            quickTrigger = true;
            break;
          }
        }

        // If quick check triggers, run full classification
        if (quickTrigger || agentOutput.length > 500) {
          const res = await runCzechBankingGuardrail(agentOutput, companyName);
          const triggered = res.moderationCategory !== 'NONE';
          return {
            tripwireTriggered: triggered,
            outputInfo: res,
          };
        }

        // For shorter, seemingly safe messages, skip API call
        return {
          tripwireTriggered: false,
          outputInfo: { 
            moderationCategory: 'NONE',
            moderationRationale: 'Message passed quick checks',
          },
        };
      } catch (error) {
        console.error('Guardrail error:', error);
        // On error, default to safe (don't block the message)
        return {
          tripwireTriggered: false,
          outputInfo: { error: 'guardrail_failed' },
        };
      }
    },
  } as const;
}

// Additional validation for collected data
export function validateCollectedData(data: any, section: string): boolean {
  switch (section) {
    case '1_identification':
      // Validate Czech ID format, birth date format, etc.
      if (data.client_birth_date) {
        const datePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
        if (!datePattern.test(data.client_birth_date)) {
          return false;
        }
      }
      return true;
      
    case '4_tax_residence':
      // Validate DIČ format for Czech Republic
      if (data.tax_residences) {
        for (const residence of data.tax_residences) {
          if (residence.country === 'Česká republika' && residence.tax_id) {
            const czTaxIdPattern = /^CZ\d{8,10}$/;
            if (!czTaxIdPattern.test(residence.tax_id)) {
              console.warn('Invalid Czech tax ID format');
            }
          }
        }
      }
      return true;
      
    default:
      return true;
  }
}