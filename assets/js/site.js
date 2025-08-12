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
  var SUN='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
  var MOON='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  
  // Apply theme with complete override
  function applyTheme(theme, skipTransition) {
    document.body.classList.remove('dark', 'light');
    
    if (theme === 'dark') {
      document.body.classList.add('dark');
      btn.innerHTML = SUN;
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      document.body.classList.add('light');
      btn.innerHTML = MOON;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Initialize immediately with saved theme or light default
  var savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme, true);
  
  // Toggle on click
  btn.addEventListener('click', function(e){ 
    e.preventDefault();
    e.stopPropagation();
    
    var currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    var newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
})();

/* Let Ghost handle all member functionality - we only provide styling */

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
        // Toggle panel visibility
        var isHidden = panel.hidden;
        panel.hidden = !isHidden;
        
        // Close mobile menu if open
        var menu = document.getElementById('mobileMenu');
        if(menu && menu.classList.contains('open')){ menu.classList.remove('open'); }
        
        // Only add click outside listener if we're opening the panel
        if(isHidden) {
          function outside(ev){
            if(!panel.contains(ev.target) && !a.contains(ev.target)){
              panel.hidden = true; 
              document.removeEventListener('click', outside, true);
            }
          }
          document.addEventListener('click', outside, true);
        }
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
    var btn=document.getElementById('navToggle'); 
    var menu=document.getElementById('mobileMenu');
    if(!btn||!menu) return;
    
    // Ensure menu starts closed
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    
    function set(open){ 
      btn.setAttribute('aria-expanded', String(open)); 
      menu.classList.toggle('open', open); 
    }
    
    btn.addEventListener('click', function(e){ 
      e.stopPropagation(); 
      e.preventDefault();
      var isOpen = menu.classList.contains('open');
      set(!isOpen); 
    });
    
    document.addEventListener('click', function(e){
      if(menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)){ 
        set(false); 
      }
    });
  }
  
  if(document.readyState === 'loading'){ 
    document.addEventListener('DOMContentLoaded', wire); 
  } else { 
    wire(); 
  }
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
      var css = "\n/* ===== v0.4.18 overrides \u2014 brutalist Koenig cards + post padding ===== */\n:root{ --wrap-x: clamp(16px, 4vw, 56px); }\n\n/* Post body alignment */\n.post-template .gh-content,\n.post-template main .gh-content,\n.post-template article .gh-content,\n.post-template .content,\n.post-template .post-content{ padding-left: var(--wrap-x) !important; padding-right: var(--wrap-x) !important; }\n\n/* Blockquote */\n.post-template .gh-content blockquote,\n.post-template .gh-content .kg-blockquote-alt{\n  position:relative; margin: 1.75rem 0 !important;\n  padding: 1.25rem 1.25rem 1.25rem 1.5rem !important;\n  background: var(--surface) !important;\n  border: 3px solid var(--ink) !important;\n  border-radius: 14px !important;\n  font-size: clamp(1.05rem, 1vw + .8rem, 1.25rem) !important;\n  line-height: 1.5 !important;\n}\nbody.light .post-template .gh-content blockquote,\nbody.light .post-template .gh-content .kg-blockquote-alt{\n  box-shadow: 10px 10px 0 #000000 !important;\n}\nbody.dark .post-template .gh-content blockquote,\nbody.dark .post-template .gh-content .kg-blockquote-alt{\n  box-shadow: 10px 10px 0 #ffffff !important;\n}\n.post-template .gh-content blockquote:before{\n  content:\"\u201c\"; position:absolute; left:.8rem; top:.2rem; font-weight:900; font-size:1.2em;\n}\n\n/* Button card */\n.post-template .gh-content .kg-button-card{ display:grid !important; place-items:start !important; margin: 1rem 0 !important; }\n.post-template .gh-content .kg-button-card.kg-align-center{ place-items:center !important; }\n.post-template .gh-content .kg-button-card .kg-btn{\n  appearance:none; background: var(--ink) !important;\n  border:3px solid var(--ink) !important; border-radius:999px !important;\n  padding:.85rem 1.25rem !important; line-height:1 !important;\n  text-decoration:none !important; font-weight:700 !important;\n  transition: transform .06s ease, box-shadow .06s ease;\n}\nbody.light .post-template .gh-content .kg-button-card .kg-btn{\n  color: #ffffff !important;\n  box-shadow:6px 6px 0 #ffffff !important;\n}\nbody.dark .post-template .gh-content .kg-button-card .kg-btn{\n  color: #000000 !important;\n  box-shadow:6px 6px 0 #000000 !important;\n}\n\n/* Callout */\n.post-template .gh-content .kg-callout-card{\n  display:grid !important; grid-template-columns:auto 1fr !important; gap:.75rem 1rem !important; align-items:start !important;\n  padding:1rem 1.25rem !important; border-radius:14px !important;\n  border:3px solid var(--ink) !important; background: var(--surface) !important;\n  margin: 1.25rem 0 !important;\n}\nbody.light .post-template .gh-content .kg-callout-card{\n  box-shadow:10px 10px 0 #000000 !important;\n}\nbody.dark .post-template .gh-content .kg-callout-card{\n  box-shadow:10px 10px 0 #ffffff !important;\n}\n.post-template .gh-content .kg-callout-card .kg-callout-emoji{\n  width:2.2rem; height:2.2rem; display:grid; place-items:center;\n  background: var(--surface); border-radius:999px; border:3px solid var(--ink);\n  font-size:1.25rem;\n}\nbody.light .post-template .gh-content .kg-callout-card .kg-callout-emoji{\n  box-shadow:4px 4px 0 #000000;\n}\nbody.dark .post-template .gh-content .kg-callout-card .kg-callout-emoji{\n  box-shadow:4px 4px 0 #ffffff;\n}\n\n/* Signup */\n.post-template .gh-content .kg-signup-card{\n  padding: clamp(1rem, 2vw, 1.5rem) !important; border-radius:14px !important;\n  border:3px solid var(--ink) !important; background: var(--surface) !important;\n  margin: 1.5rem 0 !important;\n}\nbody.light .post-template .gh-content .kg-signup-card{\n  box-shadow:12px 12px 0 #000000 !important;\n}\nbody.dark .post-template .gh-content .kg-signup-card{\n  box-shadow:12px 12px 0 #ffffff !important;\n}\n.post-template .gh-content .kg-signup-card .kg-signup-card-fields{ display:grid !important; grid-template-columns:1fr auto !important; gap:.6rem !important; }\n@media (max-width: 620px){ .post-template .gh-content .kg-signup-card .kg-signup-card-fields{ grid-template-columns:1fr !important; } }\n.post-template .gh-content .kg-signup-card .kg-signup-card-input{\n  background: var(--surface) !important; border:3px solid var(--ink) !important; border-radius:999px !important; padding:.9rem 1rem !important;\n}\n.post-template .gh-content .kg-signup-card .kg-signup-card-button{\n  border-radius:999px !important; border:3px solid var(--ink) !important; background:var(--ink) !important;\n  padding:.9rem 1.2rem !important; line-height:1 !important;\n  transition: transform .06s ease, box-shadow .06s ease;\n}\nbody.light .post-template .gh-content .kg-signup-card .kg-signup-card-button{\n  color: #ffffff !important;\n  box-shadow:6px 6px 0 #ffffff !important;\n}\nbody.dark .post-template .gh-content .kg-signup-card .kg-signup-card-button{\n  color: #000000 !important;\n  box-shadow:6px 6px 0 #000000 !important;\n}\n\n/* HTML card wrapper */\n.post-template .gh-content .nb-html{\n  padding: 1rem 1.25rem !important; border:3px solid var(--ink) !important;\n  border-radius:14px !important; background: var(--surface) !important; margin:1.25rem 0 !important;\n}\nbody.light .post-template .gh-content .nb-html{\n  box-shadow:10px 10px 0 #000000 !important;\n}\nbody.dark .post-template .gh-content .nb-html{\n  box-shadow:10px 10px 0 #ffffff !important;\n}\n\n/* Wide/full helpers */\n.kg-width-wide{ width:min(1040px, 90vw); margin-inline:auto; }\n.kg-width-full{ width:100vw; margin-left:50%; transform:translateX(-50%); }\n";
      var s=document.createElement('style'); s.id=id; s.textContent=css;
      document.head.appendChild(s);
    }
  }catch(e){}
})();

/* Signup Card Functionality */
(function signupCardHandler() {
  function handleSignupCard() {
    const signupCards = document.querySelectorAll('.kg-signup-card');
    
    signupCards.forEach(card => {
      const form = card.querySelector('form');
      const input = card.querySelector('.kg-signup-card-input');
      const button = card.querySelector('.kg-signup-card-button');
      const disclaimer = card.querySelector('.kg-signup-card-disclaimer');
      
      if (form && input && button) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const email = input.value.trim();
          if (!email || !email.includes('@')) {
            showSignupMessage(card, 'Please enter a valid email address.', 'error');
            return;
          }
          
          // Show loading state
          button.classList.add('loading');
          // Store and clear button content to prevent external script injection
          const originalHTML = button.innerHTML;
          button.innerHTML = 'Subscribing...';
          button.disabled = true;
          
          try {
            // Use Ghost's member API
            const response = await fetch('/members/api/send-magic-link/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email,
                emailType: 'signup'
              })
            });
            
            if (response.ok) {
              showSignupMessage(card, 'Thank you! Please check your email inbox to confirm your subscription.', 'success');
              input.value = '';
            } else {
              showSignupMessage(card, 'Something went wrong. Please try again.', 'error');
            }
          } catch (error) {
            console.warn('Signup failed, trying alternative method:', error);
            // Fallback: use Ghost Portal
            if (window.GhostPortal) {
              window.GhostPortal.open({
                name: 'signup',
                email: email
              });
              showSignupMessage(card, 'Thank you! Please check your email inbox to confirm your subscription.', 'success');
            } else {
              showSignupMessage(card, 'Please try again or contact support.', 'error');
            }
          } finally {
            // Reset button state completely
            button.classList.remove('loading');
            button.innerHTML = button.getAttribute('data-original-text') || 'Subscribe';
            button.disabled = false;
            
            // Clean up any injected content
            setTimeout(() => {
              if (button.innerHTML.includes('nc-loop-dots') || button.innerHTML.includes('notify me')) {
                button.innerHTML = button.getAttribute('data-original-text') || 'Subscribe';
              }
            }, 100);
          }
        });
        
        // Store original button text
        if (!button.hasAttribute('data-original-text')) {
          button.setAttribute('data-original-text', button.innerHTML.trim());
        }
      }
    });
  }
  
  function showSignupMessage(card, message, type) {
    let messageEl = card.querySelector('.kg-signup-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'kg-signup-message';
      
      // Find disclaimer or add after form
      const disclaimer = card.querySelector('.kg-signup-card-disclaimer');
      if (disclaimer) {
        disclaimer.parentNode.insertBefore(messageEl, disclaimer);
      } else {
        const form = card.querySelector('form');
        if (form) {
          form.appendChild(messageEl);
        }
      }
    }
    
    messageEl.textContent = message;
    messageEl.className = `kg-signup-message ${type}`;
    
    // Clean button of any injection attempts
    const button = card.querySelector('.kg-signup-card-button');
    if (button && type === 'success') {
      // Keep cleaning the button for a few seconds to prevent re-injection
      let cleanupAttempts = 0;
      const cleanup = () => {
        if (button.innerHTML.includes('nc-loop-dots') || 
            button.innerHTML.includes('notify me') ||
            button.innerHTML.includes('.nc-loop-dots-4-24-icon-o')) {
          button.innerHTML = button.getAttribute('data-original-text') || 'Subscribe';
        }
        cleanupAttempts++;
        if (cleanupAttempts < 20) { // Clean for ~2 seconds
          setTimeout(cleanup, 100);
        }
      };
      cleanup();
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl && messageEl.parentNode) {
          messageEl.remove();
        }
      }, 5000);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleSignupCard);
  } else {
    handleSignupCard();
  }
  
  // Re-initialize for dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node.classList.contains('kg-signup-card') || node.querySelector('.kg-signup-card'))) {
            handleSignupCard();
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})();

/* Code copy buttons */
(function(){
  function makeBtn(){ var b=document.createElement('button'); b.className='nb-copy-btn'; b.type='button'; b.textContent='copy'; return b; }
  function attach(block){
    if(block.dataset.nbCopy) return; block.dataset.nbCopy='1';
    var btn=makeBtn(); block.appendChild(btn);
    btn.addEventListener('click', function(){
      var code = block.querySelector('code') || block;
      var text = code.innerText || code.textContent || '';
      function done(ok){
        btn.textContent = ok ? 'copied' : 'failed';
        btn.classList.toggle('nb-copied', !!ok);
        setTimeout(function(){ btn.textContent='copy'; btn.classList.remove('nb-copied'); }, 1400);
      }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(false); });
      } else {
        try{
          var sel=window.getSelection(); var range=document.createRange();
          range.selectNodeContents(code); sel.removeAllRanges(); sel.addRange(range);
          document.execCommand('copy'); sel.removeAllRanges(); done(true);
        }catch(e){ done(false); }
      }
    });
  }
  function scan(root){
    (root || document).querySelectorAll('.gh-content pre, .kg-code-card pre').forEach(function(pre){ attach(pre.parentElement.classList.contains('kg-code-card') ? pre.parentElement : pre); });
  }
  if(document.readyState!=='loading') scan(document);
  else document.addEventListener('DOMContentLoaded', function(){ scan(document); });

  // Observe dynamically inserted content (e.g., portal/SPA transitions)
  var mo = new MutationObserver(function(muts){
    muts.forEach(function(m){ for(var i=0;i<m.addedNodes.length;i++){ var n=m.addedNodes[i]; if(n.nodeType===1) scan(n); } });
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});
})();

/* Load minimal JavaScript modules for theme functionality */
(function loadModules(){
  var modules = [
    'cards.js',
    'infinite-scroll.js',
    'lightbox.js'
  ];
  
  modules.forEach(function(module) {
    var script = document.createElement('script');
    script.src = '/assets/js/' + module;
    script.async = false; // Maintain load order
    script.onerror = function() {
      console.warn('Failed to load module:', module);
    };
    document.head.appendChild(script);
  });
})();

/* Minimal theme enhancements - let Ghost handle content functionality */
(function themeEnhancements(){
  // Initialize enhanced functionality
  function initEnhancements() {
    // Handle external links - just set attributes, no icons
    var externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(function(link) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // Enhanced smooth scrolling for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        var hash = link.getAttribute('href');
        if (hash === '#' || hash === '#auth' || hash === '#tags' || hash === '#logout') return;
        
        var targetId = hash.substring(1);
        var targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          var offset = 80; // Account for fixed header
          var elementPosition = targetElement.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
  } else {
    initEnhancements();
  }
})();

// Media Players Implementation
(function() {
  function initMediaPlayers() {
    initAudioPlayers();
    initVideoPlayers();
  }

  function initAudioPlayers() {
    const audioCards = document.querySelectorAll('.kg-audio-card');
    
    audioCards.forEach(card => {
      const audio = card.querySelector('audio');
      const player = card.querySelector('.kg-audio-player');
      
      if (!audio || !player) return;
      
      setupAudioPlayer(card, audio);
    });
  }
  
  function initVideoPlayers() {
    const videoCards = document.querySelectorAll('.kg-video-card');
    
    videoCards.forEach(card => {
      setupVideoCard(card);
    });
  }

  // Exact implementation based on cards.min.js
  function setupVideoCard(card) {
    const container = card.querySelector('.kg-video-container');
    const video = container?.querySelector('video');
    
    if (!container || !video) return;
    
    // Set aspect ratio like cards.min.js does
    if (video.width && video.height) {
      const aspectRatio = (video.height / video.width * 100).toFixed(3);
      container.style.paddingBottom = `${aspectRatio}%`;
    }
    
    setupVideoPlayer(card, video);
  }

  function setupAudioPlayer(card, audio) {
    const playIcon = card.querySelector('.kg-audio-play-icon');
    const pauseIcon = card.querySelector('.kg-audio-pause-icon');
    const seekSlider = card.querySelector('.kg-audio-seek-slider');
    const currentTime = card.querySelector('.kg-audio-current-time');
    const duration = card.querySelector('.kg-audio-duration');
    const playbackRate = card.querySelector('.kg-audio-playback-rate');
    const muteIcon = card.querySelector('.kg-audio-mute-icon');
    const unmuteIcon = card.querySelector('.kg-audio-unmute-icon');
    const volumeSlider = card.querySelector('.kg-audio-volume-slider');
    
    let animationFrame = null;
    let rateIndex = 1; // Start with 1x speed
    const rates = [
      {rate: 0.75, label: '0.7×'},
      {rate: 1, label: '1×'},
      {rate: 1.25, label: '1.2×'},
      {rate: 1.75, label: '1.7×'},
      {rate: 2, label: '2×'}
    ];
    
    // Format time helper
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Update progress
    function updateProgress() {
      if (seekSlider) {
        seekSlider.value = Math.floor(audio.currentTime);
        if (currentTime) currentTime.textContent = formatTime(seekSlider.value);
      }
      animationFrame = requestAnimationFrame(updateProgress);
    }
    
    // Initialize when metadata loaded
    function initializePlayer() {
      if (duration) duration.textContent = formatTime(audio.duration);
      if (seekSlider) seekSlider.max = Math.floor(audio.duration);
      if (playbackRate) playbackRate.textContent = rates[rateIndex].label;
    }
    
    if (audio.readyState > 0) {
      initializePlayer();
    } else {
      audio.addEventListener('loadedmetadata', initializePlayer);
    }
    
    // Play/Pause
    if (playIcon) {
      playIcon.addEventListener('click', () => {
        playIcon.classList.add('kg-audio-hide');
        pauseIcon.classList.remove('kg-audio-hide');
        audio.play();
        updateProgress();
      });
    }
    
    if (pauseIcon) {
      pauseIcon.addEventListener('click', () => {
        pauseIcon.classList.add('kg-audio-hide');
        playIcon.classList.remove('kg-audio-hide');
        audio.pause();
        if (animationFrame) cancelAnimationFrame(animationFrame);
      });
    }
    
    // Seek
    if (seekSlider) {
      seekSlider.addEventListener('input', () => {
        audio.currentTime = seekSlider.value;
        if (currentTime) currentTime.textContent = formatTime(seekSlider.value);
      });
    }
    
    // Playback rate
    if (playbackRate) {
      playbackRate.addEventListener('click', () => {
        rateIndex = (rateIndex + 1) % rates.length;
        const rate = rates[rateIndex];
        audio.playbackRate = rate.rate;
        playbackRate.textContent = rate.label;
      });
    }
    
    // Mute/Unmute  
    if (muteIcon) {
      muteIcon.addEventListener('click', () => {
        muteIcon.classList.add('kg-audio-hide');
        unmuteIcon.classList.remove('kg-audio-hide');
        audio.muted = false;
      });
    }
    
    if (unmuteIcon) {
      unmuteIcon.addEventListener('click', () => {
        unmuteIcon.classList.add('kg-audio-hide');
        muteIcon.classList.remove('kg-audio-hide');
        audio.muted = true;
      });
    }
    
    // Volume
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
      });
    }
  }

  function setupVideoPlayer(card, video) {
    const playIcon = card.querySelector('.kg-video-play-icon');
    const pauseIcon = card.querySelector('.kg-video-pause-icon');
    const seekSlider = card.querySelector('.kg-video-seek-slider');
    const currentTime = card.querySelector('.kg-video-current-time');
    const duration = card.querySelector('.kg-video-duration');
    const playbackRate = card.querySelector('.kg-video-playback-rate');
    const muteIcon = card.querySelector('.kg-video-mute-icon');
    const unmuteIcon = card.querySelector('.kg-video-unmute-icon');
    const volumeSlider = card.querySelector('.kg-video-volume-slider');
    
    let animationFrame = null;
    let rateIndex = 1; // Start with 1x speed
    const rates = [
      {rate: 0.75, label: '0.7×'},
      {rate: 1, label: '1×'},
      {rate: 1.25, label: '1.2×'},
      {rate: 1.75, label: '1.7×'},
      {rate: 2, label: '2×'}
    ];
    
    // Format time helper
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Update progress
    function updateProgress() {
      if (seekSlider) {
        seekSlider.value = Math.floor(video.currentTime);
        if (currentTime) currentTime.textContent = formatTime(seekSlider.value);
      }
      animationFrame = requestAnimationFrame(updateProgress);
    }
    
    // Initialize when metadata loaded
    function initializePlayer() {
      if (duration) duration.textContent = formatTime(video.duration);
      if (seekSlider) seekSlider.max = Math.floor(video.duration);
      if (playbackRate) playbackRate.textContent = rates[rateIndex].label;
    }
    
    if (video.readyState > 0) {
      initializePlayer();
    } else {
      video.addEventListener('loadedmetadata', initializePlayer);
    }
    
    // Play/Pause
    if (playIcon) {
      playIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        playIcon.classList.add('kg-video-hide');
        pauseIcon.classList.remove('kg-video-hide');
        video.play();
        updateProgress();
      });
    }
    
    if (pauseIcon) {
      pauseIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        pauseIcon.classList.add('kg-video-hide');
        playIcon.classList.remove('kg-video-hide');
        video.pause();
        if (animationFrame) cancelAnimationFrame(animationFrame);
      });
    }
    
    // Seek
    if (seekSlider) {
      seekSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        video.currentTime = seekSlider.value;
        if (currentTime) currentTime.textContent = formatTime(seekSlider.value);
      });
    }
    
    // Playback rate
    if (playbackRate) {
      playbackRate.addEventListener('click', (e) => {
        e.stopPropagation();
        rateIndex = (rateIndex + 1) % rates.length;
        const rate = rates[rateIndex];
        video.playbackRate = rate.rate;
        playbackRate.textContent = rate.label;
      });
    }
    
    // Mute/Unmute
    if (muteIcon) {
      muteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        muteIcon.classList.add('kg-video-hide');
        unmuteIcon.classList.remove('kg-video-hide');
        video.muted = false;
      });
    }
    
    if (unmuteIcon) {
      unmuteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        unmuteIcon.classList.add('kg-video-hide');
        muteIcon.classList.remove('kg-video-hide');
        video.muted = true;
      });
    }
    
    // Volume
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        video.volume = volumeSlider.value / 100;
      });
    }
    
    // Video click to play/pause
    video.addEventListener('click', () => {
      if (video.paused) {
        playIcon.classList.add('kg-video-hide');
        pauseIcon.classList.remove('kg-video-hide');
        video.play();
        updateProgress();
      } else {
        pauseIcon.classList.add('kg-video-hide');
        playIcon.classList.remove('kg-video-hide');
        video.pause();
        if (animationFrame) cancelAnimationFrame(animationFrame);
      }
    });
  }

  // Initialize media players
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaPlayers);
  } else {
    initMediaPlayers();
  }
})();

// Hero Title Line-by-Line Reveal Animation (Index page only)
(function() {
  // Only run on index page
  if (!document.body.classList.contains('home-template')) return;
  
  const el = document.getElementById('heroTitle');
  if (!el) return;
  
  function wrapTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(' ');
      const frag = document.createDocumentFragment();
      parts.forEach((p, idx) => {
        if (idx > 0) frag.appendChild(document.createTextNode(' '));
        if (!p) return;
        const s = document.createElement('span');
        s.className = 'reveal-token';
        s.textContent = p;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(wrapTextNodes);
    }
  }
  
  function computeLinesAndWrap() {
    Array.from(el.childNodes).forEach(wrapTextNodes);
    const tokens = Array.from(el.querySelectorAll('.reveal-token'));
    
    if (!tokens.length) {
      el.classList.add('loaded');
      return;
    }
    
    // Group by visual line (offsetTop)
    const lines = [];
    let curTop = null, cur = [];
    tokens.forEach(tk => {
      const top = tk.offsetTop;
      if (curTop === null) curTop = top;
      if (Math.abs(top - curTop) > 2) {
        lines.push(cur);
        cur = [];
        curTop = top;
      }
      cur.push(tk);
    });
    if (cur.length) lines.push(cur);
    
    // Wrap each line, but split into runs that share the same parent
    lines.forEach((arr, i) => {
      let j = 0;
      while (j < arr.length) {
        const parent = arr[j].parentNode;
        let k = j;
        while (k < arr.length && arr[k].parentNode === parent) k++;
        
        const first = arr[j], last = arr[k - 1];
        const range = document.createRange();
        range.setStartBefore(first);
        range.setEndAfter(last);
        
        const outer = document.createElement('span');
        outer.className = 'reveal-line';
        outer.style.setProperty('--d', (i * 0.08) + 's');
        
        try {
          range.surroundContents(outer);
          const inner = document.createElement('span');
          inner.setAttribute('data-reveal-text', '');
          while (outer.firstChild) inner.appendChild(outer.firstChild);
          outer.appendChild(inner);
        } catch (e) {
          // Fail-safe: if any browser complains, skip wrapping for this segment
          console.warn('Reveal wrap skipped for a segment:', e);
        }
        j = k;
      }
    });
    
    requestAnimationFrame(() => el.classList.add('loaded'));
  }
  
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(computeLinesAndWrap).catch(computeLinesAndWrap);
  } else {
    computeLinesAndWrap();
  }
})();

