import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────
const PHONE_DISPLAY = "(817) 294-9012";
const PHONE_HREF = "tel:+18172949012";
const ADDRESS = "4962 Overton Ridge Blvd, Fort Worth, TX 76132";
const MAPS_Q = "Nail+Creation+4962+Overton+Ridge+Blvd+Fort+Worth+TX+76132";
const GOOGLE_REVIEWS_URL = "https://share.google/vznnmPTSQn8L2xpxA";

type Page = "home" | "services" | "contact";

const SERVICES = [
  { name: "Acrylic Nails",        tag: "Most Popular",   desc: "Durable enhancements sculpted to perfection for lasting shape and strength." },
  { name: "Dip Powder Nails",     tag: "",               desc: "Long-lasting color with a lightweight finish — no UV lamp needed." },
  { name: "Gel Nail Extensions",  tag: "",               desc: "Natural-looking length with flexible gel durability." },
  { name: "Gel Nails",            tag: "Client Favorite",desc: "High-gloss, chip-resistant shine that lasts up to three weeks." },
  { name: "Manicure",             tag: "",               desc: "Classic nail care elevated into a luxurious ritual of shaping, buffing, and polish." },
  { name: "Manicure & Pedicure",  tag: "Bundle",         desc: "Complete hands and feet treatment in one indulgent visit." },
  { name: "Nail Art",             tag: "Custom",         desc: "Artistic designs tailored to your vision — from minimalist to bold." },
  { name: "Nail Extensions",      tag: "",               desc: "Achieve your desired length and shape with seamless extensions." },
  { name: "Nail Polish",          tag: "",               desc: "Classic lacquer application for vibrant, expressive color." },
  { name: "Pedicure",             tag: "",               desc: "Foot care, scrub, massage, and polish for happy, healthy feet." },
  { name: "Russian Manicure",     tag: "Signature",      desc: "Precision dry-technique for flawlessly clean cuticles and lasting results." },
  { name: "Spa Pedicure",         tag: "Luxury",         desc: "The ultimate foot relaxation — soak, scrub, mask, massage, and polish." },
];

// Replace these src URLs with your actual local nail photos from /public

const GALLERY = [
  { id: 1, rot: -5,  w: 182, h: 220, label: "Chrome Art",   src: "/chrome.png" },
  { id: 2, rot:  3,  w: 198, h: 240, label: "French Tips",  src: "/frenchtips.png" },
  { id: 3, rot: -2.5,w: 172, h: 210, label: "Glitter Gel",  src: "/glittergel.png" },
  { id: 4, rot:  6,  w: 192, h: 230, label: "Acrylic Set",  src: "/acrylic.png" },
  { id: 5, rot: -4,  w: 186, h: 225, label: "Nail Art",     src: "/nailart.png" },
  { id: 6, rot:  2,  w: 176, h: 215, label: "Russian Mani",  src: "/russian.png" },
  { id: 7, rot: -3.5,w: 200, h: 245, label: "Spa Pedicure", src: "/spa.png" },
  { id: 8, rot:  5,  w: 178, h: 218, label: "Dip Powder",   src: "/dip.png" },
];

const REVIEWS = [
  { name:"Jasmine T.", text:"Absolutely obsessed with my nails. The Russian Manicure changed my life — so clean, so perfect. I won't go anywhere else." },
  { name:"Brianna K.", text:"They do the most beautiful nail art. I came in with a reference photo and they exceeded every expectation. Highly recommend." },
  { name:"Sophia M.",  text:"The spa pedicure is a whole vibe. So relaxing, the staff is so sweet, and my feet look amazing. Already booked my next visit!" },
];

// ─── Global CSS injection ─────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Nunito:wght@300;400;500;600;700&family=Pinyon+Script&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#07070A;
  --ink-soft:#111116;
  --ink-mid:#181820;
  --pink:#E8186D;
  --pink-mid:#F06292;
  --gold:#C8A84B;
  --gold-light:#E8CC78;
  --gold-dim:#7A6425;
  --white:#FAF8FF;
  --muted:#6B6B80;
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Nunito',sans-serif;
  --script:'Pinyon Script',cursive;
}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--white);font-family:var(--sans);font-weight:400;line-height:1.6;overflow-x:hidden}
::selection{background:var(--pink);color:#fff}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--ink)}
::-webkit-scrollbar-thumb{background:var(--pink);border-radius:3px}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:999;padding:0 3.5rem;height:72px;display:flex;align-items:center;justify-content:space-between;transition:all .4s ease}
.nav.sc{background:rgba(7,7,10,.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(200,168,75,.16)}
.logo{cursor:pointer;line-height:1;user-select:none;background:none;border:none}
.logo-s{font-family:var(--script);font-size:2rem;color:var(--gold-light);display:block;line-height:1}
.logo-sub{font-size:.5rem;letter-spacing:.45em;text-transform:uppercase;color:var(--pink-mid);display:block;margin-top:-2px}
.nav-links{display:flex;gap:2.5rem;list-style:none;align-items:center}
.nav-links a,.nav-links button{background:none;border:none;color:rgba(250,248,255,.68);font-family:var(--sans);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;padding:0;transition:color .3s;text-decoration:none}
.nav-links a:hover,.nav-links button:hover,.nl-active{color:var(--gold-light) !important}
.nav-cta{background:var(--pink) !important;color:#fff !important;padding:.5rem 1.4rem !important;border-radius:2px !important;font-weight:700 !important;transition:all .3s !important}
.nav-cta:hover{background:var(--gold) !important;color:var(--ink) !important}
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
.hamburger span{display:block;width:22px;height:2px;background:var(--white);transition:all .3s}
@media(max-width:700px){
  .hamburger{display:flex}
  .nav-links{position:fixed;top:72px;left:0;right:0;background:rgba(7,7,10,.98);flex-direction:column;padding:2rem 1.5rem;gap:1.4rem;transform:translateY(-110%);transition:transform .38s ease;border-bottom:1px solid rgba(200,168,75,.15)}
  .nav-links.open{transform:translateY(0)}
  .nav{padding:0 1.5rem}
}

/* HERO */
.hero{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 65% 90% at 78% 50%,rgba(232,24,109,.11) 0%,transparent 65%),radial-gradient(ellipse 45% 60% at 15% 80%,rgba(200,168,75,.07) 0%,transparent 60%)}
.hero-vl{position:absolute;top:0;right:28%;width:1px;height:100%;background:linear-gradient(180deg,transparent 0%,rgba(200,168,75,.35) 25%,rgba(200,168,75,.12) 75%,transparent 100%)}
.particle{position:absolute;border-radius:50%;background:var(--gold);animation:floatp linear infinite;opacity:0;pointer-events:none}
@keyframes floatp{0%{transform:translateY(105vh) rotate(0deg);opacity:0}8%{opacity:.5}90%{opacity:.2}100%{transform:translateY(-10vh) rotate(360deg);opacity:0}}
.hero-content{position:relative;z-index:2;padding:0 5.5rem;max-width:780px}
.eyebrow{font-size:.63rem;letter-spacing:.52em;text-transform:uppercase;color:var(--gold);margin-bottom:1.4rem;display:flex;align-items:center;gap:.9rem;animation:fup .8s ease both}
.eyebrow::before{content:'';width:36px;height:1px;background:var(--gold);flex-shrink:0}
.hero-title{font-family:var(--serif);font-size:clamp(3.8rem,8.5vw,7.5rem);font-weight:300;line-height:.93;margin-bottom:1.5rem;animation:fup .8s .15s ease both}
.hero-title em{font-style:italic;color:var(--pink)}
.hero-title span{color:var(--gold-light);display:block}
.hero-sub{color:rgba(250,248,255,.55);font-weight:300;font-size:.98rem;max-width:400px;line-height:1.85;margin-bottom:2.5rem;animation:fup .8s .3s ease both}
.hero-btns{display:flex;gap:1rem;flex-wrap:wrap;animation:fup .8s .45s ease both}
.hero-script{position:absolute;right:5%;top:50%;transform:translateY(-50%) rotate(-90deg);font-family:var(--script);font-size:7rem;color:rgba(200,168,75,.04);pointer-events:none;white-space:nowrap;z-index:1}
.scroll-ind{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.4rem;animation:fi 1s 1.2s ease both}
.scroll-ind span{font-size:.55rem;letter-spacing:.45em;text-transform:uppercase;color:var(--muted)}
.scroll-ln{width:1px;height:48px;background:linear-gradient(180deg,var(--gold) 0%,transparent 100%);animation:spulse 2.2s ease-in-out infinite}
@keyframes spulse{0%,100%{opacity:.25;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.15)}}
@keyframes fup{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}

/* BUTTONS */
.btn-p{background:var(--pink);color:#fff;border:none;padding:1rem 2.2rem;font-family:var(--sans);font-size:.82rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .3s;text-decoration:none;display:inline-block}
.btn-p:hover{background:var(--gold);color:var(--ink);transform:translateY(-2px);box-shadow:0 12px 32px rgba(232,24,109,.35)}
.btn-o{background:transparent;color:var(--gold-light);border:1px solid rgba(200,168,75,.35);padding:1rem 2.2rem;font-family:var(--sans);font-size:.82rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .3s;text-decoration:none;display:inline-block}
.btn-o:hover{background:rgba(200,168,75,.08);border-color:var(--gold);transform:translateY(-2px)}

/* SECTION COMMON */
.section{padding:5.5rem}
.sec-eyebrow{font-size:.62rem;letter-spacing:.52em;text-transform:uppercase;color:var(--gold);margin-bottom:.7rem;display:flex;align-items:center;gap:.7rem}
.sec-eyebrow::before{content:'✦';color:var(--pink);font-size:.55rem}
.sec-title{font-family:var(--serif);font-size:clamp(2.4rem,4.5vw,3.8rem);font-weight:400;line-height:1.08;margin-bottom:.9rem}
.sec-title em{font-style:italic;color:var(--pink-mid)}

/* SERVICES TEASER */
.svc-section{background:var(--ink-soft);position:relative;overflow:hidden}
.svc-section::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold-dim),transparent)}
.svc-top{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2.8rem}
.svc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(200,168,75,.09);border:1px solid rgba(200,168,75,.09)}
.svc-mini{background:var(--ink-soft);padding:1.7rem 1.4rem;transition:all .3s;position:relative;overflow:hidden;cursor:default}
.svc-mini::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--pink);transition:width .4s}
.svc-mini:hover::after{width:100%}
.svc-mini:hover{background:var(--ink-mid)}
.svc-num{font-family:var(--serif);font-size:.85rem;color:var(--gold-dim);margin-bottom:.6rem}
.svc-name{font-family:var(--serif);font-size:1.15rem;font-weight:500;line-height:1.2}

/* GALLERY — THE POLAROID BOARD */
.gal-section{background:var(--ink);padding:5.5rem 0;overflow:hidden}
.gal-hdr{padding:0 5.5rem;margin-bottom:2rem}
.gal-hint-row{display:flex;align-items:center;gap:.75rem;margin-top:.9rem}
.gal-hint{font-size:.6rem;letter-spacing:.38em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
.gal-hr{flex:1;height:1px;background:linear-gradient(90deg,rgba(200,168,75,.15),transparent)}
.board{display:flex;gap:1.8rem;padding:2.5rem 5.5rem 5rem;overflow-x:auto;cursor:grab;align-items:flex-start;-webkit-overflow-scrolling:touch}
.board:active{cursor:grabbing}
.board::-webkit-scrollbar{height:3px}
.board::-webkit-scrollbar-track{background:var(--ink-soft)}
.board::-webkit-scrollbar-thumb{background:var(--gold-dim)}
.polaroid{flex-shrink:0;background:#13101A;padding:10px 10px 38px;border:1px solid rgba(200,168,75,.12);position:relative;transition:all .45s cubic-bezier(.175,.885,.32,1.275);box-shadow:5px 5px 22px rgba(0,0,0,.55);cursor:pointer}
.polaroid:nth-child(odd){margin-top:44px}
.polaroid:hover{transform:rotate(0deg) translateY(-18px) scale(1.07) !important;box-shadow:0 34px 64px rgba(0,0,0,.65),0 0 0 1px rgba(200,168,75,.28);z-index:10}
.pol-img{display:block;object-fit:cover;width:100%;filter:saturate(.88) contrast(1.06);user-select:none;pointer-events:none}
.pol-label{position:absolute;bottom:11px;left:0;right:0;text-align:center;font-family:var(--script);font-size:1.2rem;color:var(--gold-light);letter-spacing:.04em}
.pol-pin{position:absolute;top:-9px;left:50%;transform:translateX(-50%);width:15px;height:15px;background:radial-gradient(circle at 38% 34%,#f0d87c,var(--gold));border-radius:50%;box-shadow:0 3px 6px rgba(0,0,0,.5)}
.pol-tape{position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:36px;height:14px;background:rgba(200,168,75,.18);border-radius:1px}
.gal-foot{text-align:center;margin-top:-.3rem;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);opacity:.6}

/* REVIEWS */
.rev-section{background:var(--ink-soft);padding:5.5rem;position:relative;overflow:hidden}
.rev-section::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--pink),transparent)}
.rev-top{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2.5rem}
.rev-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
.rev-card{background:var(--ink);border:1px solid rgba(200,168,75,.1);padding:1.8rem;position:relative;transition:all .3s}
.rev-card:hover{border-color:rgba(200,168,75,.28);transform:translateY(-4px)}
.rev-card::before{content:'"';font-family:var(--serif);font-size:5rem;color:var(--pink);opacity:.12;position:absolute;top:-.6rem;left:1.4rem;line-height:1}
.rev-stars{color:var(--gold);font-size:.75rem;letter-spacing:.2em;margin-bottom:.85rem}
.rev-text{font-family:var(--serif);font-size:1.02rem;font-style:italic;line-height:1.75;color:rgba(250,248,255,.82);margin-bottom:1.4rem}
.rev-author{font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:600}
.g-badge{display:inline-flex;align-items:center;gap:.7rem;background:rgba(200,168,75,.07);border:1px solid rgba(200,168,75,.18);padding:.7rem 1.4rem;font-size:.82rem;color:var(--gold-light);text-decoration:none;transition:all .3s;cursor:pointer;border-radius:2px}
.g-badge:hover{background:rgba(200,168,75,.14);border-color:var(--gold)}

/* CALL STRIP */
.call-strip{background:var(--pink);padding:1.8rem 5.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.call-text{font-family:var(--serif);font-size:1.7rem;font-style:italic;color:#fff}
.call-num{font-family:var(--serif);font-size:2.1rem;font-weight:600;color:#fff;text-decoration:none;border-bottom:2px solid rgba(255,255,255,.4);transition:border-color .3s}
.call-num:hover{border-color:#fff}

/* FOOTER */
.footer{background:#040407;padding:2.5rem 5.5rem;border-top:1px solid rgba(200,168,75,.09);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.footer-logo{font-family:var(--script);font-size:1.8rem;color:var(--gold-light)}
.footer-tag{font-size:.55rem;letter-spacing:.35em;text-transform:uppercase;color:var(--muted);margin-top:-2px}
.footer-links{display:flex;gap:2rem}
.footer-links button{background:none;border:none;color:var(--muted);font-family:var(--sans);font-size:.75rem;cursor:pointer;transition:color .3s;letter-spacing:.06em}
.footer-links button:hover{color:var(--gold-light)}
.footer-copy{font-size:.72rem;color:var(--muted)}

/* SERVICES PAGE */
.page-hero{background:var(--ink-soft);padding:5rem 5.5rem 4rem;position:relative;overflow:hidden}
.page-hero-wm{position:absolute;right:5%;top:50%;transform:translateY(-50%);font-family:var(--script);font-size:10rem;color:rgba(200,168,75,.035);pointer-events:none;white-space:nowrap;z-index:0}
.svc-full-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(200,168,75,.07)}
.svc-card{background:var(--ink);padding:2.4rem;position:relative;overflow:hidden;transition:background .3s}
.svc-card:hover{background:var(--ink-soft)}
.svc-accent{width:28px;height:2px;background:var(--pink);margin-bottom:1.1rem;transition:width .4s}
.svc-card:hover .svc-accent{width:48px}
.svc-card-name{font-family:var(--serif);font-size:1.45rem;font-weight:500;margin-bottom:.4rem}
.svc-card-desc{color:var(--muted);font-size:.86rem;line-height:1.65}
.svc-card-tag{display:inline-block;font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);background:rgba(200,168,75,.09);padding:.22rem .55rem;border-radius:1px;margin-top:.7rem;border:1px solid rgba(200,168,75,.18)}
.svc-card-num{position:absolute;bottom:1.3rem;right:1.3rem;font-family:var(--serif);font-size:3.2rem;font-weight:700;color:rgba(200,168,75,.05);line-height:1;pointer-events:none}

/* CONTACT PAGE */
.con-layout{display:grid;grid-template-columns:1fr 1.6fr;min-height:55vh}
.con-panel{background:var(--ink-soft);padding:4rem;display:flex;flex-direction:column;justify-content:center;gap:2.2rem;border-right:1px solid rgba(200,168,75,.08)}
.con-label{font-size:.58rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:.3rem}
.con-value{font-family:var(--serif);font-size:1.25rem;line-height:1.35}
.con-value a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(200,168,75,.28);transition:border-color .3s}
.con-value a:hover{border-color:var(--gold)}
.con-map iframe{width:100%;height:100%;min-height:480px;border:none;display:block;filter:saturate(.7) hue-rotate(20deg) contrast(1.1)}

/* EMBED GUIDE */
.embed-box{background:var(--ink-soft);padding:5rem 5.5rem;border-top:1px solid rgba(200,168,75,.08)}
.embed-card{background:var(--ink-mid);border:1px solid rgba(200,168,75,.13);padding:2rem;margin-top:2rem;border-radius:2px}
.embed-step{display:flex;gap:1.4rem;margin-bottom:1.6rem;align-items:flex-start}
.embed-step:last-child{margin-bottom:0}
.step-num{background:var(--pink);color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0;margin-top:2px}
.step-txt{font-size:.88rem;color:rgba(250,248,255,.72);line-height:1.65}
.step-txt strong{color:var(--gold-light)}
.step-txt code{background:rgba(232,24,109,.14);color:#F06292;padding:.1em .4em;border-radius:2px;font-size:.82em;font-family:monospace}

/* MOBILE RESPONSIVE */
@media(max-width:900px){
  .svc-grid{grid-template-columns:repeat(2,1fr)}
  .rev-grid{grid-template-columns:1fr}
  .svc-full-grid{grid-template-columns:repeat(2,1fr)}
  .con-layout{grid-template-columns:1fr}
}
@media(max-width:700px){
  .section,.svc-section,.rev-section,.embed-box{padding:4rem 1.5rem}
  .gal-hdr{padding:0 1.5rem}
  .board{padding:2rem 1.5rem 4rem}
  .call-strip{padding:1.5rem;flex-direction:column;text-align:center}
  .page-hero{padding:4rem 1.5rem 3rem}
  .con-panel{padding:2.5rem 1.5rem}
  .footer{padding:2rem 1.5rem;flex-direction:column;text-align:center}
  .svc-full-grid{grid-template-columns:1fr}
  .hero-content{padding:0 1.5rem}
}
`;

// ─── Particles ────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  dur: Math.random() * 14 + 10,
  delay: Math.random() * 12,
}));

// ─── Components ───────────────────────────────────────────

function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p: Page) => { setPage(p); setOpen(false); window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); };

  return (
    <nav className={`nav${scrolled ? " sc" : ""}`}>
      <button className="logo" onClick={() => go("home")} aria-label="Home">
        <span className="logo-s">Nail Creation</span>
        <span className="logo-sub">Fort Worth · Texas</span>
      </button>

      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        <span style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "" }} />
        <span style={{ opacity: open ? 0 : 1 }} />
        <span style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "" }} />
      </button>

      <ul className={`nav-links${open ? " open" : ""}`}>
        {(["home","services","contact"] as Page[]).map(p => (
          <li key={p}>
            <button className={page === p ? "nl-active" : ""} onClick={() => go(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          </li>
        ))}
        <li><a href={PHONE_HREF} className="nav-cta">Call Now</a></li>
      </ul>
    </nav>
  );
}

function Hero({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-vl" />
      <div aria-hidden="true">
        {PARTICLES.map(p => (
          <div key={p.id} className="particle" style={{
            width: p.size, height: p.size, left: `${p.left}%`,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>
      <div className="hero-content">
        <div className="eyebrow">Fort Worth's Nail Destination</div>
        <h1 className="hero-title">
          <em>Where</em> Nails
          <span>Become Art.</span>
        </h1>
        <p className="hero-sub">Custom nail design, luxury treatments, and precision craftsmanship — crafted for you in the heart of Fort Worth.</p>
        <div className="hero-btns">
          <a href={PHONE_HREF} className="btn-p">Book by Phone</a>
          <button className="btn-o" onClick={() => setPage("services")}>Our Services</button>
        </div>
      </div>
      <div className="hero-script" aria-hidden="true">Nail Creation</div>
      <div className="scroll-ind" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-ln" />
      </div>
    </section>
  );
}

function ServiceTeaser({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="section svc-section">
      <div className="svc-top">
        <div>
          <div className="sec-eyebrow">What We Do</div>
          <h2 className="sec-title">Our <em>Signature</em><br />Services</h2>
        </div>
        <button className="btn-o" onClick={() => setPage("services")}>View All 12 Services →</button>
      </div>
      <div className="svc-grid">
        {SERVICES.slice(0, 8).map((s, i) => (
          <div key={s.name} className="svc-mini">
            <div className="svc-num">0{i + 1}</div>
            <div className="svc-name">{s.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollL: 0 });

  const onDown = (e: React.MouseEvent) => {
    drag.current = { active: true, startX: e.pageX - (boardRef.current?.offsetLeft ?? 0), scrollL: boardRef.current?.scrollLeft ?? 0 };
    if (boardRef.current) boardRef.current.style.userSelect = "none";
  };
  const onMove = (e: React.MouseEvent) => {
    if (!drag.current.active || !boardRef.current) return;
    e.preventDefault();
    const x = e.pageX - (boardRef.current.offsetLeft ?? 0);
    boardRef.current.scrollLeft = drag.current.scrollL - (x - drag.current.startX) * 1.4;
  };
  const onUp = () => { drag.current.active = false; if (boardRef.current) boardRef.current.style.userSelect = ""; };

  return (
    <section className="gal-section">
      <div className="gal-hdr">
        <div className="sec-eyebrow">The Studio</div>
        <h2 className="sec-title">Our <em>Work</em></h2>
        <div className="gal-hint-row">
          <div className="gal-hr" />
          <span className="gal-hint">Drag to explore the board →</span>
          <div className="gal-hr" style={{ background: "linear-gradient(90deg,transparent,rgba(200,168,75,.15))" }} />
        </div>
      </div>

      <div ref={boardRef} className="board"
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        {GALLERY.map((item, i) => (
          <div key={item.id} className="polaroid" style={{ transform: `rotate(${item.rot}deg)`, width: item.w }}>
            {i % 2 === 0 ? <div className="pol-pin" /> : <div className="pol-tape" />}
            <img
              src={item.src} alt={item.label} className="pol-img"
              style={{ height: item.h }} draggable={false}
              onError={(e) => { (e.target as HTMLImageElement).style.background = "linear-gradient(135deg,#1a0a1a,#2d1030)"; }}
            />
            <div className="pol-label">{item.label}</div>
          </div>
        ))}
      </div>
     
    </section>
  );
}

function Reviews() {
  return (
    <section className="rev-section">
      <div className="rev-top">
        <div>
          <div className="sec-eyebrow">Client Love</div>
          <h2 className="sec-title">What They're <em>Saying</em></h2>
        </div>
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" className="g-badge">
          <span style={{ fontSize: "1.1rem" }}>★</span> 5.0 on Google · See All Reviews
        </a>
      </div>

      <div className="rev-grid">
        {REVIEWS.map((r, i) => (
          <div key={i} className="rev-card">
            <div className="rev-stars">★★★★★</div>
            <p className="rev-text">"{r.text}"</p>
            <div className="rev-author">— {r.name}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2.2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" className="btn-p">★ Leave a Google Review</a>
      </div>
    </section>
  );
}

function CallStrip() {
  return (
    <div className="call-strip">
      <p className="call-text">Ready for beautiful nails?</p>
      <a href={PHONE_HREF} className="call-num">{PHONE_DISPLAY}</a>
    </div>
  );
}

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo({ top: 0 }); };
  return (
    <footer className="footer">
      <div>
        <div className="footer-logo">Nail Creation</div>
        <div className="footer-tag">Fort Worth, TX · (817) 294-9012</div>
      </div>
      <div className="footer-links">
        <button onClick={() => go("home")}>Home</button>
        <button onClick={() => go("services")}>Services</button>
        <button onClick={() => go("contact")}>Contact</button>
      </div>
      <div className="footer-copy">© 2025 Nail Creation · All rights reserved</div>
    </footer>
  );
}

// ─── Pages ────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <main>
      <Hero setPage={setPage} />
      <ServiceTeaser setPage={setPage} />
      <Gallery />
      <Reviews />
      <CallStrip />
      <Footer setPage={setPage} />
    </main>
  );
}

function ServicesPage({ setPage }: { setPage: (p: Page) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo({ top: 0 }); };
  return (
    <main style={{ paddingTop: 72 }}>
      <div className="page-hero">
        <div className="page-hero-wm" aria-hidden="true">Services</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="sec-eyebrow">Full Menu</div>
          <h1 className="sec-title" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
            Every <em>Service</em>,<br />Perfected.
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "1rem", maxWidth: 440, fontSize: ".93rem", lineHeight: 1.75 }}>
            From classic manicures to our signature Russian technique — 12 premium nail services, all tailored to you.
          </p>
        </div>
      </div>

      <div className="svc-full-grid">
        {SERVICES.map((s, i) => (
          <div key={s.name} className="svc-card">
            <div className="svc-accent" />
            <div className="svc-card-name">{s.name}</div>
            <p className="svc-card-desc">{s.desc}</p>
            {s.tag && <span className="svc-card-tag">{s.tag}</span>}
            <div className="svc-card-num">{String(i + 1).padStart(2, "0")}</div>
          </div>
        ))}
      </div>

      <CallStrip />
      <footer className="footer">
        <div>
          <div className="footer-logo">Nail Creation</div>
          <div className="footer-tag">Fort Worth, TX · (817) 294-9012</div>
        </div>
        <div className="footer-links">
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("services")}>Services</button>
          <button onClick={() => go("contact")}>Contact</button>
        </div>
        <div className="footer-copy">© 2025 Nail Creation · All rights reserved</div>
      </footer>
    </main>
  );
}

function ContactPage({ setPage }: { setPage: (p: Page) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo({ top: 0 }); };
  return (
    <main style={{ paddingTop: 72 }}>
      <div className="page-hero">
        <div className="sec-eyebrow">Come See Us</div>
        <h1 className="sec-title" style={{ fontSize: "clamp(3rem,6vw,5rem)" }}>
          Find Us in<br /><em>Fort Worth</em>
        </h1>
      </div>

      <div className="con-layout">
        <div className="con-panel">
          <div>
            <div className="con-label">Phone</div>
            <div className="con-value"><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></div>
          </div>
          <div>
            <div className="con-label">Address</div>
            <div className="con-value" style={{ fontSize: "1.1rem", lineHeight: 1.5 }}>
              4962 Overton Ridge Blvd<br />Fort Worth, TX 76132
            </div>
          </div>
          <div>
            <div className="con-label">Appointments</div>
            <div className="con-value" style={{ fontSize: ".95rem", color: "var(--muted)", lineHeight: 1.65 }}>
              Call or walk in — we'd love to see you. Same-day appointments often available.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <a href={PHONE_HREF} className="btn-p" style={{ textAlign: "center" }}>📞 Call to Book</a>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" className="btn-o" style={{ textAlign: "center" }}>★ Leave a Review</a>
          </div>
        </div>

        <div className="con-map">
          <iframe
            src={`https://maps.google.com/maps?q=${MAPS_Q}&output=embed&z=15`}
            title="Nail Creation Location"
            allowFullScreen loading="lazy"
          />
        </div>
      </div>

    

      <footer className="footer">
        <div>
          <div className="footer-logo">Nail Creation</div>
          <div className="footer-tag">Fort Worth, TX · (817) 294-9012</div>
        </div>
        <div className="footer-links">
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("services")}>Services</button>
          <button onClick={() => go("contact")}>Contact</button>
        </div>
        <div className="footer-copy">© 2025 Nail Creation · All rights reserved</div>
      </footer>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

  // Inject global styles + fonts
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "nc-global";
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.getElementById("nc-global")?.remove();
  }, []);

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "home"     && <HomePage setPage={setPage} />}
      {page === "services" && <ServicesPage setPage={setPage} />}
      {page === "contact"  && <ContactPage setPage={setPage} />}
    </>
  );
}