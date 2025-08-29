import { RealtimeAgent, tool } from '@openai/agents/realtime';

export const conceptAnalyst = new RealtimeAgent({
  name: 'Concept Analyst',
  voice: 'echo',
  instructions: `
# Personality and Tone
## Identity
You are a **Senior Conceptual Analyst**, highly experienced in the early stages of business requirements gathering. Your role is to quickly clarify the scope, intent, and stakeholders of a proposed change by asking one targeted question at a time. You specialize in high-level conceptual alignment, not implementation details. You always work in **Czech**, and are fully focused on helping business stakeholders express their needs clearly and concisely.

## Task
Your task is to lead the conceptual analysis phase of a business change. You guide the user to express the motivation, scope, stakeholders, and current context for the change — using only a few, well-structured, high-level questions. You use prior session data where possible and never repeat what has already been asked.

## Demeanor
Analytical, methodical, and curious. You demonstrate structure and competence while maintaining a supportive, helpful tone.

## Tone
Professional and accessible. You use clear language tailored to business stakeholders who may not have technical expertise.

## Level of Enthusiasm
Calm and steady. You bring confidence and clarity without being forceful or excited.

## Level of Formality
Professional and respectful, but not stiff. You avoid slang while keeping your tone natural.

## Level of Emotion
Low emotional expressiveness. You are polite but stay focused on facts and structure.

## Filler Words
None. Your speech is efficient, clear, and intentional.

## Pacing
Measured and deliberate. You ask a question, wait for an answer, then continue with the next.

## Other details
- ⚠️ **VERY IMPORTANT**: Always speak in **Czech language**.
- ⚠️ **NEVER** go into functional, implementation or technical detail.
- ⚠️ Stay strictly within the **scope of your key conceptual questions only**.
- ⚠️ Ask **only one question at a time**.
- ⚠️ Do not repeat questions already asked by others.
- ⚠️ Do not expect user greetings or confirmations before proceeding.
- Begin every session by retrieving prior business requirement context using `read_BR_analysis`.
- End every session by saving the structured conceptual summary using `save_BR_analysis`.

# Instructions
- Follow the Conversation States closely to ensure a structured and consistent interaction.
- If the caller corrects any detail, acknowledge the correction in a straightforward manner and confirm the new spelling or value.

# Conversation States
[
  {
    "id": "1_intro_and_context",
    "description": "Start the session by retrieving prior context and asking the first relevant question.",
    "instructions": [
      "Call the tool 'read_BR_analysis' to retrieve previous session data.",
      "If no prior context is available, introduce yourself and begin with a general question about the planned change.",
      "If prior context exists, refer to it, introduce yourself, and continue the analysis by asking a logical follow-up question.",
      "Proceed immediately with the first question without waiting for user greeting or confirmation.",
      "Speak in Czech only.",
      "Ask only one question at a time."
    ],
    "examples": [
      "Dobrý den, jsem Koncepční analytik a budu s vámi pracovat na vyjasnění vašich business požadavků. Můžete prosím poskytnout popis plánované změny?",
      "Dobrý den, jsem Koncepční analytik. Obdržel jsem již nějaké informace od vašich kolegů. Pojďme nyní pokračovat. Co spustilo tento požadavek?"
    ],
    "transitions": [
      {
        "next_step": "2_trigger_and_value",
        "condition": "Once the user has described the reason and goal of the change."
      }
    ]
  },
  {
    "id": "2_trigger_and_value",
    "description": "Understand what triggered the change and what business value is expected.",
    "instructions": [
      "Ask what initiated the request and what outcome the business expects.",
      "Keep your question conceptual and high-level.",
      "Stay in Czech. Do not ask follow-ups in the same turn."
    ],
    "examples": [
      "Co spustilo tento požadavek a jaká je očekávaná business hodnota?"
    ],
    "transitions": [
      {
        "next_step": "3_stakeholders",
        "condition": "Once motivation and value are captured."
      }
    ]
  },
  {
    "id": "3_stakeholders",
    "description": "Identify the stakeholders and who will be affected.",
    "instructions": [
      "Ask who are the primary stakeholders and impacted parties.",
      "Do not ask about roles or responsibilities in detail—keep it general.",
      "Speak only in Czech and stay within one clear question."
    ],
    "examples": [
      "Kdo jsou hlavní stakeholdeři a kdo bude změnou ovlivněn?"
    ],
    "transitions": [
      {
        "next_step": "5_scope",
        "condition": "Once stakeholders are named."
      }
    ]
  },
  {
    "id": "5_scope",
    "description": "Understand the boundaries of the request.",
    "instructions": [
      "Ask what is included in scope and what is explicitly out of scope.",
      "Keep the focus conceptual—do not ask for system boundaries or implementation layers.",
      "Speak only in Czech. Do not deviate into sub-topics."
    ],
    "examples": [
      "Co je v rozsahu a co je explicitně mimo rozsah tohoto požadavku?"
    ],
    "transitions": [
      {
        "next_step": "6_summary_and_save",
        "condition": "Once scope boundaries are clarified."
      }
    ]
  },
  {
    "id": "6_summary_and_save",
    "description": "Summarize the session and save the analysis.",
    "instructions": [
      "Compile a structured summary in Czech, containing:",
      "- **Business požadavek**: Jasné prohlášení požadavku",
      "- **Business cíl**: Co chce business dosáhnout",
      "- **Hranice rozsahu**: Co je zahrnuto a co vyloučeno",
      "- **Klíčové zainteresované strany**: Seznam stakeholderů",
      "- **Počáteční předpoklady**: Jakékoliv učiněné předpoklady",
      "Call the tool 'save_BR_analysis' to persist the data.",
      "End the session by informing the user the conceptual analysis is complete."
    ],
    "examples": [
      "Koncepční analýza je dokončena. Data byla uložena do BIAN dokumentu. Pro pokračování lze přepnout na dalšího analytika."
    ],
    "transitions": []
  }
]

`,
  tools: [
    tool({
      name: 'read_BR_analysis',
      description: 'Načte kompletní kontext aktuální session včetně předchozích konverzací s jinými agenty',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
      },
      execute: async () => {
        try {
          const sessionId = (typeof window !== 'undefined' && (window as any).__CURRENT_SESSION_ID) || process.env.SESSION_ID || 'current_session';
          
          // Read audit trail from all agents
          const auditResponse = await fetch(`/api/storage?action=get_audit_trail&sessionId=${sessionId}`);
          const auditData = await auditResponse.json();
          
          if (auditData.success && auditData.auditTrail && auditData.auditTrail.length > 0) {
            const conversations = auditData.auditTrail;
            
            // Group conversations by agent
            const agentConversations: any = {};
            conversations.forEach((entry: any) => {
              if (!agentConversations[entry.agentName]) {
                agentConversations[entry.agentName] = [];
              }
              agentConversations[entry.agentName].push(entry);
            });
            
            let contextSummary = `📜 KONTEXT PŘEDCHOZÍ KONVERZACE:\n\n`;
            
            for (const [agentName, messages] of Object.entries(agentConversations)) {
              if (agentName === 'Concept Analyst') continue; // Skip own previous conversations
              
              contextSummary += `Agent: ${agentName}\n`;
              contextSummary += `Počet interakcí: ${(messages as any[]).length}\n`;
              
              // Get last few meaningful interactions
              const relevantMessages = (messages as any[])
                .filter((m: any) => m.type === 'question' || m.type === 'answer')
                .slice(-5); // Last 5 Q&A pairs
              
              if (relevantMessages.length > 0) {
                contextSummary += `Poslední diskutovaná témata:\n`;
                relevantMessages.forEach((msg: any) => {
                  const role = msg.metadata?.source === 'user' ? 'Uživatel' : 'Agent';
                  const shortContent = msg.content.length > 200 ? msg.content.substring(0, 200) + '...' : msg.content;
                  contextSummary += `- ${role}: ${shortContent}\n`;
                });
              }
              contextSummary += `\n`;
            }
            
            // Also read current session data if available
            const sessionResponse = await fetch(`/api/storage?action=get_session_data&sessionId=${sessionId}`);
            const sessionData = await sessionResponse.json();
            
            if (sessionData.success && sessionData.data && Object.keys(sessionData.data).length > 0) {
              contextSummary += `\n📋 ULOŽENÁ DATA Z PŘEDCHOZÍCH AGENTŮ:\n`;
              for (const [agent, data] of Object.entries(sessionData.data)) {
                if (agent === 'Concept Analyst') continue;
                contextSummary += `${agent}: ${JSON.stringify((data as any).data, null, 2).substring(0, 500)}...\n`;
              }
            }
            
            return contextSummary + `\n\nNa základě tohoto kontextu přizpůsobte své otázky a navažte na předchozí diskuzi.`;
          } else {
            return '📜 Žádná předchozí konverzace nebyla nalezena. Začněte s úvodními otázkami.';
          }
        } catch (error) {
          console.error('Error reading session context:', error);
          return '❌ Chyba při čtení kontextu session. Pokračujte bez předchozího kontextu.';
        }
      }
    }),
    tool({
      name: 'save_BR_analysis',
      description: 'Uložení koncepční analýzy do BIAN dokumentu (kapitola 1.1)',
      parameters: {
        type: 'object',
        properties: {
          basicDescription: {
            type: 'string',
            description: 'Základní popis business požadavku'
          },
          businessProblem: {
            type: 'string',
            description: 'Hlavní business problém nebo příležitost'
          },
          opportunityDescription: {
            type: 'string',
            description: 'Popis příležitosti kterou řešíme'
          },
          overallContext: {
            type: 'string',
            description: 'Celkový kontext změny'
          },
          changeBoundaries: {
            type: 'string',
            description: 'Hranice změny'
          },
          keyStakeholders: {
            type: 'array',
            items: { type: 'string' },
            description: 'Klíčoví stakeholdeři'
          },
          existingDomainProcesses: {
            type: 'string',
            description: 'Existující doménové procesy'
          },
          currentSystems: {
            type: 'string',
            description: 'Současné systémy'
          },
          assumptions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Počáteční předpoklady'
          }
        },
        required: ['basicDescription', 'businessProblem', 'overallContext'],
        additionalProperties: false
      },
      execute: async (input: any) => {
        try {
          // First, read current document for context
          const sessionId = (typeof window !== 'undefined' && (window as any).__CURRENT_SESSION_ID) || process.env.SESSION_ID || 'current_session';
          const getResponse = await fetch(`/api/document?action=get_document&sessionId=${sessionId}`);
          const currentDoc = await getResponse.json();
          
          let contextInfo = '📄 BIAN dokument je prázdný - začínáme novou analýzu.';
          if (currentDoc.success && currentDoc.document) {
            const doc = currentDoc.document;
            contextInfo = `📄 Současný stav BIAN dokumentu (${currentDoc.completionPercentage}% kompletní):

KAPITOLA 1 - Popis požadavku:
- Koncepční analýza (1.1): ${doc.chapter1.section1_1.basicDescription ? 'DOKONČENA' : 'PRÁZDNÁ'}
- Business architektura (1.2): ${doc.chapter1.section1_2.mainMotivation ? 'DOKONČENA' : 'PRÁZDNÁ'}  
- Scope definice (1.3): ${doc.chapter1.section1_3.solutionApproach ? 'DOKONČENA' : 'PRÁZDNÁ'}

KAPITOLA 2 - Současný stav:
- AS-IS analýza (2.1): ${doc.chapter2.section2_1.currentProcesses ? 'DOKONČENA' : 'PRÁZDNÁ'}

KAPITOLA 3 - Návrh řešení:
- Design specifikace (3.1): ${doc.chapter3.section3_1.mainFunctions ? 'DOKONČENA' : 'PRÁZDNÁ'}
- Impact analýza (3.2): ${doc.chapter3.section3_2.affectedSystems ? 'DOKONČENA' : 'PRÁZDNÁ'}
- Data analýza (3.3): ${doc.chapter3.section3_3.keyBusinessData ? 'DOKONČENA' : 'PRÁZDNÁ'}
- Nefunkční požadavky (3.4): ${doc.chapter3.section3_4.performanceRequirements ? 'DOKONČENA' : 'PRÁZDNÁ'}

KAPITOLA 4 - Akceptační kritéria:
- ${doc.chapter4.basicAcceptanceConditions ? 'DOKONČENA' : 'PRÁZDNÁ'}

Na základě tohoto přehledu přizpůsobte své otázky.`;
          }
          
          // Save new data if provided
          if (input && Object.keys(input).length > 0) {
            const { basicDescription, businessProblem, opportunityDescription = '', overallContext, changeBoundaries = '', keyStakeholders = [], existingDomainProcesses = '', currentSystems = '', assumptions = [] } = input;
            
            const response = await fetch('/api/document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update_document',
                sessionId: sessionId,
                agentName: 'Concept Analyst',
                sectionData: {
                  basicDescription,
                  businessProblem,
                  opportunityDescription,
                  overallContext,
                  changeBoundaries,
                  keyStakeholders,
                  existingDomainProcesses,
                  currentSystems,
                  assumptions
                },
                timestamp: new Date().toISOString()
              })
            });
            
            const result = await response.json();
            return `${contextInfo}\n\n✅ Koncepční analýza byla úspěšně uložena do BIAN dokumentu (kapitola 1.1). Dokument je ${result.completionPercentage}% kompletní.`;
          } else {
            // Just return context without saving
            return contextInfo;
          }
        } catch {
          return '❌ Chyba při práci s dokumentem.';
        }
      }
    })
  ],
});
