(() => {
  const triggers = [...document.querySelectorAll('[data-vpn-request]')];
  if (!triggers.length) return;

  const products = {
    armenia: 'VPN в Армении',
    europe: 'VPN в Европе',
    server: 'сервер для VPN',
    corporate: 'корпоративный VPN'
  };
  let selectedProduct = products[triggers[0].dataset.vpnRequest] ? triggers[0].dataset.vpnRequest : 'armenia';

  const dialog = document.createElement('dialog');
  dialog.className = 'vpn-request-dialog';
  dialog.setAttribute('aria-labelledby', 'vpn-request-title');
  dialog.innerHTML = `
    <button class="dialog-close" type="button" aria-label="Закрыть">×</button>
    <div class="eyebrow">ENTRA VPN</div>
    <h2 id="vpn-request-title">Подключить VPN</h2>
    <p class="vpn-request-intro">Оставьте минимум информации. Специалист уточнит задачу и предложит подходящий вариант подключения.</p>
    <form class="vpn-request-form" novalidate>
      <div class="vpn-request-field">
        <label for="vpn-request-email">E-mail для связи</label>
        <input id="vpn-request-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@company.com" required>
      </div>
      <div class="vpn-request-field">
        <label for="vpn-request-task">Коротко опишите задачу</label>
        <textarea id="vpn-request-task" name="task" rows="4" maxlength="2000" placeholder="Например: нужен армянский IP для работы" required></textarea>
      </div>
      <button class="btn" type="submit">Отправить заявку →</button>
    </form>
    <p class="vpn-request-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);

  const title = dialog.querySelector('#vpn-request-title');
  const task = dialog.querySelector('#vpn-request-task');
  const form = dialog.querySelector('form');
  const status = dialog.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');

  const placeholders = {
    armenia: 'Например: нужен армянский IP для работы',
    europe: 'Например: нужна европейская точка подключения',
    server: 'Например: нужен отдельный VPN-сервер для команды',
    corporate: 'Например: 25 сотрудников и доступ к офисной сети'
  };

  function openDialog(product) {
    selectedProduct = products[product] ? product : 'armenia';
    title.textContent = `Заявка на ${products[selectedProduct]}`;
    task.placeholder = placeholders[selectedProduct];
    status.textContent = '';
    if (!dialog.open) dialog.showModal();
    form.elements.email.focus();
  }

  triggers.forEach(button => button.addEventListener('click', () => openDialog(button.dataset.vpnRequest)));
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
      const response = await fetch('/api/vpn-request', {
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
