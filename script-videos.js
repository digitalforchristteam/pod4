async function loadVideos() {
  const container = document.getElementById('video-list');
  const updatedEl = document.getElementById('updated-at');

  try {
    const res = await fetch('data/videos.json?_=' + Date.now());
    const data = await res.json();

    updatedEl.textContent = data.updatedAt
      ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}`
      : 'Waiting for the first automatic update…';

    if (!data.videos || data.videos.length === 0) {
      container.innerHTML = '<p class="loading">No videos yet — run the update workflow once to populate this page.</p>';
      return;
    }

    container.innerHTML = data.videos.map((v, i) => `
      <article class="card" style="--i:${i}">
        <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" rel="noopener" class="thumb-wrap">
          ${v.thumbnail ? `<img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" class="art video-thumb">` : ''}
          ${v.durationSeconds ? `<span class="duration-badge">${formatDuration(v.durationSeconds)}</span>` : ''}
        </a>
        <div class="card-body">
          <h2>${escapeHtml(v.title)}</h2>
          <p class="show">${escapeHtml(v.channelTitle)}${v.subscriberCountDisplay ? ` • ${v.subscriberCountDisplay} subs` : ''}</p>
          <p class="meta">${v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : ''}${v.viewCountDisplay ? ` • ${v.viewCountDisplay} views` : ''}</p>
          <p class="desc">${escapeHtml(v.description || '')}</p>
          <a class="link" href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" rel="noopener">Watch on YouTube ↗</a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="loading">Could not load videos. Please try again shortly.</p>';
    console.error(err);
  }
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

loadVideos();
