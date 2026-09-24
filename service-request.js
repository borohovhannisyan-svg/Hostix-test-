(() => {
  const triggers = [...document.querySelectorAll('[data-service-request]')];
  if (!triggers.length) return;

  const products = {
    support: 'техническое сопровождение проекта',
    ip: 'IPv4 / IPv6',
    network: 'сетевые услуги',
    ddos: 'защиту от DDoS',
    mail: 'корпоративный почтовый сервер',
    storage: 'хранение данных',
    infrastructure: 'создание инфраструктуры'
  };
  const placeholders = {
    support: 'Например: нужно сопровождение двух серверов и мониторинг',
    ip: 'Например: дополнительные IPv4 для серверов',
    network: 'Например: нужно соединить офис и серверную инфраструктуру',
    ddos: 'Например: нужна защита публичного сервиса',
    mail: 'Например: отдельный почтовый сервер для компании',
    storage: 'Например: хранилище для резервных копий',
    infrastructure: 'Например: нужно спроектировать инфраструктуру нового проекта'
  };
  let selectedProduct = products[triggers[0].dataset.serviceRequest] ? triggers[0].dataset.serviceRequest : 'support';

  const dialog = document.createElement('dialog');
  dialog.className = 'service-request-dialog';
  dialog.setAttribute('aria-labelledby', 'service-request-title');
  dialog.innerHTML = `
    <button class="dialog-close" type="button" aria-label="Закрыть">×</button>
    <div class="eyebrow">ENTRA SERVICES</div>
    <h2 id="service-request-title">Оставить заявку</h2>
    <p class="service-request-intro">Оставьте минимум информации. Специалист уточнит задачу и предложит подходящий формат работы.</p>
    <form class="service-request-form" novalidate>
      <div class="service-request-field"><label for="service-request-email">E-mail для связи</label><input id="service-request-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@company.com" required></div>
      <div class="service-request-field"><label for="service-request-task">Коротко опишите задачу</label><textarea id="service-request-task" name="task" rows="4" maxlength="2000" required></textarea></div>
      <button class="btn" type="submit">Отправить заявку →</button>
    </form>
    <p class="service-request-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);

  const title = dialog.querySelector('#service-request-title');
  const task = dialog.querySelector('#service-request-task');
  const form = dialog.querySelector('form');
  const status = dialog.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');

  function openDialog(product) {
    selectedProduct = products[product] ? product : 'support';
    title.textContent = `Заявка на ${products[selectedProduct]}`;
    task.placeholder = placeholders[selectedProduct];
    status.textContent = '';
    if (!dialog.open) dialog.showModal();
    form.elements.email.focus();
  }

  triggers.forEach(button => button.addEventListener('click', () => openDialog(button.dataset.serviceRequest)));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { form.hidden = false; form.reset(); status.textContent = ''; });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    const payload = {product:selectedProduct,email:form.elements.email.value.trim(),task:form.elements.task.value.trim(),page:location.pathname};
    submit.disabled = true;
    status.textContent = 'Отправляем заявку…';
    try {
      const response = await fetch('/api/service-request', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
      const result = await response.json();
      if (!response.ok || result.accepted !== true) throw new Error('Not accepted');
      form.hidden = true;
      status.textContent = 'Спасибо, ваш запрос отправлен. Наши специалисты свяжутся с вами в течение 24 часов.';
    } catch {
      const subject = encodeURIComponent(`Заявка на ${products[selectedProduct]}`);
      const body = encodeURIComponent(`E-mail: ${payload.email}\nЗадача: ${payload.task}`);
      status.innerHTML = `Не удалось отправить автоматически. <a href="mailto:info@entra.am?subject=${subject}&body=${body}">Отправить заявку по e-mail</a>.`;
    } finally { submit.disabled = false; }
  });
})();
