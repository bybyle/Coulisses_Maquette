
(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var emailOk=function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)};
  var store={get:function(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  var say=function(el,t,ok){el.textContent=t;el.className='cdo-msg '+(ok?'ok':'err')};


  var nl=$('#cdo-nl');
  nl.addEventListener('submit',function(e){e.preventDefault();var m=$('#cdo-nl-msg');
    if(!emailOk($('#cdo-nl-email').value.trim()))return say(m,'Merci de saisir une adresse e-mail valide.');
    if(!$('#cdo-nl-ok').checked)return say(m,'Merci d’accepter de recevoir la newsletter pour continuer.');
    nl.reset();say(m,'Merci ! Vous êtes inscrit(e) à la newsletter Tintin.com (simulation).',true);});


  var inp=$('#cdo-reseller-search');
  inp.addEventListener('input',function(){var q=inp.value.trim().toLowerCase(),n=0;
    $$('.cdo-reseller').forEach(function(li){var ok=!q||li.getAttribute('data-search').indexOf(q)>-1;li.hidden=!ok;if(ok)n++});
    $('#cdo-noresult').hidden=n>0;});

  var modal=$('#cdo-modal'),mode='',lastFocus=null;
  function open(m,title){mode=m;lastFocus=document.activeElement;
    $('#cdo-modal-title').textContent=m==='alert'?'Être prévenu(e) de la parution':'Précommander';
    $('#cdo-modal-sub').textContent=m==='alert'
      ?'Recevez un e-mail dès que « '+title+' » est disponible.'
      :'Laissez-nous votre e-mail : nous vous contacterons dès l’ouverture des précommandes de « '+title+' ».';
    $('#cdo-modal-btn').textContent=m==='alert'?'Me prévenir':'Je me préinscris';
    $('#cdo-modal-form').reset();$('#cdo-modal-msg').textContent='';modal.hidden=false;$('#cdo-modal-email').focus();}
  function close(){modal.hidden=true;if(lastFocus)lastFocus.focus()}
  $('.cdo-modal-close').addEventListener('click',close);
  modal.addEventListener('click',function(e){if(e.target===modal)close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close()});
  $('#cdo-modal-form').addEventListener('submit',function(e){e.preventDefault();var m=$('#cdo-modal-msg');
    if(!emailOk($('#cdo-modal-email').value.trim()))return say(m,'Merci de saisir une adresse e-mail valide.');
    if(!$('#cdo-modal-ok').checked)return say(m,'Merci de cocher la case de consentement.');
    say(m,mode==='alert'?'C’est noté, vous serez prévenu(e) (simulation).':'Préinscription enregistrée (simulation).',true);
    setTimeout(close,1400);});


  var interest=store.get('cdo-interest')||{};
  $$('.cdo-up').forEach(function(card){
    var id=card.getAttribute('data-id'),btn=$('.js-interest',card),c=$('.js-count',card),
        alertBtn=$('.js-alert',card),preBtn=$('.js-preorder',card);
    /* Les boutons sont optionnels : on n'attache que ceux présents dans la carte */
    if(btn&&c){
      var base=+c.getAttribute('data-base')||0;
      var paint=function(){var on=!!interest[id];btn.setAttribute('aria-pressed',on);btn.textContent=on?'✓ Intérêt enregistré':'Ça m’intéresse';c.textContent=base+(on?1:0)};
      paint();
      btn.addEventListener('click',function(){interest[id]=!interest[id];store.set('cdo-interest',interest);paint()});
    }
    if(alertBtn)alertBtn.addEventListener('click',function(){open('alert',card.getAttribute('data-title'))});
    if(preBtn)preBtn.addEventListener('click',function(){open('preorder',card.getAttribute('data-title'))});
  });
})();


document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="#"]');if(a)e.preventDefault()});
