(()=>{
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  qsa('.faq-item button').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item'), ans=qs('.faq-answer',item), open=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));ans.hidden=!open;}));
  [['cpuRange','cpuOut'],['ramRange','ramOut'],['diskRange','diskOut']].forEach(([i,o])=>{const input=qs('#'+i),out=qs('#'+o); if(input&&out) input.addEventListener('input',()=>out.value=input.value)});
  qsa('[data-config-mode]').forEach(btn=>btn.addEventListener('click',()=>{qsa('[data-config-mode]').forEach(x=>x.classList.toggle('active',x===btn)); if(btn.dataset.configMode==='custom') qs('#custom')?.scrollIntoView({behavior:'smooth'});}));
  const toggle=qs('#appsToggle'), items=qsa('.app-item'); let expanded=false, filter='all';
  const paint=()=>{let visibleCount=0;items.forEach((item,idx)=>{const match=filter==='all'||item.dataset.appCategory===filter; const allowed=expanded||visibleCount<18; item.style.display=(match&&allowed)?'grid':'none'; if(match) visibleCount++;}); if(toggle){toggle.textContent=expanded?'Свернуть каталог ↑':'Показать все 55 →'; toggle.style.display=(filter==='all'||visibleCount>18)?'inline-flex':'none';}};
  qsa('[data-app-filter]').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.appFilter;expanded=false;qsa('[data-app-filter]').forEach(x=>x.classList.toggle('active',x===btn));paint();}));
  toggle?.addEventListener('click',()=>{expanded=!expanded;paint();}); paint();
  qsa('[data-plan]').forEach(btn=>btn.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('entra:vps-plan',{detail:{plan:btn.dataset.plan}}));}));
})();
