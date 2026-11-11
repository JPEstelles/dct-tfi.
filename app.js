(function(){
  var VIEWS=['inicio','como-funciona','framework','planes','investigacion','webinars','registro'];
  var PLAN_LABEL={'pro-mensual':'Pro mensual','pro-anual':'Pro anual','enterprise':'Enterprise'};
  var menuBtn=document.getElementById('menu-btn'), mnav=document.getElementById('mobile-nav');
  var toastEl=document.getElementById('toast'), toastT;

  function toast(msg){toastEl.textContent=msg;toastEl.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){toastEl.hidden=true},3200)}
  function closeMenu(){mnav.hidden=true;menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Abrir menú')}

  function route(){
    var h=(location.hash||'').replace('#','');
    if(VIEWS.indexOf(h)<0) h='inicio';
    document.querySelectorAll('[data-view]').forEach(function(v){v.hidden=v.getAttribute('data-view')!==h});
    document.querySelectorAll('.nav a, .mobile-nav a:not(.btn)').forEach(function(a){
      if(a.getAttribute('href')==='#'+h) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    closeMenu();
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  route();

  menuBtn.addEventListener('click',function(){
    var open=mnav.hidden; mnav.hidden=!open;
    menuBtn.setAttribute('aria-expanded',String(open));
    menuBtn.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  });

  document.addEventListener('click',function(e){
    var p=e.target.closest('[data-pending]');
    if(p){e.preventDefault();toast(p.getAttribute('data-pending')+': por completar');return}
    var pl=e.target.closest('[data-plan]');
    if(pl){var r=document.querySelector('#reg-2 input[value="'+pl.getAttribute('data-plan')+'"]'); if(r) r.checked=true}
  });

  // Formularios de demostración: validan y confirman, sin enviar datos.
  document.querySelectorAll('.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!f.checkValidity()){f.reportValidity();return}
      var ok=f.querySelector('.form-ok');
      ok.textContent=f.getAttribute('data-ok');
      ok.hidden=false;
      f.reset();
    });
  });

  // Registro en tres pasos.
  var r1=document.getElementById('reg-1'), r2=document.getElementById('reg-2'), r3=document.getElementById('reg-3');
  function step(n){
    r1.hidden=n!==1; r2.hidden=n!==2; r3.hidden=n!==3;
    [1,2,3].forEach(function(i){var s=document.getElementById('sb-'+i); s.className=i===n?'on':(i<n?'done':'')});
  }
  r1.addEventListener('submit',function(e){e.preventDefault(); if(!r1.checkValidity()){r1.reportValidity();return} step(2)});
  document.getElementById('reg-back').addEventListener('click',function(){step(1)});
  r2.addEventListener('submit',function(e){
    e.preventDefault();
    var v=(r2.querySelector('input[name="plan"]:checked')||{}).value;
    var n=document.getElementById('r-nombre').value.trim();
    document.getElementById('reg-name').textContent=n?(', '+n.split(' ')[0]):'';
    document.getElementById('reg-plan').textContent=PLAN_LABEL[v]||'';
    step(3);
  });
})();
