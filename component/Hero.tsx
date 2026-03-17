import { ArrowRight } from "@/app/items";
function HeroSection() {
  return (
    <div style={{ position:"relative",overflow:"hidden" }}>
      <div className="grid-bg"/>
      <div className="hero-glow"/>
      <section className="page-section hero-sec" style={{ textAlign:"center" }}>
        <div className="badge" style={{ marginBottom:20 }}>
          <span className="badge-dot"/> Early access — now open
        </div>
        <h1 style={{ fontFamily:"'Geist',sans-serif",fontWeight:800,fontSize:"clamp(2.4rem,5.5vw,4rem)",lineHeight:1.06,letterSpacing:"-0.04em",maxWidth:720,margin:"0 auto 14px" }}>
          Instant databases<br/>for developers
        </h1>
        <p style={{ color:"#64748B",fontSize:".975rem",fontWeight:400,maxWidth:460,margin:"0 auto 40px",lineHeight:1.7 }}>
          Spin up isolated database instances in seconds. No infrastructure overhead. Connect, query, and scale without the ops burden.
        </p>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap" }}>
          <a href="#waitlist" className="spark-btn" style={{ textDecoration:"none",padding:"10px 22px",fontSize:".9rem" }}>
            Request early access <ArrowRight/>
          </a>
        </div>
      </section>
    </div>
  );
}

export default HeroSection