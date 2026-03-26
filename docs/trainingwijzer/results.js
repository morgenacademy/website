import { renderGroeiladder } from './groeiladder.js';

/**
 * Renders the result screen based on the determined route.
 */
export function renderResult(route) {
  // Individual path → online trainingen
  if (!route.isTeam) {
    return renderIndividualResult(route);
  }

  const ladder = renderGroeiladder(route.levelFrom, route.levelTo);
  const teamNote = getTeamNote(route.key);
  const followUp = route.followUp || '';
  const followUpPaths = route.key === 'basis' ? renderFollowUpPaths() : '';

  const rationale = renderRationale(route);

  return `
    <div class="screen result-screen active">
      <div class="result-header">
        <div class="result-label">Jullie route</div>
        <h1 class="result-title">${route.training}</h1>
        <p class="result-description">${route.description}</p>
      </div>

      ${rationale}

      <div class="result-body">
        <div class="result-main">
          <div class="training-card">
            <div class="training-card-header">
              <h3 class="training-name">${route.training}</h3>
              <span class="training-duration">${route.duration}</span>
            </div>
            <ul class="training-bullets">
              ${route.bullets.map((b) => `<li>${b}</li>`).join('')}
            </ul>
            ${teamNote ? `<div class="team-note">${teamNote}</div>` : ''}
            ${followUp ? `<div class="follow-up-note">${followUp}</div>` : ''}

            <div class="training-cta">
              <a href="javascript:void(0)" onclick="scrollToId('ac-trainingen')" class="btn btn-primary">Bekijk incompany trainingen</a>
              <a href="javascript:void(0)" onclick="openTrainingPopup('${route.key === 'team' ? 'teamworkshop' : route.key}')" class="btn btn-secondary">Meer over deze training</a>
              <a href="mailto:totmorgen@morgenacademy.nl" class="btn btn-secondary">Stuur ons een bericht</a>
            </div>
          </div>
        </div>

        <div class="result-ladder">
          ${ladder}
        </div>
      </div>

      ${followUpPaths}

      <button class="restart-link" data-action="restart">Opnieuw beginnen</button>
    </div>
  `;
}

function renderIndividualResult(route) {
  return `
    <div class="screen result-screen active">
      <div class="result-header">
        <h1 class="result-title">Goed nieuws!</h1>
        <p class="result-description">
          We hebben online trainingen waar je als individu direct mee aan de slag kunt.
        </p>
      </div>

      <div class="result-rationale">
        <p>
          Onze incompany trainingen zijn gericht op teams en organisaties.
          Maar we bieden ook online trainingen aan waarmee je op je eigen tempo kunt leren.
        </p>
      </div>

      <div class="result-cta result-cta-centered">
        <a href="javascript:void(0)" onclick="goToAcademy('online')" class="btn btn-primary">Bekijk online trainingen op Morgen Academy</a>
        <a href="javascript:void(0)" onclick="openTrainingPopup('basis')" class="btn btn-secondary">Meer over de basistraining</a>
        <a href="mailto:totmorgen@morgenacademy.nl" class="btn btn-secondary">Stuur ons een bericht</a>
      </div>

      <button class="restart-link" data-action="restart">Opnieuw beginnen</button>
    </div>
  `;
}

function renderRationale(route) {
  const signals = route.goalSignals;
  if (!signals) return '';

  // Opening: reflect where the team stands with AI
  const levelOpeners = {
    none: 'Jullie team heeft nog niet echt met AI gewerkt',
    occasional: 'In jullie team wordt af en toe AI gebruikt',
    regular: 'Jullie team gebruikt AI al regelmatig',
    advanced: 'Jullie team heeft al een sterke basis met AI',
  };
  const opener = levelOpeners[signals.aiUsage] || '';

  // Bridge: connect their pain point to the recommendation
  const bridges = {
    // Basis route bridges (based on time_loss)
    'basis:copying_data': 'en er gaat tijd verloren aan repetitief werk. In de Basistraining leren jullie AI écht voor je laten werken — en bouwen jullie een eigen assistent die niet elke keer opnieuw hoeft te horen wat je doet.',
    'basis:manual_work': 'en er is werk dat slimmer zou moeten kunnen. De Basistraining brengt jullie van "af en toe een vraag stellen" naar AI die écht voor jullie werkt — met meer vertrouwen en betere resultaten.',
    'basis:no_alignment': 'en iedereen doet het op zijn eigen manier. De Basistraining geeft jullie team dezelfde stevige basis, zodat AI iets vertrouwds wordt waar jullie elke dag mee willen werken.',
    'basis:unknown': 'en jullie willen ontdekken waar de kansen liggen. In de Basistraining ervaren jullie hoe krachtig AI is als je het goed inzet — en gaan jullie naar huis met een eigen assistent.',
    // Workflows bridges (based on desired_impact)
    'workflows:systems_talk': 'en jullie willen dat de systemen automatisch met elkaar praten. Daar is de Workflows & Agents training precies voor gemaakt.',
    'workflows:copying_data': 'en er gaat tijd verloren aan het kopiëren tussen systemen. Met workflows automatiseren jullie die datastromen.',
    // Toolbuilding bridges
    'toolbuilding:build_tool': 'en jullie willen een handig tooltje bouwen voor iets dat nu handmatig gaat. In de Tool Building training bouwen jullie dat prototype.',
    'toolbuilding:manual_work': 'en er is handmatig werk dat slimmer kan. Met Tool Building maken jullie daar zelf een oplossing voor.',
    'toolbuilding:understand_first': 'en jullie willen eerst ontdekken wat er allemaal mogelijk is. In de Tool Building training ervaar je dat door zelf iets te bouwen — en krijg je direct dat wauw-gevoel van wat AI kan.',
    'toolbuilding:unknown': 'en jullie willen ontdekken waar de kansen liggen. Door zelf een prototype te bouwen zie je direct wat er mogelijk is. Daarna kunnen jullie altijd nog de Workflows & Agents training volgen om het echt in de werkprocessen te integreren.',
    // Team bridges
    'team:team_alignment': 'en jullie willen dat het hele team dezelfde slimme werkwijze gebruikt. De Team-workshop helpt jullie dat samen vorm te geven.',
    'team:no_alignment': 'en iedereen doet het op zijn eigen manier. In de Team-workshop brengen jullie daar samen lijn in.',
  };

  // Try primary bridge (route + desired_impact), fallback to route + time_loss
  const bridge =
    bridges[`${route.key}:${signals.impact}`] ||
    bridges[`${route.key}:${signals.timeLoss}`] ||
    '';

  if (!opener || !bridge) return '';

  return `
    <div class="result-rationale">
      <p>${opener}, ${bridge}</p>
    </div>
  `;
}

function getTeamNote(routeKey) {
  switch (routeKey) {
    case 'basis':
      return 'We raden aan de Basistraining te combineren met een Team-workshop, zodat jullie als team de vertaalslag maken.';
    case 'workflows':
    case 'toolbuilding':
      return 'Voor jullie team raden we ook een Team-workshop aan, zodat iedereen dezelfde basis heeft.';
    case 'team':
      return '';
    default:
      return '';
  }
}

function renderFollowUpPaths() {
  const paths = [
    {
      title: 'Workflows & Agents',
      desc: 'Automatiseer processen tussen jullie systemen',
      popupKey: 'workflows',
    },
    {
      title: 'Tool Building',
      desc: 'Bouw eigen tools voor het team',
      popupKey: 'toolbuilding',
    },
    {
      title: 'Team-workshop',
      desc: 'Pak als team jullie werkproces aan',
      popupKey: 'teamworkshop',
    },
  ];

  return `
    <div class="follow-up-paths">
      <p class="follow-up-intro">Na de Basistraining staan deze paden open:</p>
      <div class="follow-up-cards">
        ${paths
          .map(
            (p) => `
          <div class="follow-up-card" onclick="openTrainingPopup('${p.popupKey}')" style="cursor:pointer">
            <div class="follow-up-card-title">${p.title}</div>
            <div class="follow-up-card-desc">${p.desc}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}
