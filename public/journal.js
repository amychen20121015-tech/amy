function initializeJournal() {
const filters=document.querySelectorAll('[data-filter]');const articles=document.querySelectorAll('[data-category]');filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button))});let count=0;articles.forEach(article=>{article.hidden=button.dataset.filter!=='all'&&article.dataset.category!==button.dataset.filter;if(!article.hidden)count++});document.querySelector('.filter-count').textContent=`顯示 ${count} 篇手札`}));

}
if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initializeJournal, { once: true }); } else { initializeJournal(); }
