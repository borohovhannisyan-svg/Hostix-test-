(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const currencies={rub:{label:'₽ RUB',symbol:'₽'},amd:{label:'֏ AMD',symbol:'֏'},usd:{label:'$ USD',symbol:'$'}};
  const languageCurrency={ru:'rub',hy:'amd',am:'amd',en:'usd'};
  const defaultSolutions=[
    ['Домены','domain-registration.html#top'],['Хостинг','virtual-hosting.html#plans'],['Облако и VPS','vps-hosting.html#plans'],
    ['Серверы','dedicated-server.html#catalog'],['Почта','entra-mail.html'],['VPN','vpn-armenia.html']
  ];
  const solutionIndex=[
    ['Регистрация домена','domain-registration.html#top','домен имя сайт регистрация купить скрытая whois dns'],
    ['SSL-сертификаты','ssl-certificates.html','ssl сертификат https защита сайта wildcard dv ov ev'],
    ['Виртуальный хостинг','virtual-hosting.html#plans','хостинг сайт cpanel виртуальный перенос сайта'],
    ['Премиум-хостинг','premium-hosting.html#plans','хостинг премиум быстрый сайт ресурсы'],
    ['WordPress-хостинг','wordpress-hosting.html#plans','хостинг wordpress вордпресс блог сайт'],
    ['Хостинг для 1С-Битрикс','1c-bitrix-hosting.html#plans','хостинг 1с битрикс bitrix сайт'],
    ['VPS / VDS','vps-hosting.html#plans','vps vds облако виртуальный сервер linux windows армения европа'],
    ['Виртуальные рабочие столы Windows','windows-desktop.html#plans','виртуальный рабочий стол windows rdp удаленная работа'],
    ['Облачные базы данных','cloud-database.html','база данных database mysql postgresql облако dbaas'],
    ['S3-хранилище','s3-storage.html','s3 объектное хранилище storage backup файлы данные'],
    ['FTP-хранилище','ftp-storage.html','ftp хранилище storage backup файлы данные'],
    ['Выделенные серверы','dedicated-server.html#catalog','сервер выделенный dedicated bare metal оборудование'],
    ['Колокация','server-colocation.html','колокация colocation стойка разместить сервер дата центр'],
    ['Выделенные рабочие столы Windows','windows-dedicated-desktop.html','выделенный рабочий стол windows rdp сервер'],
    ['Сервер для 1С','1c-server.html','сервер 1с бухгалтерия windows'],
    ['Корпоративная почта','entra-mail.html','почта email e-mail корпоративная ящик домен'],
    ['Почтовый сервер','corporate-mail-server.html','почта email e-mail корпоративная сервер'],
    ['VPN в Армении','vpn-armenia.html','vpn впн армения армянский ip доступ'],
    ['VPN в Европе','vpn-europe.html','vpn впн европа европейский ip доступ'],
    ['Сервер для VPN','vpn-server.html','vpn впн сервер выделенный ip'],
    ['Корпоративный VPN','corporate-vpn.html','vpn впн корпоративный офис команда сеть'],
    ['Техническое сопровождение','technical-support.html','поддержка помощь сопровождение администрирование перенос миграция настройка'],
    ['IP-адреса','ip-addresses.html','ip ipv4 ipv6 адрес сеть bgp'],
    ['DDoS и WAF','ddos-protection.html','ddos waf защита атака безопасность'],
    ['Хранение и резервное копирование','data-storage.html','backup бэкап резервное копирование хранение данные'],
    ['Создание IT-инфраструктуры','it-infrastructure.html','инфраструктура проектирование сервер облако сеть']
  ];

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
  const icon=name=>`<svg class="icon" aria-hidden="true"><use href="#${name}"></use></svg>`;
  function yerevanPhoneIsOpen(){
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Yerevan',weekday:'short',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(part=>[part.type,part.value]));
    return ['Mon','Tue','Wed','Thu','Fri'].includes(parts.weekday)&&Number(parts.hour)>=10&&Number(parts.hour)<19;
  }
  async function sendContactRequest(form,type,status,successText){
    if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form));
    if(!data.email&&!data.phone){status.textContent='Укажите e-mail или номер телефона.';form.elements.email.focus();return}
    const submit=form.querySelector('[type="submit"]');submit.disabled=true;status.textContent='Отправляем запрос…';
    try{
      const response=await fetch('/api/contact-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,type,page:location.pathname}),signal:AbortSignal.timeout(20000)});
      const result=await response.json();if(!response.ok||result.accepted!==true)throw new Error('Not accepted');
      form.hidden=true;status.textContent=successText;
    }catch{
      const subject=encodeURIComponent(data.topic||'Запрос с сайта ENTRA');
      const body=encodeURIComponent(`E-mail: ${data.email||'—'}\nТелефон: ${data.phone||'—'}\n\n${data.message}`);
      status.innerHTML=`Не удалось отправить автоматически. <a href="mailto:info@entra.am?subject=${subject}&body=${body}">Отправить по e-mail</a>.`;
    }finally{submit.disabled=false}
  }
  function openChat(){
    openDialog('Онлайн-чат',`<div class="support-chat-intro">${icon('i-chat')}<p><strong>Здравствуйте!</strong><br>Опишите вопрос — специалист ответит в этой линии связи.</p></div><form class="contact-popup-form" id="support-chat-form" novalidate><label>Ваш вопрос<textarea name="message" rows="4" maxlength="2000" placeholder="Коротко опишите задачу" required></textarea></label><label>E-mail для ответа<input name="email" type="email" maxlength="254" autocomplete="email" placeholder="name@company.com" required></label><input name="phone" type="hidden" value=""><input name="topic" type="hidden" value="Онлайн-чат"><button class="btn" type="submit">Отправить сообщение →</button></form><p class="popup-form-status" role="status" aria-live="polite"></p>`);
    const form=$('#support-chat-form'),status=$('.popup-form-status',form?.parentElement||document);
    form?.addEventListener('submit',event=>{event.preventDefault();sendContactRequest(form,'chat',status,'Спасибо, сообщение отправлено. Специалист ответит вам по e-mail.')});
  }
  function openSupport(){
    const phoneOpen=yerevanPhoneIsOpen();
    openDialog('Поддержка 24/7',`<p>Выберите удобный способ связи.</p><div class="support-options"><a class="support-option${phoneOpen?'':' is-unavailable'}" href="${phoneOpen?'tel:+37460405060':'#'}" ${phoneOpen?'':'aria-disabled="true"'} data-support-phone>${icon('i-phone')}<span><strong>Телефон</strong><small>${phoneOpen?'+374 60 40 50 60':'Сейчас недоступен'}</small></span></a><button class="support-option" type="button" data-open-chat>${icon('i-chat')}<span><strong>Онлайн-чат</strong><small>Написать на сайте</small></span></button><a class="support-option" href="https://amweb.am/submitticket.php" target="_blank" rel="noopener">${icon('i-ticket')}<span><strong>Открыть тикет</strong><small>В личном кабинете</small></span></a><span class="support-option is-unavailable" aria-disabled="true">${icon('i-send')}<span><strong>Telegram</strong><small>Ссылка появится скоро</small></span></span><a class="support-option" href="mailto:info@entra.am">${icon('i-mail')}<span><strong>Электронная почта</strong><small>info@entra.am</small></span></a></div>${phoneOpen?'':`<p class="support-hours-note">Звонки принимаем по будням с 10:00 до 19:00 по Еревану. Сейчас напишите в онлайн-чат, откройте тикет или отправьте e-mail.</p>`}`);
    $('[data-support-phone][aria-disabled="true"]')?.addEventListener('click',event=>event.preventDefault());
    $('[data-open-chat]')?.addEventListener('click',openChat);
  }
  function openConsultation(){
    openDialog('Консультация со специалистом',`<p>Опишите задачу и оставьте удобный контакт. Специалист свяжется с вами в течение 12 часов.</p><form class="contact-popup-form" id="consultation-form" novalidate><label>Тема<input name="topic" maxlength="140" placeholder="Например: подобрать VPS" required></label><label>Сообщение<textarea name="message" rows="4" maxlength="2000" placeholder="Коротко опишите задачу" required></textarea></label><div class="contact-popup-grid"><label>E-mail<input name="email" type="email" maxlength="254" autocomplete="email" placeholder="name@company.com"></label><label>Телефон<input name="phone" type="tel" maxlength="40" autocomplete="tel" placeholder="+374 …"></label></div><small class="contact-popup-hint">Укажите e-mail, телефон или оба варианта.</small><button class="btn" type="submit">Отправить запрос →</button></form><p class="popup-form-status" role="status" aria-live="polite"></p>`);
    const form=$('#consultation-form'),status=$('.popup-form-status',form?.parentElement||document);
    form?.addEventListener('submit',event=>{event.preventDefault();sendContactRequest(form,'consultation',status,'Спасибо, ваш запрос отправлен. Наш специалист свяжется с вами в течение 12 часов.')});
  }
  function initHomepagePolish(){
    const file=location.pathname.split('/').pop();
    if(file&&file!=='index.html'&&file!=='entra-homepage.html')return;

    const domainForm=$('.domain-search');
    domainForm?.addEventListener('submit',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      const input=$('input',domainForm),value=input?.value.trim();
      if(!value){input?.focus();return}
      location.href=`domain-registration.html?domain=${encodeURIComponent(value)}#zones`;
    },true);

    const productLinks={
      hosting:'virtual-hosting.html#plans',domains:'domain-registration.html#top',email:'entra-mail.html',
      vps:'vps-hosting.html#plans',servers:'dedicated-server.html#catalog',vpn:'vpn-armenia.html'
    };
    Object.entries(productLinks).forEach(([name,href])=>{
      const link=$(`.product.${name} .card-link`);if(link)link.href=href;
    });

    const track=$('#services-track');
    if(track){
      const items=[
        ['Техническое сопровождение проекта','Настройка, обновления и контроль инфраструктуры.','Настройка','Мониторинг','technical-support.html'],
        ['IPv4 / IPv6','Адреса для серверов, сервисов и сетевой инфраструктуры.','IPv4','IPv6','ip-addresses.html'],
        ['Сетевые услуги','Свяжем офис, облако и серверы в единую частную сеть.','Private VLAN','Связность','network-services.html'],
        ['Защита от DDoS','Фильтрация атак и защита доступности ваших сервисов.','DDoS','WAF','ddos-protection.html'],
        ['Корпоративный почтовый сервер','Почтовая инфраструктура под контролем вашей компании.','Почта','Сервер','corporate-mail-server.html'],
        ['Хранение данных','Резервные копии и хранение критичных данных.','Backup','Хранилище','data-storage.html'],
        ['Создание инфраструктуры','Проектирование и запуск инфраструктуры под задачи бизнеса.','Проектирование','Запуск','it-infrastructure.html']
      ];
      track.innerHTML=items.map((item,index)=>`<article class="service metal-card"><div class="metal-graphic graphic-${index%6}" aria-hidden="true"><i></i><i></i><i></i><i></i></div><h3>${item[0]}</h3><p>${item[1]}</p><div class="pills"><span>${item[2]}</span><span>${item[3]}</span></div><a class="more card-link" href="${item[4]}" aria-label="${item[0]} — подробнее">Подробнее →</a></article>`).join('');
      let timer;
      const stop=()=>{clearInterval(timer);timer=undefined};
      const start=()=>{if(timer||matchMedia('(prefers-reduced-motion: reduce)').matches)return;timer=setInterval(()=>{const card=$('.service',track),step=(card?.getBoundingClientRect().width||320)+20,end=track.scrollLeft+track.clientWidth>=track.scrollWidth-12;track.scrollTo({left:end?0:track.scrollLeft+step,behavior:'smooth'})},3200)};
      track.addEventListener('pointerenter',stop);track.addEventListener('pointerleave',start);
      track.addEventListener('focusin',stop);track.addEventListener('focusout',()=>setTimeout(()=>{if(!track.contains(document.activeElement))start()},0));
      document.addEventListener('visibilitychange',()=>document.hidden?stop():start());start();
    }

    const section=$('#infrastructure.infra');
    if(section){
      section.classList.add('control-section');
      section.innerHTML=`<div class="wrap"><div class="control-layout"><div class="control-copy"><div class="eyebrow">УПРАВЛЕНИЕ</div><h2>Полный контроль <em>над оборудованием</em></h2><p>Доступ к серверу и базовые инфраструктурные функции без лишних уровней между вами и железом.</p></div><div class="control-feature-grid"><article class="control-feature"><h3>iLO / iDRAC</h3><p>Удалённое управление сервером независимо от состояния операционной системы.</p></article><article class="control-feature"><h3>Root / Administrator</h3><p>Полный административный доступ к вашему выделенному серверу.</p></article><article class="control-feature"><h3>Мониторинг</h3><p>Контроль оборудования и состояния основных компонентов сервера.</p></article><article class="control-feature"><h3>Замена оборудования</h3><p>При аппаратной неисправности заменяем проблемный компонент.</p></article></div></div><div class="control-metrics"><div><strong>0 ֏</strong><span>Отсутствует установочный платёж</span></div><div><strong>4 × IPv4</strong><span>Выделенных адреса в подарок</span></div><div><strong>1 Гбит/с</strong><span>Канал и безлимитный трафик</span></div></div></div>`;
    }
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

    $$('[data-search]').forEach(trigger=>trigger.addEventListener('click',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      openDialog('Найти решение',`<p>Опишите задачу — покажем подходящие продукты и услуги.</p><div class="homepage-search-field" role="search"><svg class="icon" aria-hidden="true"><use href="#i-search"></use></svg><input id="solution-search" type="search" placeholder="Например: перенести сайт или сервер в Армении" autocomplete="off" aria-controls="solution-categories"></div><div class="eyebrow">КАТЕГОРИИ</div><div class="solution-categories" id="solution-categories" aria-live="polite"></div><p class="search-visual-status" id="search-visual-status">Введите запрос или выберите категорию.</p>`);
      const input=$('#solution-search'),status=$('#search-visual-status'),categories=$('#solution-categories');
      let currentResults=[];
      const normalize=value=>value.toLowerCase().replaceAll('ё','е').replace(/[^a-zа-я0-9]+/gi,' ').trim();
      const render=items=>{currentResults=items;categories.innerHTML=items.map(([title,href])=>`<a href="${href}">${title}</a>`).join('')};
      const findSolutions=value=>{const query=normalize(value),tokens=query.split(' ').filter(token=>token.length>1);if(!query)return defaultSolutions;return solutionIndex.map(item=>{const title=normalize(item[0]),text=`${title} ${normalize(item[2])}`;let score=text.includes(query)?12:0;tokens.forEach(token=>{if(title.includes(token))score+=5;else if(text.includes(token))score+=2});return {item,score}}).filter(result=>result.score>0).sort((a,b)=>b.score-a.score).slice(0,6).map(result=>result.item)};
      const update=()=>{const query=input.value.trim(),matches=findSolutions(query);render(matches.length?matches:defaultSolutions);status.textContent=!query?'Введите запрос или выберите категорию.':matches.length?`Найдено решений: ${matches.length}. Enter — открыть первое.`:'Точных совпадений нет — выберите основной раздел.'};
      input?.addEventListener('input',update);
      input?.addEventListener('keydown',event=>{if(event.key==='Enter'&&currentResults[0]){event.preventDefault();location.href=currentResults[0][1]}});
      update();input?.focus();
    },true));

    $$('.support-link').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openSupport()}));
    const topbarPhone=$('.topbar .phone-link');
    if(topbarPhone&&!yerevanPhoneIsOpen()){topbarPhone.classList.add('is-unavailable');topbarPhone.setAttribute('aria-label','Телефон доступен по будням с 10:00 до 19:00');topbarPhone.addEventListener('click',event=>{event.preventDefault();openSupport()})}
    $$('.hero .actions a[href="#contact"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openConsultation()}));
    initHomepagePolish();

    const loginLink=$('.nav-actions a[href*="amweb.am/login"]');
    if(loginLink){const button=document.createElement('button');button.className=loginLink.className;button.type='button';button.textContent='Войти →';loginLink.replaceWith(button);button.addEventListener('click',()=>openDialog('Личный кабинет',`<p>Войдите в существующий аккаунт или создайте новый.</p><div class="login-choices"><a class="btn" href="https://amweb.am/login">Войти →</a><a class="btn outline" href="https://amweb.am/register.php">Регистрация →</a></div>`))}

    const standards=$('.footer-standards .pills');
    ['ISO/IEC 27001','PCI DSS'].forEach(label=>{if(standards&&![...standards.children].some(item=>item.textContent.trim()===label))standards.insertAdjacentHTML('beforeend',`<span>${label}</span>`) });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
