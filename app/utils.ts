import React, { useState, useEffect, useRef, useCallback } from "react";
const DB_TYPES = [
  { id:"postgres",    label:"PostgreSQL",   color:"#4A90C4", connPrefix:"postgres://",   icon:"PG", category:"relational"  },
  { id:"mysql",       label:"MySQL",        color:"#00A0B0", connPrefix:"mysql://",       icon:"MY", category:"relational"  },
  { id:"mongodb",     label:"MongoDB",      color:"#47A248", connPrefix:"mongodb+srv://", icon:"MG", category:"document"    },
  { id:"redis",       label:"Redis",        color:"#DC382D", connPrefix:"redis://",       icon:"RD", category:"keyvalue"    },
  { id:"sqlite",      label:"SQLite",       color:"#7EC8E3", connPrefix:"sqlite://",      icon:"SQ", category:"relational"  },
  { id:"cockroach",   label:"CockroachDB",  color:"#6933FF", connPrefix:"postgres://",    icon:"CR", category:"relational"  },
  { id:"cassandra",   label:"Cassandra",    color:"#1287B1", connPrefix:"cassandra://",   icon:"CA", category:"wide-column" },
  { id:"dynamodb",    label:"DynamoDB",     color:"#FF9900", connPrefix:"dynamodb://",    icon:"DD", category:"document"    },
  { id:"neo4j",       label:"Neo4j",        color:"#008CC1", connPrefix:"neo4j://",       icon:"N4", category:"graph"       },
  { id:"clickhouse",  label:"ClickHouse",   color:"#E8B931", connPrefix:"clickhouse://",  icon:"CH", category:"columnar"    },
  { id:"neon",        label:"Neon",         color:"#00C7A8", connPrefix:"postgres://",    icon:"NE", category:"relational"  },
  { id:"supabase",    label:"Supabase",     color:"#3ECF8E", connPrefix:"postgres://",    icon:"SB", category:"relational"  },
  { id:"turso",       label:"Turso",        color:"#4FF8D2", connPrefix:"libsql://",      icon:"TU", category:"relational"  },
  { id:"mariadb",     label:"MariaDB",      color:"#C0765A", connPrefix:"mysql://",       icon:"MA", category:"relational"  },
  { id:"planetscale", label:"PlanetScale",  color:"#B3BDC7", connPrefix:"mysql://",       icon:"PS", category:"relational"  },
];

const REGIONS = ["us-east-1","us-west-2","eu-west-1","ap-southeast-1","ap-northeast-1","eu-central-1"];

// Code samples
const JS_LINES: string[][][] = [
  [["kw","import"],["var"," sparkdb"],["kw"," from"],["str",' "sparkdb"']],
  [],
  [["kw","const"],["var"," db"],["op"," ="],["kw"," await"],["var"," sparkdb"],["punct","."],["fn","connect"],["punct","({"]],
  [["prop","  url"],["punct",":"],["str",' "https://api.sparkdb.dev"'],["punct",","]],
  [["prop","  token"],["punct",":"],["var"," process"],["punct","."],["prop","env"],["punct","."],["prop","SPARKDB_TOKEN"]],
  [["punct","})"]],
  [],
  [["comment","// Insert a record"]],
  [["kw","const"],["var"," user"],["op"," ="],["kw"," await"],["var"," db"],["punct","."],["fn","table"],["punct","("],["str",'"users"'],["punct",")."],["fn","insert"],["punct","({"]],
  [["prop","  name"],["punct",":"],["str",' "Amara Osei"'],["punct",","]],
  [["prop","  email"],["punct",":"],["str",' "amara@example.com"']],
  [["punct","})"]],
];

const PY_LINES: string[][][] = [
  [["kw","import"],["var"," sparkdb"]],
  [],
  [["var","db"],["op"," ="],["var"," sparkdb"],["punct","."],["fn","connect"],["punct","("]],
  [["prop","    url"],["op","="],["str",'"https://api.sparkdb.dev"'],["punct",","]],
  [["prop","    token"],["op","="],["var","os"],["punct","."],["fn","environ"],["punct","["],["str",'"SPARKDB_TOKEN"'],["punct","]"]],
  [["punct",")"]],
  [],
  [["comment","# Insert a record"]],
  [["var","user"],["op"," ="],["var"," db"],["punct","."],["fn","table"],["punct","("],["str",'"users"'],["punct",")."],["fn","insert"],["punct","({"]],
  [["str",'    "name"'],["punct",":"],["str",' "Amara Osei"'],["punct",","]],
  [["str",'    "email"'],["punct",":"],["str",' "amara@example.com"']],
  [["punct","})"]],
];

// Schema data per DB type
const PG_ROWS = [
  { id:"usr_01HX", name:"Amara Osei",    email:"amara@example.com",  date:"2026-03-17" },
  { id:"usr_02AB", name:"Priya Sharma",  email:"priya@acme.io",      date:"2026-03-17" },
  { id:"usr_03QR", name:"Marcus Webb",   email:"marcus@devco.dev",   date:"2026-03-16" },
  { id:"usr_04LM", name:"Yuki Tanaka",   email:"yuki@spark.io",      date:"2026-03-16" },
  { id:"usr_05EF", name:"Sara Okonkwo",  email:"sara@example.com",   date:"2026-03-15" },
];

const MONGO_DOC = `{
  "_id": ObjectId("6601f3ab2c4e1a9bd3"),
  "name": "Amara Osei",
  "email": "amara@example.com",
  "created_at": ISODate("2026-03-17T09:41:00Z"),
  "profile": {
    "role": "admin",
    "plan": "pro",
    "verified": true
  },
  "tags": ["beta", "early-access"]
}`;

const REDIS_DATA = [
  { key:"session:usr_01HX",   type:"STRING", value:'"eyJhbGciOiJIUzI1NiJ9..."', ttl:"3600s" },
  { key:"users:count",        type:"STRING", value:'"5"',                       ttl:"—"     },
  { key:"rate:amara@example", type:"STRING", value:'"42"',                      ttl:"60s"   },
  { key:"queue:emails",       type:"LIST",   value:"5 items",                   ttl:"—"     },
  { key:"online:users",       type:"SET",    value:"3 members",                 ttl:"—"     },
];

function useInView(threshold=0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;min-width:0}
html{scroll-behavior:smooth;width:100%;max-width:100%;overflow-x:hidden}
body{width:100%;max-width:100%;background:#0A0C10;color:#E2E8F0;font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative}

img,svg,canvas,video{max-width:100%;height:auto}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#0A0C10}
::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:2px}

/* Grid background */
.grid-bg{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 20%,transparent 100%)}
.hero-glow{position:absolute;left:50%;top:-40px;transform:translateX(-50%);width:min(700px,100vw);max-width:100%;height:500px;pointer-events:none;background:radial-gradient(ellipse at center top,rgba(99,102,241,.09) 0%,transparent 65%)}

/* Badge */
.badge{display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.18);border-radius:6px;padding:4px 12px;font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#818CF8;font-family:'IBM Plex Mono',monospace}
.badge-dot{width:5px;height:5px;border-radius:50%;background:#818CF8;animation:pulse 2s ease-in-out infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px #818CF8}50%{opacity:.4;box-shadow:0 0 14px #818CF8}}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin .7s linear infinite;display:inline-block}

/* Card */
.card{background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.07);border-radius:10px;transition:border-color .2s,box-shadow .2s;min-width:0}
.card:hover{border-color:rgba(99,102,241,.15);box-shadow:0 0 32px rgba(99,102,241,.04)}

/* Terminal */
.terminal{background:#070A0F;border:1px solid rgba(255,255,255,.07);border-radius:10px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.45);min-width:0}
.terminal-bar{display:flex;align-items:center;padding:9px 14px;background:#050709;border-bottom:1px solid rgba(255,255,255,.055);min-width:0}
.t-dot{width:10px;height:10px;border-radius:50%;margin-right:6px}
.tab-bar{display:flex;align-items:center;background:#060A0F;border-bottom:1px solid rgba(255,255,255,.055);padding:0 14px;gap:2px;overflow-x:auto}
.tab-bar::-webkit-scrollbar{height:0}
.tab-btn{position:relative;display:flex;align-items:center;gap:6px;padding:9px 13px;font-size:.775rem;font-weight:500;color:#4A5568;background:transparent;border:none;cursor:pointer;letter-spacing:.01em;transition:color .15s;white-space:nowrap}
.tab-btn:hover{color:#94A3B8}
.tab-btn.active{color:#E2E8F0}
.tab-btn.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#6366F1;border-radius:2px 2px 0 0}

/* Code tokens */
.tk-kw{color:#F472B6}.tk-str{color:#86EFAC}.tk-fn{color:#C084FC}.tk-prop{color:#93C5FD}.tk-var{color:#E2E8F0}.tk-op{color:#67E8F9}.tk-punct{color:#64748B}.tk-num{color:#FCA5A5}.tk-comment{color:#374151;font-style:italic}

/* DB Table */
.db-table{width:100%;border-collapse:collapse;font-size:.78rem}
.db-table thead th{padding:7px 14px;text-align:left;font-size:.66rem;letter-spacing:.07em;text-transform:uppercase;color:#475569;font-family:'IBM Plex Mono',monospace;background:#050709;border-bottom:1px solid rgba(255,255,255,.05)}
.db-table tbody tr{border-bottom:1px solid rgba(255,255,255,.035);transition:background .1s}
.db-table tbody tr:last-child{border-bottom:none}
.db-table tbody tr:hover{background:rgba(99,102,241,.04)}
.db-table tbody td{padding:8px 14px;font-family:'IBM Plex Mono',monospace;font-size:.76rem;color:#94A3B8}

/* Inputs & buttons */
.spark-input{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:7px;padding:9px 13px;color:#E2E8F0;font-family:'Geist',sans-serif;font-size:.85rem;outline:none;transition:border-color .15s,box-shadow .15s;width:100%}
.spark-input::placeholder{color:rgba(148,163,184,.3)}
.spark-input:focus{border-color:rgba(99,102,241,.4);box-shadow:0 0 0 3px rgba(99,102,241,.07)}

.spark-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:#6366F1;color:#fff;border:none;border-radius:7px;padding:9px 20px;font-family:'Geist',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:background .15s,box-shadow .2s,transform .12s;white-space:nowrap}
.spark-btn:hover{background:#7577F5;box-shadow:0 0 22px rgba(99,102,241,.35);transform:translateY(-1px)}
.spark-btn:active{transform:translateY(0)}
.spark-btn:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}

.ghost-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,.08);color:#818CF8;border:1px solid rgba(99,102,241,.2);border-radius:7px;padding:6px 12px;font-size:.75rem;font-weight:600;cursor:pointer;transition:background .15s,box-shadow .15s;font-family:'Geist',sans-serif}
.ghost-btn:hover{background:rgba(99,102,241,.14);box-shadow:0 0 14px rgba(99,102,241,.15)}
.ghost-btn:disabled{opacity:.45;cursor:not-allowed}

.copy-btn{flex-shrink:0;display:flex;align-items:center;gap:5px;font-size:.71rem;font-weight:600;font-family:'IBM Plex Mono',monospace;padding:5px 11px;border-radius:6px;cursor:pointer;background:rgba(99,102,241,.08);color:#818CF8;border:1px solid rgba(99,102,241,.18);transition:all .15s;white-space:nowrap}
.copy-btn:hover{background:rgba(99,102,241,.16)}
.copy-btn.copied{background:rgba(74,222,128,.08);color:#4ADE80;border-color:rgba(74,222,128,.2)}

/* Connection string */
.conn-block{display:flex;align-items:center;gap:10px;background:#060A0F;border:1px solid rgba(99,102,241,.13);border-radius:8px;padding:9px 13px;cursor:pointer;transition:border-color .15s;min-width:0;max-width:100%}
.conn-block:hover{border-color:rgba(99,102,241,.25)}
.conn-block span,.conn-block code,.conn-block p{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:break-word}

/* Status */
.status-ready{display:flex;align-items:center;gap:5px;font-size:.72rem;font-weight:600;color:#4ADE80;font-family:'IBM Plex Mono',monospace}
.status-spin{display:flex;align-items:center;gap:5px;font-size:.72rem;font-weight:600;color:#6366F1;font-family:'IBM Plex Mono',monospace}
.live-dot{width:6px;height:6px;border-radius:50%;background:#4ADE80;box-shadow:0 0 6px #4ADE80;display:inline-block;animation:pulse 1.6s infinite;flex-shrink:0}

/* Layout */
.section-sep{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,.15),transparent);border:none;margin:0}
.fade-up{opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease}
.fade-up.visible{opacity:1;transform:translateY(0)}
.tab-fade{animation:tabFade .16s ease}
@keyframes tabFade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}

/* DB dropdown */
.db-dropdown{position:absolute;top:calc(100% + 5px);left:0;right:0;z-index:200;background:#0C1018;border:1px solid rgba(255,255,255,.09);border-radius:8px;overflow:hidden;max-height:260px;overflow-y:auto;box-shadow:0 16px 48px rgba(0,0,0,.7)}
.db-dropdown::-webkit-scrollbar{width:3px}
.db-dropdown::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:2px}
.dd-item{display:flex;align-items:center;gap:9px;padding:8px 13px;font-size:.82rem;font-weight:500;color:#94A3B8;cursor:pointer;transition:background .1s,color .1s;border:none;background:transparent;text-align:left;width:100%}
.dd-item:hover{background:rgba(255,255,255,.04);color:#E2E8F0}
.dd-item.selected{background:rgba(99,102,241,.09);color:#E2E8F0}

/* DB instance card */
.db-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:9px;padding:15px 17px;transition:border-color .2s;animation:slideIn .25s ease;min-width:0}
.db-card.ready{border-color:rgba(74,222,128,.08)}

/* Progress */
.prog-bar{height:2px;border-radius:2px;background:rgba(255,255,255,.05);overflow:hidden;margin-top:7px}
.prog-fill{height:100%;border-radius:2px;background:#6366F1;transition:width .35s ease}
.prog-fill.full{background:#F87171}

/* Nav */
nav.spark-nav{position:fixed;top:0;left:0;right:0;z-index:300;display:flex;align-items:center;justify-content:space-between;padding:13px 44px;background:rgba(10,12,16,.92);border-bottom:1px solid rgba(255,255,255,.05);backdrop-filter:blur(20px);overflow-x:clip;max-width:100%}

/* Page */
section.page-section{padding:80px 44px;max-width:1060px;margin:0 auto;position:relative;overflow-x:clip}
section.page-section.hero-sec{padding-top:136px;padding-bottom:56px;overflow-x:clip}

/* Feature grid */
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.features-grid>*{min-width:0}

/* Two col */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}
.two-col>*{min-width:0}

/* Mongo doc */
.mongo-doc{background:#060A0F;border-radius:8px;padding:16px 18px;font-family:'IBM Plex Mono',monospace;font-size:.76rem;line-height:1.7;overflow-wrap:anywhere;word-break:break-word}

/* Redis key-val */
.redis-row{display:flex;align-items:flex-start;gap:0;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);font-family:'IBM Plex Mono',monospace;font-size:.75rem}
.redis-row:last-child{border-bottom:none}

@media(max-width:960px){.features-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  nav.spark-nav{padding:11px 18px}
  .nav-links{display:none!important}
  section.page-section{padding:56px 18px}
  section.page-section.hero-sec{padding-top:90px}
  .two-col{grid-template-columns:1fr!important}
  .features-grid{grid-template-columns:1fr!important}
  .sim-row{flex-direction:column!important}
  .waitlist-row{flex-direction:column!important}
  .hero-glow{width:100%;max-width:420px}
}
`
export {
    DB_TYPES,
    REGIONS,
    PG_ROWS,
    JS_LINES,
    PY_LINES,
    MONGO_DOC,
    REDIS_DATA,
    useInView,
    GLOBAL_CSS
}