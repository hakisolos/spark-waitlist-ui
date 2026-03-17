"use client";
import Nav from "@/component/nav";
import HeroSection from "@/component/Hero";
import SDKSection from "@/component/Sdk";
import SimulatorSection from "@/component/Sim";
import { SchemaSection,SchemaViewer } from "@/component/SchemaVis";
import WaitlistSection from "@/component/waitlist";
import { GLOBAL_CSS } from "./utils";
function Footer() {
  return (
    <footer style={{ borderTop:"1px solid rgba(255,255,255,.05)",background:"#0A0C10",padding:"22px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
      <div style={{ display:"flex",alignItems:"center",gap:7 }}>
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="rgba(99,102,241,.1)"/><path d="M18 4L8 18H15L14 28L24 14H17L18 4Z" fill="#6366F1"/></svg>
        <span style={{ fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:".875rem",letterSpacing:"-0.025em" }}>SparkDB</span>
      </div>
      <div style={{ display:"flex",gap:18 }}>
        {["Powered By Nikka Tech"].map(l => (
          <a key={l} href="#" style={{ color:"#2D3748",fontSize:".775rem",fontWeight:500,textDecoration:"none",transition:"color .14s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#94A3B8")}
            onMouseLeave={e=>(e.currentTarget.style.color="#2D3748")}>{l}</a>
        ))}
      </div>
      <span style={{ color:"#1E2D3D",fontSize:".72rem" }}>© 2026 Nikka Tech, Inc.</span>
    </footer>
  );
}

export default function SparkDBPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}/>
      <main style={{ background:"#0A0C10",minHeight:"100vh" }}>
        <Nav/>
        <HeroSection/>
        <SDKSection/>
        <SimulatorSection/>
        <SchemaSection/>
        <WaitlistSection/>
        <Footer/>
      </main>
    </>
  );
}