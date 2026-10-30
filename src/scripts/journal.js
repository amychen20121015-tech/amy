function initializeJournal() {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const articles = [...document.querySelectorAll('[data-category]')];
  const counter = document.querySelector('.filter-count');
  if (!filters.length || !counter) return;
  let category = 'all';
  let page = 1;
  const pageSize = 6;
  const pagination = document.createElement('nav');
  pagination.className = 'journal-pagination';
  pagination.setAttribute('aria-label', '文章分頁');
  counter.after(pagination);
  counter.setAttribute('aria-live', 'polite');
  function render() {
    const matches = articles.filter(article => category === 'all' || article.dataset.category === category);
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, pages);
    const visible = new Set(matches.slice((page - 1) * pageSize, page * pageSize));
    articles.forEach(article => { article.hidden = !visible.has(article); });
    filters.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    counter.textContent = `顯示 ${visible.size} 篇手札，共 ${matches.length} 篇・第 ${page} / ${pages} 頁`;
    pagination.replaceChildren();
    pagination.hidden = pages <= 1;
    function addButton(label, target, disabled, current = false) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => {
        page = target;
        render();
        document.querySelector('#journal')?.scrollIntoView({ block: 'start' });
        pagination.querySelector('[aria-current="page"]')?.focus({ preventScroll: true });
      });
      pagination.append(button);
    }
    addButton('上一頁', page - 1, page === 1);
    for (let number = 1; number <= pages; number++) addButton(String(number), number, false, number === page);
    addButton('下一頁', page + 1, page === pages);
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    page = 1;
    render();
  }));
  render();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeJournal, { once: true });
} else {
  initializeJournal();
}
