const searchForm=document.getElementById('domain-search');
const domainInput=document.getElementById('domain-input');
const result=document.getElementById('domain-result');
const resultDomain=document.getElementById('result-domain');
const resultLabel=document.getElementById('result-label');
const resultPrice=document.getElementById('result-price');
const resultAction=document.getElementById('result-action');
const whoisPrivacy=document.getElementById('whois-privacy');
const whoisOptionState=document.getElementById('whois-option-state');

// Prototype only. Replace availability/pricing with WHMCS/API data on the test server.
const takenDomains=new Set(['entra.am','reg.am','hayhost.am','google.com','apple.com','boro.ru']);
const prices={
  '.am':'9 600 ֏','.հայ':'3 000 ֏','.com':'8 900 ֏','.ru':'4 300 ֏','.net':'9 800 ֏',
  '.org':'7 700 ֏','.info':'6 000 ֏','.live':'3 800 ֏','.site':'—','.online':'—','.app':'—','.store':'—'
};

function normalizeDomain(value){
  let v=(value||'').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];
  if(!v)return'';
  if(!v.includes('.'))v+='.am';
  return v;
}
function domainStem(domain){const idx=domain.indexOf('.');return idx>0?domain.slice(0,idx):domain}
function domainZone(domain){const idx=domain.indexOf('.');return idx>=0?domain.slice(idx):''}
function priceFor(domain){return prices[domainZone(domain)]||'—'}
function makeArrowButtonLabel(el,label){
  el.textContent='';el.append(label+' ');
  const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('class','icon');
  const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#i-arrow-right');icon.append(use);el.append(icon);
}
function renderResult(domain){
  const taken=takenDomains.has(domain);
  result.classList.toggle('taken',taken);
  resultDomain.textContent=domain;
  resultLabel.textContent=taken?'Занят':'Свободен';
  resultLabel.classList.toggle('available',!taken);
  resultLabel.classList.toggle('taken',taken);
  resultPrice.textContent=priceFor(domain);
  makeArrowButtonLabel(resultAction,taken?'Whois':'Добавить');
  updateSuggestions(domain);
}
function updateSuggestions(domain){
  const stem=domainStem(domain)||'brand';
  document.querySelectorAll('.domain-suggestion[data-zone]').forEach(row=>{
    const candidate=stem+row.dataset.zone;
    const taken=takenDomains.has(candidate);
    row.classList.toggle('taken',taken);
    const domainEl=row.querySelector('.suggest-domain');
    const statusEl=row.querySelector('.suggest-status');
    const priceEl=row.querySelector('.suggest-price strong');
    const action=row.querySelector('.suggest-action');
    if(domainEl)domainEl.textContent=candidate;
    if(statusEl)statusEl.textContent=taken?'Занят':'Свободен';
    if(priceEl)priceEl.textContent=priceFor(candidate);
    if(action)action.textContent=taken?'Whois':'Добавить';
  });
}

searchForm.addEventListener('submit',e=>{
  e.preventDefault();
  const domain=normalizeDomain(domainInput.value);
  if(!domain){domainInput.focus();return}
  domainInput.value=domain;
  renderResult(domain);
  document.getElementById('zones').scrollIntoView({behavior:'smooth',block:'start'});
});

document.querySelectorAll('[data-focus-search]').forEach(el=>el.addEventListener('click',()=>{
  domainInput.focus();document.getElementById('top').scrollIntoView({behavior:'smooth'});
}));

document.querySelectorAll('.domain-suggestion .suggest-action').forEach(btn=>btn.addEventListener('click',()=>{
  const row=btn.closest('.domain-suggestion');
  const candidate=row.querySelector('.suggest-domain')?.textContent;
  if(!candidate)return;
  domainInput.value=candidate;
  renderResult(candidate);
  document.getElementById('domain-result').scrollIntoView({behavior:'smooth',block:'center'});
}));

document.querySelectorAll('.zone-card [data-zone]').forEach(el=>el.addEventListener('click',()=>{
  const stem=domainStem(normalizeDomain(domainInput.value||'brand.am'))||'brand';
  const next=stem+el.dataset.zone;
  domainInput.value=next;
  renderResult(next);
  document.getElementById('domain-result').scrollIntoView({behavior:'smooth',block:'center'});
}));

const filters=[...document.querySelectorAll('.zone-filter')];
const cards=[...document.querySelectorAll('.zone-card')];
const suggestionRows=[...document.querySelectorAll('.domain-suggestion[data-zone]')];
const suggestionMore=document.getElementById('show-more-suggestions');
let expanded=false;
let suggestionsExpanded=false;

const zoneCategories=new Map();
cards.forEach(card=>{
  const zone=card.querySelector('[data-zone]')?.dataset.zone;
  if(zone)zoneCategories.set(zone,(card.dataset.categories||'').split(' ').filter(Boolean));
});
const suggestionFallbackCategories={
  '.site':['business'],
  '.online':['business','lifestyle']
};

function categoriesForSuggestion(row){
  return zoneCategories.get(row.dataset.zone)||suggestionFallbackCategories[row.dataset.zone]||[];
}
function applyFilter(category){
  suggestionRows.forEach(row=>{
    const matches=category==='all'||categoriesForSuggestion(row).includes(category);
    const extra=row.classList.contains('extra-suggestion');
    row.hidden=!(matches&&(category!=='all'||!extra||suggestionsExpanded));
  });
  if(suggestionMore)suggestionMore.parentElement.style.display=category==='all'?'flex':'none';
}
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  applyFilter(btn.dataset.category);
}));

const moreBtn=document.getElementById('show-more-zones');
function applyZoneExpansion(){
  cards.forEach(card=>{
    card.hidden=card.classList.contains('extra-zone')&&!expanded;
  });
}
if(moreBtn)moreBtn.addEventListener('click',e=>{
  expanded=!expanded;
  applyZoneExpansion();
  e.currentTarget.childNodes[0].textContent=expanded?'Скрыть ':'Смотреть ещё ';
});

if(suggestionMore)suggestionMore.addEventListener('click',e=>{
  suggestionsExpanded=!suggestionsExpanded;
  const active=document.querySelector('.zone-filter.active')?.dataset.category||'all';
  applyFilter(active);
  e.currentTarget.childNodes[0].textContent=suggestionsExpanded?'Скрыть варианты ':'Показать ещё варианты ';
});

const contact=document.getElementById('contact-form'),phone=document.getElementById('phone'),extra=document.getElementById('contact-extra'),status=document.getElementById('contact-status');
contact.addEventListener('submit',e=>{
  e.preventDefault();
  const digits=phone.value.replace(/\D/g,'');
  if(digits.length<7||digits.length>15){status.textContent='Укажите номер телефона: от 7 до 15 цифр, можно с кодом страны.';phone.focus();return}
  if(extra.hidden){extra.hidden=false;phone.setAttribute('aria-expanded','true');contact.querySelector('[type=submit]').textContent='Свяжитесь со мной →';status.textContent='';return}
  status.textContent='Данные заполнены. Это демонстрационная форма: отправка пока не подключена.';
});

const incomingDomain=new URLSearchParams(location.search).get('domain');
if(incomingDomain)domainInput.value=normalizeDomain(incomingDomain);
renderResult(normalizeDomain(domainInput.value));
applyZoneExpansion();
applyFilter('all');

whoisPrivacy?.addEventListener('change',()=>{
  if(whoisOptionState)whoisOptionState.textContent=whoisPrivacy.checked?'Добавлено':'Не выбрано';
});
