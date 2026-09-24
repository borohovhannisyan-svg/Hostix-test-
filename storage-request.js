(() => {
  const triggers = [...document.querySelectorAll('[data-storage-request]')];
  if (!triggers.length) return;

  const labels = {
    s3: {short: 'S3', full: 'S3-хранилище'},
    ftp: {short: 'FTP', full: 'FTP-хранилище'}
  };
  let selectedProduct = triggers[0].dataset.storageRequest === 'ftp' ? 'ftp' : 's3';

  const dialog = document.createElement('dialog');
  dialog.className = 'storage-request-dialog';
  dialog.setAttribute('aria-labelledby', 'storage-request-title');
  dialog.innerHTML = `
    <button class="dialog-close" type="button" aria-label="Закрыть">×</button>
    <div class="eyebrow">ENTRA CLOUD</div>
    <h2 id="storage-request-title">Подключить хранилище</h2>
    <p class="storage-request-intro">Оставьте минимум информации — специалист уточнит конфигурацию и условия подключения.</p>
    <form class="storage-request-form" novalidate>
      <div class="storage-request-field full">
        <label for="storage-request-email">E-mail для связи</label>
        <input id="storage-request-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@company.com" required>
      </div>
      <div class="storage-request-field">
        <label for="storage-request-volume">Предполагаемый объём</label>
        <select id="storage-request-volume" name="volume" required>
          <option value="">Выберите объём</option>
          <option>До 100 ГБ</option>
          <option>100–500 ГБ</option>
          <option>500 ГБ–2 ТБ</option>
          <option>Более 2 ТБ</option>
          <option>Пока не знаю</option>
        </select>
      </div>
      <div class="storage-request-field">
        <label for="storage-request-scenario">Для чего нужно хранилище</label>
        <select id="storage-request-scenario" name="scenario" required>
          <option value="">Выберите задачу</option>
          <option>Резервные копии</option>
          <option>Файлы и архивы</option>
          <option>Медиа и данные приложения</option>
          <option>Обмен файлами</option>
          <option>Другое</option>
        </select>
      </div>
      <div class="storage-request-field full">
        <label for="storage-request-comment">Комментарий <span aria-hidden="true">·</span> необязательно</label>
        <textarea id="storage-request-comment" name="comment" rows="3" maxlength="2000" placeholder="Например: переносим 300 ГБ резервных копий с другого сервера"></textarea>
      </div>
      <button class="btn" type="submit">Отправить заявку →</button>
    </form>
    <p class="storage-request-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);

  const title = dialog.querySelector('#storage-request-title');
  const form = dialog.querySelector('form');
  const status = dialog.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');

  function openDialog(product) {
    selectedProduct = product === 'ftp' ? 'ftp' : 's3';
    title.textContent = `Подключить ${labels[selectedProduct].full}`;
    submit.textContent = `Отправить заявку на ${labels[selectedProduct].short} →`;
    status.textContent = '';
    if (!dialog.open) dialog.showModal();
    form.elements.email.focus();
  }

  triggers.forEach(button => button.addEventListener('click', () => openDialog(button.dataset.storageRequest)));
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
      volume: form.elements.volume.value,
      scenario: form.elements.scenario.value,
      comment: form.elements.comment.value.trim(),
      page: location.pathname
    };
    submit.disabled = true;
    status.textContent = 'Отправляем заявку…';
    try {
      const response = await fetch('/api/storage-request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) throw new Error('Not accepted');
      form.hidden = true;
      status.textContent = 'Спасибо, заявка отправлена. Специалист ENTRA свяжется с вами в течение 24 часов.';
    } catch {
      const subject = encodeURIComponent(`Заявка на ${labels[selectedProduct].full}`);
      const body = encodeURIComponent(`E-mail: ${payload.email}\nОбъём: ${payload.volume}\nЗадача: ${payload.scenario}\nКомментарий: ${payload.comment || '—'}`);
      status.innerHTML = `Не удалось отправить автоматически. <a href="mailto:info@entra.am?subject=${subject}&body=${body}">Отправить заявку по e-mail</a>.`;
    } finally {
      submit.disabled = false;
    }
  });
})();
