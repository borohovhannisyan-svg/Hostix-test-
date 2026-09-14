(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Page-only override: while this page is under review, keep the shared shell untouched.
  const mailNav = $('.nav-direct');
  if (mailNav) {
    mailNav.href = 'entra-mail.html';
    mailNav.classList.add('current-menu');
    mailNav.setAttribute('aria-current', 'page');
  }

  $$('.mail-faq .faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = $('.faq-answer', item);
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      if (answer) answer.hidden = !open;
    });
  });

  const dialog = $('#mail-request-dialog');
  const close = $('#closeMailRequest');
  const form = $('#mail-request-form');
  const status = $('#mail-request-status');
  const interest = $('#mail-interest');

  function openDialog(mode = 'Подключить корпоративную почту') {
    if (!dialog) return;
    if (interest) interest.value = mode;
    dialog.showModal();
  }

  $$('[data-mail-action]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      openDialog(button.dataset.mailAction || 'Подключить корпоративную почту');
    });
  });

  close?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) status.textContent = 'Заявка готова. Подключение отправки добавим при интеграции с CRM.';
  });
})();
