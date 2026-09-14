(()=>{
const db=window.ENTRA_ARTICLES||{};
const qs=new URLSearchParams(location.search);
const type=qs.get('type')||'news';
const slug=qs.get('slug')||'';
const item=db[type]?.[slug];
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const back=type==='knowledge'?'entra-knowledge.html':'entra-news.html';
const backLabel=type==='knowledge'?'База знаний':'Новости';
$('article-back').href=back;$('article-back').textContent=backLabel;
if(!item){
  document.title='ENTRA — Материал не найден';
  $('article-title').textContent='Материал не найден';
  $('article-lead').textContent='Ссылка устарела или материал ещё не опубликован.';
  $('article-meta').innerHTML='';
  $('article-body').innerHTML=`<div class="article-error"><h2>Вернуться к списку</h2><p>Выберите другой материал в разделе ${esc(backLabel)}.</p><a class="btn" href="${back}">${esc(backLabel)} →</a></div>`;
  $('article-aside').hidden=true;$('article-related-section').hidden=true;return;
}
document.title=`${item.title} — ENTRA`;
$('article-category').textContent=item.category||backLabel;
$('article-kicker').textContent=type==='knowledge'?'ENTRA · БАЗА ЗНАНИЙ':'ENTRA · НОВОСТИ';
$('article-title').textContent=item.title;
$('article-lead').textContent=item.lead||'';
const meta=[];
if(type==='news'&&item.date)meta.push(item.date);
if(type==='knowledge'&&item.updated)meta.push(item.updated);
if(item.category)meta.push(item.category);
$('article-meta').innerHTML=meta.map(x=>`<span>${esc(x)}</span>`).join('');
let html='';
if(type==='news'&&item.image)html+=`<img class="article-cover" src="${esc(item.image)}" alt="">`;
html+=item.html||'';
$('article-body').innerHTML=html;
// Build table of contents from rendered h2 headings.
const heads=[...$('article-body').querySelectorAll('h2')];
heads.forEach((h,i)=>{if(!h.id)h.id=`section-${i+1}`;});
const toc=$('article-toc');
toc.innerHTML=heads.map(h=>`<a href="#${h.id}">${esc(h.textContent)}</a>`).join('');
$('article-toc-card').hidden=heads.length===0;
// Related materials: first three other items of the same type.
const others=Object.entries(db[type]||{}).filter(([key])=>key!==slug).slice(0,3);
$('related-heading').textContent=type==='knowledge'?'Другие инструкции':'Другие новости';
$('article-related').innerHTML=others.map(([key,x])=>`<a class="related-card" href="entra-article.html?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(key)}"><span>${esc(x.category||backLabel)}</span><strong>${esc(x.title)}</strong><i>Подробнее →</i></a>`).join('');
})();
