
let searchIndex = null;

async function loadSearchIndex() {
  if (!searchIndex) {
    try {
      const depth = window.location.pathname.includes('/concepts/') ||
                    window.location.pathname.includes('/entities/') ||
                    window.location.pathname.includes('/relations/') ||
                    window.location.pathname.includes('/sources/') ? '../' : './';
      const res = await fetch(depth + 'search-index.json');
      searchIndex = await res.json();
    } catch (e) {
      console.warn('Failed to load search index', e);
    }
  }
  return searchIndex || [];
}

const input = document.getElementById('wikiSearchInput');
const resultsBox = document.getElementById('searchResults');

if (input && resultsBox) {
  input.addEventListener('input', async (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) {
      resultsBox.hidden = true;
      resultsBox.innerHTML = '';
      return;
    }

    const index = await loadSearchIndex();
    const depth = window.location.pathname.includes('/concepts/') ||
                  window.location.pathname.includes('/entities/') ||
                  window.location.pathname.includes('/relations/') ||
                  window.location.pathname.includes('/sources/') ? '../' : './';

    const matches = index.filter(item => {
      return item.title.toLowerCase().includes(q) ||
             (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
             item.group.toLowerCase().includes(q);
    }).slice(0, 10);

    if (matches.length === 0) {
      resultsBox.innerHTML = '<div class="search-item" style="color:var(--muted)">Нічого не знайдено / No results</div>';
      resultsBox.hidden = false;
      return;
    }

    resultsBox.innerHTML = matches.map(item => `
      <a href="${depth}${item.url}" class="search-item">
        <div class="search-item-title">${item.title}</div>
        <div style="font-size:0.75rem; color:var(--muted)">[${item.lang.toUpperCase()}] ${item.group}</div>
      </a>
    `).join('');
    resultsBox.hidden = false;
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.hidden = true;
    }
  });
}
