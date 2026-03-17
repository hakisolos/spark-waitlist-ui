import React, { useState } from "react";
import { useInView } from "@/app/utils";
import { CheckIcon } from "@/app/items";
import { ArrowRight } from "@/app/items";

import { Spinner,PlayIcon,CodeLine } from "@/app/items";
function WaitlistSection() {
  const { ref, visible } = useInView();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name||!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  return (
    <>
      <hr className="section-sep"/>
      <section id="waitlist" className="page-section" ref={ref} style={{ textAlign:"center" }}>
        <div className={`fade-up${visible?" visible":""}`} style={{ marginBottom:28 }}>
          <div className="badge" style={{ marginBottom:12,display:"inline-flex" }}>
            <span className="badge-dot"/> Early access
          </div>
          <h2 style={{ fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:"clamp(1.7rem,3vw,2.4rem)",letterSpacing:"-0.035em",lineHeight:1.1,marginBottom:8 }}>
            Get early access.
          </h2>
          <p style={{ color:"#64748B",fontSize:".9rem",maxWidth:400,margin:"0 auto",lineHeight:1.65 }}>
            Join developers already on the waitlist. No credit card required.
          </p>
        </div>

        <div className={`fade-up${visible?" visible":""}`} style={{ maxWidth:520,margin:"0 auto",transitionDelay:"80ms" }}>
          {done ? (
            <div className="card" style={{ padding:"34px 24px" }}>
              <div style={{ width:40,height:40,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.22)" }}>
                <CheckIcon size={18}/>
              </div>
              <div style={{ fontFamily:"'Geist',sans-serif",fontWeight:600,fontSize:"1rem",marginBottom:6 }}>
                You&apos;re on the list
              </div>
              <div style={{ color:"#64748B",fontSize:".85rem" }}>
                We&apos;ll reach out to <span style={{ color:"#818CF8" }}>{email}</span> when early access opens.
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="card" style={{ padding:"22px 20px" }}>
              <div className="waitlist-row" style={{ display:"flex",gap:10,marginBottom:10 }}>
                <input className="spark-input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required style={{ flex:1 }}/>
                <input className="spark-input" type="email" placeholder="Work email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ flex:1 }}/>
              </div>
              <button type="submit" disabled={loading} className="spark-btn" style={{ width:"100%",padding:"10px" }}>
                {loading ? <><Spinner size={12}/> Joining&hellip;</> : <>Join the waitlist <ArrowRight/></>}
              </button>
              <p style={{ color:"#2D3748",fontSize:".7rem",marginTop:9,fontWeight:400 }}>
                No credit card required · Early access perks included
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}


export default WaitlistSection