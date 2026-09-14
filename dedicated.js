(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Page-local activation only. Shared menu source/styling remains untouched. */
  const header = $('header');
  const serverButton = $('[data-menu="server"]', header || document);
  if (serverButton) serverButton.classList.add('current-menu');

  const serverPanel = $('#menu-server', header || document);
  const firstServerLink = serverPanel ? $('.mega-item', serverPanel) : null;
  if (firstServerLink) firstServerLink.href = 'entra-dedicated.html#catalog';

  if (header && !$('.product-subnav', header) && serverPanel) {
    const links = $$('.mega-item', serverPanel).map((link, index) => {
      const label = $('b', link)?.textContent?.trim() || link.textContent.trim();
      const href = index === 0 ? 'entra-dedicated.html#catalog' : link.getAttribute('href');
      return `<a href="${href}">${label}</a>`;
    }).join('');
    header.insertAdjacentHTML('beforeend', `<div class="product-subnav" aria-label="Разделы server"><div class="wrap">${links}</div></div>`);
  }

  const rows = $$('.dedicated-row');
  const maker = $('#makerFilter');
  const cpu = $('#cpuFilter');
  const ram = $('#ramFilter');
  const storage = $('#storageFilter');
  const more = $('#serverMore');
  let visibleLimit = 10;

  const matches = row => {
    const makerOk = !maker || maker.value === 'all' || row.dataset.maker === maker.value;
    const cpuOk = !cpu || cpu.value === 'all' || row.dataset.cpu === cpu.value;
    const storageOk = !storage || storage.value === 'all' || row.dataset.storage === storage.value;
    let ramOk = true;
    if (ram && ram.value !== 'all') {
      const target = Number(ram.value);
      const actual = Number(row.dataset.ram || 0);
      ramOk = target === 512 ? actual >= 512 : actual === target;
    }
    return makerOk && cpuOk && storageOk && ramOk;
  };

  function renderRows(reset = false) {
    if (reset) visibleLimit = 10;
    const filtered = rows.filter(matches);
    rows.forEach(row => row.classList.add('is-hidden'));
    filtered.slice(0, visibleLimit).forEach(row => row.classList.remove('is-hidden'));
    if (more) {
      const left = Math.max(filtered.length - visibleLimit, 0);
      more.hidden = left === 0;
      more.textContent = left > 0 ? `Показать ещё ${Math.min(left, 10)} →` : 'Показать ещё →';
    }
  }

  [maker, cpu, ram, storage].filter(Boolean).forEach(select => select.addEventListener('change', () => renderRows(true)));
  more?.addEventListener('click', () => { visibleLimit += 10; renderRows(false); });
  renderRows(true);

  $$('.dedicated-choose').forEach(link => link.addEventListener('click', () => {
    const code = link.dataset.server;
    const form = $('#contact-form');
    if (form && code) form.dataset.server = code;
  }));


  const requestDialog = $('#dedicated-request-dialog');
  const openRequest = $('#openDedicatedRequest');
  const closeRequest = $('#closeDedicatedRequest');
  const leadForm = $('#dedicated-lead-form');
  const leadStatus = $('#dedicated-lead-status');

  const openLeadDialog = () => {
    if (!requestDialog) return;
    if (typeof requestDialog.showModal === 'function') requestDialog.showModal();
    else requestDialog.setAttribute('open', '');
  };

  const closeLeadDialog = () => {
    if (!requestDialog) return;
    if (typeof requestDialog.close === 'function') requestDialog.close();
    else requestDialog.removeAttribute('open');
  };

  openRequest?.addEventListener('click', openLeadDialog);
  closeRequest?.addEventListener('click', closeLeadDialog);
  requestDialog?.addEventListener('click', event => {
    if (event.target === requestDialog) closeLeadDialog();
  });

  leadForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }
    if (leadStatus) leadStatus.textContent = 'Форма пока демонстрационная — отправку подключим на следующем этапе.';
  });

  $$('.faq-item button').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = $('.faq-answer', item);
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    if (answer) answer.hidden = isOpen;
    const icon = button.lastElementChild;
    if (icon) icon.textContent = isOpen ? '+' : '−';
  }));

  const form = $('#contact-form');
  if (form) {
    const phone = $('#phone', form);
    const extra = $('#contact-extra', form);
    const status = $('#contact-status', form);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (extra?.hidden) {
        extra.hidden = false;
        phone?.setAttribute('aria-expanded','true');
        status && (status.textContent = 'Выберите задачу и оставьте контакт — отправку подключим на следующем этапе.');
      } else {
        status && (status.textContent = 'Форма пока демонстрационная.');
      }
    });
  }
})();
