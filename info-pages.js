(()=>{
  document.querySelectorAll('.demo-form').forEach(form=>{
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('.form-status');if(status)status.textContent='Заявка сохранена в демо-форме. Отправку подключим к CRM/почте на этапе интеграции.';});
  });
  const search=document.getElementById('kb-search');
  if(search){const items=[...document.querySelectorAll('[data-kb-item]')];const empty=document.getElementById('kb-empty');search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let shown=0;items.forEach(item=>{const hay=(item.dataset.searchText||item.textContent).toLowerCase();const ok=!q||hay.includes(q);item.hidden=!ok;if(ok)shown++;});if(empty)empty.hidden=shown>0;});}
})();