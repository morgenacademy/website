import fs from 'node:fs/promises';

const RSS_URL = 'https://anchor.fm/s/10c5e5be8/podcast/rss';
const INDEX_PATH = new URL('../index.html', import.meta.url);
const MAX_EPISODES = 4;
const SPOTIFY_EPISODE_URLS = {
  4: 'https://open.spotify.com/episode/1dY7uU6xHQrcWKQQI3nhNw',
  3: 'https://open.spotify.com/episode/791EAnMDi47iWF8vKCIEPJ',
  2: 'https://open.spotify.com/episode/59nYYt9rq3PcSzXipqDiqp',
  1: 'https://open.spotify.com/episode/4SllA9u9JuDTDrs1DfAngD',
};
const EPISODE_TITLE_OVERRIDES = {
  2: 'Van idee naar prototype in 10 minuten',
  1: 'Wat nodig is voor echte AI-adoptie',
};

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractTag(item, tagName) {
  const match = item.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`));
  return match ? stripHtml(match[1]) : '';
}

function extractEpisodeNumber(title) {
  const match = title.match(/^#(\d+)/);
  return match ? Number(match[1]) : null;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(value));
}

function formatDuration(value) {
  const parts = value.split(':').map((part) => Number.parseInt(part, 10));
  const minutes = parts.length === 3 ? parts[0] * 60 + parts[1] : parts[0];
  return `${minutes} min`;
}

function summarize(text) {
  const firstSentence = text.match(/^(.+?[.!?])\s/);
  const summary = firstSentence ? firstSentence[1] : text;
  return summary.length > 155 ? `${summary.slice(0, 152).trim()}...` : summary;
}

function truncate(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3).trim()}...` : value;
}

function cleanTitle(title) {
  return title.replace(/^#\d+\s*-\s*/, '').trim();
}

function parseEpisodes(rss) {
  return [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, MAX_EPISODES)
    .map(([, item]) => {
      const title = extractTag(item, 'title');
      const episodeNumber = extractEpisodeNumber(title);
      const duration = extractTag(item, 'itunes:duration');
      return {
        episodeNumber,
        title: EPISODE_TITLE_OVERRIDES[episodeNumber] || truncate(cleanTitle(title), 64),
        description: summarize(extractTag(item, 'description')),
        date: formatDate(extractTag(item, 'pubDate')),
        duration: duration ? formatDuration(duration) : '',
        href: SPOTIFY_EPISODE_URLS[episodeNumber] || extractTag(item, 'link'),
      };
    });
}

function renderEpisodes(episodes) {
  return episodes
    .map((episode) => `        <a class="episode-row" href="${escapeHtml(episode.href)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
          <span>#${episode.episodeNumber} &#183; ${escapeHtml(episode.date)} &#183; ${escapeHtml(episode.duration)}</span>
          <strong>${escapeHtml(episode.title)}</strong>
          <em>${escapeHtml(episode.description)}</em>
        </a>`)
    .join('\n');
}

const response = await fetch(RSS_URL);
if (!response.ok) {
  throw new Error(`Could not fetch podcast RSS: ${response.status} ${response.statusText}`);
}

const rss = await response.text();
const episodes = parseEpisodes(rss);
if (episodes.length === 0) {
  throw new Error('No podcast episodes found in RSS feed.');
}

const indexHtml = await fs.readFile(INDEX_PATH, 'utf8');
const start = '        <!-- podcast-episodes:start -->';
const end = '        <!-- podcast-episodes:end -->';
const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
const replacement = `${start}\n${renderEpisodes(episodes)}\n${end}`;

if (!pattern.test(indexHtml)) {
  throw new Error('Podcast episode markers not found in index.html.');
}

await fs.writeFile(INDEX_PATH, indexHtml.replace(pattern, replacement));
console.log(`Updated ${episodes.length} podcast episodes in index.html.`);
