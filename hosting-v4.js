(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => [...el.querySelectorAll(s)];
  const formatAMD = value => new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ֏';
  const billingButtons = qsa('[data-billing]');
  let billingMode = 'yearly';

  function renderPrices() {
    qsa('.plan-card').forEach(card => {
      const monthly = Number(card.dataset.month || 0);
      const annualTotal = monthly * 11;
      const annualEquivalent = annualTotal / 12;
      const oldPrice = qs('.old-price', card);
      const strong = qs('.plan-price strong', card);
      const period = qs('.price-period', card);
      const saving = qs('.price-saving', card);
      if (billingMode === 'yearly') {
        oldPrice.textContent = `${formatAMD(monthly)} / мес.`;
        strong.textContent = `${formatAMD(annualEquivalent)} / мес.`;
        period.textContent = `при оплате ${formatAMD(annualTotal)} / год`;
        saving.textContent = `Экономия ${formatAMD(monthly)} в год · 8%`;
      } else {
        oldPrice.textContent = '';
        strong.textContent = `${formatAMD(monthly)} / мес.`;
        period.textContent = 'помесячная оплата';
        saving.textContent = '';
      }
    });
  }

  billingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      billingMode = btn.dataset.billing;
      billingButtons.forEach(item => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      renderPrices();
    });
  });
  renderPrices();

  qsa('[data-plan-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.plan-card');
      const plan = card?.dataset.plan || 'тариф';
      const status = qs('#hosting-action-status');
      if (status) status.textContent = `${plan} выбран. Подключение WHMCS сделаем позже.`;
      const initial = btn.textContent;
      btn.textContent = 'Выбрано ✓';
      setTimeout(() => btn.textContent = initial, 1800);
    });
  });

  qsa('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = qs('.faq-answer', item);
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      answer.hidden = !open;
    });
  });

  const form = qs('#contact-form');
  const phone = qs('#phone');
  const extra = qs('#contact-extra');
  const status = qs('#contact-status');
  if (form && phone && extra && status) {
    const validPhone = () => /^\+?[\d\s().-]+$/.test(phone.value.trim()) && phone.value.replace(/\D/g,'').length >= 7 && phone.value.replace(/\D/g,'').length <= 15;
    const reveal = () => { extra.hidden = false; phone.setAttribute('aria-expanded','true'); qs('[type=submit]', form).textContent='Свяжитесь со мной →'; };
    phone.addEventListener('input', () => { phone.removeAttribute('aria-invalid'); status.textContent=''; if(validPhone()) reveal(); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if(!validPhone()){
        phone.setAttribute('aria-invalid','true');
        status.textContent='Укажите номер телефона: от 7 до 15 цифр.';
        phone.focus();
        return;
      }
      if(extra.hidden){ reveal(); return; }
      status.textContent='Данные заполнены. Это демонстрационная форма: отправка пока не подключена.';
    });
  }
})();