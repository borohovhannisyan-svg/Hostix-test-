(() => {
  const dialog = document.querySelector('#vpn-request-dialog');
  const form = dialog?.querySelector('form');
  const product = dialog?.querySelector('[name="product"]');
  const title = dialog?.querySelector('#vpn-request-title');

  document.querySelectorAll('[data-vpn-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.vpnAction || 'VPN ENTRA';
      if (title) title.textContent = action;
      if (product) {
        const value = action.includes('Premium') || action.includes('Standard') ? 'VPN в Армении' : action;
        [...product.options].forEach(option => option.selected = option.value === value);
      }
      dialog?.showModal();
    });
  });

  dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
    dialog.close();
  });

  document.querySelectorAll('.vpn-faq .faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      if (!item || !answer) return;
      const open = item.classList.toggle('open');
      answer.hidden = !open;
    });
  });
})();
