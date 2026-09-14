(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // Page-local service menu mapping. Shared menu code remains untouched until approval.
  const serviceLinks=[
    ['Техническое сопровождение проекта','#support'],
    ['IPv4 / IPv6','#ip'],
    ['Сетевые услуги','#network'],
    ['Защита от DDoS','#ddos'],
    ['Корпоративный почтовый сервер','#mail-server'],
    ['Хранение данных','#storage'],
    ['Создание инфраструктуры','#infrastructure']
  ];

  const serviceButton=$('[data-menu="services"]');
  serviceButton?.classList.add('current-menu');
  const header=$('header');
  if(header && !$('.product-subnav',header)){
    const links=serviceLinks.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
    header.insertAdjacentHTML('beforeend',`<div class="product-subnav" aria-label="Разделы страницы Услуги"><div class="wrap">${links}</div></div>`);
  }
  const servicePanel=$('#menu-services');
  if(servicePanel){
    const items=$$('.mega-item',servicePanel);
    items.forEach((item,i)=>{ if(serviceLinks[i]) item.href=serviceLinks[i][1]; });
  }

  const dialog=$('#services-request-dialog');
  const close=$('#closeServicesRequest');
  const interest=$('#services-interest');
  const form=$('#services-request-form');
  const status=$('#services-request-status');

  $$('[data-service-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const value=btn.dataset.serviceAction || 'Консультация по услугам';
    if(interest){
      const match=[...interest.options].find(o=>o.value===value || o.textContent===value);
      if(match) interest.value=match.value;
      else interest.value='Консультация по услугам';
    }
    if(dialog?.showModal) dialog.showModal();
  }));
  close?.addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('click',e=>{ if(e.target===dialog) dialog.close(); });
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    if(status) status.textContent='Заявка подготовлена. Подключение формы к CRM сделаем на этапе интеграции.';
  });

  // Smooth local anchors without interfering with shared navigation.
  $$('.product-subnav a, #menu-services a').forEach(a=>{
    if(!a.getAttribute('href')?.startsWith('#')) return;
    a.addEventListener('click',e=>{
      const target=$(a.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
})();
