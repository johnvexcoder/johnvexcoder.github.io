/* A projected routing tunnel: geometry only, no assets or WebGL downloads. */
(function () {
  const canvas = document.getElementById('route-field');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const pause = document.getElementById('pause-field');
  const ping = document.getElementById('send-ping');
  const status = document.getElementById('ping-status');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let width = 0, height = 0, frame = 0, last = 0, time = 0;
  let pointerX = 0, pointerY = 0, paused = false, burst = -10, pingTimer;
  const limited = () => media.matches || Boolean(connection && connection.saveData) || Boolean(navigator.deviceMemory && navigator.deviceMemory <= 4);

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cx = width * .5 + pointerX * 14, cy = height * .5 + pointerY * 14;
    const size = Math.min(width, height) * .47;
    const count = width < 500 ? 16 : 24;
    const surge = Math.max(0, 1 - (time - burst) / 2.4);
    for (let ring = 0; ring < count; ring++) {
      const depth = ((ring / count + time * .045) % 1);
      const radius = 20 + depth * depth * size * 1.5;
      const twist = time * .08 + depth * 1.8 + surge * .7;
      ctx.beginPath();
      for (let spoke = 0; spoke <= 12; spoke++) {
        const angle = spoke / 12 * Math.PI * 2 + twist;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * .72;
        if (!spoke) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${surge > .1 ? '111,129,255' : '62,185,232'},${(.12 + surge * .2) * depth})`;
      ctx.lineWidth = 1;ctx.stroke();
      for (let spoke = 0; spoke < 12; spoke++) {
        const angle = spoke / 12 * Math.PI * 2 + twist;
        const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius * .72;
        ctx.beginPath();ctx.arc(x, y, 1 + depth * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107,219,255,${depth * .65})`;ctx.fill();
        const next = Math.min(1, depth + 1 / count), nextR = 20 + next * next * size * 1.5;
        const nextAngle = angle + (next - depth) * 1.8;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cx + Math.cos(nextAngle)*nextR,cy + Math.sin(nextAngle)*nextR*.72);
        ctx.strokeStyle = `rgba(54,131,183,${depth * .15})`;ctx.stroke();
      }
    }
    if (surge > 0) {
      ctx.beginPath();ctx.ellipse(cx,cy,(1-surge)*size*1.8+10,(1-surge)*size*1.3+10,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(124,220,255,${surge*.7})`;ctx.lineWidth=2;ctx.stroke();
    }
  }
  function tick(now) {
    if (document.hidden || paused || limited()) { frame = 0; return; }
    if (now-last >= 32) { time += Math.min((now-last)/1000,.06);last=now;draw(); }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;last=performance.now();
    const lite=limited();
    pause.hidden=lite;ping.hidden=lite;
    draw();
    if (!lite && !paused && !document.hidden) frame=requestAnimationFrame(tick);
  }
  function resize() {
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;
    const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);sync();
  }
  canvas.parentElement.addEventListener('pointermove',function(event){
    if (limited() || !matchMedia('(pointer:fine)').matches) return;
    const r=canvas.getBoundingClientRect();pointerX=(event.clientX-r.left)/width-.5;pointerY=(event.clientY-r.top)/height-.5;
  },{passive:true});
  canvas.parentElement.addEventListener('pointerleave',function(){pointerX=pointerY=0;});
  pause.addEventListener('click',function(){paused=!paused;pause.textContent=paused?'Resume animation':'Pause animation';pause.setAttribute('aria-pressed',String(paused));sync();});
  ping.addEventListener('click',function(){
    burst=time;ping.disabled=true;status.textContent='Ping sent into the void…';draw();
    clearTimeout(pingTimer);pingTimer=setTimeout(function(){status.textContent='No route found. Home is still one click away.';ping.disabled=false;},1800);
  });
  media.addEventListener('change',sync);
  if(connection && connection.addEventListener) connection.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);window.addEventListener('resize',resize,{passive:true});resize();
})();
