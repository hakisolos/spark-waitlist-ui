import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "@/app/utils";
import { JS_LINES,PY_LINES } from "@/app/utils";
import { Spinner,PlayIcon,CodeLine } from "@/app/items";
function SDKSection() {
  const { ref, visible } = useInView();
  const [lang, setLang] = useState<"js"|"py">("js");
  const [tabKey, setTabKey] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeLine, setActiveLine] = useState<number|null>(null);
  const [showResult, setShowResult] = useState(false);
  const ran = useRef(false);

  const runCode = useCallback(() => {
    if (running) return;
    setRunning(true); setActiveLine(null); setShowResult(false);
    const lines = lang === "js" ? JS_LINES : PY_LINES;
    let i = 0;
    const tick = () => {
      setActiveLine(i); i++;
      if (i < lines.length) setTimeout(tick, 105);
      else setTimeout(() => { setActiveLine(null); setRunning(false); setShowResult(true); }, 320);
    };
    tick();
  }, [running, lang]);

  useEffect(() => { if (visible && !ran.current) { ran.current = true; setTimeout(runCode, 700); } }, [visible, runCode]);

  const switchLang = (l: "js"|"py") => {
    if (l===lang) return;
    setLang(l); setTabKey(k=>k+1); setActiveLine(null); setShowResult(false);
  };
  const lines = lang === "js" ? JS_LINES : PY_LINES;

  return (
    <>
      <hr className="section-sep"/>
      <section id="sdk" className="page-section" ref={ref}>
        <div className={`fade-up${visible?" visible":""}`} style={{ marginBottom:30 }}>
          <div className="badge" style={{ marginBottom:12,display:"inline-flex" }}>SDK</div>
          <h2 style={{ fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:"clamp(1.7rem,3vw,2.4rem)",letterSpacing:"-0.035em",lineHeight:1.1,marginBottom:8 }}>
            Ship in minutes, not days.
          </h2>
          <p style={{ color:"#64748B",fontSize:".9rem",maxWidth:420,lineHeight:1.65 }}>
            One API, every language. Zero configuration, full type safety out of the box.
          </p>
        </div>
        <div className={`terminal fade-up${visible?" visible":""}`} style={{ transitionDelay:"90ms" }}>
          <div className="terminal-bar">
            <div className="t-dot" style={{ background:"#FF5F57" }}/>
            <div className="t-dot" style={{ background:"#FEBC2E" }}/>
            <div className="t-dot" style={{ background:"#28C840",marginRight:12 }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#2D3748",flex:1,textAlign:"center" }}>
              sparkdb-quickstart.{lang==="js"?"js":"py"}
            </span>
            <button onClick={runCode} disabled={running} className="ghost-btn" style={{ padding:"4px 11px",fontSize:".71rem" }}>
              {running ? <><Spinner size={11}/> Running&hellip;</> : <><PlayIcon/> Run</>}
            </button>
          </div>
          <div className="tab-bar">
            <button className={`tab-btn${lang==="js"?" active":""}`} onClick={() => switchLang("js")}>
              <span style={{ background:"#F7DF1E",color:"#000",fontSize:"7.5px",fontWeight:800,padding:"1px 4px",borderRadius:3,fontFamily:"'IBM Plex Mono',monospace" }}>JS</span>
              JavaScript
            </button>
            <button className={`tab-btn${lang==="py"?" active":""}`} onClick={() => switchLang("py")}>
              <span style={{ background:"#3572A5",color:"#fff",fontSize:"7.5px",fontWeight:800,padding:"1px 4px",borderRadius:3,fontFamily:"'IBM Plex Mono',monospace" }}>PY</span>
              Python
            </button>
          </div>
          <div style={{ padding:"18px 20px",minHeight:240 }}>
            <div key={tabKey} className="tab-fade" style={{ display:"flex",gap:16 }}>
              <div style={{ display:"flex",flexDirection:"column",userSelect:"none",minWidth:18 }}>
                {lines.map((_,i) => (
                  <span key={i} style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"11.5px",color:"#1E2D3D",lineHeight:"26px",textAlign:"right" }}>{i+1}</span>
                ))}
              </div>
              <div style={{ flex:1 }}>
                {lines.map((toks, i) => (
                  <div key={i} style={{ lineHeight:"26px",borderRadius:4,padding:"0 5px",margin:"0 -5px",background:activeLine===i?"rgba(99,102,241,.07)":"transparent",transition:"background .1s",minHeight:26 }}>
                    <code style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"12.5px" }}>
                      {toks.length > 0 ? <CodeLine tokens={toks}/> : "\u00A0"}
                    </code>
                  </div>
                ))}
                {showResult && (
                  <div style={{ marginTop:10,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.05)" }}>
                    <code style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".7rem",color:"#4ADE80" }}>
                      ✓ Record inserted · id: usr_01HX · 38ms
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 18px",borderTop:"1px solid rgba(255,255,255,.04)",background:"#050709" }}>
            <div style={{ display:"flex",gap:12 }}>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#1E2D3D" }}>{lang==="js"?"ESM / CJS":"Python 3.12"}</span>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"10.5px",color:"#1E2D3D" }}>sparkdb@2.4.1</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
              <span className="live-dot" style={{ width:5,height:5 }}/>
              <span style={{ fontSize:"10.5px",fontWeight:600,color:"#4ADE80",fontFamily:"'IBM Plex Mono',monospace" }}>Connected</span>
            </div>
          </div>
        </div>
        <div className={`fade-up${visible?" visible":""}`} style={{ display:"flex",alignItems:"center",gap:10,marginTop:12,flexWrap:"wrap",transitionDelay:"160ms" }}>
          <span style={{ fontSize:".73rem",fontWeight:500,color:"#475569" }}>Install:</span>
          {["npm install sparkdb","pip install sparkdb","go get sparkdb.dev/sdk"].map(cmd => (
            <code key={cmd} style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:".71rem",padding:"4px 10px",borderRadius:6,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.065)",color:"#94A3B8" }}>{cmd}</code>
          ))}
        </div>
      </section>
    </>
  );
}

export default SDKSection