// CURSOR
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if (cur && ring) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function animRing(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);})();
  document.querySelectorAll('a,button,.service-card,.area-tag,.review-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.classList.add('hover');ring.classList.add('hover');});
    el.addEventListener('mouseleave',()=>{cur.classList.remove('hover');ring.classList.remove('hover');});
  });
  document.addEventListener('mouseleave',()=>{cur.style.opacity=0;ring.style.opacity=0;});
  document.addEventListener('mouseenter',()=>{cur.style.opacity=1;ring.style.opacity=1;});
}

// NAV SCROLL
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('main-nav');
  if(nav) nav.classList.toggle('scrolled',scrollY>60);
  const st=document.getElementById('scrolltop');
  if(st) st.classList.toggle('visible',scrollY>400);
});

// ACTIVE NAV
(function(){
  const path=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href===path||(path===''&&href==='index.html')||(path==='index.html'&&href==='index.html')) a.classList.add('active');
  });
})();

// MOBILE MENU
let mobileOpen=false;
function toggleMobile(){
  mobileOpen=!mobileOpen;
  const links=document.querySelector('.nav-links');
  if(mobileOpen){
    links.style.cssText='display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;z-index:90;background:rgba(8,12,8,0.98);backdrop-filter:blur(20px);align-items:center;justify-content:center;gap:32px;';
    links.querySelectorAll('a').forEach(a=>{a.style.fontSize='28px';a.style.letterSpacing='3px';});
  } else {
    links.style.cssText='display:none;';
  }
}

// REVEAL
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// SCROLL TOP
const scrollTopBtn=document.getElementById('scrolltop');
if(scrollTopBtn) scrollTopBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
