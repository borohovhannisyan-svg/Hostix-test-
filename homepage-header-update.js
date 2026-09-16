(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const currencies={rub:{label:'₽ RUB',symbol:'₽'},amd:{label:'֏ AMD',symbol:'֏'},usd:{label:'$ USD',symbol:'$'}};
  const languageCurrency={ru:'rub',hy:'amd',am:'amd',en:'usd'};

  function setCurrency(code,source='manual'){
    if(!currencies[code])return;
    document.documentElement.dataset.currency=code;
    const current=$('.currency-current');
    if(current)current.innerHTML=`${currencies[code].label} <span aria-hidden="true">⌄</span>`;
    document.dispatchEvent(new CustomEvent('site:currencychange',{detail:{currency:code,symbol:currencies[code].symbol,source}}));
  }
  function openDialog(title,content){
    const dialog=$('#shell-dialog')||$('#dialog'), heading=$('#shell-dialog-title')||$('#dialog-title'), body=$('#shell-dialog-body')||$('#dialog-body');
    if(!dialog||!heading||!body)return;
    heading.textContent=title; body.innerHTML=content; if(!dialog.open)dialog.showModal();
  }
  function closeMegaMenus(){
    const header=$('header'); if(!header)return;
    $$('.mega-panel',header).forEach(panel=>{panel.hidden=true});
    $$('[data-menu]',header).forEach(button=>button.setAttribute('aria-expanded','false'));
    header.classList.remove('mega-open');
  }
  function init(){
    const partners=$$('.utility-links a').find(link=>link.textContent.trim()==='Партнёрам');
    if(partners)partners.textContent='Партнёрская программа';

    const language=$('.language-switcher');
    const languageOptions=$('.language-options',language||document);
    if(languageOptions)languageOptions.innerHTML='<button type="button" role="menuitem" data-language="ru">RU</button><button type="button" role="menuitem" data-language="hy">ARM</button><button type="button" role="menuitem" data-language="en">ENG</button>';
    if(language&&!$('.currency-switcher'))language.insertAdjacentHTML('afterend',`<div class="currency-switcher" aria-label="Валюта сайта"><button class="currency-current" type="button" aria-haspopup="true" aria-expanded="false">₽ RUB <span aria-hidden="true">⌄</span></button><div class="currency-options" role="menu"><button type="button" role="menuitem" data-currency="rub">₽ RUB</button><button type="button" role="menuitem" data-currency="amd">֏ AMD</button><button type="button" role="menuitem" data-currency="usd">$ USD</button></div></div>`);
    const currencySwitcher=$('.currency-switcher'), currencyCurrent=$('.currency-current');
    currencyCurrent?.addEventListener('click',event=>{event.stopPropagation();const open=currencyCurrent.getAttribute('aria-expanded')!=='true';currencyCurrent.setAttribute('aria-expanded',String(open));currencySwitcher?.classList.toggle('open',open)});
    $$('[data-currency]',currencySwitcher||document).forEach(button=>button.addEventListener('click',()=>{setCurrency(button.dataset.currency);currencySwitcher?.classList.remove('open');currencyCurrent?.setAttribute('aria-expanded','false')}));
    document.addEventListener('click',event=>{if(currencySwitcher&&!currencySwitcher.contains(event.target)){currencySwitcher.classList.remove('open');currencyCurrent?.setAttribute('aria-expanded','false')}});
    $$('[data-language]').forEach(button=>button.addEventListener('click',()=>{const code=button.dataset.language,current=$('.language-current'),labels={ru:'RU',hy:'ARM',am:'ARM',en:'ENG'};if(current)current.innerHTML=`${labels[code]||code.toUpperCase()} <span aria-hidden="true">⌄</span>`;setCurrency(languageCurrency[code]||'rub','language')}));
    setCurrency(languageCurrency[document.documentElement.lang]||'rub','initial');

    $('.nav-direct')?.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')closeMegaMenus()});

    $('[data-search]')?.addEventListener('click',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      openDialog('Найти решение',`<p>Опишите задачу — умный подбор продукта подключим на следующем этапе.</p><div class="homepage-search-field"><svg class="icon" aria-hidden="true"><use href="#i-search"></use></svg><input id="solution-search" type="search" placeholder="Например: перенести сайт или сервер в Армении" autocomplete="off"></div><div class="eyebrow">КАТЕГОРИИ</div><div class="solution-categories"><a href="entra-domains.html#top">Домены</a><a href="entra-hosting.html#standard">Хостинг</a><a href="entra-vps.html#plans">Облако и VPS</a><a href="entra-dedicated.html#catalog">Серверы</a><a href="entra-mail.html">Почта</a><a href="entra-vpn.html#armenia">VPN</a></div><p class="search-visual-status" id="search-visual-status">Введите запрос — здесь появятся подходящие решения.</p>`);
      const input=$('#solution-search'),status=$('#search-visual-status');
      input?.addEventListener('input',()=>{status.textContent=input.value.trim()?'Умный поиск будет подключён позже. Сейчас можно выбрать категорию ниже.':'Введите запрос — здесь появятся подходящие решения.'});input?.focus();
    },true);

    const loginLink=$('.nav-actions a[href*="amweb.am/login"]');
    if(loginLink){const button=document.createElement('button');button.className=loginLink.className;button.type='button';button.textContent='Войти →';loginLink.replaceWith(button);button.addEventListener('click',()=>openDialog('Личный кабинет',`<p>Войдите в существующий аккаунт или создайте новый.</p><div class="login-choices"><a class="btn" href="https://amweb.am/login">Войти →</a><a class="btn outline" href="https://amweb.am/register.php">Регистрация →</a></div>`))}

    const standards=$('.footer-standards .pills');
    ['ISO/IEC 27001','PCI DSS'].forEach(label=>{if(standards&&![...standards.children].some(item=>item.textContent.trim()===label))standards.insertAdjacentHTML('beforeend',`<span>${label}</span>`) });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
