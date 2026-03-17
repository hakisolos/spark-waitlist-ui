import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "@/app/utils";
import { Spinner,PlayIcon,CodeLine } from "@/app/items";
import { DBInstance } from "@/app/types";
import { DB_TYPES } from "@/app/utils";
import { REGIONS } from "@/app/utils";
import { DBIcon,ChevronDown,CheckIcon,TrashIcon,CopyIcon } from "@/app/items";
function SimulatorSection() {
  const { ref, visible } = useInView();
  const [selected, setSelected] = useState(DB_TYPES[0]);
  const [name, setName] = useState("");
  const [dbs, setDbs] = useState<DBInstance[]>([]);
  const [creating, setCreating] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [copies, setCopies] = useState<Record<string,boolean>>({});
  const dropRef = useRef<HTMLDivElement>(null);
  const MAX = 15;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const create = () => {
    if (creating || dbs.length >= MAX) return;
    const dbName = name.trim() || `${selected.id}-${Math.random().toString(36).slice(2,7)}`;
    const inst: DBInstance = {
      id:`db_${Date.now()}`,typeId:selected.id,typeLabel:selected.label,color:selected.color,
      connPrefix:selected.connPrefix,name:dbName,status:"spinning",
      region:REGIONS[Math.floor(Math.random()*REGIONS.length)],
      createdAt:new Date().toISOString().slice(0,10),
    };
    setCreating(true);
    setDbs(prev => [inst,...prev]);
    setName("");
    const delay = 1200 + Math.random()*600;
    setTimeout(() => {
      setDbs(prev => prev.map(d => d.id===inst.id ? { ...d,status:"ready" } : d));
      setCreating(false);
    }, delay);
  };

  const del = (id: string) => setDbs(prev => prev.filter(d => d.id!==id));
  const copyConn = (db: DBInstance) => {
    navigator.clipboard.writeText(`${db.connPrefix}user:••••@${db.name}.sparkdb.dev:5432/main`).catch(()=>{});
    setCopies(c => ({ ...c,[db.id]:true }));
    setTimeout(() => setCopies(c => ({ ...c,[db.id]:false })), 2200);
  };
  const pct = (dbs.length / MAX) * 100;

  return (
    <>
      <hr className="section-sep"/>
      <section id="simulator" className="page-section" ref={ref}>
        <div className={`fade-up${visible?" visible":""}`} style={{ marginBottom:30 }}>
          <div className="badge" style={{ marginBottom:12,display:"inline-flex" }}>Live simulator</div>
          <h2 style={{ fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:"clamp(1.7rem,3vw,2.4rem)",letterSpacing:"-0.035em",lineHeight:1.1,marginBottom:8 }}>
            Spin up a database in seconds.
          </h2>
          <p style={{ color:"#64748B",fontSize:".9rem",maxWidth:460,lineHeight:1.65 }}>
            Pick your engine, name it, and watch it provision. Supports up to {MAX} concurrent instances.
          </p>
        </div>

        {/* Create form */}
        <div className={`card fade-up${visible?" visible":""}`} style={{ padding:"18px 20px",marginBottom:16,transitionDelay:"70ms" }}>
          <div className="sim-row" style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
            {/* Dropdown — wrapped in its own positioned container */}
            <div ref={dropRef} style={{ position:"relative",minWidth:188,flexShrink:0 }}>
              <button
                onClick={() => setDropOpen(o=>!o)}
                style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 12px",borderRadius:7,background:"rgba(255,255,255,.035)",border:`1px solid ${dropOpen?"rgba(99,102,241,.35)":"rgba(255,255,255,.07)"}`,color:"#E2E8F0",cursor:"pointer",gap:7,transition:"border-color .15s" }}
              >
                <span style={{ display:"flex",alignItems:"center",gap:7 }}>
                  <DBIcon icon={selected.icon} color={selected.color} size={20}/>
                  <span style={{ fontSize:".83rem",fontWeight:600 }}>{selected.label}</span>
                </span>
                <span style={{ transform:dropOpen?"rotate(180deg)":"rotate(0)",transition:"transform .18s",color:"#475569" }}>
                  <ChevronDown size={11}/>
                </span>
              </button>
              {dropOpen && (
                <div className="db-dropdown">
                  {DB_TYPES.map(dt => (
                    <button key={dt.id} className={`dd-item${selected.id===dt.id?" selected":""}`} onClick={() => { setSelected(dt); setDropOpen(false); }}>
                      <DBIcon icon={dt.icon} color={dt.color} size={17}/>
                      {dt.label}
                      <span style={{ marginLeft:"auto",fontSize:".65rem",color:"#374151",fontFamily:"'IBM Plex Mono',monospace" }}>{dt.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              className="spark-input"
              placeholder={`my-${selected.id}-db`}
              value={name}
              onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&create()}
              style={{ flex:1 }}
            />
            <button onClick={create} disabled={creating||dbs.length>=MAX} className="spark-btn" style={{ flexShrink:0 }}>
              {creating ? <><Spinner size={12}/> Creating&hellip;</> : dbs.length>=MAX ? "Limit reached" : <>+ Create</>}
            </button>
          </div>

          {dbs.length > 0 && (
            <div style={{ marginTop:11 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:".68rem",fontWeight:500,color:"#475569",fontFamily:"'IBM Plex Mono',monospace" }}>{dbs.length} / {MAX} instances</span>
                <span style={{ fontSize:".68rem",fontWeight:500,color:dbs.length>=MAX?"#F87171":"#475569",fontFamily:"'IBM Plex Mono',monospace" }}>{MAX-dbs.length} slots free</span>
              </div>
              <div className="prog-bar"><div className={`prog-fill${dbs.length>=MAX?" full":""}`} style={{ width:`${pct}%` }}/></div>
            </div>
          )}
        </div>

        {/* Empty state — only shows when no DBs */}
        {dbs.length === 0 && (
          <div className={`card fade-up${visible?" visible":""}`} style={{ padding:"40px 22px",textAlign:"center",transitionDelay:"110ms",borderStyle:"dashed",borderColor:"rgba(255,255,255,.06)" }}>
            <div style={{ fontSize:"1.6rem",marginBottom:9,opacity:.25 }}>⚡</div>
            <div style={{ fontWeight:600,fontSize:".875rem",marginBottom:4 }}>No databases yet</div>
            <div style={{ color:"#475569",fontSize:".8rem" }}>Select an engine above and click Create to get started</div>
          </div>
        )}

        {/* DB list */}
        {dbs.length > 0 && (
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {dbs.map(db => {
              const dbDef = DB_TYPES.find(d=>d.id===db.typeId);
              return (
                <div key={db.id} className={`db-card${db.status==="ready"?" ready":""}`}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:11,minWidth:0 }}>
                      <div style={{ flexShrink:0 }}><DBIcon icon={dbDef?.icon||"DB"} color={db.color} size={30}/></div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:7,flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"'Geist',sans-serif",fontWeight:600,fontSize:".875rem" }}>{db.name}</span>
                          <span style={{ fontSize:".66rem",fontWeight:600,padding:"2px 8px",borderRadius:20,background:`${db.color}12`,color:db.color,border:`1px solid ${db.color}22`,fontFamily:"'IBM Plex Mono',monospace" }}>{db.typeLabel}</span>
                        </div>
                        <div style={{ display:"flex",gap:9,marginTop:2 }}>
                          <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".68rem",color:"#2D3748" }}>{db.region}</span>
                          <span style={{ color:"#1A2433" }}>·</span>
                          <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".68rem",color:"#2D3748" }}>{db.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:9,flexShrink:0 }}>
                      {db.status==="spinning"
                        ? <div className="status-spin"><Spinner size={12}/> Spinning up</div>
                        : <div className="status-ready"><span className="live-dot"/> Ready</div>
                      }
                      <button
                        onClick={() => del(db.id)}
                        style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:7,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.065)",cursor:"pointer",color:"#475569",transition:"all .14s" }}
                        onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(248,113,113,.09)"; el.style.color="#F87171"; el.style.borderColor="rgba(248,113,113,.22)"; }}
                        onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,.03)"; el.style.color="#475569"; el.style.borderColor="rgba(255,255,255,.065)"; }}
                      >
                        <TrashIcon size={11}/>
                      </button>
                    </div>
                  </div>
                  {db.status==="ready" && (
                    <div style={{ marginTop:10 }}>
                      <div style={{ fontSize:".63rem",fontWeight:600,color:"#2D3748",letterSpacing:".08em",textTransform:"uppercase",marginBottom:5,fontFamily:"'IBM Plex Mono',monospace" }}>Connection string</div>
                      <div className="conn-block" onClick={() => copyConn(db)}>
                        <code style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".73rem",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                          <span style={{ color:"#C084FC" }}>{db.connPrefix}</span>
                          <span style={{ color:"#86EFAC" }}>user</span>
                          <span style={{ color:"#67E8F9" }}>:</span>
                          <span style={{ color:"#FCA5A5" }}>••••</span>
                          <span style={{ color:"#67E8F9" }}>@</span>
                          <span style={{ color:"#93C5FD" }}>{db.name}.sparkdb.dev</span>
                          <span style={{ color:"#67E8F9" }}>:5432/main</span>
                        </code>
                        <button className={`copy-btn${copies[db.id]?" copied":""}`} onClick={e=>{e.stopPropagation();copyConn(db);}}>
                          {copies[db.id] ? <><CheckIcon/> Copied</> : <><CopyIcon/> Copy</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
export default SimulatorSection