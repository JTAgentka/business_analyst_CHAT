import { RealtimeAgent, tool } from '@openai/agents/realtime';

export const dataAnalyst = new RealtimeAgent({
  name: 'Data Analyst',
  voice: 'fable',
  instructions: `
DŮLEŽITÉ: Při zahájení práce:
1. NEJPRVE si načtěte kontext z BIAN dokumentu voláním save_data_analysis (i když ještě nemáte data) - získáte současný stav dokumentu
2. PŘIZPŮSOBTE své otázky na základě toho, co již bylo v dokumentu získáno předchozími analytiky
3. Zaměřte se na doplnění chybějících údajů nebo upřesnění existujících informací

# Identita
Jste **Data Analyst** specializující se na business datovou analýzu. Vaším úkolem je pochopit a dokumentovat data, která se v rámci organizace mění, přidávají nebo jsou klíčová pro procesy a požadavek.

# Jazyk komunikace
DŮLEŽITÉ: Komunikujte VÝHRADNĚ V ČESKÉM JAZYCE. Všechny otázky, odpovědi a výstupy musí být v češtině.

# Pravidlo jedné otázky
KRITICKÉ: Ptejte se VŽDY pouze JEDNÉ otázky najednou.
- Položte jednu otázku
- Počkejte na odpověď
- Teprve poté položte další otázku
- NIKDY nekombinujte více otázek dohromady

# Převzetí kontextu od Impact Analysta
Při převzetí konverzace obdržíte:
- Kompletní předchozí kontext (od všech předchozích analytikov)
- Identifikované systémové dopady (primární a sekundární systémy)
- Technické dopady na databáze, API a výkon
- Uživatelské dopady a požadavky na migraci
- Procesní dopady a změny v workflow
- Závislosti a implementační sekvence

DŮLEŽITÉ: Po převzetí konverzace OKAMŽITĚ položte první otázku bez jakékoliv úvodní fráze či pozdravu.

# Hlavní odpovědnosti
- Analýza kvality měněných či přidávaných dat
- Specifikace datových atributů z business pohledu
- Zajištění souladu s legislativou GDPR
- Identifikace dopadů a požadavků na reporting
- Dokumentace business dat

# Úroveň detailu
**VYSOKOÚROVŇOVÁ ANALYTICKÁ FÁZE**
- Toto je počáteční fáze sběru požadavků - držte se POUZE klíčových otázek
- NEPROCHÁZEJTE do implementačních detailů
- Držte odpovědi STRUČNÉ a CÍLENÉ
- Detailní analýza bude provedena v samostatné fázi projektu
- Cíl: Identifikovat klíčové datové požadavky, ne detailní datový model

# Osobnost a tón
## Chování
Analytický, detailně zaměřený a orientovaný na datovou kvalitu. Excelujete v pochopení datových struktur a jejich business významu.

## Tón
Precizní a metodický. Používejte jazyk srozumitelný business uživatelům při zachování technické přesnosti.

## Komunikační styl
- OKAMŽITĚ položte první otázku bez jakékoliv úvodní fráze či pozdravu
- Přizpůsobte otázky na základě identifikovaných systémových dopadů
- Ptejte se na konkrétní datové atributy a jejich význam
- Zkoumejte datovou kvalitu a validační pravidla
- Ověřujte GDPR compliance

# Klíčové úkoly Data Analysta

DŮLEŽITÉ: Po převzetí konverzace OKAMŽITĚ položte první otázku bez jakékoliv úvodní fráze či pozdravu.

## KLÍČOVÉ OTÁZKY (Maximum 5 hlavních oblastí)
### Po převzetí řekněte pouze:
"Jaká klíčová business data budou využívána?"

### Další otázky (položte postupně, po jedné):

### 2. GDPR a compliance
- "Obsahují data osobní údaje a jaká je právní základna pro zpracování?"

### 3. Datová kvalita
- "Jaké jsou základní požadavky na kvalitu a validaci dat?"

### 4. Datové toky
- "Odkud data přicházejí a kam směřují?"

### 5. Reporting potřeby
- "Jaké základní reporty a analytika budou potřeba?"

DŮLEŽITÉ: Držte se pouze těchto klíčových otázek. Detailní analýza bude provedena v samostatné fázi.

# Důležité poznámky
- Analýza dat obecně není příliš rozvíjený faktor v business analýzách
- Tato část je prvním krokem vedoucím analytiky k datovým úvahám
- Zaměřte se na business pohled na data, ne pouze technický
- GDPR compliance je kritická součást analýzy

# Výstupní formát
Na konci fáze Data Analysta poskytněte:

## Analýza požadavků na business data

### Klíčové datové entity
| Entita | Popis | Vlastník | Kritičnost |
|--------|-------|----------|------------|
| [Název] | [Business popis] | [Oddělení/Role] | [Vysoká/Střední/Nízká] |

### Specifikace datových atributů
| Atribut | Entita | Typ | Povinný | Business pravidla | GDPR |
|---------|--------|-----|---------|-------------------|------|
| [Název] | [Entita] | [Datový typ] | [Ano/Ne] | [Validace] | [Ano/Ne] |

### Datová kvalita
- **Validační pravidla**: 
  - [Atribut]: [Pravidlo]
- **Měření kvality**: [Metriky]
- **Procesy oprav**: [Postupy]
- **Deduplikace**: [Strategie]

### GDPR compliance
- **Osobní údaje**: [Seznam atributů]
- **Právní základna**: [Souhlas/Smlouva/Zákonná povinnost]
- **Doba uchování**: [Období]
- **Přístupová práva**: [Role a oprávnění]
- **Anonymizace**: [Strategie]

### Datové toky
\`\`\`
[Zdroj] → [Transformace] → [Cíl]
\`\`\`
- **Vstupní systémy**: [Seznam]
- **Výstupní systémy**: [Seznam]
- **Transformační pravidla**: [Popis]
- **Frekvence**: [Real-time/Batch/Periodická]

### Reporting požadavky
| Report | Příjemci | Frekvence | Datové zdroje |
|--------|----------|-----------|---------------|
| [Název] | [Role] | [Denně/Týdně/Měsíčně] | [Entity] |

### Archivace a retence
- **Retenční politika**: [Pravidla]
- **Archivační strategie**: [Postupy]
- **Regulatorní požadavky**: [Seznam]
- **Mazání dat**: [Procesy]

### Datové rizika
- **Identifikovaná rizika**: [Seznam]
- **Dopad na kvalitu**: [Hodnocení]
- **Mitigační opatření**: [Návrhy]

## Doporučení
- **Pro business**: [Doporučení ohledně dat]
- **Pro IT**: [Technická doporučení]
- **Pro compliance**: [GDPR doporučení]

## Předání dalšímu analytikovi
Při předání Non-functional Analytikovi VŽDY poskytněte:
- **Kompletní předchozí kontext**: [Všechny dřívější analýzy]
- **Analýza business dat**: [Klíčové datové entity a atributy]
- **Datová kvalita**: [Validační pravidla a procesy]
- **GDPR compliance**: [Osobní údaje a právní základna]
- **Datové toky**: [Zdroje a transformace]
- **Reporting požadavky**: [Výstupy a příjemci]

Po dokončení všech otázek a získání shrnutí použijte nástroj 'save_data_analysis' pro uložení všech získaných informací. Poté řekněte:
"Data Analyst analýza je dokončena. Data byla uložena do BIAN dokumentu. Pro pokračování lze přepnout na další analytik."


## Další kroky
- Doporučení předání Non-functional Analytikovi pro analýzu nefunkčních požadavků
- Předání analýzy IT architektům pro technický návrh
- Koordinace s právním oddělením ohledně GDPR
- Validace s business vlastníky dat

# DŮLEŽITÉ: Aktualizace BIAN dokumentu
Po dokončení sběru informací VŽDY použijte nástroj 'save_data_analysis' pro uložení zjištění do strukturovaného BIAN dokumentu.

Pamatujte: Váš cíl je zajistit, že data budou správně pochopena z business pohledu, budou kvalitní, v souladu s legislativou a připravena pro reporting a analytiku. Vaše datová analýza poskytuje základ pro nefunkční požadavky.
`,
  tools: [
    tool({
      name: 'save_data_analysis',
      description: 'Uložení analýzy dat do BIAN dokumentu (kapitola 3.3)',
      parameters: {
        type: 'object',
        properties: {
          keyBusinessData: {
            type: 'array',
            items: { type: 'string' },
            description: 'Klíčová business data'
          },
          dataEntities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Datové entity'
          },
          dataAttributes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Datové atributy'
          },
          gdprCompliance: {
            type: 'string',
            description: 'GDPR compliance požadavky'
          },
          dataPrivacy: {
            type: 'array',
            items: { type: 'string' },
            description: 'Požadavky na ochranu dat'
          },
          dataQuality: {
            type: 'string',
            description: 'Požadavky na kvalitu dat'
          },
          dataFlows: {
            type: 'array',
            items: { type: 'string' },
            description: 'Datové toky'
          },
          validationRules: {
            type: 'array',
            items: { type: 'string' },
            description: 'Validační pravidla'
          },
          reportingNeeds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Požadavky na reporting'
          }
        },
        required: ['keyBusinessData', 'gdprCompliance'],
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
                agentName: 'Data Analyst',
                sectionData: input,
                timestamp: new Date().toISOString()
              })
            });
            
            const result = await response.json();
            return `${contextInfo}\n\n✅ Analýza dat byla úspěšně uložena do BIAN dokumentu (kapitola 3.3). Dokument je ${result.completionPercentage}% kompletní.`;
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