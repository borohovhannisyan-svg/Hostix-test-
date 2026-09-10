(() => {
  const header=document.querySelector('header');
  const menuButtons=[...document.querySelectorAll('[data-menu]')];
  let leaveTimer;
  function closeMenus(){document.querySelectorAll('.mega-panel').forEach(p=>p.hidden=true);menuButtons.forEach(b=>b.setAttribute('aria-expanded','false'));clearTimeout(leaveTimer);}
  function openMenu(button){clearTimeout(leaveTimer);closeMenus();const panel=document.getElementById('menu-'+button.dataset.menu);if(!panel)return;panel.hidden=false;button.setAttribute('aria-expanded','true');}
  menuButtons.forEach(b=>{
    b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:761px)').matches)openMenu(b);});
    b.addEventListener('click',()=>b.getAttribute('aria-expanded')==='true'?closeMenus():openMenu(b));
    b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openMenu(b);document.querySelector('#menu-'+b.dataset.menu+' a')?.focus();}});
  });
  if(header){header.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')leaveTimer=setTimeout(closeMenus,180);});header.addEventListener('pointerenter',()=>clearTimeout(leaveTimer));header.addEventListener('focusout',()=>setTimeout(()=>{if(!header.contains(document.activeElement))closeMenus();},0));}
  document.querySelectorAll('[data-close-menu]').forEach(b=>b.addEventListener('click',()=>closeMenus()));
  document.addEventListener('click',e=>{if(header&&!header.contains(e.target))closeMenus();});
  const burger=document.querySelector('.utility-burger'),utility=document.querySelector('#utility-menu');
  function closeUtility(){if(!utility||!burger)return;utility.classList.remove('open');burger.setAttribute('aria-expanded','false');}
  if(burger&&utility)burger.addEventListener('click',()=>{const open=burger.getAttribute('aria-expanded')!=='true';burger.setAttribute('aria-expanded',String(open));utility.classList.toggle('open',open);});
  document.addEventListener('click',e=>{if(!e.target.closest('.topbar'))closeUtility();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenus();closeUtility();}});
  document.querySelectorAll('.mega-panel a,.utility-links a').forEach(a=>a.addEventListener('click',()=>{closeMenus();closeUtility();}));

  const dialog=document.querySelector('#shell-dialog');
  const dialogTitle=document.querySelector('#shell-dialog-title');
  const dialogBody=document.querySelector('#shell-dialog-body');
  if(dialog&&dialogTitle&&dialogBody){
    const close=dialog.querySelector('.dialog-close');
    close?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    document.querySelectorAll('[data-info]').forEach(b=>b.addEventListener('click',()=>{dialogTitle.textContent=b.dataset.info||'ENTRA';dialogBody.innerHTML='<p>Раздел подготовлен в структуре сайта. Содержание подключим на следующем этапе.</p>';dialog.showModal();}));
    document.querySelectorAll('[data-search]').forEach(b=>b.addEventListener('click',()=>{dialogTitle.textContent='Найдите свой продукт';dialogBody.innerHTML='<div class="search-results"><a href="entra-domains.html#top">Домены →</a><a href="entra-hosting.html#standard">Хостинг →</a><a href="entra-homepage.html#vps">VPS / VDS →</a><a href="entra-homepage.html#servers">Выделенные серверы →</a><a href="entra-homepage.html#email">Корпоративная почта →</a><a href="entra-homepage.html#vpn">VPN →</a></div>';dialog.showModal();}));
  }
  document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{
    document.dispatchEvent(new CustomEvent('site:languagechange',{detail:{language:b.dataset.language}}));
  }));
})();