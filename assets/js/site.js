/* Mobile nav */
(function(){
  var btn=document.getElementById('navToggle'); var menu=document.getElementById('mobileMenu'); if(!btn||!menu) return;
  function openMenu(open){ btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); }
  btn.addEventListener('click', function(){ var isOpen = btn.getAttribute('aria-expanded')==='true'; openMenu(!isOpen); });
})();

/* Headline per-line reveal */
(function(){
  var el=document.getElementById('heroTitle'); if(!el) return;
  function wrap(node){
    if(node.nodeType===3){ var parts=node.textContent.split(' '), f=document.createDocumentFragment(); for(var i=0;i<parts.length;i++){ if(i>0) f.appendChild(document.createTextNode(' ')); var p=parts[i]; if(!p) continue; var s=document.createElement('span'); s.className='reveal-token'; s.textContent=p; f.appendChild(s); } node.parentNode.replaceChild(f,node); }
    else if(node.nodeType===1){ var kids=[].slice.call(node.childNodes); kids.forEach(wrap); }
  }
  function go(){ [].slice.call(el.childNodes).forEach(wrap); var tokens=[].slice.call(el.querySelectorAll('.reveal-token')); if(!tokens.length){ el.classList.add('loaded'); return; }
    var lines=[], curTop=null, cur=[]; tokens.forEach(function(t){ var top=t.offsetTop; if(curTop===null) curTop=top; if(Math.abs(top-curTop)>2){ lines.push(cur); cur=[]; curTop=top; } cur.push(t); }); if(cur.length) lines.push(cur);
    lines.forEach(function(arr,i){ var j=0; while(j<arr.length){ var parent=arr[j].parentNode; var k=j; while(k<arr.length && arr[k].parentNode===parent) k++; var first=arr[j], last=arr[k-1]; var r=document.createRange(); r.setStartBefore(first); r.setEndAfter(last); var outer=document.createElement('span'); outer.className='reveal-line'; outer.style.setProperty('--d',(i*0.08)+'s'); try{ r.surroundContents(outer); var inner=document.createElement('span'); inner.setAttribute('data-reveal-text',''); while(outer.firstChild) inner.appendChild(outer.firstChild); outer.appendChild(inner);}catch(e){} j=k; } });
    requestAnimationFrame(function(){ el.classList.add('loaded'); });
  }
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(go, go); } else { go(); }
})();

/* Theme toggle */
(function(){
  var btn=document.getElementById('themeToggle'); if(!btn) return;
  var SUN='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  var MOON='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  function apply(mode){ var dark=mode==='dark'; document.body.classList.toggle('dark', dark); btn.setAttribute('aria-pressed', String(dark)); btn.innerHTML = dark ? SUN : MOON; localStorage.setItem('theme', dark ? 'dark' : 'light'); }
  var saved=localStorage.getItem('theme'); var prefers=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; apply(saved ? saved : (prefers ? 'dark' : 'light'));
  btn.addEventListener('click', function(){ apply(document.body.classList.contains('dark') ? 'light' : 'dark'); });
})();

/* Members subscribe feedback hooks */
document.addEventListener('submit', function(e){
  var form = e.target.closest('[data-members-form="subscribe"]'); if(!form) return;
  var success = form.querySelector('.success-message'); var error = form.querySelector('.error-message');
  form.addEventListener('success', function(){ if(success){ success.style.display='block'; } if(error){ error.style.display='none'; } });
  form.addEventListener('error', function(){ if(error){ error.style.display='block'; } if(success){ success.style.display='none'; } });
}, { once: true });

/* Lottie auto-loader (loads only if hero.json exists) */
(function(){
  var mount=document.getElementById('lottieMount'); if(!mount) return;
  var src=mount.getAttribute('data-src'); if(!src) return;
  fetch(src, { method:'GET' }).then(function(r){
    if(!r.ok) throw new Error('no lottie'); return r.json();
  }).then(function(json){
    // load lottie-web from CDN only when needed
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';
    s.onload=function(){
      try{
        window.lottie && window.lottie.loadAnimation({
          container: mount,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: json
        });
      }catch(e){ console.warn('Lottie init failed', e); }
    };
    document.head.appendChild(s);
  }).catch(function(){ /* keep placeholder */ });
})();


/* Compute CSS --nav-h from actual nav height (fonts can change it) */
(function(){
  var nav=document.querySelector('.nav-bar'); if(!nav) return;
  function setNavH(){ var h = nav.offsetHeight || 64; document.documentElement.style.setProperty('--nav-h', (h + 8) + 'px'); }
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(setNavH, setNavH); } else { setNavH(); }
  window.addEventListener('resize', function(){ window.requestAnimationFrame(setNavH); });
})();

/* Tags dropdown */
(function(){
  var btn=document.getElementById('navTagsBtn');
  var panel=document.getElementById('tagsPanel');
  if(btn && panel){
    function setOpen(open){ btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open; }
    btn.addEventListener('click', function(){ setOpen(panel.hidden); });
    document.addEventListener('click', function(e){
      if(!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
  }
  var mBtn=document.getElementById('mTagsBtn');
  if(mBtn && panel){
    mBtn.addEventListener('click', function(){ panel.hidden = !panel.hidden; });
  }
})();

/* Modal helpers */
function openModal(id){ var el=document.getElementById(id); if(!el) return; el.hidden=false; document.body.style.overflow='hidden'; }
function closeModal(id){ var el=document.getElementById(id); if(!el) return; el.hidden=true; document.body.style.overflow=''; }
document.addEventListener('click', function(e){
  var closeId = e.target.getAttribute('data-close');
  if(closeId){ closeModal(closeId); }
  if(e.target.classList.contains('modal-overlay')){ closeModal(e.target.id); }
});

/* Lazy-load Ghost Portal and open */
function ensurePortal(cb){
  if(window.GhostPortal && typeof window.GhostPortal.open === 'function'){ cb(); return; }
  var s=document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@tryghost/portal@~1.42/umd/portal.min.js';
  s.onload = cb;
  s.onerror = function(){ console.warn('Portal failed to load'); };
  document.head.appendChild(s);
}
function openPortalView(view){
  ensurePortal(function(){
    try{
      window.GhostPortal.open({ name: view });
    }catch(e){ console.warn('Portal open failed', e); }
  });
}

/* Auth buttons */
(function(){
  var a=document.getElementById('authBtn'); var am=document.getElementById('mAuthBtn');
  if(a){ a.addEventListener('click', function(){ openModal('authModal'); }); }
  if(am){ am.addEventListener('click', function(){ openModal('authModal'); }); }
  var modal=document.getElementById('authModal');
  if(modal){
    modal.addEventListener('click', function(e){
      var v = e.target.getAttribute('data-portal');
      if(v){ closeModal('authModal'); openPortalView(v); }
    });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !modal.hidden){ closeModal('authModal'); }});
  }
})();


/* Intercept special nav anchors: #auth (open modal), #tags (open panel), #logout (signout) */
(function(){
  function onClick(e){
    var a = e.target.closest('a'); if(!a) return;
    var href = a.getAttribute('href'); if(!href) return;
    if(href === '#auth'){
      e.preventDefault(); openModal('authModal');
    } else if(href === '#tags'){
      e.preventDefault();
      var panel = document.getElementById('tagsPanel');
      if(panel){
        // Always open the panel
        panel.hidden = false;
        // Close mobile menu if open
        var menu = document.getElementById('mobileMenu');
        if(menu && menu.classList.contains('open')){ menu.classList.remove('open'); }
        // Click outside to close
        function outside(ev){
          if(!panel.contains(ev.target) && !a.contains(ev.target)){
            panel.hidden = true; document.removeEventListener('click', outside, true);
          }
        }
        document.addEventListener('click', outside, true);
      }
    } else if(href === '#logout'){
      e.preventDefault();
      var s = document.getElementById('__signout'); if(s){ s.click(); }
    }
  }
  var navbars = document.querySelectorAll('.nav-bar, #mobileMenu');
  navbars.forEach(function(el){ el.addEventListener('click', onClick); });
})();


/* Mobile nav (robust) */
(function initMobileNav(){
  function wire(){
    var btn=document.getElementById('navToggle'); var menu=document.getElementById('mobileMenu');
    if(!btn||!menu) return;
    function set(open){ btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); }
    btn.addEventListener('click', function(e){ e.stopPropagation(); set(menu && !menu.classList.contains('open')); });
    document.addEventListener('click', function(e){
      if(menu && menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)){ set(false); }
    });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', wire); }
  else { wire(); }
})();


/* Mobile nav (final pass) */
(function(){
  function setup(){
    var btn=document.getElementById('navToggle');
    var menu=document.getElementById('mobileMenu');
    if(!btn||!menu) return;
    if(btn.__wired) return; btn.__wired=true;
    function set(open){ btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); }
    btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); set(!menu.classList.contains('open')); });
    document.addEventListener('click', function(e){
      if(menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)){ set(false); }
    }, true);
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', setup); } else { setup(); }
})();


/* Clone primary/secondary nav into mobile menu if empty */
(function(){
  function cloneNav(){
    var menu=document.getElementById('mobileMenu'); if(!menu) return;
    var hasList = menu.querySelector('ul.nav li');
    if(hasList) return;
    var primary=document.querySelector('.nav-bar ul.nav');
    var secondary=document.querySelector('.tags-panel .tags-grid ul.nav');
    if(primary){
      var p=primary.cloneNode(true);
      menu.appendChild(p);
    }
    if(secondary){
      var s=secondary.cloneNode(true);
      menu.appendChild(s);
    }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', cloneNav); } else { cloneNav(); }
})();

/* Avoid panel overlap: close tags panel when opening mobile menu, and close menu when opening tags */
(function autoClosePanelsForMobile(){
  var btn=document.getElementById('navToggle');
  var menu=document.getElementById('mobileMenu');
  var tagsPanel=document.getElementById('tagsPanel');
  if(btn && menu){
    btn.addEventListener('click', function(){
      if(tagsPanel && !tagsPanel.hidden){ tagsPanel.hidden = true; }
    });
  }
  var nav=document.querySelector('.nav-bar');
  if(nav && tagsPanel){
    nav.addEventListener('click', function(e){
      var a=e.target.closest('a'); if(!a) return;
      if(a.getAttribute('href')==='#tags' && menu && menu.classList.contains('open')){
        menu.classList.remove('open');
      }
    });
  }
})();


/* v0.4.18 — runtime fallback to ensure overrides win */
(function(){
  try{
    var id='nb-overrides';
    if(!document.getElementById(id)){
      var css = "\n/* ===== v0.4.18 overrides \u2014 brutalist Koenig cards + post padding ===== */\n:root{ --wrap-x: clamp(16px, 4vw, 56px); }\n\n/* Post body alignment */\n.post-template .gh-content,\n.post-template main .gh-content,\n.post-template article .gh-content,\n.post-template .content,\n.post-template .post-content{ padding-left: var(--wrap-x) !important; padding-right: var(--wrap-x) !important; }\n\n/* Blockquote */\n.post-template .gh-content blockquote,\n.post-template .gh-content .kg-blockquote-alt{\n  position:relative; margin: 1.75rem 0 !important;\n  padding: 1.25rem 1.25rem 1.25rem 1.5rem !important;\n  background: var(--paper, #F1EEE5) !important;\n  border: 3px solid var(--ink, #0a0a0a) !important;\n  border-radius: 14px !important;\n  box-shadow: 10px 10px 0 #000 !important;\n  font-size: clamp(1.05rem, 1vw + .8rem, 1.25rem) !important;\n  line-height: 1.5 !important;\n}\n.post-template .gh-content blockquote:before{\n  content:\"\u201c\"; position:absolute; left:.8rem; top:.2rem; font-weight:900; font-size:1.2em;\n}\n\n/* Button card */\n.post-template .gh-content .kg-button-card{ display:grid !important; place-items:start !important; margin: 1rem 0 !important; }\n.post-template .gh-content .kg-button-card.kg-align-center{ place-items:center !important; }\n.post-template .gh-content .kg-button-card .kg-btn{\n  appearance:none; background: var(--ink, #0a0a0a) !important; color:#fff !important;\n  border:3px solid var(--ink, #0a0a0a) !important; border-radius:999px !important;\n  padding:.85rem 1.25rem !important; line-height:1 !important;\n  box-shadow:6px 6px 0 #000 !important; text-decoration:none !important; font-weight:700 !important;\n  transition: transform .06s ease, box-shadow .06s ease;\n}\n\n/* Callout */\n.post-template .gh-content .kg-callout-card{\n  display:grid !important; grid-template-columns:auto 1fr !important; gap:.75rem 1rem !important; align-items:start !important;\n  padding:1rem 1.25rem !important; border-radius:14px !important;\n  border:3px solid var(--ink, #0a0a0a) !important; background: var(--paper, #F1EEE5) !important;\n  box-shadow:10px 10px 0 #000 !important; margin: 1.25rem 0 !important;\n}\n.post-template .gh-content .kg-callout-card .kg-callout-emoji{\n  width:2.2rem; height:2.2rem; display:grid; place-items:center;\n  background:#fff; border-radius:999px; border:3px solid var(--ink, #0a0a0a);\n  box-shadow:4px 4px 0 #000; font-size:1.25rem;\n}\n\n/* Signup */\n.post-template .gh-content .kg-signup-card{\n  padding: clamp(1rem, 2vw, 1.5rem) !important; border-radius:14px !important;\n  border:3px solid var(--ink, #0a0a0a) !important; background: var(--paper, #F1EEE5) !important;\n  box-shadow:12px 12px 0 #000 !important; margin: 1.5rem 0 !important;\n}\n.post-template .gh-content .kg-signup-card .kg-signup-card-fields{ display:grid !important; grid-template-columns:1fr auto !important; gap:.6rem !important; }\n@media (max-width: 620px){ .post-template .gh-content .kg-signup-card .kg-signup-card-fields{ grid-template-columns:1fr !important; } }\n.post-template .gh-content .kg-signup-card .kg-signup-card-input{\n  background:#fff !important; border:3px solid var(--ink, #0a0a0a) !important; border-radius:999px !important; padding:.9rem 1rem !important;\n}\n.post-template .gh-content .kg-signup-card .kg-signup-card-button{\n  border-radius:999px !important; border:3px solid var(--ink, #0a0a0a) !important; background:var(--ink, #0a0a0a) !important; color:#fff !important;\n  padding:.9rem 1.2rem !important; line-height:1 !important; box-shadow:6px 6px 0 #000 !important;\n  transition: transform .06s ease, box-shadow .06s ease;\n}\n\n/* HTML card wrapper */\n.post-template .gh-content .nb-html{\n  padding: 1rem 1.25rem !important; border:3px solid var(--ink, #0a0a0a) !important;\n  border-radius:14px !important; background: var(--paper, #F1EEE5) !important; box-shadow:10px 10px 0 #000 !important; margin:1.25rem 0 !important;\n}\n\n/* Wide/full helpers */\n.kg-width-wide{ width:min(1040px, 90vw); margin-inline:auto; }\n.kg-width-full{ width:100vw; margin-left:50%; transform:translateX(-50%); }\n";
      var s=document.createElement('style'); s.id=id; s.textContent=css;
      document.head.appendChild(s);
    }
  }catch(e){}
})();