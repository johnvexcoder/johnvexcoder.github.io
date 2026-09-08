/* Motion is an enhancement: without this file every section remains readable. */
(function () {
  const root=document.documentElement;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let requested='auto';try{requested=localStorage.getItem('portfolio-motion')||'auto';}catch(e){}
  const visible=new Set();let frame=0;
  function sync(){
    const limited=media.matches||!!navigator.connection?.saveData||requested==='reduced';
    root.classList.toggle('motion-lite',limited);root.classList.toggle('motion-paused',document.hidden);
    const button=document.getElementById('motion-toggle');
    if(button){button.setAttribute('aria-pressed',String(limited));button.setAttribute('aria-label',limited?'Enable full motion':'Reduce motion');button.title=media.matches?'Your system requests reduced motion':navigator.connection?.saveData?'Data saver is active':'Change animation preference';button.querySelector('span').textContent=limited?'Off':'On';}
    dispatchEvent(new Event('portfolio-motion-change'));
  }
  function update(){frame=0;if(document.hidden)return;const max=Math.max(1,root.scrollHeight-innerHeight);const progress=document.getElementById('scroll-progress-bar');if(progress)progress.style.transform='scaleX('+Math.min(1,scrollY/max)+')';
    if(!root.classList.contains('motion-lite'))visible.forEach(section=>{const box=section.getBoundingClientRect();section.style.setProperty('--section-progress',Math.max(0,Math.min(1,(innerHeight-box.top)/(innerHeight+box.height))));});
    document.getElementById('back-to-top')?.classList.toggle('visible',scrollY>700);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  document.addEventListener('DOMContentLoaded',()=>{
    sync();document.body.classList.add('site-ready');
    document.getElementById('motion-toggle')?.addEventListener('click',()=>{requested=root.classList.contains('motion-lite')?'full':'reduced';try{localStorage.setItem('portfolio-motion',requested)}catch(e){}sync();});
    if('IntersectionObserver'in window){
      const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');reveal.unobserve(entry.target)}}),{threshold:.05});
      document.querySelectorAll('.timeline article,.achievements-grid>*,.case-content>*,.case-cover,.case-page h1').forEach(n=>n.classList.add('reveal'));
      document.querySelectorAll('.reveal').forEach((node,index)=>{node.style.setProperty('--reveal-delay',(index%3*75)+'ms');reveal.observe(node);});
      const activity=new IntersectionObserver(entries=>{entries.forEach(entry=>{entry.target.classList.toggle('in-view',entry.isIntersecting);if(entry.isIntersecting){visible.add(entry.target);entry.target.classList.add('section-entered');}else visible.delete(entry.target);});schedule();});
      document.querySelectorAll('main>section,.case-page').forEach(s=>activity.observe(s));root.classList.add('motion-ready');
    }else document.querySelectorAll('.reveal').forEach(n=>n.classList.add('revealed'));
    document.getElementById('back-to-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:root.classList.contains('motion-lite')?'auto':'smooth'}));
    const hero=document.getElementById('hero-visual');let pointerFrame=0;
    hero?.addEventListener('pointermove',event=>{if(innerWidth<861||root.classList.contains('motion-lite')||!matchMedia('(pointer:fine)').matches)return;const b=hero.getBoundingClientRect(),x=(event.clientX-b.left)/b.width-.5,y=(event.clientY-b.top)/b.height-.5;cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{hero.style.setProperty('--hero-tilt-x',(-y*4)+'deg');hero.style.setProperty('--hero-tilt-y',(x*5)+'deg')});},{passive:true});
    hero?.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);hero.style.setProperty('--hero-tilt-x','0deg');hero.style.setProperty('--hero-tilt-y','0deg')});
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();
  });
  media.addEventListener('change',sync);navigator.connection?.addEventListener('change',sync);document.addEventListener('visibilitychange',()=>{sync();if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});
})();
