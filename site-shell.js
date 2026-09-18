(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const svgIcon = (id) => `<svg class="icon" aria-hidden="true"><use href="#${id}"></use></svg>`;
  const entraLogoPath = 'M212.71 0.76l461.8 0 0 35.53 -213.14 0 0 230.9 -35.52 0 0 -230.9 -213.14 0 0 -35.53zm-177.62 71.05l142.09 0 0 35.53 -142.09 0 0 44.4 142.09 0 0 35.53 -142.09 0 0 44.4 142.09 0 0 35.52 -142.09 0 -35.53 0 0 -35.52 0 -44.4 0 -35.53 0 -44.4 0 -35.53 35.53 0zm461.81 195.38l0 -44.4 0 -35.52 0 -79.93 0 -35.53 0 0 109.61 0 0 0.01c41.39,0.36 74.83,34.01 74.83,75.48 0,29.83 -17.3,55.61 -42.42,67.87l35.59 52.02 -43.04 0 -30.38 -44.4 -68.67 0 0 44.4 -35.52 0zm35.52 -159.85l0 79.93 74.09 0 0 -0.01c21.76,-0.36 39.3,-18.11 39.3,-39.96 0,-21.85 -17.54,-39.6 -39.3,-39.96l0 0 -74.09 0zm153.37 159.85l82.13 -195.38 38.53 0 82.12 195.38 -38.53 0 -62.86 -149.54 -62.85 149.54 -38.54 0zm-339.42 0l-98.14 -143.45 0 143.45 -35.52 0 0 -195.38 35.52 0 7.52 0 99.05 144.79 0 -144.79 35.53 0 0 195.38 -0.92 0 -34.61 0 -8.43 0z';

  const menus = {
    domains: [
      ['i-globe', 'Регистрация домена', 'domain-registration.html#top'],
      ['i-shield-check', 'SSL-сертификаты', 'ssl-certificates.html#top']
    ],
    hosting: [
      ['i-globe', 'Виртуальный хостинг', 'virtual-hosting.html#plans'],
      ['i-gauge', 'Премиум-хостинг', 'premium-hosting.html#plans'],
      ['i-wrench', 'Хостинг для 1С-Битрикс', '1c-bitrix-hosting.html#plans'],
      ['i-image', 'Хостинг для WordPress', 'wordpress-hosting.html#plans']
    ],
    cloud: [
      ['i-network', 'VPS', 'vps-hosting.html#plans'],
      ['i-briefcase', 'Рабочие столы Windows', 'windows-desktop.html'],
      ['i-gauge', 'Облачная база данных', 'cloud-database.html'],
      ['i-image', 'Облачное хранилище S3', 's3-storage.html'],
      ['i-send', 'Облачное хранилище FTP', 'ftp-storage.html']
    ],
    server: [
      ['i-briefcase', 'Выделенный сервер', 'entra-dedicated.html#catalog'],
      ['i-network', 'Коллокация сервера', 'entra-colocation.html#colocation'],
      ['i-users', 'Выделенные рабочие столы Windows', 'entra-dedicated.html#enterprise-solutions'],
      ['i-wrench', 'Сервер для 1С', 'entra-dedicated.html#enterprise-solutions']
    ],
    vpn: [
      ['i-shield-check', 'VPN в Армении', 'entra-vpn.html#armenia'],
      ['i-globe', 'VPN в Европе', 'entra-vpn.html#europe'],
      ['i-network', 'Сервер для VPN', 'entra-vpn.html#server']
    ],
    services: [
      ['i-wrench', 'Техническое сопровождение проекта', 'entra-services.html#support'],
      ['i-network', 'IPv4 / IPv6', 'entra-services.html#ip'],
      ['i-globe', 'Сетевые услуги', 'entra-services.html#network'],
      ['i-shield-check', 'Защита от DDoS', 'entra-services.html#ddos'],
      ['i-mail', 'Корпоративный почтовый сервер', 'entra-services.html#mail-server'],
      ['i-image', 'Хранение данных', 'entra-services.html#storage'],
      ['i-briefcase', 'Создание инфраструктуры', 'entra-services.html#infrastructure']
    ]
  };

  const navItems = [
    ['domains', 'Домен'],
    ['hosting', 'Хостинг'],
    ['cloud', 'Облако'],
    ['server', 'Сервер'],
    ['mail', 'Почта'],
    ['vpn', 'VPN'],
    ['services', 'Услуги']
  ];

  const currentFile = (location.pathname.split('/').pop() || 'entra-homepage.html').toLowerCase();
  const currentMenu = (currentFile.includes('domain') || currentFile.includes('ssl-certificates')) ? 'domains'
    : (currentFile.includes('vps') || currentFile.includes('cloud') || currentFile.includes('windows-desktop') || currentFile.includes('s3-storage') || currentFile.includes('ftp-storage')) ? 'cloud'
      : currentFile.includes('hosting') ? 'hosting'
        : (currentFile.includes('dedicated') || currentFile.includes('colocation')) ? 'server'
          : currentFile.includes('mail') ? 'mail'
            : currentFile.includes('vpn') ? 'vpn'
              : currentFile.includes('services') ? 'services'
                : '';

  function makeMegaPanel(key) {
    const items = menus[key] || [];
    const links = items.map(([icon, label, href]) => `
      <a class="mega-item" href="${href}">
        ${svgIcon(icon)}
        <span><b>${label}</b></span>
        <span class="item-arrow" aria-hidden="true">↗</span>
      </a>`).join('');

    return `
      <div class="mega-panel" id="menu-${key}" hidden>
        <div class="wrap mega-inner">
          <div class="mega-main">
            <div class="mega-items">${links}</div>
          </div>
          <a class="mega-promo" href="domain-registration.html#top">
            <strong>Ваш домен.<br>Хостинг в подарок.</strong>
            <p>Начните проект с готовой основы.</p>
            <span class="promo-link">Выбрать домен →</span>
          </a>
        </div>
      </div>`;
  }

  function makeProductSubnav(key) {
    const items = menus[key] || [];
    if (!items.length) return '';
    const links = items.map(([, label, href]) => `<a href="${href}">${label}</a>`).join('');
    return `<div class="product-subnav" aria-label="Разделы ${key}"><div class="wrap">${links}</div></div>`;
  }

  function makeLogo(instance = 'header') {
    const gradA = `entra-logo-grad-a-${instance}`;
    const gradB = `entra-logo-grad-b-${instance}`;
    return `
      <svg class="entra-logo-svg" viewBox="0 0 889 266.43" role="img" aria-label="ENTRA">
        <defs>
          <linearGradient id="${gradA}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7040C7"></stop>
            <stop offset="52%" stop-color="#8E51FF"></stop>
            <stop offset="100%" stop-color="#45DCF6"></stop>
          </linearGradient>
          <linearGradient id="${gradB}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#45DCF6"></stop>
            <stop offset="48%" stop-color="#7040C7"></stop>
            <stop offset="100%" stop-color="#8E51FF"></stop>
          </linearGradient>
        </defs>
        <path class="entra-logo-base" d="${entraLogoPath}"></path>
        <path class="entra-logo-color entra-logo-color-a" style="fill:url(#${gradA})" d="${entraLogoPath}"></path>
        <path class="entra-logo-color entra-logo-color-b" style="fill:url(#${gradB})" d="${entraLogoPath}"></path>
      </svg>`;
  }

  function renderFooterLogo() {
    const footerBrand = $('footer .footer-top .brand');
    if (!footerBrand) return;
    footerBrand.className = 'entra-brand footer-entra-brand';
    footerBrand.setAttribute('aria-label', 'ENTRA — главная');
    footerBrand.innerHTML = makeLogo('footer');
  }

  function renderFooterLinks() {
    $$('footer .footer-grid a').forEach(link => {
      if (link.textContent.trim() === 'Контакты') link.setAttribute('href', 'entra-company.html#contacts');
    });
  }

  function updateLegacyHostingLinks() {
    const destinations = {
      premium: 'premium-hosting.html#plans',
      wordpress: 'wordpress-hosting.html#plans',
      'cms-stack': '1c-bitrix-hosting.html#plans'
    };

    $$('a[href*="entra-hosting.html"]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const hash = href.split('#')[1] || 'standard';
      link.setAttribute('href', destinations[hash] || 'virtual-hosting.html#plans');
    });
  }

  function updateLegacyCloudLinks() {
    const cloudDestinations = {
      desktops: 'windows-desktop.html',
      database: 'cloud-database.html',
      s3: 's3-storage.html',
      ftp: 'ftp-storage.html'
    };

    $$('a[href*="entra-cloud.html"]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const hash = href.split('#')[1] || '';
      link.setAttribute('href', cloudDestinations[hash] || 'vps-hosting.html');
    });

    $$('a[href*="entra-vps.html"]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const hash = href.split('#')[1];
      link.setAttribute('href', `vps-hosting.html${hash ? `#${hash}` : ''}`);
    });
  }

  function renderShell() {
    const topbar = $('.topbar');
    const header = $('header');
    if (!topbar || !header) return;

    const productSubnav = $('.product-subnav', header);
    if (productSubnav) productSubnav.remove();

    topbar.innerHTML = `
      <div class="wrap entra-topbar-inner">
        <button class="utility-burger" type="button" aria-expanded="false" aria-controls="utility-menu" aria-label="Открыть служебное меню">
          <span></span><span></span><span></span>
        </button>
        <div class="utility-links" id="utility-menu">
          <a href="entra-news.html">Новости</a>
          <a href="entra-development.html" aria-label="Программы развития — социальные программы компании">Программы развития</a>
          <a href="entra-knowledge.html">База знаний</a>
          <a href="entra-company.html">Компания</a>
          <a href="entra-partners.html">Партнёрам</a>
        </div>
        <div class="utility-contact">
          <a href="entra-homepage.html#support" class="support-link">${svgIcon('i-headset')}<span>Поддержка 24/7</span></a>
          <a href="tel:+37460405060" class="phone-link">+374 60 40 50 60</a>
          <div class="language-switcher" aria-label="Язык сайта">
            <button class="language-current" type="button" aria-haspopup="true" aria-expanded="false">RU <span aria-hidden="true">⌄</span></button>
            <div class="language-options" role="menu">
              <button type="button" role="menuitem" data-language="hy">ARM</button>
              <button type="button" role="menuitem" data-language="en">ENG</button>
            </div>
          </div>
        </div>
      </div>`;

    const nav = navItems.map(([key, label]) => {
      if (key === 'mail') {
        return `<a class="nav-direct${currentMenu === key ? ' current-menu' : ''}" href="entra-mail.html">${label}</a>`;
      }
      return `<button class="${currentMenu === key ? 'current-menu' : ''}" type="button" data-menu="${key}" aria-expanded="false" aria-controls="menu-${key}">${label}<span aria-hidden="true"></span></button>`;
    }).join('');

    header.innerHTML = `
      <nav class="wrap entra-mainnav">
        <a class="entra-brand" href="entra-homepage.html" aria-label="ENTRA — главная">
          ${makeLogo('header')}
        </a>
        <div class="navlinks" aria-label="Продукты и услуги">${nav}</div>
        <div class="nav-actions">
          <button class="btn small" type="button" data-search>${svgIcon('i-search')} Найти решение</button>
          <a class="btn outline small" href="https://amweb.am/login" target="_blank" rel="noopener">Войти →</a>
        </div>
      </nav>
      ${['domains', 'hosting', 'cloud', 'server', 'vpn', 'services'].map(makeMegaPanel).join('')}
      ${makeProductSubnav(currentMenu)}`;
  }

  renderShell();
  renderFooterLogo();
  renderFooterLinks();
  updateLegacyHostingLinks();
  updateLegacyCloudLinks();

  function updateActiveSubnav() {
    const links = $$('.product-subnav a');
    const matching = links.filter(link => new URL(link.href).pathname === location.pathname);
    const active = matching.find(link => new URL(link.href).hash === location.hash) || matching[0];
    links.forEach(link => {
      if (link === active) link.setAttribute('aria-current', matching.length > 1 ? 'location' : 'page');
      else link.removeAttribute('aria-current');
    });
  }
  updateActiveSubnav();
  addEventListener('hashchange', updateActiveSubnav);

  const header = $('header');
  const menuButtons = $$('[data-menu]', header || document);
  let openKey = null;
  let leaveTimer = null;
  const mainNav = $('.entra-mainnav', header || document);

  function syncMegaTop() {
    if (!header || !mainNav) return;
    header.style.setProperty('--entra-mega-top', `${mainNav.offsetHeight}px`);
  }

  syncMegaTop();
  addEventListener('resize', syncMegaTop, { passive: true });

  function closeMenus({ focus = false } = {}) {
    const active = openKey ? $(`[data-menu="${openKey}"]`, header) : null;
    $$('.mega-panel', header || document).forEach(panel => { panel.hidden = true; });
    menuButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    openKey = null;
    header?.classList.remove('mega-open');
    clearTimeout(leaveTimer);
    if (focus && active) active.focus();
  }

  function openMenu(button) {
    const key = button?.dataset.menu;
    const panel = key ? $(`#menu-${key}`, header) : null;
    if (!key || !panel) return;
    clearTimeout(leaveTimer);
    syncMegaTop();
    header.classList.add('mega-open');
    $$('.mega-panel', header).forEach(item => { item.hidden = item !== panel; });
    menuButtons.forEach(item => item.setAttribute('aria-expanded', String(item === button)));
    openKey = key;
  }

  menuButtons.forEach(button => {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && matchMedia('(min-width: 761px)').matches) openMenu(button);
    });
    button.addEventListener('click', event => {
      event.preventDefault();
      if (openKey === button.dataset.menu) closeMenus();
      else openMenu(button);
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        openMenu(button);
        $(`#menu-${button.dataset.menu} a`, header)?.focus();
      }
    });
  });

  if (header) {
    header.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse' && matchMedia('(min-width: 761px)').matches) {
        leaveTimer = setTimeout(() => closeMenus(), 160);
      }
    });
    header.addEventListener('pointerenter', () => clearTimeout(leaveTimer));
    header.addEventListener('focusout', () => setTimeout(() => {
      if (!header.contains(document.activeElement)) closeMenus();
    }, 0));
    $$('.mega-panel a,.nav-direct', header).forEach(link => link.addEventListener('click', () => closeMenus()));
  }

  const topbar = $('.topbar');
  const burger = $('.utility-burger', topbar || document);
  const utility = $('#utility-menu', topbar || document);
  const language = $('.language-switcher', topbar || document);
  const languageCurrent = $('.language-current', language || document);

  function closeUtility() {
    if (!utility || !burger) return;
    utility.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  function closeLanguage() {
    if (!language || !languageCurrent) return;
    language.classList.remove('open');
    languageCurrent.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', event => {
    event.stopPropagation();
    const shouldOpen = burger.getAttribute('aria-expanded') !== 'true';
    closeLanguage();
    burger.setAttribute('aria-expanded', String(shouldOpen));
    utility?.classList.toggle('open', shouldOpen);
  });

  languageCurrent?.addEventListener('click', event => {
    event.stopPropagation();
    const shouldOpen = languageCurrent.getAttribute('aria-expanded') !== 'true';
    closeUtility();
    languageCurrent.setAttribute('aria-expanded', String(shouldOpen));
    language?.classList.toggle('open', shouldOpen);
  });

  $$('[data-language]', language || document).forEach(button => button.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language: button.dataset.language } }));
    closeLanguage();
  }));

  utility && $$('.utility-links a', topbar).forEach(link => link.addEventListener('click', closeUtility));

  document.addEventListener('click', event => {
    if (header && !header.contains(event.target)) closeMenus();
    if (topbar && !topbar.contains(event.target)) {
      closeUtility();
      closeLanguage();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeMenus({ focus: true });
    closeUtility();
    closeLanguage();
  });

  const shellDialog = $('#shell-dialog');
  const shellDialogTitle = $('#shell-dialog-title');
  const shellDialogBody = $('#shell-dialog-body');
  const infoDialog = shellDialog || $('#dialog');
  const infoDialogTitle = shellDialogTitle || $('#dialog-title');
  const infoDialogBody = shellDialogBody || $('#dialog-body');

  const requisitesText = [
    'ООО «ProITLab» / ENTRA',
    'Организационно-правовая форма: ООО',
    'Страна: Республика Армения',
    'Город: Ереван',
    'Юридический адрес: [указать юридический адрес]',
    'ИНН / Tax ID: [указать ИНН]',
    'Телефон: +374 60 40 50 60',
    'E-mail: info@entra.am',
    'Банк: [название банка]',
    'SWIFT: [SWIFT-код]',
    'Счёт AMD: AM00 0000 0000 0000 0000 0000',
    'Счёт USD: AM00 0000 0000 0000 0000 0000',
    'Директор: [ФИО директора]'
  ].join('\n');

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  if (infoDialog && infoDialogTitle && infoDialogBody) {
    const close = $('.dialog-close', infoDialog);
    close?.addEventListener('click', () => infoDialog.close());
    infoDialog.addEventListener('click', event => { if (event.target === infoDialog) infoDialog.close(); });
    $$('[data-info]').forEach(button => {
      button.onclick = null;
      button.addEventListener('click', () => {
        const title = button.dataset.info || 'ENTRA';
        infoDialogTitle.textContent = title;
        if (title === 'Реквизиты компании') {
          infoDialogBody.innerHTML = `
            <p><strong>Шаблон реквизитов.</strong> Перед публикацией заменим поля в квадратных скобках и банковские счета на реальные данные компании.</p>
            <p><strong>Компания:</strong> ООО «ProITLab» / ENTRA<br>
            <strong>Форма:</strong> ООО<br>
            <strong>Страна:</strong> Республика Армения<br>
            <strong>Город:</strong> Ереван<br>
            <strong>Юридический адрес:</strong> [указать юридический адрес]<br>
            <strong>ИНН / Tax ID:</strong> [указать ИНН]<br>
            <strong>Телефон:</strong> +374 60 40 50 60<br>
            <strong>E-mail:</strong> info@entra.am<br>
            <strong>Банк:</strong> [название банка]<br>
            <strong>SWIFT:</strong> [SWIFT-код]<br>
            <strong>Счёт AMD:</strong> AM00 0000 0000 0000 0000 0000<br>
            <strong>Счёт USD:</strong> AM00 0000 0000 0000 0000 0000<br>
            <strong>Директор:</strong> [ФИО директора]</p>
            <button class="btn small" id="copy-company-details" type="button">Скопировать реквизиты</button>
            <p id="copy-company-status" class="form-status" aria-live="polite"></p>`;
          $('#copy-company-details', infoDialogBody)?.addEventListener('click', async event => {
            const copyButton = event.currentTarget;
            const status = $('#copy-company-status', infoDialogBody);
            try {
              await copyText(requisitesText);
              copyButton.textContent = 'Скопировано ✓';
              if (status) status.textContent = 'Реквизиты скопированы в буфер обмена.';
            } catch {
              if (status) status.textContent = 'Не удалось скопировать автоматически. Выделите текст и скопируйте вручную.';
            }
          });
        } else {
          infoDialogBody.innerHTML = '<p>Раздел подготовлен в структуре сайта. Содержание подключим на следующем этапе.</p>';
        }
        if (!infoDialog.open) infoDialog.showModal();
      });
    });
  }

  const searchDialog = shellDialog || $('#dialog');
  const searchDialogTitle = shellDialogTitle || $('#dialog-title');
  const searchDialogBody = shellDialogBody || $('#dialog-body');
  if (searchDialog && searchDialogTitle && searchDialogBody) {
    $$('[data-search]', header || document).forEach(button => button.addEventListener('click', () => {
      searchDialogTitle.textContent = 'Найдите свой продукт';
      searchDialogBody.innerHTML = '<div class="search-results"><a href="domain-registration.html#top">Домены →</a><a href="virtual-hosting.html#plans">Хостинг →</a><a href="vps-hosting.html#plans">VPS →</a><a href="entra-dedicated.html#catalog">Выделенные серверы →</a><a href="entra-mail.html">Корпоративная почта →</a><a href="entra-vpn.html#armenia">VPN →</a></div>';
      searchDialog.showModal();
    }));
  }
})();

/* Shared header/footer revision loader. Page-specific content remains unchanged. */
(() => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'homepage-header-update.css';
  document.head.append(style);
  const script = document.createElement('script');
  script.src = 'homepage-header-update.js';
  document.head.append(script);
})();
