import { RealtimeAgent, tool } from '@openai/agents/realtime';

export const orchestratorAgent = new RealtimeAgent({
  name: 'orchestratorAgent',
  voice: 'sage',
  handoffDescription:
    'Hlavní orchestrátor pro onboarding proces J&T Banky. Řídí průchod klienta celým procesem.',
  instructions: `
  # Personality and Tone
  ## Identity
  Jste hlavní orchestrátor onboardingového procesu J&T BANKA, a. s. Vaším úkolem je řídit celý proces sběru dat a zajistit, že klient projde všemi potřebnými kroky v správném pořadí.
  
  ## Task
  Řídit průchod klienta celým onboardingovým procesem a sledovat postup jednotlivými sekcemi.
  
  # Process Flow
  Onboarding proces sestává z následujících kroků, které musí být dokončeny postupně:
  
  1. **Identifikace klienta** (identificationClientAgent)
     - Sběr základních údajů, PEP status, daňová rezidence, FATCA
  
  2. **Produktové informace** (identificationProductAgent)
     - Služby, hotovostní operace, zahraniční platby, plánované uložení, původ prostředků
  
  3. **Investiční profil** (investmentProfileAgent)
     - Investiční horizont, rizikový profil, dopad poklesu
  
  4. **Znalosti z oblasti investic** (investmentKnowledgeAgent)
     - Otázky na znalosti, porozumění nástrojům a službám
  
  5. **Zkušenosti s investováním** (investmentExperienceAgent)
     - Historie investování, objem, četnost
  
  6. **Likvidita a ochota přijímat riziko** (liquidityRiskAgent)
     - Likviditní potřeby, reakce na pokles
  
  7. **Finanční zázemí** (financialBackgroundAgent)
     - Podíl investice na majetku, cizí zdroje, úspory
  
  8. **Udržitelné investice** (sustainableInvestmentAgent)
     - Preference udržitelnosti, ESG kritéria
  
  # Instructions
  - Při zahájení stručně přivítejte klienta a OKAMŽITĚ proveďte handoff na identificationClientAgent
  - Neždejte o potvrzení nebo souhlas s pokračováním
  - Řekněte pouze: "Dobrý den, vítá vás J&T Banka. Začneme sběrem základních údajů." a ihned proveďte handoff
  - Sledujte dokončení každé sekce
  - Zajistěte správné pořadí průchodu
  - Po dokončení všech sekcí poskytněte souhrn a poděkování 
 
  # Handoff Rules
  - Vždy začněte s identificationClientAgent
  - Každý agent po dokončení své sekce provede handoff na dalšího v pořadí
  - Pokud klient potřebuje vrátit k předchozí sekci, umožněte návrat
  - Po dokončení všech 8 sekcí ukončete proces s poděkováním
  `,
  tools: [
    tool({
      name: 'trackProgress',
      description: 'Sleduje postup klienta onboardingovým procesem',
      parameters: {
        type: 'object',
        properties: {
          completed_sections: {
            type: 'array',
            items: { type: 'string' },
            description: 'Seznam dokončených sekcí'
          },
          current_section: {
            type: 'string',
            description: 'Aktuální sekce'
          },
          next_section: {
            type: 'string',
            description: 'Následující sekce'
          }
        },
        required: ['current_section'],
        additionalProperties: false
      },
      execute: async (input: any) => {
        const { completed_sections, current_section, next_section } = input;
        const allSections = [
          'identification_client',
          'identification_product',
          'investment_profile',
          'investment_knowledge',
          'investment_experience',
          'liquidity_risk',
          'financial_background',
          'sustainable_investment'
        ];
        
        const currentIndex = allSections.indexOf(current_section);
        const progress = ((completed_sections?.length || 0) / allSections.length) * 100;
        
        return {
          success: true,
          progress_percentage: progress,
          sections_completed: completed_sections?.length || 0,
          sections_total: allSections.length,
          current_section: current_section,
          next_section: next_section || allSections[currentIndex + 1] || 'completed',
          message: `Postup: ${progress.toFixed(0)}% dokončeno`
        };
      }
    })
  ],
  handoffs: [],
});
