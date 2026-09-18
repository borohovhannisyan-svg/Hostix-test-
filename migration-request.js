(() => {
  const triggers = document.querySelectorAll('#migration .migration-actions a');
  if (!triggers.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'migration-dialog';
  dialog.setAttribute('aria-labelledby', 'migration-title');
  dialog.innerHTML = `
    <button class="dialog-close" type="button" aria-label="Закрыть">×</button>
    <h2 id="migration-title">Перенос сайта</h2>
    <p>Укажите email и что нужно перенести. Специалист уточнит детали в ответном письме.</p>
    <form>
      <label for="migration-email">Email для связи</label>
      <input id="migration-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@example.com" required>
      <label class="migration-choice"><input name="noDomain" type="checkbox">Нет домена — опишу, что нужно перенести</label>
      <div data-domain-field><label for="migration-domain">Домен сайта</label>
        <input id="migration-domain" name="domain" type="text" maxlength="253" placeholder="example.com" autocapitalize="none" spellcheck="false" required>
      </div>
      <div data-description-field hidden><label for="migration-description">Что нужно перенести?</label>
        <textarea id="migration-description" name="description" rows="4" maxlength="2000" placeholder="Например: сайт с базой данных и корпоративную почту" disabled></textarea>
      </div>
      <button class="btn" type="submit">Отправить специалисту</button>
    </form>
    <p class="migration-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form');
  const status = dialog.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');
  const domain = form.elements.domain;
  const description = form.elements.description;
  triggers.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  form.elements.noDomain.addEventListener('change', event => {
    const descriptive = event.target.checked;
    form.querySelector('[data-domain-field]').hidden = descriptive;
    form.querySelector('[data-description-field]').hidden = !descriptive;
    domain.disabled = descriptive;
    domain.required = !descriptive;
    description.disabled = !descriptive;
    description.required = descriptive;
    status.textContent = '';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    const payload = {
      email: form.elements.email.value.trim(),
      domain: domain.disabled ? '' : domain.value.trim(),
      description: description.disabled ? '' : description.value.trim(),
      page: location.pathname
    };
    if (!payload.domain && !payload.description) {
      status.textContent = 'Укажите домен или опишите, что нужно перенести.';
      return;
    }
    submit.disabled = true;
    status.textContent = 'Отправляем запрос…';
    try {
      const response = await fetch('/api/migration-request', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) throw new Error('Not accepted');
      form.hidden = true;
      status.textContent = 'Спасибо, ваш запрос отправлен. Наши специалисты свяжутся с вами в течение 24 часов.';
    } catch {
      status.textContent = 'Не удалось отправить запрос. Попробуйте позже или свяжитесь с поддержкой.';
    } finally {
      submit.disabled = false;
    }
  });
})();
