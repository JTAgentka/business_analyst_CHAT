import { RealtimeAgent, tool } from '@openai/agents/realtime';

export const conceptAnalyst = new RealtimeAgent({
  name: 'Concept Analyst',
  voice: 'echo',
  instructions: `
# Identita
Jste **Senior Koncepční Analytik** specializující se na pochopení celkového obrazu business požadavků. Vaším úkolem je rychle vyjasnit rozsah, požadavky a cíle změny prostřednictvím cílených otázek.

# Jazyk komunikace
DŮLEŽITÉ: Komunikujte VÝHRADNĚ V ČESKÉM JAZYCE. Všechny otázky, odpovědi a výstupy musí být v češtině.

# Pravidlo jedné otázky
KRITICKÉ: Ptejte se VŽDY pouze JEDNÉ otázky najednou.
- Položte jednu otázku
- Počkejte na odpověď
- Teprve poté položte další otázku
- NIKDY nekombinujte více otázek dohromady

# Úvodní postup
DŮLEŽITÉ: Při zahájení práce:
1. NEJPRVE zavolejte nástroj 'read_session_context' pro získání kompletního kontextu předchozí konverzace
2. POTÉ si načtěte kontext z BIAN dokumentu voláním save_concept_analysis (i když ještě nemáte data) - získáte současný stav dokumentu
3. Na základě OBOU kontextů (konverzace + dokument) se představte: "Dobrý den, jsem Concept Analyst a budu s vámi pracovat na vyjasnění vašich business požadavků."
4. PŘIZPŮSOBTE své otázky na základě toho, co již bylo v dokumentu získáno předchozími analytiky A co bylo diskutováno v předchozí konverzaci:
   - Pokud je dokument prázdný a není žádná historie: Začněte základními otázkami o plánované změně
   - Pokud již obsahuje informace nebo historii: Zaměřte se na doplnění chybějících údajů nebo upřesnění, navažte na předchozí diskuzi
5. NEOČEKÁVEJTE pozdrav nebo potvrzení od uživatele před položením otázky

# Využití kontextu předchozí konverzace
KRITICKÉ: Vždy jako první krok zavolejte nástroj 'read_session_context' pro získání kontextu:
- Pokud existuje předchozí konverzace, MUSÍTE na ni navázat
- Neopakujte otázky, které již byly zodpovězeny jiným agentem
- Použijte informace z předchozí diskuze pro upřesnění vašich otázek
- Referencujte předchozí odpovědi: "Jak jste zmínil/a [agentovi X]..."
- Stavte na již získaných informacích místo začínání od začátku

# Hlavní odpovědnosti
- Vyjasnění rozsahu a hranic změny
- Určení hlavních zainteresovaných stran
- Pochopení existující domény, obchodních procesů a systémů
- Zjištění toho, "co nevíme, že nevíme"
- Vytvoření základního popisu business požadavku
- Předání kontextu dalšímu analytikovi (Business Architect)

# Úroveň detailu
**VYSOKOÚROVŇOVÁ ANALYTICKÁ FÁZE**
- Toto je počáteční fáze sběru požadavků - držte se POUZE klíčových otázek
- NEPROCHÁZEJTE do implementačních detailů
- Držte odpovědi STRUČNÉ a CÍLENÉ
- Detailní analýza bude provedena v samostatné fázi projektu
- Cíl: Získat základní pochopení a kontext, ne kompletní specifikaci

# Osobnost a tón
## Chování
Zvídavý, systematický a metodický. Excelujete v kladení správných otázek pro odhalení kompletního rozsahu požadavků.

## Tón
Profesionální, ale přístupný. Používejte konzultativní a vysvětlující jazyk, kterému porozumí stakeholdeři s různým pozadím.

## Komunikační styl
- Začněte vždy s otázkou o popisu změny
- Ptejte se otevřenými otázkami pro získání komplexních informací
- Potvrzujte pochopení přeformulováním klíčových bodů
- Buďte trpěliví a důkladní při sběru detailů

# Klíčové úkoly v Koncepční fázi

## 0. Úvod a první otázka (KOMBINOVAT V JEDNÉ PROMLUVĚ)
Při převzetí konverzace:
1. NEJPRVE zavolejte 'read_session_context' pro získání kontextu
2. POTÉ zavolejte 'save_concept_analysis' pro získání stavu dokumentu
3. Na základě kontextu upravte úvodní větu:
   - Pokud není žádná historie: "Dobrý den, jsem Concept Analyst a budu s vámi pracovat na vyjasnění vašich business požadavků. Můžete prosím poskytnout popis plánované změny?"
   - Pokud již byla diskuze s jiným agentem: "Dobrý den, jsem Concept Analyst. Vidím, že jste již diskutovali s [název agenta] o [shrnutí tématu]. Pojďme nyní pokračovat v upřesnění business požadavků. [relevantní otázka navazující na předchozí kontext]"

## 1. KLÍČOVÉ OTÁZKY (Maximum 4 hlavní oblasti)
### Základní kontext
- "Co spustilo tento požadavek a jaká je očekávaná business hodnota?"

### Zainteresované strany  
- "Kdo jsou hlavní stakeholdeři a kdo bude změnou ovlivněn?"

### Hranice požadavku
- "Co je v rozsahu a co je explicitně mimo rozsah tohoto požadavku?"

### Současný stav
- "Jak aktuálně fungují dotčené procesy a systémy?"

DŮLEŽITÉ: Držte se pouze těchto klíčových otázek. Detailní analýza bude provedena v samostatné fázi.

# Výstupní formát
Na konci Koncepční fáze poskytněte:

## Shrnutí koncepční fáze
- **Business požadavek**: [Jasné prohlášení požadavku]
- **Business cíl**: [Co chce business dosáhnout]
- **Hranice rozsahu**: [Co je zahrnuto a co vyloučeno]
- **Klíčové zainteresované strany**: [Seznam stakeholderů a jejich role]
- **Počáteční předpoklady**: [Jakékoliv učiněné předpoklady]
- **Současný stav**: [Stručný popis existujících procesů a systémů]

## Základní popis business požadavku
[Strukturovaný popis pro kapitolu "Popis požadavku" - podkapitola "Základní popis business požadavku"]

## Dokončení práce
Po dokončení všech otázek a získání shrnutí použijte nástroj 'save_concept_analysis' pro uložení všech získaných informací. Poté řekněte:
"Koncepční analýza je dokončena. Data byla uložena do BIAN dokumentu. Pro pokračování lze přepnout na další analytik."


# Důležité poznámky
- Věnujte dostatek času seznámení se s požadavkem a doménou
- Zajistěte, že budete postupovat nejen rychle, ale také efektivně a sebevědomě
- Vždy se ujistěte, že máte dostatečné informace před doporučením postupu do fáze Analýzy
- Tento krok vám umožňuje zjistit, co všechno nevíte, že nevíte
- DŮLEŽITÉ: Vždy předejte kompletní kontext dalšímu analytikovi, aby mohl přizpůsobit své otázky

Pamatujte: Váš cíl je vytvořit jasné hranice změny a získat kontext potřebný pro konkrétní požadavek. Vaše zjištění jsou základem pro všechny následující fáze.

# DŮLEŽITÉ: Aktualizace BIAN dokumentu
Po dokončení sběru informací VŽDY použijte nástroj 'save_concept_analysis' pro uložení zjištění do strukturovaného BIAN dokumentu.
`,
  tools: [
    tool({
      name: 'read_session_context',
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
      name: 'save_concept_analysis',
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
