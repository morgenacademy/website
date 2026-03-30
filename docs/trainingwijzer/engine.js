const OFFERS = {
  online_basis: {
    key: 'online_basis',
    popupKey: 'basis',
    training: 'Online basistraining AI',
    startTypeLabel: 'Online training',
    sectionLabel: 'Online aanbod',
    sectionTarget: 'ac-aanvraag',
    duration: 'Direct starten',
    description: 'De laagdrempelige individuele instap om direct zelf met AI aan de slag te gaan.',
    bullets: [
      'Werk op je eigen tempo aan je AI-basis',
      'Direct toepasbaar in je eigen werk',
      'Logische opstap naar een teamtraining of incompany sessie',
    ],
    levelTo: 3,
    external: true,
  },
  basis: {
    key: 'basis',
    popupKey: 'basis',
    training: 'Basistraining AI',
    startTypeLabel: 'Losse training',
    sectionLabel: 'Losse trainingen',
    sectionTarget: 'ac-trainingen',
    duration: '2 uur',
    description: 'De snelste en meest laagdrempelige teamtraining om dezelfde AI-basis te leggen.',
    bullets: [
      'Begrijp wat AI is, wat het kan en hoe je er veilig mee werkt',
      'Leer effectief prompten voor betere resultaten',
      'Bouw een eerste assistent die direct bruikbaar is in jullie werk',
    ],
    levelTo: 3,
  },
  teamworkshop: {
    key: 'teamworkshop',
    popupKey: 'teamworkshop',
    training: 'Team-workshop',
    startTypeLabel: 'Losse training',
    sectionLabel: 'Losse trainingen',
    sectionTarget: 'ac-trainingen',
    duration: 'Halve dag',
    description: 'Voor teams die vooral lijn, procesinzicht en gezamenlijke keuzes nodig hebben.',
    bullets: [
      'Breng samen processen, pijnpunten en kansen in kaart',
      'Kies waar AI wel en niet waarde toevoegt',
      'Ga naar huis met een concreet verbeterplan voor het team',
    ],
    levelTo: 4,
  },
  workflows: {
    key: 'workflows',
    popupKey: 'workflows',
    training: 'Workflows & Agents',
    startTypeLabel: 'Losse training',
    sectionLabel: 'Losse trainingen',
    sectionTarget: 'ac-trainingen',
    duration: '2 uur',
    description: 'Voor teams die al een basis hebben en minder handwerk tussen systemen willen.',
    bullets: [
      'Bouw workflows met Make, n8n of Zapier',
      'Laat systemen en data automatisch met elkaar praten',
      'Leer wanneer automatisering of agentic AI de slimste keuze is',
    ],
    levelTo: 5,
  },
  toolbuilding: {
    key: 'toolbuilding',
    popupKey: 'toolbuilding',
    training: 'Tool Building',
    startTypeLabel: 'Losse training',
    sectionLabel: 'Losse trainingen',
    sectionTarget: 'ac-trainingen',
    duration: '2 uur',
    description: 'Voor teams die een eigen tool, prototype of assistent willen bouwen.',
    bullets: [
      'Maak een eerste werkend prototype in de sessie',
      'Werk met tools als Lovable, Cursor of Replit',
      'Ontdek wat je zelf kunt bouwen zonder programmeerervaring',
    ],
    levelTo: 5,
  },
  managers: {
    key: 'managers',
    popupKey: 'managers',
    training: 'Mini masterclass AI voor managers',
    startTypeLabel: 'Masterclass',
    sectionLabel: 'Masterclasses',
    sectionTarget: 'ac-verdiepen',
    duration: '1 dag',
    description: 'Een compacte deep dive voor managementteams die koers, kaders en prioriteiten willen bepalen.',
    bullets: [
      'Vertaal AI naar leiderschap, prioriteiten en besluitvorming',
      'Bespreek kansen, risico’s en AI Act-verantwoordelijkheid',
      'Kies een logisch vervolg voor team, management of organisatie',
    ],
    levelTo: 5,
  },
  masterclass: {
    key: 'masterclass',
    popupKey: 'masterclass',
    training: 'Masterclass AI voor voorlopers',
    startTypeLabel: 'Masterclass',
    sectionLabel: 'Masterclasses',
    sectionTarget: 'ac-verdiepen',
    duration: '4 dagen',
    description: 'Voor een selecte groep kartrekkers die cases, processen en implementatie samen wil uitdiepen.',
    bullets: [
      'Werk van kans en value case naar concrete oplossing',
      'Combineer procesdenken, tooling en implementatie',
      'Bouw draagvlak en eigenaarschap voor het vervolg',
    ],
    levelTo: 6,
  },
  chancesession: {
    key: 'chancesession',
    popupKey: 'chancesession',
    training: 'AI-kansensessie',
    startTypeLabel: 'Begeleide sessie',
    sectionLabel: 'Begeleiding',
    sectionTarget: 'ac-begeleiding',
    duration: '90 min - halve dag',
    description: 'Voor organisaties die eerst scherp willen krijgen waar de meeste winst zit en wat de slimste route is.',
    bullets: [
      'Breng processen, knelpunten en ambitie scherp in kaart',
      'Kies de slimste eerste stap: training, masterclass of traject',
      'Krijg concreet vervolgadvies dat past bij jullie situatie',
    ],
    levelTo: 4,
  },
};

const audienceLabels = {
  team: 'Team of organisatie',
  management: 'Managementteam',
  pioneers: 'Kleine voorlopersgroep',
  organization: 'Organisatievraagstuk',
  myself: 'Individueel',
};

function getLevelFrom(aiUsage) {
  switch (aiUsage) {
    case 'regular':
      return 2;
    case 'advanced':
      return 3;
    case 'none':
    case 'occasional':
    default:
      return 1;
  }
}

function cloneOffer(key, answers, overrides = {}) {
  const offer = OFFERS[key];
  return {
    ...offer,
    ...overrides,
    audienceLabel: audienceLabels[answers.for_whom] || 'Team of organisatie',
    isTeam: answers.for_whom !== 'myself',
    levelFrom: overrides.levelFrom ?? getLevelFrom(answers.ai_usage),
    levelTo: overrides.levelTo ?? offer.levelTo,
  };
}

function makeNextPath(popupKey, title, desc) {
  return { popupKey, title, desc };
}

function buildBasisRoute(answers) {
  const desired = answers.desired_impact;
  let followUp =
    'Na deze training kunnen jullie gericht door naar een vervolg dat past bij jullie echte vraagstuk.';
  let nextPaths = [
    makeNextPath('teamworkshop', 'Team-workshop', 'Breng proces, lijn en eigenaarschap samen in kaart'),
    makeNextPath('workflows', 'Workflows & Agents', 'Automatiseer handwerk tussen systemen'),
    makeNextPath('toolbuilding', 'Tool Building', 'Bouw een eerste eigen tool of prototype'),
  ];

  if (desired === 'systems_talk') {
    followUp =
      'Jullie willen uiteindelijk minder handwerk tussen systemen. Leg eerst de basis en pak daarna Workflows & Agents erbij.';
    nextPaths = [
      makeNextPath('workflows', 'Workflows & Agents', 'De logische vervolgstap zodra de basis staat'),
      makeNextPath('teamworkshop', 'Team-workshop', 'Zorg dat het hele team dezelfde werkwijze kiest'),
    ];
  }

  if (desired === 'build_tool') {
    followUp =
      'Jullie willen uiteindelijk een eigen tool of assistent bouwen. Start laagdrempelig en stap daarna in Tool Building.';
    nextPaths = [
      makeNextPath('toolbuilding', 'Tool Building', 'Bouw daarna een werkend prototype'),
      makeNextPath('teamworkshop', 'Team-workshop', 'Koppel het bouwen aan een slim proces'),
    ];
  }

  if (desired === 'roadmap') {
    followUp =
      'Na de basis is het slim om teamafspraken en proceskeuzes te maken, zodat AI niet bij losse experimenten blijft.';
    nextPaths = [
      makeNextPath('teamworkshop', 'Team-workshop', 'Breng lijn en eigenaarschap in het team'),
      makeNextPath('managers', 'Mini masterclass', 'Betrek management bij koers en prioriteiten'),
    ];
  }

  return cloneOffer('basis', answers, {
    why:
      'Jullie willen laagdrempelig starten en eerst zorgen dat mensen in het team dezelfde basis hebben. Dan is een losse training de slimste eerste stap, en Basistraining AI de meest logische keuze.',
    followUp,
    nextPaths,
  });
}

function buildChanceRoute(answers) {
  let nextPaths = [
    makeNextPath('basis', 'Basistraining AI', 'Als er eerst een brede teambasis nodig is'),
    makeNextPath('managers', 'Mini masterclass', 'Als management eerst richting en kaders moet bepalen'),
    makeNextPath('masterclass', '4-daagse masterclass', 'Als een kleine groep direct wil doorpakken'),
  ];

  if (answers.for_whom === 'team') {
    nextPaths = [
      makeNextPath('teamworkshop', 'Team-workshop', 'Als proces, lijn en teamafstemming centraal staan'),
      makeNextPath('workflows', 'Workflows & Agents', 'Als systemen slimmer moeten samenwerken'),
      makeNextPath('toolbuilding', 'Tool Building', 'Als er een eigen tool of prototype moet komen'),
    ];
  }

  return cloneOffer('chancesession', answers, {
    why:
      'Jullie vraag zit nu nog vóór de trainingskeuze. Eerst scherp krijgen waar de meeste winst zit voorkomt dat je te vroeg in een standaardvorm stapt die niet past bij jullie echte behoefte.',
    followUp:
      'De kansensessie eindigt niet met losse inspiratie, maar met een concreet advies over welke training, masterclass of begeleiding logisch is.',
    nextPaths,
  });
}

function buildManagementRoute(answers) {
  return cloneOffer('managers', answers, {
    why:
      'Management heeft nu vooral richting nodig: waar zit waarde, welke risico’s zijn echt, wat vraagt dit van leiderschap en welke vervolgstap past bij de organisatie? Daarom is een compacte masterclass hier slimmer dan meteen een losse vaardigheidstraining.',
    followUp:
      'Vanuit deze sessie kun je gericht kiezen voor een teamtraining, een kansensessie of een verdiepend programma voor een kleine groep.',
    nextPaths: [
      makeNextPath('chancesession', 'AI-kansensessie', 'Breng organisatiebrede kansen en prioriteiten scherp in kaart'),
      makeNextPath('masterclass', '4-daagse masterclass', 'Ga met een kleine groep verdiepend aan de slag'),
      makeNextPath('basis', 'Basistraining AI', 'Zet daarna de brede teambasis neer'),
    ],
  });
}

function buildMasterclassRoute(answers) {
  return cloneOffer('masterclass', answers, {
    why:
      'Jullie willen niet alleen iets leren, maar met een kleine groep echt doorpakken op case, proces, implementatie en draagvlak. Dan past een masterclass beter dan een losse training.',
    followUp:
      'Na de masterclass is vaak een begeleid implementatietraject of een gerichte vervolgtraining logisch om het verder te laten landen.',
    nextPaths: [
      makeNextPath('chancesession', 'AI-kansensessie', 'Koppel de inzichten aan een bredere organisatiekeuze'),
      makeNextPath('workflows', 'Workflows & Agents', 'Verdiep op procesautomatisering'),
      makeNextPath('toolbuilding', 'Tool Building', 'Bouw een concreet prototype of interne tool'),
    ],
  });
}

function buildTeamWorkshopRoute(answers) {
  const nextPaths =
    answers.desired_impact === 'systems_talk'
      ? [
          makeNextPath('workflows', 'Workflows & Agents', 'Automatiseer daarna de processen die jullie kiezen'),
          makeNextPath('basis', 'Basistraining AI', 'Geef het hele team dezelfde basis in gebruik'),
        ]
      : answers.desired_impact === 'build_tool'
        ? [
            makeNextPath('toolbuilding', 'Tool Building', 'Ga daarna een eerste prototype bouwen'),
            makeNextPath('basis', 'Basistraining AI', 'Leg eerst de brede teambasis waar nodig'),
          ]
        : [
            makeNextPath('basis', 'Basistraining AI', 'Zorg dat iedereen dezelfde taal en basis heeft'),
            makeNextPath('workflows', 'Workflows & Agents', 'Koppel proceskeuzes aan automatisering'),
          ];

  return cloneOffer('teamworkshop', answers, {
    why:
      'De vraag zit nu minder in losse AI-skills en meer in proces, lijn en eigenaarschap. Daarom is de Team-workshop de slimste eerste stap: samen kiezen wat slimmer moet en wat daar wel of niet bij helpt.',
    followUp:
      'Vanuit deze workshop kunnen 1 of 2 kartrekkers veel gerichter door naar een bouw- of automatiseringstraining.',
    nextPaths,
  });
}

function buildWorkflowRoute(answers) {
  return cloneOffer('workflows', answers, {
    why:
      'Jullie gebruiken AI al vaker en de grootste winst zit in minder handwerk tussen systemen. Dan is Workflows & Agents de juiste losse training: concreet genoeg om iets werkends neer te zetten, zonder meteen een heel traject te starten.',
    followUp:
      'Na deze training kun je het automatiseringswerk verder uitbouwen of koppelen aan begeleiding voor implementatie en borging.',
    nextPaths: [
      makeNextPath('teamworkshop', 'Team-workshop', 'Breng ook teamafspraken en proceskeuzes in lijn'),
      makeNextPath('masterclass', '4-daagse masterclass', 'Verdiep met een kleine groep op implementatie'),
    ],
  });
}

function buildToolRoute(answers) {
  return cloneOffer('toolbuilding', answers, {
    why:
      'Jullie willen niet alleen beter prompten, maar echt iets bouwen. Omdat er al voldoende basis is, is Tool Building de slimste eerste stap om snel van idee naar prototype te gaan.',
    followUp:
      'Als het prototype werkt, volgt vaak de vraag hoe je het borgt, opschaalt of verbindt met andere processen en systemen.',
    nextPaths: [
      makeNextPath('masterclass', '4-daagse masterclass', 'Verdiep op implementatie en opschaling'),
      makeNextPath('chancesession', 'AI-kansensessie', 'Bepaal hoe dit past in een bredere route'),
    ],
  });
}

export function determineRoute(answers) {
  const levelFrom = getLevelFrom(answers.ai_usage);

  if (answers.for_whom === 'myself') {
    return cloneOffer('online_basis', answers, {
      why:
        'Je zoekt een laagdrempelige individuele instap. Dan is het slimmer om direct online te starten dan een incompany route te kiezen die voor teams bedoeld is.',
      followUp:
        'Wil je later met een team verder, dan kun je altijd nog door naar een losse training of incompany sessie.',
      nextPaths: [],
      levelFrom,
    });
  }

  if (answers.for_whom === 'organization' || answers.need_now === 'clarity') {
    return buildChanceRoute(answers);
  }

  if (answers.for_whom === 'management' || answers.desired_impact === 'roadmap') {
    return buildManagementRoute(answers);
  }

  if (answers.for_whom === 'pioneers') {
    if (answers.ai_usage === 'none' && answers.need_now === 'skills') {
      return buildBasisRoute(answers);
    }
    if (answers.desired_impact === 'explore') {
      return buildChanceRoute(answers);
    }
    return buildMasterclassRoute(answers);
  }

  if (answers.need_now === 'alignment') {
    return buildTeamWorkshopRoute(answers);
  }

  if (answers.need_now === 'build') {
    if (answers.desired_impact === 'systems_talk') {
      return levelFrom >= 2 ? buildWorkflowRoute(answers) : buildBasisRoute(answers);
    }
    if (answers.desired_impact === 'build_tool') {
      return levelFrom >= 2 ? buildToolRoute(answers) : buildBasisRoute(answers);
    }
  }

  if (answers.need_now === 'skills') {
    return buildBasisRoute(answers);
  }

  if (answers.desired_impact === 'systems_talk') {
    return levelFrom >= 2 ? buildWorkflowRoute(answers) : buildBasisRoute(answers);
  }

  if (answers.desired_impact === 'build_tool') {
    return levelFrom >= 2 ? buildToolRoute(answers) : buildBasisRoute(answers);
  }

  return buildBasisRoute(answers);
}
