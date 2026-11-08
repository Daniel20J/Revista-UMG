'use strict';
const count=70;
const el=id=>document.getElementById(id);
const page=el('page');
const path=n=>`pages/${String(n).padStart(2,'0')}.webp`;
let current=1;
const hashPage=()=>{const m=location.hash.match(/^#pagina-(\d+)$/);return m?Number(m[1]):1};
function show(n,updateHash=true){
  current=Math.max(1,Math.min(count,Number.isFinite(n)?Math.trunc(n):1));
  el('image-error').hidden=true;
  page.src=path(current);page.alt=`Página ${current} de ${count} de la revista`;
  el('page-number').value=current;el('status').textContent=`Página ${current} de ${count}`;
  el('progress').value=current;el('prev').disabled=current===1;el('next').disabled=current===count;
  if(updateHash)history.replaceState(null,'',`#pagina-${current}`);
  if(current<count){const preload=new Image();preload.src=path(current+1)}
  document.querySelectorAll('#grid button').forEach((b,i)=>b.setAttribute('aria-current',String(i+1===current)));
}
el('prev').addEventListener('click',()=>show(current-1));
el('next').addEventListener('click',()=>show(current+1));
el('jump').addEventListener('submit',e=>{e.preventDefault();show(Number(el('page-number').value))});
page.addEventListener('error',()=>{el('image-error').hidden=false});
el('retry').addEventListener('click',()=>show(current));
el('zoom').addEventListener('click',()=>{const zoomed=el('canvas').classList.toggle('zoomed');el('zoom').setAttribute('aria-pressed',String(zoomed));el('zoom').textContent=zoomed?'⊖ Reducir':'⊕ Ampliar'});
document.addEventListener('keydown',e=>{
  if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||el('gallery').open||e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}
  if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}
});
el('thumbnails').addEventListener('click',()=>{
  if(!el('grid').children.length){
    for(let i=1;i<=count;i++){
      const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ir a la página ${i}`);b.setAttribute('aria-current',String(i===current));
      const img=new Image();img.src=path(i);img.loading='lazy';img.alt='';img.width=1545;img.height=1999;
      b.append(img,document.createTextNode(`Página ${i}`));
      b.addEventListener('click',()=>{show(i);el('gallery').close()});el('grid').append(b);
    }
  }
  el('gallery').showModal();
});
el('close-gallery').addEventListener('click',()=>el('gallery').close());
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#pagina-'))show(hashPage(),false)});
show(hashPage(),false);
if(location.hash.startsWith('#pagina-'))el('lector').scrollIntoView();
