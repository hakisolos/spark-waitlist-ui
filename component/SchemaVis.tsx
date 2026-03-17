import React, { useState, useEffect, useRef, useCallback } from "react";


import { DB_TYPES,REGIONS,JS_LINES,PY_LINES,PG_ROWS,MONGO_DOC,REDIS_DATA,useInView } from "../app/utils";
import { 
  Spinner, 
  CopyIcon, 
  CheckIcon, 
  TrashIcon, 
  ChevronDown, 
  ArrowRight, 
  PlayIcon, 
  DBIcon,
  CodeLine
} from "../app/items";


function SchemaViewer() {
  const [dbType, setDbType] = useState<"postgres"|"mongodb"|"redis">("postgres");
  const [tab, setTab] = useState<string>("table");
  const [tabKey, setTabKey] = useState(0);
  const [connCopied, setConnCopied] = useState(false);

  const dbConfigs = {
    postgres: {
      label: "PostgreSQL",
      color: "#4A90C4",
      icon: "PG",
      connStr: "postgres://user:••••@sparkdb-instance:5432/mydb",
      tabs: ["table","schema"],
    },
    mongodb: {
      label: "MongoDB",
      color: "#47A248",
      icon: "MG",
      connStr: "mongodb+srv://user:••••@cluster.sparkdb.dev/mydb",
      tabs: ["document","indexes"],
    },
    redis: {
      label: "Redis",
      color: "#DC382D",
      icon: "RD",
      connStr: "redis://user:••••@sparkdb-instance:6379",
      tabs: ["keys","info"],
    },
  };

  const cfg = dbConfigs[dbType];

  const switchDB = (db: typeof dbType) => {
    setDbType(db);
    const firstTab = dbConfigs[db].tabs[0];
    setTab(firstTab);
    setTabKey(k=>k+1);
  };
  const switchTab = (t: string) => { if (t===tab) return; setTab(t); setTabKey(k=>k+1); };
  const copyConn = () => {
    navigator.clipboard.writeText(cfg.connStr).catch(()=>{});
    setConnCopied(true);
    setTimeout(() => setConnCopied(false), 2200);
  };

  return (
    <div className="terminal">
      {/* DB type switcher bar */}
      <div className="terminal-bar">
        <div className="t-dot" style={{ background:"#FF5F57" }}/><div className="t-dot" style={{ background:"#FEBC2E" }}/><div className="t-dot" style={{ background:"#28C840",marginRight:12 }}/>
        <div style={{ display:"flex",gap:4,flex:1 }}>
          {(["postgres","mongodb","redis"] as const).map(db => (
            <button
              key={db}
              onClick={() => switchDB(db)}
              style={{
                display:"flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:5,
                background:dbType===db?"rgba(99,102,241,.12)":"transparent",
                border:dbType===db?"1px solid rgba(99,102,241,.22)":"1px solid transparent",
                color:dbType===db?"#E2E8F0":"#475569",cursor:"pointer",
                fontSize:".73rem",fontWeight:600,transition:"all .15s",fontFamily:"'Geist',sans-serif",
              }}
            >
              <DBIcon icon={dbConfigs[db].icon} color={dbConfigs[db].color} size={14}/>
              {dbConfigs[db].label}
            </button>
          ))}
        </div>
        <div className="status-ready" style={{ flexShrink:0 }}>
          <span className="live-dot" style={{ width:5,height:5 }}/> Live
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {cfg.tabs.map(t => (
          <button key={t} className={`tab-btn${tab===t?" active":""}`} onClick={() => switchTab(t)}>
            {{
              table:"Table view",schema:"Schema",
              document:"Document",indexes:"Indexes",
              keys:"Keys",info:"Server info",
            }[t] || t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div key={`${dbType}-${tabKey}`} className="tab-fade" style={{ minHeight:290 }}>

        {/* ---- POSTGRES: table view ---- */}
        {dbType==="postgres" && tab==="table" && (
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 13px",borderBottom:"1px solid rgba(255,255,255,.045)",background:"#050709" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#1E2D3D" }}>Filter rows…</span>
              <span style={{ marginLeft:"auto",fontFamily:"'IBM Plex Mono',monospace",fontSize:"10px",color:"#1E2D3D",padding:"1px 5px",borderRadius:3,background:"rgba(255,255,255,.03)" }}>⌘K</span>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table className="db-table">
                <thead>
                  <tr>
                    <th style={{ width:24,paddingLeft:11,paddingRight:5 }}><input type="checkbox" style={{ accentColor:"#6366F1",width:10,height:10 }}/></th>
                    {["id","name","email","created_at"].map(c => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PG_ROWS.map((row,i) => (
                    <tr key={row.id} style={i===0?{background:"rgba(99,102,241,.04)"}:{}}>
                      <td style={{ paddingLeft:11,paddingRight:5 }}><input type="checkbox" checked={i===0} readOnly style={{ accentColor:"#6366F1",width:10,height:10 }}/></td>
                      <td style={{ color:"#93C5FD" }}>{row.id}</td>
                      <td style={{ color:"#E2E8F0",fontWeight:500 }}>{row.name}</td>
                      <td style={{ color:"#86EFAC" }}>{row.email}</td>
                      <td style={{ color:"#2D3748" }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 13px",borderTop:"1px solid rgba(255,255,255,.04)",background:"#050709" }}>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#1E2D3D" }}>Showing 1–5 of 5 rows</span>
              <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                <span className="live-dot" style={{ width:5,height:5 }}/>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#4ADE80" }}>Streaming</span>
              </div>
            </div>
          </div>
        )}

        {/* ---- POSTGRES: schema ---- */}
        {dbType==="postgres" && tab==="schema" && (
          <div style={{ padding:"18px 17px" }}>
            <div style={{ fontSize:".62rem",fontWeight:600,color:"#2D3748",letterSpacing:".08em",textTransform:"uppercase",marginBottom:9,fontFamily:"'IBM Plex Mono',monospace" }}>Schema · users</div>
            {[
              { col:"id",         type:"VARCHAR(20)", note:"PRIMARY KEY",      pk:true  },
              { col:"name",       type:"TEXT",        note:"NOT NULL",         pk:false },
              { col:"email",      type:"TEXT",        note:"NOT NULL UNIQUE",  pk:false },
              { col:"created_at", type:"TIMESTAMPTZ", note:"DEFAULT NOW()",    pk:false },
            ].map(row => (
              <div key={row.col} style={{ display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontFamily:"'IBM Plex Mono',monospace",fontSize:".74rem" }}>
                <span style={{ width:14,textAlign:"center",flexShrink:0 }}>{row.pk?"🔑":""}</span>
                <span style={{ color:"#E2E8F0",fontWeight:500,minWidth:88 }}>{row.col}</span>
                <span style={{ color:"#93C5FD" }}>{row.type}</span>
                <span style={{ color:"#2D3748",marginLeft:"auto",fontSize:".68rem" }}>{row.note}</span>
              </div>
            ))}
            <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginTop:13 }}>
              {[["Indexes","2"],["FKs","0"],["Rows","5"],["Size","48 KB"],["Engine","PG 16"]].map(([k,v]) => (
                <span key={k} style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".68rem",padding:"3px 9px",borderRadius:20,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.065)",color:"#94A3B8" }}>
                  {k}: <span style={{ color:"#E2E8F0" }}>{v}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ---- MONGODB: document ---- */}
        {dbType==="mongodb" && tab==="document" && (
          <div style={{ padding:"16px 17px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".62rem",fontWeight:600,color:"#2D3748",letterSpacing:".08em",textTransform:"uppercase" }}>Collection · users</span>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".66rem",color:"#475569" }}>1 of 5 documents</span>
            </div>
            <div className="mongo-doc">
              {(MONGO_DOC as string).split("\n").map((line: string, i: number) => {
                // Simple colouring
                const keyMatch = line.match(/^(\s*)("[\w_]+")(\s*:)(.*)$/);
                if (keyMatch) {
                  const [,indent,key,,rest] = keyMatch;
                  return (
                    <div key={i}>
                      <span>{indent}</span>
                      <span style={{ color:"#93C5FD" }}>{key}</span>
                      <span style={{ color:"#67E8F9" }}>: </span>
                      <span style={{ color: rest.trim().startsWith('"') ? "#86EFAC" : rest.trim().startsWith("Object") || rest.trim().startsWith("ISODate") ? "#C084FC" : rest.trim()==="true"||rest.trim()==="false" ? "#F472B6" : "#FCA5A5" }}>{rest}</span>
                    </div>
                  );
                }
                return <div key={i} style={{ color:"#475569" }}>{line}</div>;
              })}
            </div>
            <div style={{ display:"flex",gap:7,marginTop:11,flexWrap:"wrap" }}>
              {[["Collection","users"],["Documents","5"],["Avg size","312 B"],["Index","_id"]].map(([k,v]) => (
                <span key={k} style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".68rem",padding:"3px 9px",borderRadius:20,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.065)",color:"#94A3B8" }}>
                  {k}: <span style={{ color:"#E2E8F0" }}>{v}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ---- MONGODB: indexes ---- */}
        {dbType==="mongodb" && tab==="indexes" && (
          <div style={{ padding:"16px 17px" }}>
            <div style={{ fontSize:".62rem",fontWeight:600,color:"#2D3748",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10,fontFamily:"'IBM Plex Mono',monospace" }}>Indexes · users</div>
            {[
              { name:"_id_",   keys:"{ _id: 1 }",          type:"btree", unique:true  },
              { name:"email_1",keys:"{ email: 1 }",         type:"btree", unique:true  },
              { name:"name_1", keys:'{ name: "text" }',     type:"text",  unique:false },
            ].map(idx => (
              <div key={idx.name} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontFamily:"'IBM Plex Mono',monospace",fontSize:".74rem" }}>
                <span style={{ color:"#E2E8F0",fontWeight:500,minWidth:80 }}>{idx.name}</span>
                <span style={{ color:"#93C5FD",flex:1 }}>{idx.keys}</span>
                <span style={{ padding:"1px 7px",borderRadius:4,background:"rgba(99,102,241,.09)",color:"#818CF8",fontSize:".64rem" }}>{idx.type}</span>
                {idx.unique && <span style={{ padding:"1px 7px",borderRadius:4,background:"rgba(74,222,128,.07)",color:"#4ADE80",fontSize:".64rem" }}>unique</span>}
              </div>
            ))}
          </div>
        )}

        {/* ---- REDIS: keys ---- */}
        {dbType==="redis" && tab==="keys" && (
          <div style={{ padding:"16px 17px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:10,padding:"6px 10px",borderRadius:6,background:"#050709",border:"1px solid rgba(255,255,255,.045)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#1E2D3D" }}>KEYS * — showing all</span>
            </div>
            <div>
              {REDIS_DATA.map((row: typeof REDIS_DATA[0]) => (
                <div key={row.key} className="redis-row">
                  <div style={{ minWidth:180,paddingRight:12 }}>
                    <span style={{ color:"#93C5FD",fontWeight:500 }}>{row.key}</span>
                  </div>
                  <div style={{ minWidth:68,paddingRight:12 }}>
                    <span style={{ padding:"1px 7px",borderRadius:4,background:"rgba(220,56,45,.1)",color:"#DC382D",fontSize:".64rem",border:"1px solid rgba(220,56,45,.18)" }}>{row.type}</span>
                  </div>
                  <div style={{ flex:1,color:"#86EFAC",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{row.value}</div>
                  <div style={{ minWidth:48,textAlign:"right",color:"#374151" }}>TTL: {row.ttl}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:7,marginTop:11,flexWrap:"wrap" }}>
              {[["Keys","5"],["Memory","1.2 MB"],["Version","7.2"],["Mode","standalone"]].map(([k,v]) => (
                <span key={k} style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".68rem",padding:"3px 9px",borderRadius:20,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.065)",color:"#94A3B8" }}>
                  {k}: <span style={{ color:"#E2E8F0" }}>{v}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ---- REDIS: server info ---- */}
        {dbType==="redis" && tab==="info" && (
          <div style={{ padding:"16px 17px" }}>
            <div style={{ fontSize:".62rem",fontWeight:600,color:"#2D3748",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10,fontFamily:"'IBM Plex Mono',monospace" }}>Server info</div>
            {[
              ["redis_version","7.2.4"],["uptime_in_seconds","86400"],["connected_clients","3"],
              ["used_memory_human","1.20M"],["total_commands_processed","14821"],["keyspace_hits","9940"],
              ["keyspace_misses","82"],["rdb_last_save_time","2026-03-17 09:00:00"],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.035)",fontFamily:"'IBM Plex Mono',monospace",fontSize:".73rem" }}>
                <span style={{ color:"#93C5FD",minWidth:200,flexShrink:0 }}>{k}</span>
                <span style={{ color:"#E2E8F0" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connection string footer */}
      <div style={{ padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,.05)",background:"#050709" }}>
        <div className="conn-block" onClick={copyConn}>
          <code style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".72rem",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#475569" }}>
            {cfg.connStr}
          </code>
          <button className={`copy-btn${connCopied?" copied":""}`} onClick={e=>{e.stopPropagation();copyConn();}}>
            {connCopied ? <><CheckIcon/> Copied</> : <><CopyIcon/> Copy</>}
          </button>
        </div>
      </div>
    </div>
  );
}


function SchemaSection() {
  const { ref, visible } = useInView();
  return (
    <>
      <hr className="section-sep"/>
      <section className="page-section" ref={ref}>
        <div className="two-col">
          <div className={`fade-up${visible?" visible":""}`}>
            <div className="badge" style={{ marginBottom:12,display:"inline-flex" }}>Live preview</div>
            <h2 style={{ fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:"clamp(1.6rem,2.8vw,2.2rem)",letterSpacing:"-0.035em",lineHeight:1.1,marginBottom:8 }}>
              One connection.<br/>Infinite scale.
            </h2>
            <p style={{ color:"#64748B",fontSize:".875rem",fontWeight:400,marginBottom:20,lineHeight:1.7 }}>
              Standard wire protocol for every engine. Drop into any ORM or client — no driver changes needed.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:11,marginBottom:20 }}>
              {[
                { icon:"🔐", title:"TLS 1.3 everywhere", desc:"All connections encrypted at rest and in transit by default." },
                { icon:"⟲",  title:"Point-in-time recovery", desc:"Restore to any second in the last 30 days." },
                { icon:"⚡", title:"Connection pooling", desc:"Built-in PgBouncer-compatible pooling, no extra config." },
              ].map(item => (
                <div key={item.title} style={{ display:"flex",gap:11,alignItems:"flex-start" }}>
                  <span style={{ fontSize:"1rem",lineHeight:1,marginTop:2,flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:".85rem",fontWeight:600,color:"#E2E8F0",marginBottom:2 }}>{item.title}</div>
                    <div style={{ fontSize:".78rem",color:"#475569",lineHeight:1.55 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {[["Region","us-east-1"],["Engine","auto-detected"],["Latency","<1ms local"]].map(([k,v]) => (
                <span key={k} style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".68rem",padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.065)",color:"#94A3B8" }}>
                  {k}: <span style={{ color:"#E2E8F0" }}>{v}</span>
                </span>
              ))}
            </div>
          </div>
          <div className={`fade-up${visible?" visible":""}`} style={{ transitionDelay:"100ms" }}>
            <SchemaViewer/>
          </div>
        </div>
      </section>
    </>
  );
}
export  {SchemaViewer,SchemaSection}