export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,420;9..144,560;9..144,640&family=Outfit:wght@400;500;600;700&display=swap');
:root{--ink:#4A3B5C;--ink-soft:#8B7BA3;--rose:#E8739A;--violet:#9B7FE8;
--glass:rgba(255,255,255,.6);--glass-brd:rgba(255,255,255,.9);
--shadow-soft:0 12px 28px -12px rgba(155,127,232,.24);
--shadow-3d:0 24px 48px -16px rgba(155,127,232,.3),0 8px 20px -8px rgba(232,115,154,.18);}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',sans-serif;color:var(--ink);
background:radial-gradient(55rem 40rem at 10% -8%,#FBE3EE 0%,transparent 58%),
radial-gradient(50rem 42rem at 108% 14%,#E3D9FB 0%,transparent 60%),
radial-gradient(46rem 38rem at 50% 112%,#D9EBFB 0%,transparent 62%),
linear-gradient(168deg,#FFF7FA 0%,#F6F1FD 55%,#F0F6FD 100%);
background-attachment:fixed;min-height:100vh}
.serif{font-family:'Fraunces',serif}
.glass{background:var(--glass);backdrop-filter:blur(20px) saturate(1.15);
-webkit-backdrop-filter:blur(20px) saturate(1.15);border:1px solid var(--glass-brd);
border-radius:26px;box-shadow:var(--shadow-soft),inset 0 1px 0 rgba(255,255,255,.92)}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:600}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-soft)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;
font-family:'Outfit',sans-serif;font-weight:600;border-radius:999px;padding:13px 24px;font-size:15px;
transition:transform .2s ease,filter .2s ease}
.btn:active{transform:scale(.97)}
.btn-rose{color:#fff;background:linear-gradient(135deg,#F191B4 0%,#E8739A 55%,#C77FE0 130%);
box-shadow:0 14px 28px -10px rgba(232,115,154,.55)}
.btn-ghost{color:var(--ink);background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.95);box-shadow:var(--shadow-soft)}
.btn:hover{transform:translateY(-2px)}
input.mj,select.mj{width:100%;border:1px solid rgba(255,255,255,.9);border-radius:16px;background:rgba(255,255,255,.7);
padding:13px 16px;font-family:'Outfit';font-size:14.5px;color:var(--ink);outline:none}
input.mj:focus{border-color:var(--violet);box-shadow:0 0 0 4px rgba(155,127,232,.15)}
.nav{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);width:min(500px,calc(100% - 24px));
display:flex;justify-content:space-around;padding:8px 6px;z-index:50;border-radius:28px}
.nav a{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10.5px;font-weight:700;
color:var(--ink-soft);text-decoration:none;padding:8px 12px;border-radius:16px}
.nav a.on{color:var(--rose)}
input[type=range].wk{-webkit-appearance:none;appearance:none;width:100%;height:10px;border-radius:999px;outline:none;
background:linear-gradient(90deg,#F191B4 0%,#C77FE0 55%,#8FB8EE 100%);box-shadow:inset 0 2px 5px rgba(74,59,92,.18)}
input[type=range].wk::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;cursor:pointer;
background:radial-gradient(circle at 32% 28%,#fff 0%,#FCE1EC 45%,#EFB8D6 100%);border:3px solid #fff;
box-shadow:0 8px 18px -4px rgba(232,115,154,.6)}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .5s cubic-bezier(.22,.9,.34,1) both}
@keyframes pulseHeart{0%,100%{transform:scale(1)}12%{transform:scale(1.2)}24%{transform:scale(1)}36%{transform:scale(1.12)}48%{transform:scale(1)}}
button:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid rgba(155,127,232,.55);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001s!important;transition-duration:.001s!important}}
`;
