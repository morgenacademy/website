/**
 * Decision engine: determines the recommended route based on answers.
 *
 * Levels (groeiladder):
 *   1 = Exploratie & Experimenteren
 *   2 = Tactisch prompten
 *   3 = Herbruikbare flows
 *   4 = Integratie in processen
 *   5 = Maatwerk & Automatisering
 *   6 = Strategische transformatie
 */

const ROUTES = {
  basis: {
    key: 'basis',
    training: 'Basistraining AI',
    duration: '2 uur',
    description: 'Van kennismaking tot de eerste eigen AI-assistent',
    bullets: [
      'Begrijp het AI-landschap — wat het is, wat het kan, en wat bij jullie past',
      'Effectief prompten voor betere resultaten',
      'Iedereen bouwt een eigen AI-assistent (Custom GPT of Gem)',
    ],
    followUp: 'Na de Basistraining staan nieuwe paden open voor jullie team.',
  },
  workflows: {
    key: 'workflows',
    training: 'Workflows & Agents',
    duration: '2 uur',
    description: 'Laat jullie systemen samenwerken — met en zonder AI',
    bullets: [
      'Bouw workflows met Make, n8n of Zapier',
      'Koppel jullie systemen zodat data automatisch stroomt',
      'Leer wanneer je automatisering of agentic AI inzet',
    ],
  },
  toolbuilding: {
    key: 'toolbuilding',
    training: 'Tool Building',
    duration: '2 uur',
    description: 'Bouw eigen tools — van idee naar werkend prototype',
    bullets: [
      'Maak eigen tools met Loveable, Cursor of Antigravity',
      'Van idee naar werkend prototype in een uur',
      'Geen programmeerervaring nodig',
    ],
  },
  team: {
    key: 'team',
    training: 'Team-workshop',
    duration: 'Halve dag — 2 dagdelen',
    description: 'Samen als team jullie werkproces slimmer maken',
    bullets: [
      'Breng als team jullie werkproces in kaart',
      'Ontdek waar AI en automatisering het verschil maken',
      'Ga naar huis met een concreet verbeterplan',
    ],
    followUp: 'Daarna pakken 1-2 mensen uit het team een vervolgtraining op.',
  },
};

export function determineRoute(answers) {
  // Step 1: Determine level
  const hasBuiltAssistant = answers.instructions_saved === 'custom_gpt';
  const usesRegularly =
    answers.ai_usage === 'regular' || answers.ai_usage === 'advanced';
  const isAdvanced = usesRegularly && hasBuiltAssistant;

  // Determine starting level (6-level scale)
  let levelFrom = 1;
  if (answers.ai_usage === 'occasional') levelFrom = 1;
  if (answers.ai_usage === 'regular') levelFrom = 1;
  if (isAdvanced) levelFrom = 2;

  const isTeam = answers.for_whom !== 'myself';

  const goalSignals = {
    aiUsage: answers.ai_usage,
    timeLoss: answers.time_loss,
    impact: answers.desired_impact,
  };

  // Step 2: Beginners always get Basistraining
  if (!isAdvanced) {
    return {
      ...ROUTES.basis,
      levelFrom,
      levelTo: 3,
      isTeam,
      goalSignals,
    };
  }

  // Step 3: Advanced — determine path from goal signals
  const goalMap = {
    copying_data: 'workflows',
    systems_talk: 'workflows',
    manual_work: 'toolbuilding',
    build_tool: 'toolbuilding',
    no_alignment: 'team',
    team_alignment: 'team',
    unknown: 'toolbuilding',
    understand_first: 'toolbuilding',
  };

  // V4 (desired impact) is the stronger signal
  const primary = goalMap[answers.desired_impact] || 'toolbuilding';

  const route = ROUTES[primary];

  // Add follow-up note for exploratory paths routed to toolbuilding
  const isExploratory =
    answers.desired_impact === 'understand_first' ||
    answers.desired_impact === 'unknown';
  const followUp =
    isExploratory && primary === 'toolbuilding'
      ? 'Daarna kun je altijd nog de Workflows & Agents training volgen om het echt in je werkprocessen te integreren.'
      : route.followUp || '';

  return {
    ...route,
    levelFrom: 2,
    levelTo: 5,
    isTeam,
    goalSignals,
    followUp,
  };
}
