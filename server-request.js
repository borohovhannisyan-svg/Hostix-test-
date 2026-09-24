(() => {
  const triggers = [...document.querySelectorAll('[data-server-request]')];
  if (!triggers.length) return;

  const products = {
    colocation: 'колокацию сервера',
    'windows-desktop': 'выделенные рабочие столы Windows',
    '1c-server': 'сервер для 1С'
  };
  let selectedProduct = products[triggers[0].dataset.serverRequest] ? triggers[0].dataset.serverRequest : 'colocation';

  const dialog = document.createElement('dialog');
  dialog.className = 'server-request-dialog';
  dialog.setAttribute('aria-labelledby', 'server-request-title');
  dialog.innerHTML = `
    <button class="dialog-close" type="button" aria-label="Закрыть">×</button>
    <div class="eyebrow">ENTRA SERVERS</div>
    <h2 id="server-request-title">Подобрать решение</h2>
    <p class="server-request-intro">Оставьте минимум информации. Специалист уточнит детали и предложит подходящую конфигурацию.</p>
    <form class="server-request-form" novalidate>
      <div class="server-request-field">
        <label for="server-request-email">E-mail для связи</label>
        <input id="server-request-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@company.com" required>
      </div>
      <div class="server-request-field">
        <label for="server-request-task">Коротко опишите задачу</label>
        <textarea id="server-request-task" name="task" rows="4" maxlength="2000" placeholder="Например: нужны рабочие места для удалённой команды" required></textarea>
      </div>
      <button class="btn" type="submit">Отправить заявку →</button>
    </form>
    <p class="server-request-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);

  const title = dialog.querySelector('#server-request-title');
  const task = dialog.querySelector('#server-request-task');
  const form = dialog.querySelector('form');
  const status = dialog.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');

  function openDialog(product) {
    selectedProduct = products[product] ? product : 'colocation';
    title.textContent = `Заявка на ${products[selectedProduct]}`;
    task.placeholder = selectedProduct === 'colocation'
      ? 'Например: 2 сервера 1U, требуется подключение к сети'
      : selectedProduct === '1c-server'
        ? 'Например: 1С для команды и удалённый доступ сотрудников'
        : 'Например: рабочие места для удалённой команды';
    status.textContent = '';
    if (!dialog.open) dialog.showModal();
    form.elements.email.focus();
  }

  triggers.forEach(button => button.addEventListener('click', () => openDialog(button.dataset.serverRequest)));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    form.hidden = false;
    form.reset();
    status.textContent = '';
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    const payload = {
      product: selectedProduct,
      email: form.elements.email.value.trim(),
      task: form.elements.task.value.trim(),
      page: location.pathname
    };
    submit.disabled = true;
    status.textContent = 'Отправляем заявку…';
    try {
      const response = await fetch('/api/server-request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) throw new Error('Not accepted');
      form.hidden = true;
      status.textContent = 'Спасибо, ваш запрос отправлен. Наши специалисты свяжутся с вами в течение 24 часов.';
    } catch {
      const subject = encodeURIComponent(`Заявка на ${products[selectedProduct]}`);
      const body = encodeURIComponent(`E-mail: ${payload.email}\nЗадача: ${payload.task}`);
      status.innerHTML = `Не удалось отправить автоматически. <a href="mailto:info@entra.am?subject=${subject}&body=${body}">Отправить заявку по e-mail</a>.`;
    } finally {
      submit.disabled = false;
    }
  });
})();
