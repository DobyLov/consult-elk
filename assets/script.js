
// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t = document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault(); t.scrollIntoView({behavior:'smooth'});}
  });
});

// Form mock
const form=document.querySelector('#contact-form');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const ok=document.querySelector('.success'); if(ok){ok.style.display='block';}
    form.reset();
  });
}

// Theme toggle with persistence
(function(){
  const root = document.documentElement;
  // Initialize from localStorage or OS preference
  const saved = localStorage.getItem('theme');
  if(saved){
    root.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  const btn = document.querySelector('[data-theme-toggle]');
  if(btn){
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.setAttribute('aria-pressed', next === 'dark');
      btn.title = next === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre';
    });
  }
})();
