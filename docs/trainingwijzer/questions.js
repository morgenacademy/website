export const questions = [
  {
    id: 'ai_usage',
    question: 'Hoe ver is jullie team met AI?',
    options: [
      { id: 'none', label: 'De meesten hebben er nog niet echt mee gewerkt' },
      { id: 'occasional', label: 'Sommigen stellen af en toe een vraag aan ChatGPT of Gemini' },
      { id: 'regular', label: 'Er wordt regelmatig mee gewerkt, maar ieder op zijn eigen manier' },
      { id: 'advanced', label: 'Er zijn al eigen GPTs of Gems ingericht die dagelijks gebruikt worden' },
    ],
  },
  {
    id: 'instructions_saved',
    question: 'Zijn er al vaste AI-instructies of templates vastgelegd?',
    options: [
      { id: 'no', label: 'Nee, iedereen begint steeds opnieuw' },
      { id: 'template', label: 'Ja, er zijn templates of vaste prompts' },
      { id: 'custom_gpt', label: 'Ja, er zijn eigen GPTs of Gems gemaakt' },
    ],
  },
  {
    id: 'time_loss',
    question: 'Waar gaat bij jullie de meeste tijd verloren?',
    options: [
      { id: 'copying_data', label: 'Steeds dezelfde informatie overtypen of kopiëren tussen systemen' },
      { id: 'manual_work', label: 'Handmatig werk dat eigenlijk slimmer zou moeten kunnen' },
      { id: 'no_alignment', label: 'Iedereen doet dingen op zijn eigen manier, weinig lijn in' },
      { id: 'unknown', label: 'We weten niet precies waar de kansen liggen' },
    ],
  },
  {
    id: 'desired_impact',
    question: 'Wat zou de meeste impact hebben voor jullie organisatie?',
    options: [
      { id: 'systems_talk', label: 'Als onze systemen automatisch met elkaar zouden praten' },
      { id: 'build_tool', label: 'Als er een handig tooltje was voor iets dat we nu handmatig doen' },
      { id: 'team_alignment', label: 'Als het hele team dezelfde slimme werkwijze zou gebruiken' },
      { id: 'understand_first', label: 'Als we eerst zouden begrijpen wat er allemaal mogelijk is' },
    ],
  },
  {
    id: 'for_whom',
    question: 'Is dit voor jou persoonlijk, of voor je team?',
    options: [
      { id: 'team', label: 'Voor mijn team of organisatie' },
      { id: 'myself', label: 'Voor mezelf' },
    ],
  },
];
