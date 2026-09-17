(() => {
  const filters=[...document.querySelectorAll('[data-ssl-filter]')];
  const cards=[...document.querySelectorAll('.ssl-card[data-ssl-type]')];
  const showAll=document.getElementById('show-all-ssl');
  let expanded=false;

  function applyFilter(type='all'){
    filters.forEach(button=>{
      const active=button.dataset.sslFilter===type;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });
    cards.forEach((card,index)=>{
      const matches=type==='all'||card.dataset.sslType===type;
      const withinInitial=index<6;
      card.hidden=!(matches&&(expanded||type!=='all'||withinInitial));
    });
    if(showAll){
      showAll.parentElement.hidden=type!=='all';
      showAll.childNodes[0].textContent=expanded?'Скрыть полный каталог ':'Показать весь каталог ';
    }
  }

  filters.forEach(button=>button.addEventListener('click',()=>applyFilter(button.dataset.sslFilter)));
  showAll?.addEventListener('click',()=>{expanded=!expanded;applyFilter('all')});

  document.querySelectorAll('[data-pick-type]').forEach(button=>button.addEventListener('click',()=>{
    applyFilter(button.dataset.pickType);
    document.getElementById('catalog')?.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  const interest=document.getElementById('ssl-interest');
  document.querySelectorAll('[data-ssl-order]').forEach(button=>button.addEventListener('click',()=>{
    if(interest)interest.value=button.dataset.sslOrder;
    document.getElementById('contact')?.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>document.getElementById('ssl-phone')?.focus(),450);
  }));

  const form=document.getElementById('ssl-contact-form');
  const phone=document.getElementById('ssl-phone');
  const status=document.getElementById('ssl-contact-status');
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    const digits=(phone?.value||'').replace(/\D/g,'');
    if(digits.length<7||digits.length>15){
      if(status)status.textContent='Укажите номер телефона: от 7 до 15 цифр, можно с кодом страны.';
      phone?.focus();
      return;
    }
    if(status)status.textContent=`Заявка на «${interest?.value||'SSL-сертификат'}» заполнена. Отправку подключим к CRM на этапе интеграции.`;
  });

  applyFilter('all');
})();
