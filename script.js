async function loadEpisodes() {
  const container = document.getElementById('episode-list');
  const updatedEl = document.getElementById('updated-at');

  try {
    const res = await fetch('data/episodes.json?_=' + Date.now());
    const data = await res.json();

    updatedEl.textContent = data.updatedAt
      ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}`
      : 'Waiting for the first automatic update…';

    if (!data.episodes || data.episodes.length === 0) {
      container.innerHTML = '<p class="loading">No episodes yet — run the update workflow once to populate this page.</p>';
      return;
    }

    container.innerHTML = data.episodes.map((ep, i) => `
      <article class="card" style="--i:${i}">
        ${ep.showArt ? `<img src="${ep.showArt}" alt="${escapeHtml(ep.show)}" class="art">` : ''}
        <div class="card-body">
          <h2>${escapeHtml(ep.title)}</h2>
          <p class="show">${escapeHtml(ep.show)}</p>
          <p class="meta">${ep.pubDate ? new Date(ep.pubDate).toLocaleDateString() : ''}${ep.duration ? ' • ' + escapeHtml(ep.duration) : ''}</p>
          <p class="desc">${escapeHtml(ep.description || '')}</p>
          ${ep.audioUrl ? `<audio controls src="${ep.audioUrl}"></audio>` : ''}
          ${ep.link ? `<a class="link" href="${ep.link}" target="_blank" rel="noopener">View episode ↗</a>` : ''}
        </div>
      </article>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="loading">Could not load episodes. Please try again shortly.</p>';
    console.error(err);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

loadEpisodes();
