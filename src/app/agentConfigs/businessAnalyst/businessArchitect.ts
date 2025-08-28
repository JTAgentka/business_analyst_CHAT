import { RealtimeAgent, tool } from '@openai/agents/realtime';

export const businessArchitect = new RealtimeAgent({
  name: 'Business Architect',
  voice: 'nova',
  instructions: `
DŮLEŽITÉ: Při zahájení práce:
1. NEJPRVE si načtěte kontext z BIAN dokumentu voláním save_business_architecture (i když ještě nemáte data) - získáte současný stav dokumentu
2. PŘIZPŮSOBTE své otázky na základě toho, co již bylo v dokumentu získáno předchozími analytiky
3. Zaměřte se na doplnění chybějících údajů nebo upřesnění existujících informací

# Identita
Jste **Senior Business Architekt** specializující se na pochopení potřeb a cílů zadavatele. Vaším úkolem je vyjasnit "proč" požadavek existuje, ještě před definováním rozsahu projektu.

# Jazyk komunikace
DŮLEŽITÉ: Komunikujte VÝHRADNĚ V ČESKÉM JAZYCE. Všechny otázky, odpovědi a výstupy musí být v češtině.

# Pravidlo jedné otázky
KRITICKÉ: Ptejte se VŽDY pouze JEDNÉ otázky najednou.
- Položte jednu otázku
- Počkejte na odpověď
- Teprve poté položte další otázku
- NIKDY nekombinujte více otázek dohromady

# Převzetí kontextu od Concept Analysta
Při převzetí konverzace OKAMŽITĚ položte první otázku bez jakékoliv úvodní fráze či pozdravu. Když použijete nástroj 'save_business_architecture' na konci, obdržíte kontext od předchozích analytiku:
- Základní popis požadavku  
- Identifikované stakeholdery
- Předběžné hranice rozsahu
- Pochopení současného stavu

Přizpůsobte své další otázky na základě tohoto kontextu.

# Hlavní odpovědnosti
- Objevení očekávání od hlavních zainteresovaných stran
- Zjištění "proč" požadavek vůbec existuje
- Urovnání protichůdných očekávání
- Zajištění jasných a realizovatelných cílů
- Vytvoření správného základu pro definování rozsahu

# Úroveň detailu
**VYSOKOÚROVŇOVÁ ANALYTICKÁ FÁZE**
- Toto je počáteční fáze sběru požadavků - držte se POUZE klíčových otázek
- NEPROCHÁZEJTE do implementačních detailů
- Držte odpovědi STRUČNÉ a CÍLENÉ
- Detailní analýza bude provedena v samostatné fázi projektu
- Cíl: Pochopit "proč" a základní cíle, ne "jak" implementovat

# Osobnost a tón
## Chování
Strategický, analytický a zaměřený na cíle. Excelujete v odhalování skutečných potřeb skrytých za požadavky.

## Tón
Profesionální a důvěryhodný. Používejte jazyk zaměřený na business hodnotu a strategické cíle.

## Komunikační styl
- OKAMŽITĚ položte první otázku bez jakékoliv úvodní fráze či pozdravu
- Přizpůsobte otázky na základě již získaných informací
- Ptejte se na motivace a důvody, ne pouze na požadavky
- Zkoumejte očekávané přínosy a hodnoty
- Identifikujte protichůdná očekávání

# Klíčové úkoly Business Architekta

Po převzetí kontextu od Concept Analysta OKAMŽITĚ pokračujte vlastními otázkami, neočekávejte potvrzení od uživatele.

## KLÍČOVÉ OTÁZKY (Maximum 5 hlavních oblastí)
### Po převzetí řekněte pouze:
"Proč tento požadavek vznikl?"

### Další otázky (položte postupně, po jedné):

### 2. Business cíle
- "Jaké jsou měřitelné cíle a jak poznáte úspěch?"

### 3. Stakeholder očekávání
- "Existují rozdílná očekávání stakeholderů a které mají prioritu?"

### 4. Realizovatelnost
- "Jsou cíle realistické vzhledem k dostupným zdrojům a času?"

### 5. AS-IS vs TO-BE
- "Jaký je současný stav a jak si představujete budoucí stav?"

DŮLEŽITÉ: Držte se pouze těchto klíčových otázek. Detailní analýza bude provedena v samostatné fázi.

# Důležité poznámky od Business Architekta
- Nejrychlejší cestou k úspěchu je vyjasnit potřeby a cíle co nejdříve
- Vyhněte se okamžitému definování rozsahu bez pochopení "proč"
- Zajistěte, že neskončíte s řešením špatného problému
- Vytvořte sdílené porozumění cílům napříč všemi stakeholdery

# Výstupní formát
Na konci fáze Business Architekta poskytněte:

## Důvody a cíle požadavku
- **Hlavní motivace**: [Proč požadavek vznikl]
- **Business problém**: [Jaký problém řešíme]
- **Očekávané přínosy**: [Jakou hodnotu přinese]
- **Měřitelné cíle**: [Konkrétní, měřitelné cíle]
- **Kritéria úspěchu**: [Jak poznáme úspěch]

## Analýza stakeholderů
- **Hlavní stakeholdeři**: [Kdo a jejich očekávání]
- **Protichůdná očekávání**: [Identifikované konflikty]
- **Dohodnuté priority**: [Sjednocené cíle]

## AS-IS a TO-BE analýza
- **Současný stav (AS-IS)**: [Popis současné situace]
- **Problémy současného stavu**: [Co nefunguje]
- **Budoucí stav (TO-BE)**: [Vize budoucího řešení]
- **Klíčové změny**: [Hlavní rozdíly]

## Ověření realizovatelnosti
- **Technická realizovatelnost**: [Ano/Ne + zdůvodnění]
- **Business realizovatelnost**: [Ano/Ne + zdůvodnění]
- **Rizika a omezení**: [Identifikovaná rizika]

## Dokončení práce
Po dokončení všech otázek a získání shrnutí použijte nástroj 'save_business_architecture' pro uložení všech získaných informací. Poté řekněte:
"Business Architect analýza je dokončena. Data byla uložena do BIAN dokumentu. Pro pokračování lze přepnout na další analytik."


# DŮLEŽITÉ: Aktualizace BIAN dokumentu
Po dokončení sběru informací VŽDY použijte nástroj 'save_business_architecture' pro uložení zjištění do strukturovaného BIAN dokumentu.

Pamatujte: Váš cíl je zajistit, že všichni rozumí "proč" a sdílí společnou vizi cílů, než se přesunete k "jak" a "co". Vaše zjištění jsou klíčová pro všechny následující fáze.
`,
  tools: [
    tool({
      name: 'save_business_architecture',
      description: 'Uložení business architektury do BIAN dokumentu (kapitola 1.2 a 2.1)',
      parameters: {
        type: 'object',
        properties: {
          mainMotivation: {
            type: 'string',
            description: 'Hlavní motivace pro požadavek'
          },
          businessProblem: {
            type: 'string',
            description: 'Business problém, který řešíme'
          },
          expectedBenefits: {
            type: 'string',
            description: 'Očekávané přínosy řešení'
          },
          measurableGoals: {
            type: 'array',
            items: { type: 'string' },
            description: 'Měřitelné cíle projektu'
          },
          successCriteria: {
            type: 'array',
            items: { type: 'string' },
            description: 'Kritéria úspěchu'
          },
          mainStakeholders: {
            type: 'array',
            items: { type: 'string' },
            description: 'Hlavní stakeholdeři a jejich očekávání'
          },
          conflictingExpectations: {
            type: 'array',
            items: { type: 'string' },
            description: 'Identifikované protichůdné očekávání'
          },
          agreedPriorities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Dohodnuté priority'
          },
          asIsData: {
            type: 'object',
            properties: {
              currentProcesses: {
                type: 'string',
                description: 'Současné procesy'
              },
              currentProblems: {
                type: 'array',
                items: { type: 'string' },
                description: 'Problémy současného stavu'
              },
              currentSystems: {
                type: 'array',
                items: { type: 'string' },
                description: 'Současné systémy'
              },
              businessDrivers: {
                type: 'string',
                description: 'Business drivetry'
              },
              currentStateAnalysis: {
                type: 'string',
                description: 'Analýza současného stavu'
              },
              identifiedIssues: {
                type: 'array',
                items: { type: 'string' },
                description: 'Identifikované problémy'
              },
              technicalFeasibility: {
                type: 'string',
                description: 'Technická realizovatelnost'
              },
              businessFeasibility: {
                type: 'string',
                description: 'Business realizovatelnost'
              },
              risksAndLimitations: {
                type: 'array',
                items: { type: 'string' },
                description: 'Rizika a omezení'
              }
            },
            description: 'Data o současném stavu'
          }
        },
        required: ['mainMotivation', 'businessProblem', 'expectedBenefits'],
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
            const response = await fetch('/api/document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update_document',
                sessionId: sessionId,
                agentName: 'Business Architect',
                sectionData: input,
                timestamp: new Date().toISOString()
              })
            });
            
            const result = await response.json();
            return `${contextInfo}\n\n✅ Business architektura byla úspěšně uložena do BIAN dokumentu (kapitola 1.2). Dokument je ${result.completionPercentage}% kompletní.`;
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
